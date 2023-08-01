# Backend Language Examples

You can use Passwordless.dev with any programming language by implementing calls to the Passwordless.dev API, but this document will provide some code examples, guidelines, and other help integrating Passwordless.dev with popular languages.

## ASP.NET Core

This ASP.NET Core implementation uses .NET 7 and some JavaScript for a simple passwordless.dev implementation. A [register](api/#register-token) function might look something like:


```csharp
[HttpGet("/create-token")]
public async Task<IActionResult> GetRegisterToken(string alias)
{
    var userId = Guid.NewGuid().ToString();
    var payload = new
    {
        userId,
        username = alias,
        Aliases = new[] { alias }
    };

    var request = await _httpClient.PostAsJsonAsync("register/token", payload);

    if (request.IsSuccessStatusCode)
    {
        var token = await request.Content.ReadFromJsonAsync<TokenResponse>();
        return Ok(token);
    }

    // Handle or log any API error, { errorCode: "unknown_credentials", "title": "This is what is wrong", "details": "..."}
    var error = await request.Content.ReadFromJsonAsync<ProblemDetails>();    
    return new JsonResult(error)
    {
        StatusCode = (int)request.StatusCode
    };
}
```


[Open the ASP.NET example on Github](https://github.com/passwordless/passwordless-dotnet-example).

## Node.js

This Node.js implementation is done in only a few lines of code. A [register](api/#register-token) function might look something like:

```js
app.get("/create-token", async (req, res) => {

  const alias = req.query.alias;
  
  // Generate a new userid or grab the userid from session, cookie etc
  const payload = {
    userId: getRandomInt(),
    username: alias,
    aliases: [alias] // We can also set aliases for the userid, so that signin can be initiated without knowing the userid
  };

  // Send the username to the passwordless api to get a token
  var response = await fetch("https://v4.passwordless.dev/register/token", {
    method: "POST",
    body: JSON.stringify(payload),
    headers: { ApiSecret: API_SECRET, 'Content-Type': 'application/json'}
  });

  var responseData = await response.json();
  console.log("passwordless api response", response.status, response.statusText, responseData);
    
  if(response.status == 200) {
    console.log("received token: ", responseData.token);
  } else {
    // Handle or log any API error, { errorCode: "unknown_credentials", "title": "This is what is wrong", "details": "..."}
  }

  res.status(response.status);
  res.send(responseData);
});
```

[Open the Node.js example on Github](https://github.com/passwordless/passwordless-nodejs-example)

If you just want to see the Node.js demo run, we host an example at [demo-backend.passwordless.dev](https://demo-backend.passwordless.dev/)

## PHP
This PHP implementation is compatible with PHP 5.6 and above. However, it is important to note that the curl library may not be available in older versions of PHP. Therefore, you may need to update your PHP installation if you are using an older version. A [register](https://docs.passwordless.dev/guide/api/#register-token) function might look something like:
```php
<?php

$API_SECRET = "YOUR_API_SECRET";

function get_random_int() {
  return intval(1e9 * mt_rand());
}

function create_token($alias) {
  $payload = array(
    "userId" => get_random_int(),
    "username" => $alias,
    "aliases" => array($alias)
  );

  $ch = curl_init();
  curl_setopt($ch, CURLOPT_URL, "https://v4.passwordless.dev/register/token");
  curl_setopt($ch, CURLOPT_POST, 1);
  curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($payload));
  curl_setopt($ch, CURLOPT_HTTPHEADER, array("ApiSecret: $API_SECRET", "Content-Type: application/json"));
  curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);

  $response = curl_exec($ch);
  curl_close($ch);

  $response_data = json_decode($response, true);
  print("passwordless api response", $response_code, $response_text, $response_data);

  if ($response_code == 200) {
    print("received token: ", $response_data["token"]);
  } else {
    # Handle or log any API error
    pass;
  }

  return $response_data;
}

if ($argc == 2) {
  $alias = $argv[1];
  $response_data = create_token($alias);
} else {
  print("Usage: create_token.php <alias>");
}

?>
```



## Python 3.8+
This Python 3.8+ implementation is done in only a few lines of code. A [register](https://docs.passwordless.dev/guide/api/#register-token) function might look something like:
```python
import requests
import json
import random

API_SECRET = "YOUR_API_SECRET"

def get_random_int():
  return int(1e9 * random.random())

def create_token(alias):
  payload = {
    "userId": get_random_int(),
    "username": alias,
    "aliases": [alias]
  }

  response = requests.post("https://v4.passwordless.dev/register/token", json=payload, headers={"ApiSecret": API_SECRET, "Content-Type": "application/json"})

  response_data = response.json()
  print("passwordless api response", response.status_code, response.text, response_data)

  if response.status_code == 200:
    print("received token: ", response_data["token"])
  else:
    # Handle or log any API error
    pass

  return response_data

if __name__ == "__main__":
  response_data = create_token("alias")
```
[Open the example Python 3.8+ application using Flask on GitHub
](https://github.com/passwordless/sdk-collection/tree/main/Python%203.8-Flask)
## Python 2.7+
This Python 2.7+ implementation is done in only a few lines of code. A [register](https://docs.passwordless.dev/guide/api/#register-token) function might look something like:

```python
import requests
import simplejson as json
import random

API_SECRET = "YOUR_API_SECRET"

def get_random_int():
  return int(1e9 * random.random())

def create_token(alias):
  payload = {
    "userId": get_random_int(),
    "username": alias,
    "aliases": [alias]
  }

  response = requests.post("https://v4.passwordless.dev/register/token", data=json.dumps(payload), headers={"ApiSecret": API_SECRET, "Content-Type": "application/json"})

  response_data = json.loads(response.content)
  print("passwordless api response", response.status_code, response.text, response_data)

  if response.status_code == 200:
    print("received token: ", response_data["token"])
  else:
    # Handle or log any API error
    pass

  return response_data

if __name__ == "__main__":
  response_data = create_token("alias")
```
## Java 1.8+
This Java implementation is compatible with Java 1.8+ and above. A [register](https://docs.passwordless.dev/guide/api/#register-token) function might look something like:
```java
import java.io.IOException;
import java.io.InputStream;
import java.io.PrintWriter;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.Scanner;

public class CreateToken {

    private static final String API_SECRET = "YOUR_API_SECRET";

    public static void main(String[] args) throws IOException {
        String alias = args[0];

        URL url = new URL("https://v4.passwordless.dev/register/token");
        HttpURLConnection connection = (HttpURLConnection) url.openConnection();
        connection.setRequestMethod("POST");
        connection.setRequestProperty("ApiSecret", API_SECRET);
        connection.setRequestProperty("Content-Type", "application/json");

        String payload = "{" +
                "  \"userId\": " + getRandomInt() + "," +
                "  \"username\": \"" + alias + "\", " +
                "  \"aliases\": [\"" + alias + "\"]" +
                "}";

        connection.setDoOutput(true);
        try (PrintWriter writer = new PrintWriter(connection.getOutputStream())) {
            writer.print(payload);
        }

        int responseCode = connection.getResponseCode();
        String responseMessage = connection.getResponseMessage();
        InputStream responseInputStream = connection.getInputStream();

        Scanner scanner = new Scanner(responseInputStream);
        String responseData = scanner.nextLine();

        System.out.println("passwordless api response: " + responseCode + " " + responseMessage + " " + responseData);

        if (responseCode == 200) {
            System.out.println("received token: " + responseData);
        } else {
            // Handle or log any API error
        }
    }

    private static int getRandomInt() {
        return (int) (1e9 * Math.random());
    }
}
```
