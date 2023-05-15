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

Coming Soon.

## Python

Coming Soon.
