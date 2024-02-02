---
title: JS Client Reference
---

# JavaScript Client Reference

The Passwordless.dev JavaScript client is used by your frontend to complete FIDO2 WebAuthn cryptographic exchanges with the browser.

All methods **require** your API [public key](../concepts.md#api-keys) for authentication. Requests made to the [private API](../api.md) will instead require your API [private secret](../concepts.md#api-keys).

## Installation

To install the Passwordless.dev JavaScript client:

::: code-tabs#install

@tab yarn

```bash
yarn add @passwordlessdev/passwordless-client
```

@tab npm

```bash
npm install @passwordlessdev/passwordless-client
```

@tab es6

```html
<script
  src="https://cdn.passwordless.dev/dist/1.1.0/esm/passwordless.min.mjs"
  type="module"
  crossorigin="anonymous"
></script>
```

@tab html

```html
<script
  src="https://cdn.passwordless.dev/dist/1.1.0/umd/passwordless.umd.min.js"
  crossorigin="anonymous"
></script>
```

:::

In all cases, your frontend must import the library to call the methods used by Passwordless.dev:

::: code-tabs#install

@tab yarn

```js
import { Client } from '@passwordlessdev/passwordless-client';
```

@tab npm

```js
import { Client } from '@passwordlessdev/passwordless-client';
```

@tab es6

```html
<script type="module">
  import { Client } from 'https://cdn.passwordless.dev/dist/1.1.0/esm/passwordless.min.mjs';
</script>
```

@tab html

```html
<script>
  const Client = Passwordless.Client;
  const p = new Client({});
</script>
```

:::

## .register()

Call the `.register()` method to fetch a [registration token](../concepts.md#tokens) from your backend to authorize creation of a passkey on the end-user's device, for example:

```js
// Instantiate a passwordless client using your API public key.
const p = new Passwordless.Client({
  apiKey: 'myapplication:public:4364b1a49a404b38b843fe3697b803c8'
});

// Fetch the registration token from the backend.
const backendUrl = 'https://localhost:8002';
const registerToken = await fetch(backendUrl + '/create-token?userId' + userId).then((r) =>
  r.json()
);

// Register the token with the end-user's device.
const { token, error } = await p.register(registerToken);
```

Successful implementation will prompt Passwordless.dev to negotiate creation of a passkey through the user's web browser API and save its public key to the database for future sign-in operations.

## .signinWith()

Call the `.signin` methods to generate an [authentication token](../concepts.md#tokens) that will be checked by your backend to complete a sign-in. There are a few different `.signinWith*()` methods available:

| Method                      | Description                                                                | Example                                            |
| --------------------------- | -------------------------------------------------------------------------- | -------------------------------------------------- |
| `.signinWithAutofill()`     | Triggers the Browser native autofill UI to select identity and sign in.    | `verify_token = await p.signinWithAutofill();`     |
| `.signinWithDiscoverable()` | Triggers the Browsers native UI prompt to select identity and sign in.     | `verify_token = await p.signinWithDiscoverable();` |
| `.signinWithAlias(alias)`   | Uses a [alias](../api.md#alias) (e.g. email,username) to specify the user. | `verify_token = await p.signinWithAlias(email);`   |
| `.signinWithId(id)`         | Uses the userId to specify the user.                                       | `verify_token = await p.signinWithId(userId);`     |

```js
// Instantiate a passwordless client using your API public key.
const p = new Passwordless.Client({
  apiKey: 'myapplication:public:4364b1a49a404b38b843fe3697b803c8'
});

// Generate an authentication token for the user.

// Option 1: Enable browsers to suggest passkeys for any input that has autofill="webauthn" (only works with discoverable passkeys).
const { token, error } = await p.signinWithAutofill();

// Option 2: Enables browsers to suggest passkeys by opening a UI prompt (only works with discoverable passkeys).
const { token, error } = await p.signinWithDiscoverable();

// Option 3: Use an alias specified by the user.
const email = 'pjfry@passwordless.dev';
const { token, error } = await p.signinWithAlias(email);

// Option 4: Use a userId if already known, for example if the user is re-authenticating.
const userId = '107fb578-9559-4540-a0e2-f82ad78852f7';
const { token, error } = await p.signinWithId(userId);

if (error) {
  console.error(error);
  // { errorCode: "unknown_credential", "title": "That credential is not registered with this website", "details": "..."}
}

// Call your backend to verify the token.
const backendUrl = 'https://localhost:8002'; // Your backend
const verifiedUser = await fetch(backendUrl + '/signin?token=' + token).then((r) => r.json());
if (verifiedUser.success === true) {
  // If successful, proceed!
  // verifiedUser.userId = "107fb578-9559-4540-a0e2-f82ad78852f7";
}
```

### Response

All `.signinWith*()` methods return a object with two properties, commonly destructured as:

```js
// destructured
const { token, error } = await p.siginWithId(123);

// plain object
const signinResponse = await p.signinWithId(123);
console.log(signinResponse.token); // "verify_xxyyzz"
console.log(signinResponse.error); // undefined or a problem details object
```

If the signin was successful, the `token` has a string value `"verify_xxyyzz"`. If the sign-in failed, the `error` property contains the [problem details](../errors.md#problem-details).

## .isBrowserSupported()

Call the static `.isBrowserSupported()` method to check if the end-user's browser supports FIDO2 WebAuth passkey-based authentication, for example:

```js
if (Passwordless.isBrowserSupported()) {
}
```

## .isPlatformSupported()

Call the static async `.isPlatformSupported()` method to check if the end-users device or browser supports platform authentication such as Windows Hello, for example:

```js
if (await Passwordless.isPlatformSupported()) {
}
```

## .isAutofillSupported()

Call the static async `.isAutofillSupported()` method to check if the end-user's device or browser supports listing passkeys in an auto-fill dialog, for example:

```js
if (await Passwordless.isAutofillSupported()) {
}
```
