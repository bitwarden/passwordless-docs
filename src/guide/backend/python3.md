# Python 3+

## Getting Started 

Install with `python -m pip install passwordless`.

### Example

This Python 3 implementation is compatible with Python 3.8+ and above. A [register](../api#register-token) function might look something like:

### Create `PasswordlessClient` instance:

```python
from passwordless import (
    PasswordlessClient,
    PasswordlessClientBuilder,
    PasswordlessOptions
)


class PasswordlessPythonSdkExample:
    client: PasswordlessClient

    def __init__(self):
        options = PasswordlessOptions("your_api_secret")

        self.client = PasswordlessClientBuilder(options).build()

```

### Register a passkey

```python
import uuid
from passwordless import (
    PasswordlessClient,
    RegisterToken,
    RegisteredToken
)


class PasswordlessPythonSdkExample:
    client: PasswordlessClient

    def get_register_token(self, alias: str) -> str:
        # Get existing userid from session or create a new user.
        user_id = str(uuid.uuid4())

        # Options to give the Api
        register_token = RegisterToken(
            user_id=user_id,  # your user id
            username=alias,  # e.g. user email, is shown in browser ui
            aliases=[alias]  # Optional: Link this userid to an alias (e.g. email)
        )

        response: RegisteredToken = self.client.register_token(register_token)

        # return this token
        return response.token
```

### Verify user

```python
from passwordless import (
    PasswordlessClient,
    VerifySignIn,
    VerifiedUser
)


class PasswordlessPythonSdkExample:
    client: PasswordlessClient

    def verify_sign_in_token(self, token: str) -> VerifiedUser:
        verify_sign_in = VerifySignIn(token)

        # Sign the user in, set a cookie, etc,
        return self.client.sign_in(verify_sign_in)
```

### Customization

Customize `PasswordlessOptions` by providing `api_secret` with your Application's Api Secret.
You can also change the `api_url` if you prefer to self-host.

Customize `PasswordlessClientBuilder` by providing `session` [requests Session](https://requests.readthedocs.io/en/latest/) instance.

### Examples

See [Passwordless Python Example](https://github.com/passwordless/passwordless-python/tree/main/examples/flask) for Flash Web application.
