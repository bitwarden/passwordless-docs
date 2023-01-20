# What is WebAuthn and FIDO2?

FIDO2 / WebAuthn is a modern open authentication standard, supported by browsers and many large tech companies such as Microsoft, Google etc. The main driver is to allow a user to login without passwords, creating passwordless flows or strong MFA for user signup/login on websites. The standard is not limited to web applications with support coming to Active Directory and native apps. The technology builds on public/private keys, allowing authentication to happen without sharing a secret between the user & platform. This brings many benefits, such as easier and safer logins and makes phishing attempts extremely hard.

## WebAuthn Concepts

### Fido2 vs WebAuthn?

Fido2 is the umbrella term and branding of two new w3c standards: WebAuthn and CTAP2. WebAuthn is the JS API that allows browser to talk to the operating system to generate assertions and CTAP2 is the API that allows the operating system to talk to Authenticators (USB security keys etc)

### Relying Party (RP)

The Relying Party - often called RP - is the server that the browser communicates with. If you are a developer reading this, your server is the Relying Party and your domain is the Relying Party ID (example.com).

### Security Key
A USB-like physical device. It stores private-keys and handles cryptography. See YubiKey or search for "FIDO2 Security Key".

### User Verification

A FIDO2 server (a.k.a the Relying Party, RP) can ask the authenticator to verify the user. This can be done either via PIN code, biometrics or other factors that securely verifies that it's the expected human in front of the device, not just any human.

[WebAuthn spec - User Verification](https://www.w3.org/TR/webauthn-2/#user-verification)

### Platform vs cross-platform (roaming)? (AuthenticatorType and Authenticator Attachment)

An Authenticator is classified as a "platform authenticator" when its built-in or part of the client platform (e.g. FaceId, TouchID, Windows Hello) or classified as a roaming authenticator ("cross-platform") if it is detachable (Security keys).

[WebAuthn spec](https://www.w3.org/TR/webauthn-2/#sctn-authenticator-attachment-modality)

<!-- ### Resident Credentials (RK)

The resident credential is a credential that can be accessed simply with RP ID. When not using RK you will have to provide a list of the credentials (array of ID's) you want the authenticator to use. With RK you don’t need it because the authentication will locate all RK's (only RK credentials), and for each of them generate the assertion over the challenge and return all of them to the client. The client then will display all of the credentials to the user and user will pick one, thus returning selected credential to the relying party. -->
