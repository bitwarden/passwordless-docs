---
title: Android Client SDK
---

# Android Client SDK

The Passwordless.dev JavaScript client is used by your frontend to complete FIDO2 WebAuthn cryptographic exchanges with the browser.

All methods **require** your API [public key](../concepts.md#api-keys) for authentication. Requests made to the [private API](../api.md) will instead require your API [private secret](../concepts.md#api-keys).

## Installation

TODO: Pending publishing of SDK

## Configuration

### Your backend

#### Generating SHA-256 Certificate Fingerprints

To configure your backend, you'll need to host a `.well-known/assetlinks.json` file at the root of your domain. This file contains a list of SHA-256 certificate fingerprints that are allowed to authenticate with your backend.

This command will print detailed information about the keystore entry with the specified alias, including information about the certificate, its validity, and other details. It's commonly used in Android development to verify the properties of the debug keystore and the associated key used for signing applications during development.

- Option 1:
  - MacOS & Linux:
    ```bash
    keytool -list -v -keystore ~/.android/debug.keystore -alias androiddebugkey -storepass android -keypass android
    ```
  - Windows:
    ```powershell
    keytool -list -v -keystore "%USERPROFILE%\.android\debug.keystore" -alias androiddebugkey -storepass android -keypass android
    ```
- Option 2:
  Go to the root directory of the project from the terminal and run the below command
  ```bash
  ./gradlew signingReport
  ```
  Put this SHA256 along with your root android package name in your backend to generate `assetlinks.json` for your app at `https://yourexample.com/.well-known/assetlinks.json`.
  If you are using `example-nodejs-backend`. then just put these 2 values in your `.env` file.

#### Host ~/.well-known/assetlinks.json

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

- [Associate apps & sites - Google](https://developers.google.com/identity/smartlock-passwords/android/associate-apps-and-sites)
- [Passkeys - Google](https://developer.android.com/training/sign-in/passkeys)

### Application

#### General

```kotlin
data class PasswordlessOptions(
   # Your public API key
   val apiKey: String,

   # Identifier for your server, for example 'example.com' if your backend is hosted at https://example.com.
   val rpId: String,

   # This is where your Facet ID goes
   val origin: String,

   # Where your backend is hosted
   val backendUrl:String,

   # Passwordless.dev server, change for self-hosting
   val apiUrl: String = "https://v4.passwordless.dev"
)
```

#### Permissions

In your `AndroidManifest.xml`, you will need to add the following permissions:

```xml
<uses-permission android:name="android.permission.INTERNET" />
```

#### Use the hosted .well-known/assetlinks.json

In your application's `AndroidManifest.xml`, you will then need to add the tag below under `manifest::application`:

```xml
<meta-data
            android:name="asset_statements"
            android:resource="@xml/assetlinks" />
```

In your application's `res/xml/assetlinks.xml`, you will then need to add the following content. This will tell our Android application where our `.well-known/assetlinks.json` file is hosted.

```xml
<?xml version="1.0" encoding="utf-8"?>
<resources>
    <string name="assetlinks">https://yourexample.com/.well-known/assetlinks.json</string>
</resources>
```

#### Facet ID

The `Facet ID` will be used at a later point in this guide to use as the `origin`.

To obtain the Facet ID continue the steps below, the facet id typically looks like:

`android:apk-key-hash:POIplOLeHuvl-XAQckH0DwY4Yb1ydnnKcmhn-jibZbk`

1. Execute the following command in your terminal:

   - MacOS & Linux:
     ```bash
     # Linux, Mac OS, Git Bash, ...
     keytool -list -v -keystore ~/.android/debug.keystore | grep "SHA256: " | cut -d " " -f 3 | xxd -r -p | openssl base64 | sed 's/=//g'
     ```
   - Windows:

     ```powershell
     # Run keytool command and extract SHA256 hash
     $keytoolOutput = keytool -list -v -keystore $HOME\.android\debug.keystore
     $sha256Hash = ($keytoolOutput | Select-String "SHA256: ").ToString().Split(" ")[2]

     # Remove any non-hex characters from the hash
     $hexHash = $sha256Hash -replace "[^0-9A-Fa-f]"

     # Convert the hexadecimal string to a byte array
     $byteArray = [byte[]]@()
     for ($i = 0; $i -lt $hexHash.Length; $i += 2) {
       $byteArray += [byte]([Convert]::ToUInt32($hexHash.Substring($i, 2), 16))
     }

     # Convert the byte array to a base64 string
     $base64String = [Convert]::ToBase64String($byteArray)

     Write-Output $base64String
     ```

2. The default password for the debug keystore is `android`. For your production keystore, enter your chosen password.

3. This command will output BASE64:
   `POIplOLeHuvl+XAQckH0DwY4Yb1ydnnKcmhn+jibZbk`

4. You need to convert this to BASE64URL format:
   `POIplOLeHuvl-XAQckH0DwY4Yb1ydnnKcmhn-jibZbk`

5. Now append it to `android:apk-key-hash:` to get the Facet ID:
   `android:apk-key-hash:POIplOLeHuvl-XAQckH0DwY4Yb1ydnnKcmhn-jibZbk`

## Getting Started

Follow the [Get started guide](https://docs.passwordless.dev/guide/get-started.html).

### Creating a `PasswordlessClient` instance

You can either set the `ActivityContext` by injecting it with Dagger Hilt as follows:

```kotlin
@Module
@InstallIn(ActivityComponent::class)
class PasswordlessModule {
    @Provides
    @ActivityScoped
    fun providePasswordlessClient(@ActivityContext activity: Context): PasswordlessClient {
        val options = PasswordlessOptions(
            DemoPasswordlessOptions.API_KEY, // Your secret key
            DemoPasswordlessOptions.RP_ID, // yourbackend.com
            DemoPasswordlessOptions.ORIGIN, // This is your Facet ID
            DemoPasswordlessOptions.API_URL // https://v4.passwordless.dev
        )
        return PasswordlessClient(options, activity)
    }
}
```

Or you can set the Context of PasswordlessClient manually: Ensure the context is set to the current `Activity`.

```kotlin
/** Context needs to be set according to current activity
 * If there are different activity handling register and signin,
 * then call this on every activity
*/
_passwordless.setContext(this)
```

**Set Coroutine Scope**: Set the coroutine scope, passing lifecycleScope of the current fragment.

```kotlin
_passwordless.setCoroutineScope(lifecycleScope)
```

### Registration

1. **Call Your Backend with User Details**:Make a call to your backend with user details (e.g., username, alias) and retrieve the registration token.
2. **Call Passwordless Register Function**

```kotlin
_passwordless.register(
    token =responseToken,
    nickname = nickname
) { success, exception, result ->
        if (success) {
            Toast.makeText(context, result.toString(), Toast.LENGTH_SHORT).show()
        } else {
            Toast.makeText(
            context,
            "Exception: " + getPasskeyFailureMessage(exception as Exception),
        Toast.LENGTH_SHORT
        ).show()
    }
}
```

### Logging in

1. **Take Alias as Input**: Gather the alias as input from the user.
2. **Call Passwordless Login**: Initiate the login process with the alias and response callback.

```kotlin
_passwordless.login(alias) { success, exception, result ->
    if (success) {
        lifecycleScope.launch {
             val clientDataResponse =
                httpClient.login(UserLoginRequest(result?.token!!))
            if (clientDataResponse.isSuccessful) {
                val data = clientDataResponse.body()
                showText(data.toString())
            }
        }
    } else {
        showException(exception)
    }
}
```

## References

- [Google Android: Client Auth](https://developers.google.com/android/guides/client-auth)
