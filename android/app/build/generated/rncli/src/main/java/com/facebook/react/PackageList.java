
package com.facebook.react;

import android.app.Application;
import android.content.Context;
import android.content.res.Resources;

import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainPackageConfig;
import com.facebook.react.shell.MainReactPackage;
import java.util.Arrays;
import java.util.ArrayList;

// react-native-vector-icons
import com.oblador.vectoricons.VectorIconsPackage;
// @react-native-async-storage/async-storage
import com.reactnativecommunity.asyncstorage.AsyncStoragePackage;
// @react-native-community/checkbox
import com.reactnativecommunity.checkbox.ReactCheckBoxPackage;
// @react-native-community/netinfo
import com.reactnativecommunity.netinfo.NetInfoPackage;
// @react-native-firebase/app
import io.invertase.firebase.app.ReactNativeFirebaseAppPackage;
// @react-native-firebase/messaging
import io.invertase.firebase.messaging.ReactNativeFirebaseMessagingPackage;
// @react-native-picker/picker
import com.reactnativecommunity.picker.RNCPickerPackage;
// react-native-background-timer
import com.ocetnik.timer.BackgroundTimerPackage;
// react-native-date-picker
import com.henninghall.date_picker.DatePickerPackage;
// react-native-device-info
import com.learnium.RNDeviceInfo.RNDeviceInfo;
// react-native-document-picker
import com.reactnativedocumentpicker.DocumentPickerPackage;
// react-native-exception-handler
import com.masteratul.exceptionhandler.ReactNativeExceptionHandlerPackage;
// react-native-fast-image
import com.dylanvann.fastimage.FastImageViewPackage;
// react-native-gesture-handler
import com.swmansion.gesturehandler.RNGestureHandlerPackage;
// react-native-image-crop-picker
import com.reactnative.ivpusic.imagepicker.PickerPackage;
// react-native-image-picker
import com.imagepicker.ImagePickerPackage;
// react-native-keep-awake
import com.corbt.keepawake.KCKeepAwakePackage;
// react-native-pager-view
import com.reactnativepagerview.PagerViewPackage;
// react-native-push-notification
import com.dieam.reactnativepushnotification.ReactNativePushNotificationPackage;
// react-native-reanimated
import com.swmansion.reanimated.ReanimatedPackage;
// react-native-safe-area-context
import com.th3rdwave.safeareacontext.SafeAreaContextPackage;
// react-native-screens
import com.swmansion.rnscreens.RNScreensPackage;
// react-native-sound
import com.zmxv.RNSound.RNSoundPackage;
// react-native-splash-screen
import org.devio.rn.splashscreen.SplashScreenReactPackage;
// react-native-video
import com.brentvatne.react.ReactVideoPackage;
// react-native-webview
import com.reactnativecommunity.webview.RNCWebViewPackage;
// rn-fetch-blob
import com.RNFetchBlob.RNFetchBlobPackage;

public class PackageList {
  private Application application;
  private ReactNativeHost reactNativeHost;
  private MainPackageConfig mConfig;

  public PackageList(ReactNativeHost reactNativeHost) {
    this(reactNativeHost, null);
  }

  public PackageList(Application application) {
    this(application, null);
  }

  public PackageList(ReactNativeHost reactNativeHost, MainPackageConfig config) {
    this.reactNativeHost = reactNativeHost;
    mConfig = config;
  }

  public PackageList(Application application, MainPackageConfig config) {
    this.reactNativeHost = null;
    this.application = application;
    mConfig = config;
  }

  private ReactNativeHost getReactNativeHost() {
    return this.reactNativeHost;
  }

  private Resources getResources() {
    return this.getApplication().getResources();
  }

  private Application getApplication() {
    if (this.reactNativeHost == null) return this.application;
    return this.reactNativeHost.getApplication();
  }

  private Context getApplicationContext() {
    return this.getApplication().getApplicationContext();
  }

  public ArrayList<ReactPackage> getPackages() {
    return new ArrayList<>(Arrays.<ReactPackage>asList(
      new MainReactPackage(mConfig),
      new VectorIconsPackage(),
      new AsyncStoragePackage(),
      new ReactCheckBoxPackage(),
      new NetInfoPackage(),
      new ReactNativeFirebaseAppPackage(),
      new ReactNativeFirebaseMessagingPackage(),
      new RNCPickerPackage(),
      new BackgroundTimerPackage(),
      new DatePickerPackage(),
      new RNDeviceInfo(),
      new DocumentPickerPackage(),
      new ReactNativeExceptionHandlerPackage(),
      new FastImageViewPackage(),
      new RNGestureHandlerPackage(),
      new PickerPackage(),
      new ImagePickerPackage(),
      new KCKeepAwakePackage(),
      new PagerViewPackage(),
      new ReactNativePushNotificationPackage(),
      new ReanimatedPackage(),
      new SafeAreaContextPackage(),
      new RNScreensPackage(),
      new RNSoundPackage(),
      new SplashScreenReactPackage(),
      new ReactVideoPackage(),
      new RNCWebViewPackage(),
      new RNFetchBlobPackage()
    ));
  }
}
