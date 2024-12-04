package com.devtest

import android.content.Context
import android.graphics.Point
import android.util.DisplayMetrics
import android.view.WindowManager
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod

class SizeHelper(reactApplicationContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactApplicationContext) {
  
    private val context = reactApplicationContext
    override fun getName(): String {
        return "SizeHelper"
    }

    @ReactMethod
    fun getScreenSize(promise: Promise) {
        val point = Point()
        val windowManager = context.getSystemService(Context.WINDOW_SERVICE) as WindowManager
        windowManager.defaultDisplay.getRealSize(point)
        val displayMetrics: DisplayMetrics = context.resources.displayMetrics
        val width = point.x
        val height = point.y
        val wi = width.toDouble() / displayMetrics.xdpi
        val hi = height.toDouble() / displayMetrics.ydpi
        val diagonalInches = Math.sqrt(Math.pow(wi, 2.0) + Math.pow(hi, 2.0))
        val diagonalMilimeter = diagonalInches * 25.4
        promise.resolve(diagonalMilimeter)
    }
}