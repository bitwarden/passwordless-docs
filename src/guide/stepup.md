# Step-up Authentication

## Introduction

Step-up authentication is a method of requiring a user to authenticate with a higher level of assurance than they have already done. This is often used in the context of a user trying to access a more restricted resource or perform a more sensitive operation.

A good well-known example of this process is the [GitHub's Sudo Mode](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/sudo-mode). There, even if the user has already successfully logged in, GitHub may ask for the user's password again before allowing them to perform certain destructive actions, such as deleting a repository.

This guide will explain how to implement step-up authentication using Passwordless.dev.

## Implementation

You can implement step-up authentication using the basic building blocks that the Passwordless Client SDK already provides. Specifically, to trigger a step-up sequence, simply call the [`signinWithId`](frontend/javascript.md#signinwith) method to perform the authentication flow for a specific (current) user.

```js
const p = new Passwordless.Client({
  apiKey: 'myapplication:public:4364b1a49a404b38b843fe3697b803c8'
});

// ...

// Scenario: user about to perform a sensitive operation.
// Trigger a step-up authentication sequence by requiring the user to re-authenticate.
const userId = 'user123'; // retrieve the user's ID from your application's context
const { token, error } = await p.signinWithId(userId);

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

On the backend, make sure to use the Passwordless SDK for your platform to verify the token to determine whether to allow the user to proceed with what they are trying to do.

```js
app.post('/sensitive-operation', async (req, res) => {
  const token = req.headers['x-passwordless-token'];
  const verification = await passwordless.verify(token);

  if (!verification || !verification.success) {
    res.status(401).json({ error: 'Step-up authentication failed' });
    return;
  }

  // Proceed with the sensitive operation
  // ...
});
```

Note that if the user fails to authenticate via the step-up sequence, they can still continue to use the application as usual. Calling the `signinWith...` methods does not inherently invalidate the user's existing session or token.