# Java

## Getting Started

Add to your `pom.xml` the dependency to our package:

```xml
<dependency>
    <groupId>com.bitwarden</groupId>
    <artifactId>passwordless</artifactId>
    <version>1.0.5</version>
</dependency>
```

## Example

This Java implementation is compatible with Java 8 and above. A [register](../api#register-token) function might look something like:

### Create `PasswordlessClient` instance:

```java
import com.bitwarden.passwordless.*;

import java.io.*;

public class PasswordlessJavaSdkExample implements Closeable {

    private final PasswordlessClient client;

    public PasswordlessClientExample() {
        PasswordlessOptions options = PasswordlessOptions.builder()
                .apiSecret("your_api_secret")
                .build();

        client = PasswordlessClientBuilder.create(options)
                .build();
    }

    @Override
    public void close() throws IOException {
        client.close();
    }
}
```

**Note:** You need to close the underlying http client resources when you are done
using `PasswordlessClient` with `close` method.

### Register a passkey

```java
import com.bitwarden.passwordless.*;
import com.bitwarden.passwordless.error.*;
import com.bitwarden.passwordless.model.*;

import java.io.*;
import java.util.*;

public class PasswordlessJavaSdkExample {

    private final PasswordlessClient client;

    // Constructor

    public String getRegisterToken(String alias) throws PasswordlessApiException, IOException {

        // Get existing userid from session or create a new user.
        String userId = UUID.randomUUID().toString();

        // Options to give the Api
        RegisterToken registerToken = RegisterToken.builder()
                // your user id
                .userId(userId)
                // e.g. user email, is shown in browser ui
                .username(alias)
                // Optional: Link this userid to an alias (e.g. email)
                .aliases(Arrays.asList(alias))
                .build();

        RegisteredToken response = client.registerToken(registerToken);

        // return this token
        return response.getToken();
    }
}
```

### Verify user

```java
import com.bitwarden.passwordless.*;
import com.bitwarden.passwordless.error.*;
import com.bitwarden.passwordless.model.*;

import java.io.*;

public class PasswordlessJavaSdkExample {

    private final PasswordlessClient client;

    // Constructor

    public VerifiedUser verifySignInToken(String token) throws PasswordlessApiException, IOException {

        VerifySignIn signInVerify = VerifySignIn.builder()
                .token(token)
                .build();

        // Sign the user in, set a cookie, etc,
        return client.signIn(signInVerify);
    }
}
```

### Customization

Customize `PasswordlessOptions` by providing `apiSecret` with your Application's Private API Key.
You can also change the `apiUrl` if you prefer to self-host.

Customize `PasswordlessClientBuilder` by providing `httpClient` [CloseableHttpClient][apache-http-client] instance
and `objectMapper` [ObjectMapper][fasterxml-jackson-databind].

### Examples

See [Passwordless Java Example](https://github.com/passwordless/passwordless-java-example) for Spring Boot 3 application
using this library.

[apache-http-client]: https://hc.apache.org/httpcomponents-client-5.2.x/index.html
[fasterxml-jackson-databind]: https://github.com/FasterXML/jackson-databind
