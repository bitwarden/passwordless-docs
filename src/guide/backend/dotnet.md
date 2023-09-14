# ASP.NET Core

Install NuGet packages:

```bash
dotnet add package Passwordless
dotnet add package Passwordless.AspNetCore
```

This ASP.NET Core implementation uses .NET 7 and some JavaScript for a simple passwordless.dev implementation. A [register](api/#register-token) function might look something like:

The `Startup` class is responsible for configuring and setting up various services, middleware, and components that the application will use during its lifetime.

```csharp
public class Startup
{
    public Startup(IConfiguration configuration)
    {
        Configuration = configuration;
    }
    
    private IConfiguration Configuration { get; }

    ...

    // This method gets called by the runtime. Use this method to add services to the container.
    // For more information on how to configure your application, visit https://go.microsoft.com/fwlink/?LinkID=398940
    public void ConfigureServices(IServiceCollection services)
    {
        // add support for routing to controllers
        services.AddControllers();
        
        // Inject the Passwordless SDK
        services.Configure<PasswordlessOptions>(Configuration.GetRequiredSection("Passwordless"));
        services.AddPasswordlessSdk(options =>
        {
            Configuration.GetRequiredSection("Passwordless").Bind(options);
        });
    }
```

 Newer templates might not have this, in which case you will need to configure this in your `Program` class instead. In this case you can  access `Services` and `Configuration` properties on `WebApplicationBuilder`.

It would then be as simple to inject `IPasswordlessClient` in the class where you want to use it. Using the SDK for registering a token would then look like:

```csharp
[HttpGet("/create-token")]
public async Task<IActionResult> GetRegisterToken(string alias)
{
    var userId = Guid.NewGuid().ToString();

    var payload = new RegisterOptions(userId, alias)
    {
        Aliases = new HashSet<string> { alias }
    };

    try
    {
        var token = await _passwordlessClient.CreateRegisterTokenAsync(payload);
        return Ok(token);
    }
    catch (PasswordlessApiException e)
    {
        return new JsonResult(e.Details)
        {
            StatusCode = (int?)e.StatusCode,
        };
    }
}
```

And logging in:

```csharp
[HttpGet("/verify-signin")]
public async Task<IActionResult> VerifySignInToken(string token)
{
    try
    {
        var verifiedUser = await _passwordlessClient.VerifyTokenAsync(token);
        return Ok(verifiedUser);
    }
    catch (PasswordlessApiException e)
    {
        return new JsonResult(e.Details)
        {
            StatusCode = (int?)e.StatusCode
        };
    }
}
```

## References
* [ASP.NET example on Github](https://github.com/passwordless/passwordless-dotnet-example).