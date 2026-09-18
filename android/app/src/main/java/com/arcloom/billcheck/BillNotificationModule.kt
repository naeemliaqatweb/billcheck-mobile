package com.arcloom.billcheck

import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.content.Context
import android.content.Intent
import android.content.pm.PackageManager
import android.graphics.pdf.PdfDocument
import android.media.MediaScannerConnection
import android.os.Build
import android.os.CancellationSignal
import android.os.Environment
import android.os.Handler
import android.os.Looper
import android.os.ParcelFileDescriptor
import android.print.PageRange
import android.print.PrintAttributes
import android.print.PrintDocumentAdapter
import android.print.PrintDocumentInfo
import android.print.PrintManager
import android.view.View
import android.webkit.WebView
import android.webkit.WebViewClient
import android.widget.Toast
import androidx.core.app.ActivityCompat
import androidx.core.app.NotificationCompat
import androidx.core.app.NotificationManagerCompat
import androidx.core.content.ContextCompat
import androidx.core.content.FileProvider
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import java.io.File
import java.io.FileOutputStream

class BillNotificationModule(private val reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

    companion object {
        const val CHANNEL_ID = "pakbill_live_alerts"
        const val CHANNEL_NAME = "Bill Release Alerts"
        const val CHANNEL_DESC = "Notifications for new monthly utility bills and due dates"
    }

    init {
        createNotificationChannel()
    }

    override fun getName(): String {
        return "BillNotificationModule"
    }

    private fun createNotificationChannel() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val importance = NotificationManager.IMPORTANCE_HIGH
            val channel = NotificationChannel(CHANNEL_ID, CHANNEL_NAME, importance).apply {
                description = CHANNEL_DESC
                enableVibration(true)
                enableLights(true)
                setShowBadge(true)
                lockscreenVisibility = android.app.Notification.VISIBILITY_PUBLIC
            }
            val notificationManager: NotificationManager =
                reactContext.getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
            notificationManager.createNotificationChannel(channel)
        }
    }

    @ReactMethod
    fun hasNotificationPermission(promise: Promise) {
        try {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
                val granted = ContextCompat.checkSelfPermission(
                    reactContext,
                    android.Manifest.permission.POST_NOTIFICATIONS
                ) == PackageManager.PERMISSION_GRANTED
                promise.resolve(granted)
            } else {
                val areEnabled = NotificationManagerCompat.from(reactContext).areNotificationsEnabled()
                promise.resolve(areEnabled)
            }
        } catch (e: Exception) {
            promise.resolve(false)
        }
    }

    @ReactMethod
    fun requestNotificationPermission(promise: Promise) {
        try {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
                val currentActivity = reactApplicationContext.currentActivity
                val isGranted = ContextCompat.checkSelfPermission(
                    reactContext,
                    android.Manifest.permission.POST_NOTIFICATIONS
                ) == PackageManager.PERMISSION_GRANTED
                if (isGranted) {
                    promise.resolve(true)
                    return
                }
                if (currentActivity != null) {
                    ActivityCompat.requestPermissions(
                        currentActivity,
                        arrayOf(android.Manifest.permission.POST_NOTIFICATIONS),
                        1001
                    )
                    promise.resolve(true)
                } else {
                    promise.resolve(false)
                }
            } else {
                promise.resolve(true)
            }
        } catch (e: Exception) {
            promise.resolve(false)
        }
    }

    @ReactMethod
    fun showLocalNotification(
        title: String,
        message: String,
        tag: String?,
        promise: Promise
    ) {
        try {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
                val hasPermission = ContextCompat.checkSelfPermission(
                    reactContext,
                    android.Manifest.permission.POST_NOTIFICATIONS
                ) == PackageManager.PERMISSION_GRANTED
                if (!hasPermission) {
                    val currentActivity = reactApplicationContext.currentActivity
                    if (currentActivity != null) {
                        ActivityCompat.requestPermissions(
                            currentActivity,
                            arrayOf(android.Manifest.permission.POST_NOTIFICATIONS),
                            1001
                        )
                    }
                }
            }

            val intent = Intent(reactContext, MainActivity::class.java).apply {
                flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TOP
            }

            val pendingIntentFlag = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
                PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
            } else {
                PendingIntent.FLAG_UPDATE_CURRENT
            }

            val pendingIntent = PendingIntent.getActivity(
                reactContext,
                (System.currentTimeMillis() % 100000).toInt(),
                intent,
                pendingIntentFlag
            )

            var smallIcon = reactContext.resources.getIdentifier("ic_launcher", "mipmap", reactContext.packageName)
            if (smallIcon == 0) {
                smallIcon = reactContext.applicationInfo.icon
            }
            if (smallIcon == 0) {
                smallIcon = android.R.drawable.ic_dialog_info
            }

            val builder = NotificationCompat.Builder(reactContext, CHANNEL_ID)
                .setSmallIcon(smallIcon)
                .setContentTitle(title)
                .setContentText(message)
                .setStyle(NotificationCompat.BigTextStyle().bigText(message))
                .setPriority(NotificationCompat.PRIORITY_MAX)
                .setCategory(NotificationCompat.CATEGORY_REMINDER)
                .setVisibility(NotificationCompat.VISIBILITY_PUBLIC)
                .setDefaults(NotificationCompat.DEFAULT_ALL)
                .setAutoCancel(true)
                .setContentIntent(pendingIntent)

            val notificationManager = NotificationManagerCompat.from(reactContext)
            val notifId = (tag?.hashCode() ?: System.currentTimeMillis().toInt()) and 0x7FFFFFFF
            notificationManager.notify(notifId, builder.build())
            promise.resolve(true)
        } catch (e: Exception) {
            promise.resolve(false)
        }
    }

    @ReactMethod
    fun printOfficialBill(url: String, jobName: String, promise: Promise) {
        try {
            val currentAct = reactApplicationContext.currentActivity
            if (currentAct == null) {
                promise.resolve(false)
                return
            }

            Handler(Looper.getMainLooper()).post {
                try {
                    val webView = WebView(currentAct)
                    webView.settings.javaScriptEnabled = true
                    webView.settings.domStorageEnabled = true
                    webView.settings.loadWithOverviewMode = true
                    webView.settings.useWideViewPort = true

                    webView.webViewClient = object : WebViewClient() {
                        private var hasPrinted = false

                        override fun onPageFinished(view: WebView?, loadedUrl: String?) {
                            super.onPageFinished(view, loadedUrl)
                            if (hasPrinted) return
                            hasPrinted = true

                            try {
                                val printManager = currentAct.getSystemService(Context.PRINT_SERVICE) as? PrintManager
                                if (printManager != null && view != null) {
                                    val printAdapter = view.createPrintDocumentAdapter(jobName)
                                    val printAttributes = PrintAttributes.Builder()
                                        .setMediaSize(PrintAttributes.MediaSize.ISO_A4)
                                        .setColorMode(PrintAttributes.COLOR_MODE_COLOR)
                                        .build()
                                    printManager.print(jobName, printAdapter, printAttributes)
                                    promise.resolve(true)
                                } else {
                                    promise.resolve(false)
                                }
                            } catch (e: Exception) {
                                promise.resolve(false)
                            }
                        }
                    }

                    webView.loadUrl(url)
                } catch (e: Exception) {
                    promise.resolve(false)
                }
            }
        } catch (e: Exception) {
            promise.resolve(false)
        }
    }

    @ReactMethod
    fun printOfficialHtml(html: String, jobName: String, baseUrl: String?, promise: Promise) {
        try {
            val currentAct = reactApplicationContext.currentActivity
            if (currentAct == null) {
                promise.resolve(false)
                return
            }

            Handler(Looper.getMainLooper()).post {
                try {
                    val webView = WebView(currentAct)
                    webView.settings.javaScriptEnabled = true
                    webView.settings.domStorageEnabled = true
                    webView.settings.loadWithOverviewMode = true
                    webView.settings.useWideViewPort = true

                    val mainHandler = Handler(Looper.getMainLooper())
                    var hasPrinted = false

                    val doPrint = {
                        if (!hasPrinted) {
                            hasPrinted = true
                            try {
                                val printManager = currentAct.getSystemService(Context.PRINT_SERVICE) as? PrintManager
                                if (printManager != null) {
                                    val printAdapter = webView.createPrintDocumentAdapter(jobName)
                                    val printAttributes = PrintAttributes.Builder()
                                        .setMediaSize(PrintAttributes.MediaSize.ISO_A4)
                                        .setColorMode(PrintAttributes.COLOR_MODE_COLOR)
                                        .build()
                                    printManager.print(jobName, printAdapter, printAttributes)
                                    promise.resolve(true)
                                } else {
                                    promise.resolve(false)
                                }
                            } catch (e: Exception) {
                                promise.resolve(false)
                            }
                        }
                    }

                    val watchdogRunnable = Runnable { doPrint() }
                    mainHandler.postDelayed(watchdogRunnable, 600)

                    webView.webViewClient = object : WebViewClient() {
                        override fun onPageFinished(view: WebView?, loadedUrl: String?) {
                            super.onPageFinished(view, loadedUrl)
                            mainHandler.removeCallbacks(watchdogRunnable)
                            doPrint()
                        }
                    }

                    val effectiveBaseUrl = if (!baseUrl.isNullOrBlank()) baseUrl else "https://bill.pitc.com.pk"
                    webView.loadDataWithBaseURL(effectiveBaseUrl, html, "text/html", "UTF-8", null)
                } catch (e: Exception) {
                    promise.resolve(false)
                }
            }
        } catch (e: Exception) {
            promise.resolve(false)
        }
    }

    @ReactMethod
    fun saveOfficialHtmlToPdf(html: String, fileName: String, baseUrl: String?, promise: Promise) {
        renderHtmlToPdf(html, fileName, baseUrl, isShare = false, promise = promise)
    }

    @ReactMethod
    fun shareOfficialHtmlAsPdf(html: String, fileName: String, baseUrl: String?, promise: Promise) {
        renderHtmlToPdf(html, fileName, baseUrl, isShare = true, promise = promise)
    }

    private fun renderHtmlToPdf(
        html: String,
        fileName: String,
        baseUrl: String?,
        isShare: Boolean,
        promise: Promise
    ) {
        try {
            val currentAct = reactApplicationContext.currentActivity
            val contextToUse = currentAct ?: reactContext

            Handler(Looper.getMainLooper()).post {
                try {
                    val webView = WebView(contextToUse)
                    webView.settings.javaScriptEnabled = true
                    webView.settings.domStorageEnabled = true
                    webView.settings.loadWithOverviewMode = true
                    webView.settings.useWideViewPort = true
                    webView.settings.textZoom = 100

                    val safeFileName = fileName.replace("[^a-zA-Z0-9_.-]".toRegex(), "_")
                    val pdfFileName = if (safeFileName.endsWith(".pdf", ignoreCase = true)) safeFileName else "$safeFileName.pdf"

                    val targetFile = if (isShare) {
                        val shareDir = File(reactContext.cacheDir, "shared_bills")
                        if (!shareDir.exists()) shareDir.mkdirs()
                        File(shareDir, pdfFileName)
                    } else {
                        val downloadsDir = Environment.getExternalStoragePublicDirectory(Environment.DIRECTORY_DOWNLOADS)
                        if (!downloadsDir.exists()) downloadsDir.mkdirs()
                        var file = File(downloadsDir, pdfFileName)
                        if (!downloadsDir.canWrite()) {
                            val fallbackDir = reactContext.getExternalFilesDir(Environment.DIRECTORY_DOWNLOADS) ?: reactContext.filesDir
                            file = File(fallbackDir, pdfFileName)
                        }
                        file
                    }

                    if (targetFile.exists()) {
                        targetFile.delete()
                    }

                    val fullFitCss = """
                        <style>
                        * {
                          box-sizing: border-box !important;
                        }
                        @page {
                          size: A4 portrait;
                          margin: 0;
                        }
                        html, body {
                          margin: 0 !important;
                          padding: 0 !important;
                          background-color: #FFFFFF !important;
                          -webkit-print-color-adjust: exact !important;
                          print-color-adjust: exact !important;
                        }
                        center, form, .main-table, #bill, .container, .bill-card {
                          margin: 0 auto !important;
                        }
                        table {
                          margin: 0 auto !important;
                        }
                        img {
                          max-width: 100% !important;
                          height: auto !important;
                        }
                        button, input[type=button], input[type=submit], .print-btn, .btn, .noprint, #print-btn, [onclick*="print"] {
                          display: none !important;
                        }
                        </style>
                    """.trimIndent()

                    val styledHtml = if (html.contains("<head>", ignoreCase = true)) {
                        html.replace("(?i)<head>".toRegex(), "<head>$fullFitCss")
                    } else if (html.contains("<html>", ignoreCase = true)) {
                        html.replace("(?i)<html>".toRegex(), "<html><head>$fullFitCss</head>")
                    } else {
                        "<!DOCTYPE html><html><head>$fullFitCss</head><body>$html</body></html>"
                    }

                    val mainHandler = Handler(Looper.getMainLooper())
                    var isCompleted = false

                    fun notifyCompletion(success: Boolean) {
                        if (isCompleted) return
                        isCompleted = true
                        if (!success) {
                            promise.resolve(false)
                            return
                        }
                        if (isShare) {
                            val uri = FileProvider.getUriForFile(
                                reactContext,
                                "${reactContext.packageName}.fileprovider",
                                targetFile
                            )
                            val shareIntent = Intent(Intent.ACTION_SEND).apply {
                                type = "application/pdf"
                                putExtra(Intent.EXTRA_STREAM, uri)
                                putExtra(Intent.EXTRA_SUBJECT, pdfFileName)
                                addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION)
                                addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
                            }
                            val chooser = Intent.createChooser(shareIntent, "Share Official Bill PDF").apply {
                                addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
                            }
                            reactContext.startActivity(chooser)
                            promise.resolve(true)
                        } else {
                            MediaScannerConnection.scanFile(
                                reactContext,
                                arrayOf(targetFile.absolutePath),
                                arrayOf("application/pdf"),
                                null
                            )
                            Toast.makeText(
                                reactContext,
                                "Official Bill saved to Downloads: $pdfFileName",
                                Toast.LENGTH_SHORT
                            ).show()
                            promise.resolve(targetFile.absolutePath)
                        }
                    }

                    fun doRenderPdf() {
                        try {
                            val dm = reactContext.resources.displayMetrics
                            val density = if (dm.density > 0f) dm.density else 1f

                            val targetCssWidth = 800
                            val targetWidthPx = (targetCssWidth * density).toInt()

                            webView.measure(
                                View.MeasureSpec.makeMeasureSpec(targetWidthPx, View.MeasureSpec.EXACTLY),
                                View.MeasureSpec.makeMeasureSpec(0, View.MeasureSpec.UNSPECIFIED)
                            )
                            val measuredH = if (webView.measuredHeight > 0) webView.measuredHeight else (1130 * density).toInt()
                            webView.layout(0, 0, targetWidthPx, measuredH)

                            val a4Width = 1240
                            val a4Height = 1754
                            val scale = a4Width.toFloat() / targetWidthPx.toFloat()

                            val pdfDoc = PdfDocument()
                            val pageInfo = PdfDocument.PageInfo.Builder(a4Width, a4Height, 1).create()
                            val page = pdfDoc.startPage(pageInfo)
                            val canvas = page.canvas

                            canvas.save()
                            canvas.scale(scale, scale)
                            webView.draw(canvas)
                            canvas.restore()

                            pdfDoc.finishPage(page)

                            val outputStream = FileOutputStream(targetFile)
                            pdfDoc.writeTo(outputStream)
                            outputStream.flush()
                            outputStream.close()
                            pdfDoc.close()

                            notifyCompletion(true)
                        } catch (e: Exception) {
                            notifyCompletion(false)
                        }
                    }

                    val watchdogRunnable = Runnable { doRenderPdf() }
                    mainHandler.postDelayed(watchdogRunnable, 1800)

                    webView.webViewClient = object : WebViewClient() {
                        override fun onPageFinished(view: WebView?, loadedUrl: String?) {
                            super.onPageFinished(view, loadedUrl)
                            mainHandler.removeCallbacks(watchdogRunnable)
                            mainHandler.postDelayed({ doRenderPdf() }, 300)
                        }
                    }

                    val effectiveBaseUrl = if (!baseUrl.isNullOrBlank()) baseUrl else "https://bill.pitc.com.pk"
                    webView.loadDataWithBaseURL(effectiveBaseUrl, styledHtml, "text/html", "UTF-8", null)
                } catch (e: Exception) {
                    promise.resolve(false)
                }
            }
        } catch (e: Exception) {
            promise.resolve(false)
        }
    }

    @ReactMethod
    fun openPdfFile(filePath: String, promise: Promise) {
        try {
            Handler(Looper.getMainLooper()).post {
                try {
                    val file = File(filePath)
                    if (!file.exists()) {
                        promise.resolve(false)
                        return@post
                    }
                    val uri = FileProvider.getUriForFile(
                        reactContext,
                        "${reactContext.packageName}.fileprovider",
                        file
                    )
                    val intent = Intent(Intent.ACTION_VIEW).apply {
                        setDataAndType(uri, "application/pdf")
                        addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION)
                        addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
                    }
                    val chooser = Intent.createChooser(intent, "Open Bill PDF").apply {
                        addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
                    }
                    reactContext.startActivity(chooser)
                    promise.resolve(true)
                } catch (e: Exception) {
                    promise.resolve(false)
                }
            }
        } catch (e: Exception) {
            promise.resolve(false)
        }
    }

    @ReactMethod
    fun copyToClipboard(text: String, label: String?, promise: Promise) {
        try {
            Handler(Looper.getMainLooper()).post {
                try {
                    val clipboard = reactContext.getSystemService(Context.CLIPBOARD_SERVICE) as? android.content.ClipboardManager
                    if (clipboard != null) {
                        val clip = android.content.ClipData.newPlainText(label ?: "Bill Reference Number", text)
                        clipboard.setPrimaryClip(clip)
                        promise.resolve(true)
                    } else {
                        promise.resolve(false)
                    }
                } catch (e: Exception) {
                    promise.resolve(false)
                }
            }
        } catch (e: Exception) {
            promise.resolve(false)
        }
    }
}
