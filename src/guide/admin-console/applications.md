# Applications

## Get started

The **Get Started** page walks you through the preliminary steps for getting Passwordless.dev running in your application. This information is very similar to what's documented in the [Get Started](../get-started) guide.

:::warning
This page contains your [API keys](../concepts.md#api-keys). It's important to download your API keys to a safe place, as they will be removed from the admin console after 7 days.
:::

## Playground

The **Playground** page gives access to a simple passwordless demo you can use for testing devices.

## Users

The **Users** page allows you to monitor the end-users with passkeys registered for your application. For each user, as determined by their `userId`, you'll be able to view:

### Credentials

Credentials registered to each user are listed. [Learn what data is stored for each credential](../concepts.md#credential).

### Aliases

Aliases registered to each user are listed, however aliases that are hashed cannot be viewed here ([learn more](../api.md#alias)).

## Settings

The **Settings** page will offer some options for configuring your application, including what [plan](https://bitwarden.com/products/passwordless/#pricing) your application is on. More to come.

### Api key management

There are several operations you can perform on your API keys:

| Operation | Condition           | Reversible | Description                                                                                                                           |
| --------- | ------------------- | ---------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| Lock      | API key is unlocked | Yes        | Locking an API key will prevent it from being used. You will typically receive a 403 HTTP status code.                                |
| Unlock    | API key is locked   | Yes        | Unlocking an API key will allow it to be used again.                                                                                  |
| Create    |                     | Yes        | Creating an API key will allow you to interact with the Passwordless.dev API. You are allowed to create as many API keys as you like. |
| Delete    | Api key is locked   | No         | Deleting an API key will permanently remove it.                                                                                       |

### Manually Generated Authentication Tokens

Manually Generated Authentication Tokens allow you to create a custom sign-in flow specific to your application. This could be incredibly useful in account recovery, identity verification, etc. To enable this feature, go to the **Settings** page, scroll to the **Manually Generated Authentication Tokens** section, check the box, and click Save.

You should now be able to call `https://v4.passwordless.dev/signin/generate-token` to retrieve a manually generated authentication token to be used to sign-in without a passkey. For more information, please refer to the [documentation](../api.md#signin-generate-token).

### Magic Links

Magic Links provides you with the ability to email your users a link that will redirect them to your application without having to configure your own email provider. This feature can be enabled by going to the **Settings** page, scrolling to the **Magic Links** section, checking the box, and clicking Save.

You should now be able to call `https://v4.passwordless.dev/magic-links/send` to send Magic Link emails to your users. For more information, please refer to the [documentation](../api.md#magic-links-send).

### Authentication Configurations

Authentication Configurations allow you to fine tune the tokens being used through the `signin` or `stepup` client methods. The two default purposes are `sign-in` and `step-up`. You can configure the TTL on each of them, change the User Verification requirement, as well as some other options. However, they cannot be deleted.

You can create additional configurations to suit your needs and pass through the purposes through the `stepup()` client method.
