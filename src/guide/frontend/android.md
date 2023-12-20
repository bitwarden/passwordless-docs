---
title: Android Client SDK
---

# Android Client SDK

The Passwordless.dev JavaScript client is used by your frontend to complete FIDO2 WebAuthn cryptographic exchanges with the browser.

All methods **require** your API [public key](../concepts.md#api-keys) for authentication. Requests made to the [private API](../api.md) will instead require your API [private secret](../concepts.md#api-keys).

## Installation

TODO

## Configuration

### Your backend

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

To obtain the Facet ID continue the steps below, the facet id typically looks like:

`android:apk-key-hash:POIplOLeHuvl-XAQckH0DwY4Yb1ydnnKcmhn-jibZbk`

1. Execute the following command in your terminal:

   ```bash
   # Linux, Mac OS, Git Bash, ...
   keytool -list -v -keystore ~/.android/debug.keystore | grep "SHA256: " | cut -d " " -f 3 | xxd -r -p | openssl base64 | sed 's/=//g'
   ```

2. The default password for the debug keystore is `android`. For your production keystore, enter your chosen password.

3. This command will output BASE64:
   `POIplOLeHuvl+XAQckH0DwY4Yb1ydnnKcmhn+jibZbk`

4. You need to convert this to BASE64URL format:
   `POIplOLeHuvl-XAQckH0DwY4Yb1ydnnKcmhn-jibZbk`

5. Now append it to `android:apk-key-hash:` to get the Facet ID:
   `android:apk-key-hash:POIplOLeHuvl-XAQckH0DwY4Yb1ydnnKcmhn-jibZbk`

## Usage

### Registration

TODO

### Signing in

TODO

## References

- [Google Android: Client Auth](https://developers.google.com/android/guides/client-auth)
