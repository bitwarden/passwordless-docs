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

### missing_register_token

|Reason|Solution|
|----|----|
|You receive this error when you call `p.register(registerToken)` but the value of `registerToken` is empty or invalid.|Make sure you have an expected value in your `registerToken`. Obtain a register token from your backend by calling the `/register/token` endpoint. It should start with `register_`.|





### unknown_credential

|Reason|Solution|
|----|----|
|You receive this error when you call `p.signinWith*()` but the passkey that was used is not registered in our system.</br>This can happen if the passkey has been deleted on the server (e.g. removing it in your app UI or the Admin Console) but still exists on a users device.|Remove the passkey from the user device. This can be done in the browser's settings or on the operating system's credential manager.|

### missing_userid


|Reason|Solution|
|----|----|
|You receive this error while calling `/register/token` and fail to supply the userId property in the `json` payload.|When creating a register_token you must supply a valid userId.|

**Solution example**

Add a userId to your payload, e.g:

```json5
{
  "userId": "123",
  "Username": "pjfry@passwordless.dev"
}
```

### expired_token

You may receive this error when you're trying to use a token to: 
* register a passkey
* verify a sign-in

|Reason|Solution|
|----|----|
|The token you're trying to use has expired. By default, tokens are only valid for 120 seconds.|Make sure you use your tokens immediately when they are being created. Tokens are meant to be short-lived. If your use case requires it, the expiration can be configured when creating the token.|


### alias_conflict

You receive this error if you're trying to set or update the aliases of a user.

|Reason|Solution|
|----|----|
|The alias you are trying to use is already being used by a different userId.|You need to use a unique alias per userId. You can remove the alias from an existing user by calling the `/alias` endpoint.|
