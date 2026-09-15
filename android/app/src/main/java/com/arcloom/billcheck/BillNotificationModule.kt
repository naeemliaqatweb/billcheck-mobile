package com.arcloom.billcheck

import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.content.Context
import android.content.Intent
import android.content.pm.PackageManager
import android.os.Build
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
                    promise.resolve(false)
                    return
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

            val appIconRes = reactContext.applicationInfo.icon

            val builder = NotificationCompat.Builder(reactContext, CHANNEL_ID)
                .setSmallIcon(if (appIconRes != 0) appIconRes else android.R.drawable.ic_dialog_info)
                .setContentTitle(title)
                .setContentText(message)
                .setStyle(NotificationCompat.BigTextStyle().bigText(message))
                .setPriority(NotificationCompat.PRIORITY_HIGH)
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
}
