package com.arcloom.billcheck

import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.content.pm.PackageManager
import android.os.Build
import androidx.core.app.NotificationCompat
import androidx.core.app.NotificationManagerCompat
import androidx.core.content.ContextCompat

/**
 * BroadcastReceiver triggered by AlarmManager even when the app is completely killed/closed.
 * Posts authentic Android system tray notifications with sound, vibration, and lockscreen visibility.
 */
class BillAlarmReceiver : BroadcastReceiver() {

    override fun onReceive(context: Context, intent: Intent) {
        if (Intent.ACTION_BOOT_COMPLETED == intent.action) {
            // AlarmManager alarms are cleared by OS on reboot; when user opens the app,
            // App.tsx / NotificationService re-schedules them automatically.
            return
        }

        val title = intent.getStringExtra("title") ?: "⚠️ Bill Due Date Reminder"
        val message = intent.getStringExtra("message") ?: "Your utility bill is due soon. Pay on time to avoid surcharge."
        val tag = intent.getStringExtra("tag") ?: "bill_reminder"
        val notifId = intent.getIntExtra("notifId", (System.currentTimeMillis() % 100000).toInt())

        // Ensure Notification Channel exists
        createNotificationChannel(context)

        // Android 13+ permission check
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
            val hasPerm = ContextCompat.checkSelfPermission(
                context,
                android.Manifest.permission.POST_NOTIFICATIONS
            ) == PackageManager.PERMISSION_GRANTED
            if (!hasPerm) return
        }

        // Tap action: opens the main app
        val launchIntent = context.packageManager.getLaunchIntentForPackage(context.packageName) ?: Intent(context, MainActivity::class.java)
        launchIntent.flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TOP

        val flags = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
        } else {
            PendingIntent.FLAG_UPDATE_CURRENT
        }

        val pendingIntent = PendingIntent.getActivity(
            context,
            notifId,
            launchIntent,
            flags
        )

        var smallIcon = context.resources.getIdentifier("ic_launcher", "mipmap", context.packageName)
        if (smallIcon == 0) {
            smallIcon = context.applicationInfo.icon
        }
        if (smallIcon == 0) {
            smallIcon = android.R.drawable.ic_dialog_info
        }

        val builder = NotificationCompat.Builder(context, BillNotificationModule.CHANNEL_ID)
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

        try {
            val notificationManager = NotificationManagerCompat.from(context)
            notificationManager.notify(tag, notifId, builder.build())
        } catch (_: Exception) {
            // gracefully ignore if OS restricts
        }
    }

    private fun createNotificationChannel(context: Context) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val importance = NotificationManager.IMPORTANCE_HIGH
            val channel = NotificationChannel(
                BillNotificationModule.CHANNEL_ID,
                BillNotificationModule.CHANNEL_NAME,
                importance
            ).apply {
                description = BillNotificationModule.CHANNEL_DESC
                enableVibration(true)
                enableLights(true)
                setShowBadge(true)
                lockscreenVisibility = android.app.Notification.VISIBILITY_PUBLIC
            }
            val notificationManager =
                context.getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
            notificationManager.createNotificationChannel(channel)
        }
    }
}
