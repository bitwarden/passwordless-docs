# Errors

While errors are never fun, we've tried our best to make it easy to determine why you're receiving an error. Here's a collection of the different errors you might run into and how to solve them.

## Problem details

All errors are formatted as problem details [RFC-7807](https://www.rfc-editor.org/rfc/rfc7807), meaning our HTTP API and client-side code return errors that look like this:

```json5
{
  type: 'https://docs.passwordless.dev/errors#missing_register_token',
  title: "The token you sent was not correct. The token used for this endpoint should start with 'register_'. Make sure you are not sending the wrong value.",
  status: 400,
  errorCode: 'missing_register_token'
}
```

### How do I see errors on the client side?

Please take a look at our frontend examples. Passwordless.dev JavaScript functions return an object containing either a token or an error: `{ token: string, error: ProblemDetails}`.

```ts
const { token, error } = p.signinWithDiscoverable();
if (error) {
  console.error(error); // Console logs a problem details object.
}
```

## List of error codes

### api_key_locked

You'll receive this error when you call an endpoint with an API key that has been locked.

This could happen due to several reasons:

- Either you've locked the API keys yourself.
- Your application was marked for deletion, which causes the API keys to be locked automatically.

If this was unintentional, you can unlock the API key in the [admin console](admin-console/applications.md#api-key-management).

### invalid_token

The token that was submitted did not contain the expected value. This error often occurs when something goes wrong earlier in the process and the error message is sent instead of a valid token.

You'll receive this error when calling a endpoint that expects a token of a certain type, either `verify_` or `register_`.

#### Solution

Makes sure your request contains the expected a value for the token.

### missing_register_token

You'll receive this error when you call `p.register(registerToken)`, but the value of `registerToken` is empty or invalid.

The token you pass to your frontend `p.register(token)` was not valid. Your backend call to generate the register token may have failed, and subsequently fed an error response `.register()` call rather than a token.

Also see [invalid_token](#invalid-token).

#### Solution

Make sure you have an expected value in your `registerToken`. Obtain a register token from your backend by calling the `/register/token` endpoint. It should begin with `register_`.

### unknown_credential

You'll receive this error when you call `p.signinWith*()` but the passkey that was used is not registered in our system. This can happen if the passkey has been deleted on the server (e.g. removing it in your app UI or the admin console) but still exists on a users device.

#### Solution

Remove the passkey from the user device. This can be done in the browser's settings or on the operating system's credential manager.

### forbidden

You'll receive this error when you call an endpoint with an API key that does not have permission to access the endpoint. Please check the [API key permissions](admin-console/applications.md#api-key-management) in the admin console.

### missing_userid

You'll receive this error when you call the `/register/token` endpoint but fail to supply a userId in the `json` payload.

#### Solution

When creating a `register_token` you must supply a valid userId. Add a userId to your payload, for example:

```json5
{
  userId: '123',
  username: 'pjfry@passwordless.dev'
}
```

### expired_token

The token you're trying to use has expired. By default, tokens are only valid for 120 seconds. You may receive this error when you're trying to use a token to:

- Register a passkey
- Verify a sign-in

#### Solution

Make sure you use your tokens immediately once they are created. Tokens are meant to be short-lived. If your use-case requires it, a non-default expiration can be configured while creating the token.

### alias_conflict

The alias you are trying to use is already being used by a different userId.

#### Solution

You need to use a unique alias per userId. You can remove the alias from an existing user by calling the `/alias` endpoint. [Learn more](https://docs.passwordless.dev/guide/api.md#alias).

### missing_token

This endpoint expected a token, but no token was present.

Also see [invalid_token](#invalid-token).

### invalid_token_format

You'll receive this error when calling an endpoint with a token but the format is not properly encoded with base64url. Under normal circumstances, you should never encounter this issue or need to care about the encoding.

Also see [invalid_token](#invalid-token).

### invalid_attestation

You'll receive these error if you're trying to use an attestation format other than `"none"`, `"direct"`, `"indirect"` while calling `/register/token`.

Currently, Passwordless.dev only supports attestation format `"none"`, `"direct"`, `"indirect"`. While this is suitable for most applications, please contact support our support at [support@passwordless.dev](mailto:support@passwordless.dev) to discuss possibilities should you have a requirement that forces you to use `"enterprise"` attestation.

### attestation_not_supported_on_plan

You'll receive this error when you're trying to use an attestation format other than `"none"` while calling `/register/token`, but your plan does not support it. Learn more [here](https://bitwarden.com/products/passwordless/#pricing)

### magic_link_email_admin_address_only

You'll receive this error when trying to request a magic link email on an application that's been created very recently. As a measure to avoid spam, you'll only be able to request emails to your own (i.e. application admin) email address.

### magic_link_email_quota_exceeded

You'll receive this error when trying to request a magic link email, after your monthly email quota has already been reached. Dispatched emails are counted on a sliding window basis, so you may only need to wait a day or two before you can send emails again. 

#### Solution

When you call the `/register/token` endpoint, either remove the `attestation` property or change the value to be `"none"`.

### max_users_exceeded

You'll receive this error when you try to create a new user, but have reached the maximum number of users for your plan.

An existing user will still be able to add additional credentials.

You can learn more [here](https://bitwarden.com/products/passwordless/).
