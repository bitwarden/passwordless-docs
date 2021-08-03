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

* **UserId** is a string which will be used as the [WebAuthn Userhandle](https://www.w3.org/TR/webauthn-2/#dom-publickeycredentialuserentity-id). It must **NOT contain PII** such as an email or similiar (This should be a database ID or GUID).
* **Alias** is a "human friendly" reference to a UserId. In order to allow a sign in to be initiated with a "username" of some sort (email, username, phonenumer etc), it is possible (but not required) to attach one or multiple aliases to a specific UserId. This is done with the Alias API endpoint. The Alias is hashed with PBKDF2 before storage and is only an alternative way to initiate a signin (e.g. when the UserId might not be known to the front end code initiating the sign in)

## ✨ Quick start with copy-paste <Badge text="frontend only" type="tip"/>

If you just want to **try signing in using your face/fingerprint**, you can copy-paste the demo code to your application.

[Get the code](guide/demo-and-examples.html#copy-paste-demo-client-side-only)

## ✅ Getting started for real

To really use Passwordless you need to add our library to your frontend and add a small backend integration. 
Integrating Passwordless into your app or website can begin as soon as you create a Passwordless account, and requires three steps:


1. [Obtain your API keys](https://beta.passwordless.dev/create-account) so Passwordless can authenticate your integration’s API requests.
2. [Install the client library](https://github.com/passwordless/passwordless-client-js#get-coding) so your integration can interact with the Passwordless API and the browser
3. Register a credential to confirm everything is up and running


## Register a credential

This section will explain the flow of this operation. Code is available in the examples section

1. Your backend calls the Passworldess api `/register/token` endpoint with the username/id of the user.
2. Client-side initiates the WebAuthn process and is allowed to store the credential with the Passwordless API using the token.

![Passwordless register flow](https://cdn.passwordless.dev/assets/passwordless.register.png)

#### 1. Retrieve a token <Badge text="backend" type="warning"/>

To register a credential for a user, your backend calls the passwordless api:

```http
POST https://apiv2.passwordless.dev/register/token
ApiSecret: demo:secret:yyy
Content-Type: application/json

{ "UserId": "123", username: "anders@user.com", "displayName": "Anders" } 
```
Response:
```json
"wWdDh02ItIvnCKT_02ItIvn..."
```

And to allow a user to sign in using an alias (email etc), make sure to also set the alias:

```
POST https://apiv2.passwordless.dev/alias
ApiSecret: demo:secret:yyy
Content-Type: application/json

{ "UserId": "123", aliases: ["anders@user.com"]} 
```
Response: 200 OK.

#### 2. Initiate the registration <Badge text="frontend" type="tip"/>

[Get the client-side library](https://github.com/passwordless/passwordless-client-js) from a cdn or npm.
Your client-side code can start the registration progress. The keys will automatically be stored in the passwordless api

```js
var p = new Passwordless.Client({
    apiKey: "demo:public:6b08891222194fd1992465f8668f"
});

// wWdDh02ItIvnCKT_02ItIvn...
var myToken = await fetch("/example-backend/passwordless/token").then(r => r.text());

try {
    await p.register(myToken);
    // success!
} catch (e) {
    // error    
}
```


## Sign in

This section will explain the flow of this operation. Code is available in the examples section

1. Client-side library calls the passwordless API with the UserId or Alias and initiates the WebAuthn process.
    * If the sign-in is cryptographically successful, a token is returned from the passwordless api to the client side.
    * Client-side forwards the token your backend.
2. Your backend calls the Passworldess api `/signin/verify` endpoint with the token.
    * The Passwordless API verifies that the signin was successful and returns the verified user and additional information about the sign in. 

![Passwordless sign in flow](https://cdn.passwordless.dev/assets/passwordless.signin.png?v1)

#### 1. Start the passwordless sign in <Badge text="frontend" type="tip"/>

[Get the client-side library](https://github.com/passwordless/passwordless-client-js) from a cdn or npm.
Pass a alias or id to the sign in method to begin the WebAuthn process.

```js
var p = new Passwordless.Client({
    apiKey: "demo:public:6b08891222194fd1992465f8668f"
});

var alias = "anders@user.com"; // get username from input

// yUf6_wWdDh02ItIvnCKT_02ItIvn...
var token = await p.signinWithAlias(alias);
// var token = await p.signinWithId("123"); // if you did not set an alias, you can signin with the UserId.

// verify the token
var verifiedUser = await fetch("/example-backend/passwordless/signin?token=" + token).then(r => r.json());
if(verifiedUser.success === true) {
    //success!
}
```

#### 2. Verify the token <Badge text="backend" type="warning"/>

Once the client-side code has finished the WebAuthn process you need to verify the token with the backend api.
Only then can you trust that the WebAuthn process succeeded and identify what user has signed in.

```http
POST https://apiv2.passwordless.dev/signin/verify
ApiSecret: demo:secret:yyy
Content-Type: application/json

{ "token": "yUf6_wWdDh02ItIvnCKT_02ItIvn..." }
```
Response:
```json
{
   "success":true,
   "userId":"123",
   "timestamp":"2020-08-21T16:42:48.5061807Z",
   "rpid":"example.com",
   "origin":"https://example.com"
}
```

## And you're done!

That's all that is required to get started with Passwordless.
There will be more to explore however, see our other API endpoints.