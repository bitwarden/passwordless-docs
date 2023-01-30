# Passwordless JS client

This section covers the methods exposed by the JS client.

For more all-round documentation, please see the [Getting started](getting-started) part of the documentation.

## Install

You can use NPM or YARN or include a link from our cdn.

Please see the [installation instructions](https://github.com/passwordless/passwordless-client-js#get-coding) on the github readme.

Using yarn: 
```bash
yarn add @passwordlessdev/passwordless-client
```

Using normal HTML script tag
```html
<script src="https://cdn.passwordless.dev/dist/0.4.0/passwordless.iife.js" crossorigin="anonymous"></script>
```


## Methods


### Register

```html
<script src="https://cdn.passwordless.dev/dist/0.4.0/passwordless.iife.js" crossorigin="anonymous"></script>
```

```js

const p = new Passwordless.Client({ apiKey: "demo:public:6b08891222194fd1992465f8668f" });
const myToken = "..."; // todo: Fetch from your own backend
try {
    await p.register(myToken);
    // success!
} catch (e) {
    // error    
}
```


### Sign in

```html
<script src="https://cdn.passwordless.dev/dist/0.4.0/passwordless.iife.js" crossorigin="anonymous"></script>
```

```js

const p = new Passwordless.Client({ apiKey: "demo:public:6b08891222194fd1992465f8668f" });
try {
    let verify_token = null;
    // alternative 1:
    // use autofill to sign in. This enables browsers to suggest passkeys for any input that has autofill="webauthn",
    // e.g. <input type="text" placeholder="Your email" autofill="username email webauthn" />
    verify_token = await p.signinWithAutofill();

    // alternative 2:
    // Not specyfing an alias will allow the user to select any available credentials on the device or insert a security key
    verify_token = await p.signinWithAlias(null);

    // alternative 3:
    // Use an alias as inputed by the user to authenticate the user
    const email = ""; // get email from input field
    verify_token = await p.signinWithAlias(email);

    // alternative 4:
    // If you know the userid beforehand (e.g. they are already logged in but you want to re-auth them)
    // You can use signInWithId to do a re-auth
    const userId = ""; // fetch userid from database or localstorage
    verify_token = await p.signInWithId(userId);
    // success!

    // todo: call your backend to verify the verify_token
} catch (e) {
    // error    
}
```

## Helper methods

### static isBrowserSupported()

Call the static method  `isBrowserSupported()` to check if the browser supports WebAuthn (and passkey) based authentication.
```html
<script src="https://cdn.passwordless.dev/dist/0.4.0/passwordless.iife.js" crossorigin="anonymous"></script>
```

```js

if (Passwordless.isBrowserSupported() === true) {
    // browser supports webauthn
}
```

### static async isPlatformSupported()

Call the static async method  `isPlatformSupported()` to check if platform authentication is possible.
```html
<script src="https://cdn.passwordless.dev/dist/0.4.0/passwordless.iife.js" crossorigin="anonymous"></script>
```
```js
if (await Passwordless.isPlatformSupported() === true) {
    // platform authentication is supported
}
```

### static async isAutofillSupported()

Call the static async method  `isAutofillSupported()` to check if platform authentication is possible.



```html
<script src="https://cdn.passwordless.dev/dist/0.4.0/passwordless.iife.js" crossorigin="anonymous"></script>
```

```js

if (await Passwordless.isAutofillSupported() === true) {
    // autofill is supported   
}
```
