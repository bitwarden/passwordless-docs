---
title: Android Client SDK
---

# Android Client SDK

The Passwordless.dev Android client SDK gives users the ability to leverage their device’s built-in fingerprint sensor and/or FIDO security keys for secure passwordless access to websites and native applications that support the FIDO2 protocols.

## Requirements

- Android 9.0 (API level 28) or higher
- Java 8 or higher
- [Having completed the 'Get started' guide](../get-started.md).

## Installation

::: tabs

@tab Apache Maven

```xml
<dependency>
  <groupId>com.bitwarden</groupId>
  <artifactId>passwordless-android</artifactId>
  <version>1.1.0</version>
</dependency>
```

@tab Gradle Kotlin DSL

```kotlin
implementation("com.bitwarden:passwordless-android:1.1.0")
```

@tab Gradle Groovy DSL

```groovy
implementation 'com.bitwarden:passwordless-android:1.1.0'
```

:::

## Permissions

When the library has been added to your app, the following permission will be added to your `AndroidManifest.xml` automatically when the app is being built.

It is not necessary for you to add the following permission.

```xml
<uses-permission android:name="android.permission.INTERNET" />
```

## Configuration (Android application)

Somewhere in your Android application, configure `PasswordlessOptions`.

```kotlin
data class PasswordlessOptions(
   // Your public API key
   val apiKey: String,

   // Identifier for your server, for example 'example.com' if your backend is hosted at https://example.com.
   val rpId: String,

   // Where your backend is hosted
   val backendUrl:String,

   // Passwordless.dev server, change for self-hosting
   val apiUrl: String = "https://v4.passwordless.dev"
)
```

### .well-known/assetlinks.json

In your application's `AndroidManifest.xml`, add the following tag under `manifest::application`:

```xml
<meta-data
  android:name="asset_statements"
  android:resource="@xml/assetlinks" />
```

In your application's `res/xml/assetlinks.xml`, you will then need to add the following content. This will tell our Android application where your `.well-known/assetlinks.json` file is hosted.

```xml
<?xml version="1.0" encoding="utf-8"?>
<resources>
    <string name="assetlinks">https://yourexample.com/.well-known/assetlinks.json</string>
</resources>
```

## Configuration (Your back-end)

### Obtaining the SHA-256 Certificate Fingerprints

To configure your backend, you'll need to host a `.well-known/assetlinks.json` file at the root of your domain. This file contains a list of SHA-256 certificate fingerprints that are allowed to authenticate with your backend.

The following command will print detailed information about the keystore entry with the specified alias, including information about the certificate, its validity, and other details. It's commonly used in Android development to verify the properties of the debug keystore and the associated key used for signing applications during development.

::: tabs

@tab Gradle

Go to the root directory of the project from the terminal and run the below command:

```bash
./gradlew signingReport
```

@tab Bash

```bash
keytool -list -v -keystore ~/.android/debug.keystore -alias androiddebugkey -storepass android -keypass android
```

@tab Powershell

```powershell
keytool -list -v -keystore "%USERPROFILE%\.android\debug.keystore" -alias androiddebugkey -storepass android -keypass android
```

:::

Put this SHA256 along with your root Android package name in your backend to generate `assetlinks.json` for your app at `https://yourexample.com/.well-known/assetlinks.json`.
If you are using `example-nodejs-backend`, then just put these 2 values in your `.env` file.

### Host ~/.well-known/assetlinks.json

You will need store the following file at `https://<your-domain>/.well-known/assetlinks.json`. To generate the SHA256 hash, read the links below the snippet.

You may also have to change the 'target::namespace' and 'target::package_name' properties to match your application's.

```json
[
  {
    "relation": [
      "delegate_permission/common.handle_all_urls",
      "delegate_permission/common.get_login_creds"
    ],
    "target": {
      "namespace": "web"
    }
  },
  {
    "relation": [
      "delegate_permission/common.handle_all_urls",
      "delegate_permission/common.get_login_creds"
    ],
    "target": {
      "namespace": "android_app",
      "package_name": "com.example.myapplication",
      "sha256_cert_fingerprints": [
        "3C:E2:29:94:E2:DE:1E:EB:E5:F9:70:10:72:41:F4:0F:06:38:61:BD:72:76:79:CA:72:68:67:FA:38:9B:65:B9"
      ]
    }
  }
]
```

## Using the PasswordlessClient

::: tabs

@tab With Dagger Hilt

You can either set the `ActivityContext` and `CoroutineScope` by injecting it with Dagger Hilt as follows:

```kotlin
@Module
@InstallIn(ActivityComponent::class)
class PasswordlessModule {
    @Provides
    fun provideLifecycleCoroutineScope(activity: Activity): LifecycleCoroutineScope =
        (activity as AppCompatActivity).lifecycleScope

    @Provides
    @ActivityScoped
    fun providePasswordlessClient(
        @ActivityContext activity: Context, scope: LifecycleCoroutineScope): PasswordlessClient {
        val options = PasswordlessOptions(
            DemoPasswordlessOptions.API_KEY,
            DemoPasswordlessOptions.RP_ID,
            DemoPasswordlessOptions.ORIGIN,
            DemoPasswordlessOptions.API_URL
        )

        return PasswordlessClient(options, activity, scope)
    }
}
```

@tab Without Dagger Hilt

Or you can set the Context of PasswordlessClient manually. Ensure the context is set to the current `Activity`.

```kotlin
/** Context needs to be set according to current activity
 * If there are different activity handling register and signin,
 * then call this on every activity
*/
_passwordless.setContext(this)
```

Set the coroutine scope, passing lifecycleScope of the current fragment, only necessary if you again do not use Dagger Hilt.

```kotlin
_passwordless.setCoroutineScope(lifecycleScope)
```

:::

## Registration

1. **UI**:
   - (Required) Specify the username for the credential.
   - (Optional) Take the alias as input from the user if it's a non-discoverable credential.
2. **Call `POST /register/token` implemented in `your backend`**: Your backend should call the Passwordless.dev API to generate a registration token.
   - See [API documentation](https://docs.passwordless.dev/guide/api.html#register-token)
3. **Call `PasswordlessClient.register()`**:

```kotlin
// Pass the registration token to PasswordlessClient.register()
_passwordless.register(
    token = responseToken, // Token received from your back-end
    nickname = nickname // (Optional) Can be used by the user to identify the credential, e.g. "Work Laptop"
) { success, exception, result ->
    if (success) {
        Toast.makeText(context, result.toString(), Toast.LENGTH_SHORT).show()
    } else {
        Toast.makeText(context, "Exception: " + getPasskeyFailureMessage(exception as Exception), Toast.LENGTH_SHORT).show()
    }
}
```

## Logging in

1. **UI**: Optionally, take the alias as input from the user if it's a non-discoverable credential.
2. **Call `PasswordlessClient.login()`**: Initiate the login process with the (optional) alias and response callback.
3. **Call `POST /signin/verify` implemented in `your backend`**: Your backend should call the Passwordless.dev API to generate a login token.
   - See [API documentation](https://docs.passwordless.dev/guide/api.html#signin-verify)

```kotlin
// Call PasswordlessClient.login() with the alias
_passwordless.login(alias) { success, exception, result ->
    if (success) {
        lifecycleScope.launch {
            // When successful, call your backend to verify the token, which could for example return a JWT token.
            val clientDataResponse = httpClient.login(UserLoginRequest(result?.token!!))
            if (clientDataResponse.isSuccessful) {
                // Login successful. Parse the response or JWT token and proceed.
                val data = clientDataResponse.body()
                showText(data.toString())
            }
        }
    } else {
        showException(exception)
    }
}
```

## Sample

You can find the source code for a sample application [here](https://github.com/bitwarden/passwordless-android/tree/main/app).

::: tabs

@tab Registration 1
![Registration #1](../../assets/images/guide/frontend/android/register_1.png =300x)

@tab Registration 2
![Registration #2](../../assets/images/guide/frontend/android/register_2.png =300x)

@tab Login 1
![Login #1](../../assets/images/guide/frontend/android/login_1.png =300x)

@tab Login 2
![Login #2](../../assets/images/guide/frontend/android/login_2.png =300x)

@tab Login 3
![Login #3](../../assets/images/guide/frontend/android/login_3.png =300x)

:::

## References

- [Get Started - Passwordless.dev](../get-started.md/)
- [Integration with your backend - Passwordless.dev](../backend/index.md)
- [Client Auth - Google](https://developers.google.com/android/guides/client-auth)
- [Associate apps & sites - Google](https://developers.google.com/identity/smartlock-passwords/android/associate-apps-and-sites)
- [Passkeys - Google](https://developer.android.com/training/sign-in/passkeys)
- [Troubleshooting - Android Client SDK - Passwordless.dev](android/troubleshooting.md)
