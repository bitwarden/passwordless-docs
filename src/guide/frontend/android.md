---
title: Android Client SDK
---

# Android Client SDK

The Passwordless.dev JavaScript client is used by your frontend to complete FIDO2 WebAuthn cryptographic exchanges with the browser.

All methods **require** your API [public key](../concepts.md#api-keys) for authentication. Requests made to the [private API](../api.md) will instead require your API [private secret](../concepts.md#api-keys).

## Installation

### Facet ID

To obtain the Facet ID which looks like `android:apk-key-hash:POIplOLeHuvl-XAQckH0DwY4Yb1ydnnKcmhn-jibZbk`, follow the instructions below.

1. Execute the following command in your terminal:

   ```bash
   # Linux, Mac OS, Git Bash, ...
   keytool -list -v -keystore ~/.android/debug.keystore | grep "SHA256: " | cut -d " " -f 3 | xxd -r -p | openssl base64 | sed 's/=//g'
   ```

2. The default password for the debug keystore is `android`. For your production keystore, enter your chosen password.

3. This command will output BASE64, for example: `POIplOLeHuvl+XAQckH0DwY4Yb1ydnnKcmhn+jibZbk`.

4. You need to convert this to BASE64URL format: `POIplOLeHuvl-XAQckH0DwY4Yb1ydnnKcmhn-jibZbk`.

5. Now append it to `android:apk-key-hash:` to get the Facet ID: `android:apk-key-hash:POIplOLeHuvl-XAQckH0DwY4Yb1ydnnKcmhn-jibZbk`.

## References

- [Google Android: Client Auth](https://developers.google.com/android/guides/client-auth)
