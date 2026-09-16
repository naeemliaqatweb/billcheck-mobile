package com.arcloom.billcheck

import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.content.Context
import android.content.Intent
import android.content.pm.PackageManager
import android.os.Build
import android.os.Handler
import android.os.Looper
import android.print.PrintAttributes
import android.print.PrintManager
import android.webkit.WebView
import android.webkit.WebViewClient
import androidx.core.app.ActivityCompat
import androidx.core.app.NotificationCompat
import androidx.core.app.NotificationManagerCompat
import androidx.core.content.ContextCompat
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod

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
                    // Try to request if activity is available
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
}
