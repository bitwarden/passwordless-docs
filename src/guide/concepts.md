# Concepts

## FIDO2

FIDO2 is the world wide web consortium (W3C) standard's specification for web authentication (WebAuthn), and client to authenticator protocol (CTAP). FIDO authentication standards were developed in order to provide authentication that is more secure than standard passwords and SMS 2FA. Using FIDO authentication standards can provide a secure experience that is simpler for consumers to use and developers to implement. Learn more about FIDO at [FIDO Alliance](https://fidoalliance.org/fido2/).

FIDO2 consists of two standardized components, **WebAuthn** and **CTAP**. Together, these standards operate to create a secure and passwordless experience.

- **WebAuthn** is an API that connects a relying party to an application or login system. In a practical sense, WebAuthn creates an easy connection between the web and an application to allow passwordless authentication to occur. Learn more about WebAuthn [here](https://www.yubico.com/resource/why-webauthn-matters/).
- **CTAP2** The client to authenticator protocol components allow an external and portable authenticator (security key) to operate with a client platform. FIDO CTAP2 is responsible for the external factor, like a security key, communicating with a website or account via an authenticator.

In order to achieve FIDO2 compliance, the Passwordless.dev authentication process will incorporate both WebAuthn and CTAP2 standards.

### Passkeys

Passkeys are a replacement for passwords that provide faster, easier, and more secure sign-ins to websites and apps across a user's devices. More precisely, "passkey" is a consumer-friendly term for a discoverable FIDO credential that can be synced to allow secure passwordless sign-ins across devices, or dedicated to a single piece of hardware as a device-bound passkey.

Passkeys may also have the capability to provide step-up authentication when bound to a device.

### Discoverable Credential

A Discoverable Credential is a passkey that is usable for authentication without the server requiring a `credentialId` first. This means that you don't need to first identify the user with a username or email, making it even simpler to sign-in. Passkeys are an example of Discoverable Credentials.

### User identifiers

The FIDO2 specification defines several user identifiers which are or can be used by Passwordless.dev in various registration and sign-in operations:

- A **userId** is a unique string that represents the [WebAuthn Userhandle](https://www.w3.org/TR/webauthn-2/#dom-publickeycredentialuserentity-id). This value is not meant to be displayed to a user and should not contain personally identifiable information. Authentication attempts are made exclusively against `userId` values. Examples of a `userId` is a database primary key, such as an int `123` or a guid `a2bd8bf7-2145-4a5a-910f-8fdc9ef421d3`.
- A **username** (Only for display purposes) A human-palatable identifier for a user account. It is intended only for display, i.e., aiding the user in determining the difference between user accounts with similar displayNames. Used in Browser UI's and never stored in the database. E.g. `pjfry@passwordless.dev`
- A **display name** (Only for display purposes) is a human-palatable name for the account, which should be chosen by the user and only used in your application's UI. E.g. `Philip J. Fry`
- An **alias** is a user-facing reference to a `userId` which allows sign-in with additional usernames, email addresses, etc. By default, aliases are hashed before being stored to preserve user privacy. Multiple aliases can be set for a `userId` by making requests to the `/alias` endpoint ([learn more](api.md#alias)), however the following rules should be taken into consideration when allowing users to create aliases:
  - An alias must be unique to the specified `userId`.
  - An alias must be no more than 250 characters.
  - A `userId` may have no more than 10 aliases associated with it.

### Authenticator types

FIDO2 authenticators can be one of two types:

- **Platform authenticators** are device-resident authenticators, like macOS FaceID or TouchID, or Windows Hello, which cannot be accessed via protocols like USB or NFC.
- **Roaming authenticators** (also called "cross-platform") are detachable device-agnostic authenticators, like USB security keys, that can connect to multiple devices over a supported transport protocol like USB or NFC.

## Passwordless.dev

### Product components

Architecturally, Passwordless.dev consists of three key parts:

- An [open-source client side library](frontend/javascript.md), used by your frontend to make requests to end-users browsers' WebAuthn API and requests to the Passwordless.dev APIs.
- A public RESTful API, used by your frontend to complete FIDO2 WebAuthn cryptographic exchanges with the browser.
- A [private RESTful API](api.md), used by your backend to initiate key registrations, verify sign-ins, and retrieve keys for end-users.

### API keys

Registering an application with the [Passwordless.dev admin console](get-started.md#create-an-application) will create a set of API keys:

- **ApiKey**: A public API key, safe and intended to be included client side. It allows the browser to connect to our backend and initiate key negotiations and assertions. Public API keys are in the format:
  ```
  <application-name>:public:<guid>
  //e.g. myapp:public:a28e285ec8b64ca58a3dec90c5af48c2
  ```
- **ApiSecret**: A private API key, or private secret, that should be well protected. It allows your backend to verify sign-ins and register keys on behalf of your users. Private API secrets are in the format:

  ```
  <application-name>:secret:<guid>
  //e.g. myapp:secret:42cd551fb288371812596e211fbc2a5a
  ```

### Credential

A credential represents a FIDO2 authenticator that is registered by Passwordless.dev for a user. Examples of credentials include [passkeys](https://fidoalliance.org/passkeys/) and [hardware security keys](https://www.yubico.com/products/security-key/). For each credential, the following information is stored:

| Property           | Description                                                                                                                                                   |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `descriptorId`     | A Base64Url string representation of the byte array that identifies the specific credential. Also referred to as the `credentialId`.                          |
| `publicKey`        | The credential's public key, used to cryptographically verify authentication. Note: Knowing the public key **does not** give access to an account/credential. |
| `userId`           | The unique identifier that is associated with a specific user account. It can be used to retrieve information about the user. E.g. `123`.                     |
| `signatureCounter` | The number of times this credential has been used for authentication.                                                                                         |
| `createdAt`        | Timestamp (UTC) when the credential was registered for the application.                                                                                       |
| `aaGuid`           | The Authenticator Attestation GUID is a unique identifier that is used to identify your authenticator when it is registered.                                  |
| `lastUsedAt`       | Timestamp (UTC) when the credential was last used for authentication for the application.                                                                     |
| `rpid`             | Relying party identifier for the application the credential is registered for.                                                                                |
| `origin`           | The domain name or IP address of the service using the API.                                                                                                   |
| `country`          | Country code indicating where the credential is located or registered.                                                                                        |
| `device`           | Device information for the device on which the credential resides, for example `Chrome, Mac OS X 10`.                                                         |
| `nickname`         | A user-specified name associated with this specific credential, for example `My Macbook`.                                                                     |

### Tokens

In the regular course of business, Passwordless.dev uses two important types of ephemeral tokens:

- A **registration token**, created by the private API from requests to the `/register/token` endpoint ([learn more](api.md#register-token)). Your frontend will register this token with the end-user's device for use in sign-in operations.
- An **authentication token**, created by the public API from calls to the `.signin()` method ([learn more](frontend/javascript.md#signinwith)). Your backend will verify this token to complete a sign-in operation (via the `/signin/verify` endpoint).

Additionally, Passwordless.dev uses other types of tokens for special purposes:

- A **manually generated authentication token**, created by the private API from requests to the `/signin/generate-token` endpoint. This token carries the same weight as a regular authentication token, but is generated manually, side-stepping the usual authentication flow. It's primarily used to facilitate account recovery and sign-in via magic links.

### Attestation

::: warning Important
Attestation is only supported in our 'Enterprise' plan. Read more about our plans [here](https://bitwarden.com/products/passwordless/#pricing).
:::

While WebAuthn is very secure, attestation enhances the security of the WebAuthn registration process by allowing the relying party to receive and verify information about the authenticator.

| Types        | Plans      | Description                                                                                                                                                                                                                                                                                                              |
| ------------ | ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `none`       | All        | The authenticator provides its attestation information, but without a meaningful cryptographic signature. This is less secure compared to other attestation types and is generally used when a relying party doesn't need strong proof of the authenticator's characteristics.                                           |
| `direct`     | Enterprise | The authenticator provides its attestation information directly to the relying party. However, it's important to note that "direct" attestation is essentially synonymous with "self-attestation." The authenticator makes a statement about its own properties without involving a third-party attestation certificate. |
| `indirect`   | Enterprise | The authenticator includes a signed attestation statement from an Attestation Certificate Authority (AttCA). The attestation statement from the AttCA provides a cryptographic proof of the authenticator's characteristics, enhancing the security of the attestation process.                                          |
| `enterprise` | n/a        | Gives enterprises the ability to uniquely identify authenticators to determine if they have been approved for use in a protected environment.                                                                                                                                                                            |

The relying party can use the attestation information to make informed decisions about whether to trust the authenticator and to assess the level of security provided by the user's device. It's important to note that while attestation enhances security, it is not mandatory for the basic operation of WebAuthn. WebAuthn can still work without attestation, but its use is recommended for stronger security practices.

### Authentication Configurations

Authentication configurations allow you to configure your authentication token used in the `signin()` and `stepup()` client methods. Each method passes parameters into the authenticator accessed by the browser. Authentication Configurations allow for the Time to Live of the authentication token and the User Verification Requirement setting to be set for the given authentication workflow. There are also other options available for configuration.

There are two default Authentication Configurations for each application, `step-up` and `sign-in`. They are used in their respective client methods as the `purpose` of the authentication. They can be edited, and if deleted, they will revert back to their default settings. Authentication Configurations can be accessed via the [API](./api.md#auth-configs) or [Admin Console](./admin-console/applications.md#authentication-configurations).

### Credential Hints

When performing a sign-in operation, the Passwordless.dev API can provide hints to the user agent for how best to authenticate the user. These hints are not requirements and the user agent retains the liberty to choose how to react to them.

The following hints are available:

- `SecurityKey` - the user agent should use a security key for authentication.
- `ClientDevice` - the user agent should use the device's built-in authenticator for authentication.
- `Hybrid` - the user agent should use a general-purpose authenticator for authentication, such as a smartphone.

Credential hints can be combined in an ordered list to provide the user agent with a preference for how to authenticate the user. The user agent should use the first hint in the list that it can satisfy.

In Passwordless.dev, credential hints are configured as part of an [authentication configuration](#authentication-configurations).

## More terms

### Relying party

The relying party (RP) is the server that processes requests for access to a resource. A web application that verifies a user's credentials during an access request would be an example of a RP.

### Relying party ID

The ID for relying parties provides the technology platform and identification that correspond with the given domain.

### User verification

A FIDO2 server RP can interact with an authenticator to verify a user. This can be done via PIN code, biometrics, or other 2FA methods that securely verify that the proper person is accessing an account.
