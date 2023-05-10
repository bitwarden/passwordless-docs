# Backend Language Examples

You can use Passwordless.dev with any programming language by implementing calls to the Passwordless.dev API, but this document will provide some code examples, guidelines, and other help integrating Passwordless.dev with popular languages.

## ASP.NET Core <Badge text="example" type="warning"/>

This ASP.NET Core implementation uses .NET5 and some JavaScript for a simple passwordless.dev implementation. A [register](api/#register-token) function might look something like:

```csharp
// Call the API to receive the register token. The following values are required.
public async Task<ActionResult<string>> GetRegisterToken(string alias) {
    string userId = Guid.NewGuid().ToString(); 

    var json = JsonSerializer.Serialize(new
    {
        userId = userId, // Required.
        username = alias, // Required.
        DisplayName = "Mr Guest" 
    });

    var request = await _httpClient.PostAsync("register/token", new StringContent(json, Encoding.UTF8, "application/json"));
    
    var json = await request.Content.ReadAsStringAsync();
    if (res.IsSuccessStatusCode) {   
        return json; // { "token": "register_xxyyzz..."}    
    } else {
        // Log the error
        throw new Exception(json);
        // { errorCode: "unknown_credentials", "title": "This is what is wrong", "details": "..."}
    }
}
```


[See more sample code](https://github.com/passwordless/passwordless-dotnet-example).

## Node.js <Badge text="example" type="warning"/> <Badge text="demo" type="tip"/>

This Node.js implementation is done in only a few lines of code. A [register](api/#register-token) function might look something like:

```js
const apiKey = "demobackend:public:c203e65b581443778ea4823b3ef0d6af"; 
const backendUrl = "https://localhost:8002"; // Your backend.
// Instantiate a passwordless client using your API public key.
async function registerPasskey(alias) {
    const p = new Passwordless.Client({ apiKey }); // Fetch the returned registration token from the backend.
    const registerToken = await fetch(backendUrl + "/create-token?alias=" + alias).then((r) => r.json()); 
    const { token, error} = await p.register(registerToken); //Register the token with the end-user's device.
    if(token) {
        console.log("Succesfully registered as passkey!"); // Successfully registered.
    } else {
        console.error(error);
    }
}
```

[See more sample code](https://github.com/passwordless/passwordless-nodejs-example).

Alternatively, check out our demo application, which you can use by adding your [API key](concepts)'s secret to `index.html` and `app.js`. [See our demo](https://demo-backend.passwordless.dev/).

## PHP

Coming Soon.

## Python

Coming Soon.
