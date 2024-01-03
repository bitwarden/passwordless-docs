# Create a Passwordless.dev SDK

This document provides guidelines for creating an official or community SDK for Passwordless.dev.

## General recommendations

1. Choose an open source license like [Apache 2.0](https://choosealicense.com/licenses/apache-2.0/)
2. Host your code on GitHub or GitLab
3. Name it `passwordless-{language/framework}` (e.g. `passwordless-dotnet`)
4. Add documentation and examples (see below)
5. Follow best practices for SDKs in the target ecosystem

## Documentation

In your `README` we recommend to give users the info they need to get started.

### Introduction

- Mention that this is a community project
- Point users to the official Passwordless docs: https://docs.passwordless.dev
- ... and the admin portal to create an account: https://admin.passwordless.dev

### Installation

Describe how to install / set up the SDK.

### Getting Started

Provide a basic usage example.

### API Reference

Document the SDK methods that wrap the Passwordless API.

### Examples

Include a simple app that creates and verifies a passkey e.g. some examples might look like this:

- [passwordless-dotnet-example]
- [passwordless-nodejs-example]

## Scope of the SDK

Use the [API reference documentation](https://docs.passwordless.dev/guide/api.html) as your blueprint on what methods to add. Please see the official SDKs (e.g. [passwordless-dotnet] and [passwordless-nodejs]) for a reference of methods and how to implement them.

## Testing and CI / CD

Configure automated tests and CI / CD (e.g. GitHub Actions) for quality.

## Language SDK vs. Framework SDK

We encourage different flavors of SDKs and integrations as described here:

- Language SDK: wraps the HTTP API in the target language, e.g. `dotnet`, `python`, or `ruby`
- Framework SDK: integrates the Language SDK into an opinionated framework, e.g. ASP.NET, Flask, Rails, Nuxt, or Laravel
- Plugin: integrates Passwordless.dev as a Plugin to a existing system, e.g. Wordpress, Umbraco, etc.

[passwordless-dotnet]: https://github.com/passwordless/passwordless-dotnet
[passwordless-nodejs]: https://github.com/passwordless/passwordless-nodejs
[passwordless-dotnet-example]: https://github.com/passwordless/passwordless-dotnet-example
[passwordless-nodejs-example]: https://github.com/passwordless/passwordless-nodejs-example

## Support

Hope this helps provide some best practices for creating high-quality Passwordless SDKs! Let us know if you have any other questions by reaching out to team@passwordless.dev.
