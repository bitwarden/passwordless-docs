---
title: iOS Client Reference
---

# iOS Client Reference

The purpose of this SDK is to be able to easily integrate [passkeys](https://developer.apple.com/passkeys/) into your iOS app with the help of the [Passwordless.dev](https://bitwarden.com/products/passwordless/) management system.

## apple-app-site-association

Apple requires associated domains to be set up to perform passkey registration and assertions. For more details on setting up an apple-app-site-association, see [Apple's documentation](https://developer.apple.com/documentation/Xcode/supporting-associated-domains).

For passkeys, you need to set up a `webcredentials` section for your app.

## Getting Started with the iOS SDK

### Requirements

* **Minimum iOS Version:** iOS 16
* **Additional Capabilities:** 
  * _Associate Domains_ are needed to add the domain of where the AASA file is hosted.

### Swift Package Manager

The SDK can be added to your project via [Swift Package Manager](https://www.swift.org/package-manager/). You can then access the SDK functionality using `import Passwordless`.

### Initialization

The SDK provides a `PasswordlessClient` object that needs to be initialized with a `PasswordlessConfig` configuration. The configuration contains the API URL and API key needed to interface with [Passwordless.dev](https://bitwarden.com/products/passwordless/). It also requires the relying party ID, which represents the domain of your server that hosts an apple-app-site-association file with your app's team ID and bundle ID.

You will need to register with [Passwordless.dev](https://bitwarden.com/products/passwordless/) to obtain an API key.

Here is an example of a configuration:

```swift
let passwordlessClient = PasswordlessClient(
    config: PasswordlessConfig(
        apiKey: "<YOUR API KEY>",
        rpId: "demo.passwordless.dev"
    )
)
```

### Registration

1. Request a registration token from your public RESTful API with the given username.
2. Pass the registration token to the `PasswordlessClient` via the `register(token:)` function. This will prompt the user to use biometrics to create the local private key needed for validation and send the public key to the Passwordless.dev API. Once complete, a verification token will be returned. See [error section](#error-responses) for possible errors that could be thrown.

```swift
let verifyToken = try await passwordlessClient.register(token: registrationToken)
```

3. Pass the verification token to your public RESTful API to verify and return an authorization token. The user is now logged in to your app.

![Registration Flow](./ios/Registration.gif)

### Sign in

There are two main approaches for passkey sign in: auto fill and manual entry.

#### A. Auto Fill
This is when the user taps the username field, and the keyboard appears. If the user taps the auto fill options above the keyboard, then this is the auto fill approach. For this to work correctly, you must call `signInWithAutofill` when your view first appears. This way, by the time the keyboard appears, the OS will have results ready to show.

1. Call `signInWithAutofill()` when your view first appears. Once complete, a verification token will be returned.
    * This function will wait until the user has tapped on an autofill item, it has been canceled in the passkey dialog, or an error has occurred. 
    * If errors are thrown, your app will need to decide whether or not to restart the auto fill sign in process again. 
    * If it is not running, then no options will show in the keyboard, so it usually makes sense to restart the process only in the `authorizationCancelled` case. 
    * Getting an `authorizationError` may be a sign that something is not configured properly within your app, so it may be best to not rerun the auto fill to prevent endless looping errors. See [error section](#error-responses) for possible errors that could be thrown.

```swift
let verifyToken = try await passwordlessClient.signInWithAutofill()
```

2. Pass the verification token to your public RESTful API to verify and return an authorization token. The user is now logged in to your app.

![Auto Fill Sign in Flow](./ios/SignInAutoFill.gif)

#### B. Manual Entry

This is when the user types in a user name, and hits a button within the view to sign in. This will display a different version of the passkey window for the user to select from.

1. Call `signIn(alias:)` with a given alias. Once complete, a verification token will be returned. See [error section](#error-responses) for possible errors that could be thrown.

```swift
let verifyToken = try await passwordlessClient.signIn(alias: username)
```

2. Pass the verification token to your public RESTful API to verify and return an authorization token. The user is now logged in to your app.

![Manual Sign in Flow](./ios/SignInManual.gif)

### Error Responses
The PasswordlessClient object can throw the following errors:

| Error | Description |
| --- | --- |
| authorizationCancelled | OS Authorization was cancelled from the key credential provider. |
| authorizationError(Error) | OS Authorization failed from the key credential provider. |
| internalErrorDecodingJson(Error) | There was an issue decoding json to an object from a network response. |
| internalErrorEncodingPayload(Error) | There was an issue encoding json from an object for a network request. |
| internalErrorInvalidURL(String) | The url used to make the network request is invalid. |
| internalErrorNetworkRequestFailed(Error) | An error occurred when making a network request. |
| internalErrorNetworkRequestResponseError(Int?, PasswordlessErrorResponse?) | An error response occurred when making a network request with the given status code and error response if available. |
| internalErrorUnableToDecodeChallenge | The challenge provided is not in the correct format. |
| internalErrorUnableToEncodeUserId | The user Id is not able to be encoded to base 64 Url. |

For internalErrorNetworkRequestResponseError, the PasswordlessErrorResponse can be provided, which contains details about the error from the response. Here's an example of a response error that could be returned:

```json
{
  "type": "https://docs.passwordless.dev/errors#missing_register_token",
  "title": "The token you sent was not correct. The token used for this endpoint should start with 'register_'. Make sure you are not sending the wrong value.",
  "status": 400,
  "errorCode": "missing_register_token"
}
```

And here's an example of how you could view this in your app:

```swift
do {
    let verifyToken = try await passwordlessClient.signIn()
}
catch PasswordlessClientError.authorizationCancelled {
    print("Cancelled")
}
catch let PasswordlessClientError.internalErrorNetworkRequestResponseError(code, response) {
    print("Network Error occurred. Response status code: \(code ?? -1)")
    dump(response)
}
catch {
    print("Some other error occurred: \(error)")
}
```