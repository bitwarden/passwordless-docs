# Step-up Authentication

## Introduction

Step-up authentication is a method of requiring a user to authenticate with a higher level of assurance than they have already done. This is often used in the context of a user trying to access a more restricted resource or perform a more sensitive operation.

A good well-known example of this process is the [GitHub's Sudo Mode](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/sudo-mode). There, even if the user has already successfully logged in, GitHub may ask for the user's password again before allowing them to perform certain destructive actions, such as deleting a repository.

This guide will explain how to implement step-up authentication using Passwordless.dev.

## Implementation

You can implement step-up authentication by using the `stepup` method provided by the Passwordless Client SDK. This method functions very similarly to the `signinWithId` method (which is used to start a signin process for a specific user), but with a few additional features.

```js
const p = new Passwordless.Client({
  apiKey: 'myapplication:public:4364b1a49a404b38b843fe3697b803c8'
});

// ...

// Scenario: user about to perform a sensitive operation.
// Trigger a step-up authentication sequence by requiring the current user to re-authenticate.
// Uses the ID of the last user that was successfully authenticated with `p.signInWith*()`.
const { token, error } = await p.stepup({
  // Sets the time-to-live (TTL) for the token in seconds.
  // While the token is valid, calling `p.stepup()` again will return the same token
  // without requiring the user to re-authenticate.
  ttl: 3600,
  // Free-form string to help you identify the context of the sensitive operation on the backend.
  context: 'sensitive-operation'
});

// ...

// Attach the token to the request to your backend
// while performing the sensitive operation.
await fetch(backendUrl + '/sensitive-operation', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    // It's up to you to decide how to pass the token to your backend
    'x-passwordless-token': token
  },
  body: JSON.stringify({
    /* ... */
  })
});
```

Note that to avoid the user having to re-enter their credentials every time they perform a sensitive operation, you may consider caching the produced step-up token on the client side. This way, you can reuse the token for a certain period of time before requiring the user to re-authenticate.

On the backend, make sure to use the Passwordless SDK for your platform to verify the token to determine whether to allow the user to proceed with what they are trying to do.

```js
app.post('/sensitive-operation', async (req, res) => {
  const token = req.headers['x-passwordless-token'];
  const verification = await passwordless.verify(token, {
    // Pass the same context string you used when calling `p.stepup()`.
    // This is used to ensure that the token is only valid for the intended action.
    context: 'sensitive-operation'
  });

  if (!verification || !verification.success) {
    res.status(401).json({ error: 'Step-up authentication failed' });
    return;
  }

  // Proceed with the sensitive operation
  // ...
});
```
