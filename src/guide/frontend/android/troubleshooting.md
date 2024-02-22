---
title: Troubleshooting - Android Client SDK
---

# Troubleshooting

[[toc]]

## Working on physical devices, but not in the emulator

The error indicates that an error was returned from the framework.

```
2024-02-22 11:07:55.231  6884-6908  CredManProvService      dev.passwordless.sampleapp           I  CreateCredentialResponse error returned from framework
2024-02-22 11:07:55.238  6884-6979  bwp-register-begin      dev.passwordless.sampleapp           E  Cannot call registerRequest
    androidx.credentials.exceptions.publickeycredential.CreatePublicKeyCredentialDomException
        at androidx.credentials.exceptions.publickeycredential.DomExceptionUtils$Companion.generateException(DomExceptionUtils.kt:144)
        at androidx.credentials.exceptions.publickeycredential.DomExceptionUtils$Companion.access$generateException(DomExceptionUtils.kt:57)
        at androidx.credentials.exceptions.publickeycredential.CreatePublicKeyCredentialDomException$Companion.createFrom(CreatePublicKeyCredentialDomException.kt:127)
        at androidx.credentials.exceptions.publickeycredential.CreatePublicKeyCredentialException$Companion.createFrom(CreatePublicKeyCredentialException.kt:51)
        at androidx.credentials.CredentialProviderFrameworkImpl.convertToJetpackCreateException$credentials_release(CredentialProviderFrameworkImpl.kt:315)
        at androidx.credentials.CredentialProviderFrameworkImpl$onCreateCredential$outcome$1.onError(CredentialProviderFrameworkImpl.kt:201)
        at androidx.credentials.CredentialProviderFrameworkImpl$onCreateCredential$outcome$1.onError(CredentialProviderFrameworkImpl.kt:187)
        at android.credentials.CredentialManager$CreateCredentialTransport.lambda$onError$2(CredentialManager.java:752)
        at android.credentials.CredentialManager$CreateCredentialTransport.$r8$lambda$8NwBIrbcK6SvF9Mra_qL_8hhFMU(Unknown Source:0)
        at android.credentials.CredentialManager$CreateCredentialTransport$$ExternalSyntheticLambda0.run(Unknown Source:6)
        at androidx.credentials.CredentialManager$$ExternalSyntheticLambda0.execute(Unknown Source:0)
        at android.credentials.CredentialManager$CreateCredentialTransport.onError(CredentialManager.java:751)
        at android.credentials.ICreateCredentialCallback$Stub.onTransact(ICreateCredentialCallback.java:123)
        at android.os.Binder.execTransactInternal(Binder.java:1344)
        at android.os.Binder.execTransact(Binder.java:1275)
```

Solutions:

- Verify Google Play Services is up-to-date & update Google Play Services if necessary.
