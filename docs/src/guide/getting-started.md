# Getting started

We will now go into to details, what you need to know about the API and explain the terminology and concepts of the API.

## Introduction

The passwordless.dev service consists of three parts

* A small open-source client side library. The library helps you interact with the browser WebAuthn API and to connect with the public passwordless API.
* A public API, for browsers to negotiate public keys and cryptographic details with the browser
* A secret API, for your backend server to initiate key registrations, verify sign ins and retrieve keys for your users


## Terminology and concepts

This section will only describe concepts specific to the Passwordless API. See [What is Webauthn and Fido?](what-is-webauthn-and-fido) for more terminology.

When using the Passwordless API, you will encounter three type of tokens:

* **ApiKey** `example:public:6b086b1e...` This is a Public API key, safe and intended to be included client side. It allows the browser to connect to our backend and initiate key negotiations and assertions.
* **ApiSecret** `example:secret:4fd1992...` This is a Secret API key and should be well protected. It allows your backend to verify sign ins and register keys on behalf of your users.
* **Token** `wWdDh02ItIvnCKT...` This is a ephemeral token (exists only temporarily) and is passed between the client, your backend and the Passwordless API. It encodes the status of an ongoing operation, such as registering a credential or signing in. You can think of it as an session or JWT token.

# Operations


The following API operations are available:

* Register a credential
* Sign in
* List credentials
* Delete a credential

## Register a credential

This section will explain the flow of this operation. Code is available in the examples section

```
User presses 'register'-button
Client-side calls your backend to retrieve a token
Your backend calls the Passworldess api /register/token endpoint with the username/id of the user.
The Passwordless API returns a token that you give to the client-side.
client-side initiates the WebAuthn process and is allowed to store the credential with the Passwordless API using the token.
```

## Sign in

This section will explain the flow of this operation. Code is available in the examples section

```
User presses 'signin'-button
Client-side library calls the passwordless API with the username an initiates the WebAuthn process.
If the sign-in is cryptographically succesfull, a token is returned from the passwordless api to the client side.
Client-side forwards the token your backend.
Your backend calls the Passworldess api /signin/verify endpoint with the token.
The Passwordless API verifies that the signin was successfull and returns the verified user and additional information about the sign in. token that you give to the client-side.
client-side initiates the WebAuthn protocal and is allowed to store the credential with the Passwordless API using the token.
```










