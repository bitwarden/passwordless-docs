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

### Aliases,

Aliases registered to teach user are listed, however aliases that are hashed cannot be viewed here ([learn more](../api.md#alias)).

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
