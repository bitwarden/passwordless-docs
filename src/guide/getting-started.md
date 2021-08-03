# 🚀 Getting started

We will now go into to details, what you need to know about the API and explain the terminology and concepts of the API.

## Introduction

The passwordless.dev service consists of three parts:

* A small open-source client side library. The library helps you interact with the browser WebAuthn API and to connect with the public passwordless API.
* A public API, for browsers to negotiate public keys and cryptographic details with the browser
* A secret API, for your backend server to initiate key registrations, verify sign ins and retrieve keys for your users


## Terminology and concepts

This section will only describe concepts specific to the Passwordless API. See [What is Webauthn and Fido?](what-is-webauthn-and-fido) for more terminology.

When using the Passwordless API, you will encounter three type of tokens:

* **ApiKey** `example:public:6b086b1e...` This is a Public API key, safe and intended to be included client side. It allows the browser to connect to our backend and initiate key negotiations and assertions.
* **ApiSecret** `example:secret:4fd1992...` This is a Secret API key and should be well protected. It allows your backend to verify sign ins and register keys on behalf of your users. ([Create an account](https://beta.passwordless.dev/create-account) to get your API keys.)
* **Token** `wWdDh02ItIvnCKT...` This is a ephemeral token (exists only temporarily) and is passed between the client, your backend and the Passwordless API. It encodes the status of an ongoing operation, such as registering a credential or signing in. You can think of it as an session or JWT token.

It's also good to understand how WebAuthn and the Passwordless API treats UserIDs, Emails, usernames, etc.

* **UserId** is a string which will be used as the [WebAuthn Userhandle](https://www.w3.org/TR/webauthn-2/#dom-publickeycredentialuserentity-id). It must **NOT contain PII**. (This should be a database ID or GUID).
* **Alias** is a "human friendly" reference (e.g username/email) to a UserId to allow a sign in to be initiated with user input. you can attach multiple aliases to a userid via the alias-endpoint. Aliases are hashed with PBKDF2 before storage to ensure privacy.
