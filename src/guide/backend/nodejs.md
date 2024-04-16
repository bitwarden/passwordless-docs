# Node.js

## Installation

```bash
$ npm i @passwordlessdev/passwordless-nodejs
```

## Requirements

- ES2018 or newer, read more [here](https://node.green/).
- Supported JavaScript modules: CommonJS, ES
- Node.js 10 or newer

## Using

Specifying the `baseUrl` would be optional, and will contain `https://v4.passwordless.dev` as its default value.

To obtain your `ApiSecret`, you can find it in the admin console under `Applications > 'Your Application' > Getting Started`.

```tsx
const options: PasswordlessOptions = {
  baseUrl: 'https://v4.passwordless.dev'
};
this._passwordlessClient = new PasswordlessClient(
  'demo:secret:f831e39c29e64b77aba547478a4b3ec6',
  options
);
```

```tsx
const options: PasswordlessOptions = {};
this._passwordlessClient = new PasswordlessClient(
  'demo:secret:f831e39c29e64b77aba547478a4b3ec6',
  options
);
```

### Registration

If you had for example a 'UserController.ts' with a 'signup' arrow function. You could register a new token as shown below.

You'll first want to proceed to store the new user in your database and verifying it has succeeded, before registering the token.

```tsx
signup = async (request: express.Request, response: express.Response) => {
  const signupRequest: SignupRequest = request.body;
  const repository: UserRepository = new UserRepository();
  let id: string = null;
  try {
    // First, create the user in your database. We will use the id to register the token.
    // This way we know what user the credentials will belong to.
    id = repository.create(signupRequest.username, signupRequest.firstName, signupRequest.lastName);
  } catch {
    // do error handling, creating user failed.
  } finally {
    repository.close();
  }

  if (!id) {
    // Do not proceed to create a token, we failed to create a user.
    response.send(400);
  }

  let registerOptions = new RegisterOptions();
  registerOptions.userId = id;
  registerOptions.username = signupRequest.username;

  // We will use our deviceName as an alias. But using an alias is completely optional.
  if (signupRequest.deviceName) {
    registerOptions.aliases = new Array(1);
    registerOptions.aliases[0] = signupRequest.deviceName;
  }

  registerOptions.discoverable = true;

  // Now call Passwordless.dev to register a new token.
  const token: RegisterTokenResponse =
    await this._passwordlessClient.createRegisterToken(registerOptions);

  // Return the token to the client.
  response.send(token);
};
```

### Logging in

```tsx
signin = async (request: express.Request, response: express.Response) => {
  try {
    const token: string = request.query.token as string;

    // First check if the token is valid, and if a matching user is found.
    const verifiedUser: VerifiedUser = await this._passwordlessClient.verifyToken(token);

    // If a user is found, and the token is valid, you can proceed to log the user in.
    if (verifiedUser && verifiedUser.success === true) {
      // If you want to build a JWT token for SPA that are rendered client-side, you can do this here.
      response.send(JSON.stringify(verifiedUser));
      return;
    }
  } catch (error) {
    console.error(error.message);
  }
  response.send(401);
};
```

## References

- [Open the Node.js example on Github](https://github.com/bitwarden/passwordless-nodejs/tree/main/examples/simple-example)

- If you just want to see the Node.js demo run, we host an example at [demo-backend.passwordless.dev](https://demo-backend.passwordless.dev/)
