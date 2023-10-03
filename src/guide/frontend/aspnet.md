---
title: ASP.NET
---

# ASP.NET Core 7 Identity

## Getting Started

The utilization of our NuGet package will streamline the integration process with ASP.NET Identity, facilitating a smoother and more efficient integration experience.

```bash
dotnet add package Passwordless.AspNetCore
```

Bootstrapping is now a straightforward process, where the addition of Passwordless to the `IdentityBuilder` becomes a requisite step.

The example below assumes your `appsettings.json` will add all configuration settings under the key `Passwordless`.

```csharp
builder.Services
    .AddIdentity<IdentityUser, IdentityRole>()
    .AddEntityFrameworkStores<PasswordlessContext>()
    .AddPasswordless(builder.Configuration.GetSection("Passwordless"));
```

At a minimum, you will be required to furnish the `ApiKey` (public key) and `ApiSecret` (private key).

```json
{
  "Passwordless": {
    "ApiKey": "***:public:***",
    "ApiSecret": "***:secret:***",
    "Register": {
      "Discoverable": true
    }
  }
}
```

Now, we'll need to modify the `WebApplication` object to add the Passwordless routing to make registering, logging in and managing credentials easier.

The endpoints are documented in a later section on this page.

```csharp
app.MapPasswordless(enableRegisterEndpoint: true);
```

Now we will create our registration page at `/Account/Register`. When we load the page, we will present a form to the user.

When we click the `Register` button, `OnPostAsync` will be called. When the form is valid, we will set the flag which will allow our Javascript code to run to allow registration of the token.

Calling `POST /passwordless-register` will create our `IdentityUser` and return a registration token in its response. We will then be able to use that token to create our passkeys.

```html
@page @using Passwordless.Net @using Microsoft.Extensions.Options @using Passwordless.AspNetCore
@model RegisterModel @inject IOptions<PasswordlessAspNetCoreOptions>
  PasswordlessOptions; @{ ViewData["Title"] = "Register"; }
  <h1>@ViewData["Title"]</h1>

  @{ var canAddPasskeys = ViewData["CanAddPasskeys"] is true; }

  <div class="row">
    <div class="col-12">
      <form class="needs-validation" action="" method="POST">
        <div class="mb-3">
          <label asp-for="Form.Username" class="form-label">Username</label>
          <input
            placeholder="Jane Doe"
            type="text"
            asp-for="Form.Username"
            class="form-control"
            id="username"
          />
          <span class="text-danger" asp-validation-for="Form.Username"></span>
        </div>
        <div class="mb-3">
          <label asp-for="Form.Email" class="form-label">Email</label>
          <input
            placeholder="janedoe@example.org"
            type="text"
            asp-for="Form.Email"
            class="form-control"
            id="email"
          />
          <span class="text-danger" asp-validation-for="Form.Email"></span>
        </div>
        <div class="text-danger" asp-validation-summary="ModelOnly"></div>
        <div>
          <button type="submit" class="btn-primary">Register</button>
        </div>
      </form>
    </div>
  </div>

  @if (canAddPasskeys) {
  <script src="https://cdn.passwordless.dev/dist/1.1.0/umd/passwordless.umd.js"></script>
  <script>
    async function register() {
      const username = document.getElementById('username').value;
      const email = document.getElementById('email').value;
      const registrationRequest = {
        email: email,
        username: username,
        displayName: username,
        aliases: [email]
      };

      const registrationResponse = await fetch('/passwordless-register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(registrationRequest)
      });

      // If no error then deserialize and use returned token to create now our passkeys
      if (registrationResponse.ok) {
        const registrationResponseJson = await registrationResponse.json();
        const token = registrationResponseJson.token;

        // We need to use Client from https://cdn.passwordless.dev/dist/1.1.0/umd/passwordless.umd.js which is imported above.
        const p = new Passwordless.Client({
          apiKey: '@PasswordlessOptions.Value.ApiKey',
          apiUrl: '@PasswordlessOptions.Value.ApiUrl'
        });
        const registeredPasskeyResponse = await p.register(token, email);
      }
    }

    register();
  </script>
  }</PasswordlessAspNetCoreOptions
>
```

```csharp
public IActionResult OnGet()
{
    if (HttpContext.User.Identity is { IsAuthenticated: true })
    {
        return LocalRedirect("/");
    }

    return Page();
}

public async Task OnPostAsync(FormModel form, CancellationToken cancellationToken)
{
    if (!ModelState.IsValid) return;
    _logger.LogInformation("Registering user {username}", form.Username);
    ViewData["CanAddPasskeys"] = true;
}

public FormModel Form { get; init; } = new();
```

Regarding the login page, `/Account/Login`, clicking the 'Login' button will once again trigger the setting of a similar flag, enabling the execution of our JavaScript code.

There are two approaches you can take. You can either request an "alias" to verify which passkeys correspond to the alias, or if you have discoverable credentials, an input form may not be necessary.

The process of logging in differs from registration. During login, you will request valid passkeys from your authenticator to obtain a verification token. Subsequently, this verification token will be transmitted to your backend to initiate the session.

With the "Passwordless ASP.NET Identity SDK," you can streamline this process by making a simple call to POST /passwordless-login, and the SDK will handle all the necessary steps for you.

Upon a successful authentication, our sample application will automatically redirect you to the /Authorized/HelloWorld page, which requires you to be logged in to access.

```html
@page @model LoginModel @using Microsoft.Extensions.Options @using Passwordless.AspNetCore @inject
IOptions<PasswordlessAspNetCoreOptions>
  PasswordlessOptions; @{ ViewData["Title"] = "Login"; }
  <h1>@ViewData["Title"]</h1>

  @{ var canLogin = ViewData["CanLogin"] != null && (bool)ViewData["CanLogin"]; }

  <div class="row">
    <div class="col-12">
      <form class="needs-validation" action="" method="POST">
        <div class="mb-3">
          <label asp-for="Form.Email" class="form-label">Email</label>
          <input
            placeholder="janedoe@example.org"
            type="text"
            asp-for="Form.Email"
            class="form-control"
            id="email"
          />
          <span class="text-danger" asp-validation-for="Form.Email"></span>
        </div>
        <div class="text-danger" asp-validation-summary="ModelOnly"></div>
        <div>
          <button type="submit" class="btn-primary">Login</button>
        </div>
      </form>
    </div>
  </div>

  @if (canLogin) {
  <script src="https://cdn.passwordless.dev/dist/1.1.0/umd/passwordless.umd.js"></script>
  <script>
    async function login() {
      const alias = document.getElementById('email').value;
      const p = new Passwordless.Client({
        apiKey: '@PasswordlessOptions.Value.ApiKey',
        apiUrl: '@PasswordlessOptions.Value.ApiUrl'
      });
      const loginPasskeyResponse = await p.signinWithAlias(alias);
      if (!loginPasskeyResponse) {
        return;
      }
      const loginRequest = {
        token: loginPasskeyResponse.token
      };
      const loginResponse = await fetch('/passwordless-login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(loginRequest)
      });

      if (loginResponse.ok) {
        console.log('login successful: ' + (await loginResponse.text()));

        // Redirect to authorized page /Authorized/HelloWorld
        window.location.href = '/Authorized/HelloWorld';
      }
    }

    login();
  </script>
  }</PasswordlessAspNetCoreOptions
>
```

If we visit the login page when we're already authenticated, we do want to redirect elsewhere.

```csharp
public IActionResult OnGet()
{
    if (HttpContext.User.Identity is { IsAuthenticated: true })
    {
        return LocalRedirect("/");
    }
    return Page();
}

public async Task OnPostAsync(LoginForm form, CancellationToken cancellationToken)
{
    if (!ModelState.IsValid) return;
    _logger.LogInformation("Logging in user {email}", form.Email);
    ViewData["CanLogin"] = true;
}

public LoginForm Form { get; } = new();
```

You can then access information about your logged in user from the `HttpContext`:

```csharp
public class HelloWorldModel : PageModel
{
    private readonly ILogger<HelloWorldModel> _logger;

    public HelloWorldModel(ILogger<HelloWorldModel> logger)
    {
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
    }

    public void OnGet()
    {
        var identity = HttpContext.User.Identity ;
        var email = User.FindFirstValue(ClaimTypes.Email);
        AuthenticatedUser = new AuthenticatedUserModel(identity.Name, email);
    }

    public AuthenticatedUserModel AuthenticatedUser { get; private set; }
}

public record AuthenticatedUserModel(string Username, string Email);
```

## Configuration

| Key                            | Default                     | Description                                                                                                                                                                                                                                                                                                        |
| ------------------------------ | --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| ApiKey                         |                             | Your public API key                                                                                                                                                                                                                                                                                                |
| ApiSecret                      |                             | Your private API key                                                                                                                                                                                                                                                                                               |
| ApiUrl                         | https://v4.passwordless.dev | Where your `Passwordless.dev` instance is running                                                                                                                                                                                                                                                                  |
| SignInScheme                   | Identity.Application        | Controls the scheme that will be used to handle the sign in                                                                                                                                                                                                                                                        |
| UserIdClaimType                |                             | Controls the claim type that will be used to find the user id from an authenticated users, see `ClaimsPrincipal`. If it is null it will fallback to `ClaimsIdentityOptions.UserIdClaimType` from `IdentityOptions.ClaimsIdentity` and if that is null will fallback to `ClaimTypes.NameIdentifier`.                |
| Register\_\_AliasHashing       | true                        | [false/true] When set to true, aliases are only stored in their hashed form.                                                                                                                                                                                                                                       |
| Register\_\_Attestation        | None                        | [None/Direct/Indirect] A value of `None` indicates that the server does not care about attestation. A value of `Indirect` means that the server will allow for anonymized attestation data. `Direct` means that the server wishes to receive the attestation data from the authenticator.                          |
| Register\_\_AuthenticationType | any                         |                                                                                                                                                                                                                                                                                                                    |
| Register\_\_Expiration         | "00:02:00"                  | ["hh:mm:ss"]                                                                                                                                                                                                                                                                                                       |
| Register\_\_Discoverable       | true                        | [false/true] Discoverable Credentials store private keys and associated data in the authenticator's memory instead of on a server. This eliminates the need for the server to send the credential to the authenticator for decryption, reducing the reliance on usernames and passwords for identity verification. |
| Register\_\_UserVerification   | Preferred                   | [Discouraged/Preferred/Required] A WebAuthn Relying Party may require user verification for some of its operations but not for others, and may use this type to express its needs.                                                                                                                                 |
|                                |

# Advanced

If you find yourself requiring greater flexibility, we invite you to explore our JavaScript client library and .NET SDK. This option is particularly suitable if you seek more granular control over the [ASP.NET Identity](https://learn.microsoft.com/en-us/aspnet/core/security/authentication/identity) framework or aspire to undertake a fully customized implementation.

- [JavaScript client](javascript)
- [.NET](../backend/dotnet)
