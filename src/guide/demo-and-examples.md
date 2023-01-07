# 💡 Demo and Examples

## Copy-paste demo (client side only!)
If you just want to try using FaceID on your webapp, this example has copy-pasteable client-side code.
It hosts the NodeJS demo backend for your convenience.

To have more control of the UserID and the backend, see Node.js demo.

<PasswordlessDemo />

[Online example](https://demo-backend.passwordless.dev/minimal.html) - [See the code on github](https://github.com/passwordless/passwordless-nodejs-example/blob/main/public/minimal.html#L27)



```html
<script
      src="https://cdn.passwordless.dev/dist/0.3.0/passwordless.iife.js"
      crossorigin="anonymous"
    ></script>

  <script>
    // Passwordless integration
    const apiKey = "demobackend:public:c203e65b581443778ea4823b3ef0d6af";
    const backendUrl = "https://demo-backend.passwordless.dev";

    async function Register(alias) {
      const p = new Passwordless.Client({ apiKey });
      const myToken = await fetch(backendUrl + "/create-token?alias=" + alias).then((r) => r.text());
      await p.register(myToken);
      console.log("Register succeded");
    }
    async function Signin(alias) {
      const p = new Passwordless.Client({ apiKey });
      const token = await p.signinWithAlias(alias);
      const user = await fetch(backendUrl + "/verify-signin?token=" + token).then((r) => r.json());
      console.log("User details", user);
      return user;
    }

    // Call Register('unique@email') to register with faceid/touchid/authenticator
    // Call Signin('unique@email') to signin using faceid/touchid/authenticator
  </script>
```

## Node.js

[Online example](https://demo-backend.passwordless.dev/) - [See the code on github](https://github.com/passwordless/passwordless-nodejs-example)

You only need a couple lines of code to get the code working in node. This example uses Express.js and node.js to register and sign in users.

## ASP.NET

[See the code on github](https://github.com/passwordless/passwordless-dotnet-example)

You only need a couple lines of code to get the code working in asp.net. This example uses ASP.NET Core (on .NET5) and some javascript to register and sign in users.

Note: .NET framework is also fully supported.

## PHP

Coming soon...