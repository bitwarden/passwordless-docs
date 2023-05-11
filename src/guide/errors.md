# Errors

While errors are never fun, we've tried our best to make it easy to determine why you're receiving an error. Here's a collection of the different errors you might run into and how to solve them.

## Problem details

All errors are formatted as problem details [RFC-7807](https://www.rfc-editor.org/rfc/rfc7807), meaning our HTTP API and client-side code return errors that look like this:

```json5
{
  "type": "https://docs.passwordless.dev/errors#missing_register_token",
  "title": "The token you sent was not correct. The token used for this endpoint should start with 'register_'. Make sure you are not sending the wrong value.",
  "status": 400,
  "errorCode": "missing_register_token"
}
```

### How do I see errors on the client side?

Please take a look at our frontend examples. Passwordless.dev JavaScript functions return an object containing either a token or an error: `{ token: string, error: ProblemDetails}`.

```ts
const { token, error } = p.signinWithDiscoverable();
if(error) {
  console.error(error); // Console logs a problem details object.
}

```

## List of Error codes


### invalid_token

You receive this error when calling a endpoint that expects a token of a certain type, either `verify_` or `register_`.
The token that was submitted did not contain the expected value. This error often occurs when something goes wrong earlier in the process and the error message is sent instead of a valid token.

#### Solution

Makes sure your request contains the expected a value for the `token`.

### missing_register_token

You receive this error when you call `p.register(registerToken)` but the value of `registerToken` is empty or invalid.

The token you pass to your frontend `p.register(token)` was not valid. Perhaps your backend call to generate the register-token failed and gave you a error response and the error got feeded into the register() call?

Please also see [invalid_token](#invalid_token)

#### Solution

Make sure you have an expected value in your `registerToken`. Obtain a register token from your backend by calling the `/register/token` endpoint. It should start with `register_`.

### unknown_credential

You receive this error when you call `p.signinWith*()` but the passkey that was used is not registered in our system. This can happen if the passkey has been deleted on the server (e.g. removing it in your app UI or the Admin Console) but still exists on a users device.
#### Solution
Remove the passkey from the user device. This can be done in the browser's settings or on the operating system's credential manager.

### missing_userid

You receive this error while calling `/register/token` and fail to supply the userId property in the `json` payload.
#### Solution
When creating a `register_token` you must supply a valid userId.

Add a userId to your payload, e.g:

```json5
{
  "userId": "123",
  "username": "pjfry@passwordless.dev"
}
```

### expired_token

You may receive this error when you're trying to use a token to: 
* register a passkey
* verify a sign-in

The token you're trying to use has expired. By default, tokens are only valid for 120 seconds.

#### Solution
Make sure you use your tokens immediately once they are have been created. Tokens are meant to be short-lived. If your use case requires it, the expiration can be configured while creating the token.

### alias_conflict

You receive this error if you are trying to set or update the aliases of a user.
The alias you are trying to use is already being used by a different userId.

#### Solution
You need to use a unique alias per userId. You can remove the alias from an existing user by calling the `/alias` endpoint.

### missing_token

This endpoint expected a token, but no token was present.

Also see [invalid_token](#invalid_token)

### invalid_token_format

You receive this error when calling an endpoint with a token but the format is not properly encoded with base64url. Under normal circumstances, you should never encounter this issue or need to care about the encoding. 

Also see [invalid_token](#invalid_token)


### invalid_attestation

You receive these error if you're trying to use another attestation format than `"none"` while calling `/register/token`. 

Currently, passwordless.dev only supports attestation format `"none"`. While this is suitable for most applications, should you have a requirement that forces you to use `"direct"` or `"indirect"` attestation, please contact support our support at [support@passwordless.dev](mailto:support@passwordless.dev) to discuss the possibilities.

#### Solution

When you call `/register/token` either remove the `attestation` property or change the value to be `"none"`.