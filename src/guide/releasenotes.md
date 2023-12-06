# Release Notes

## General Availability

Bitwarden is proud to announce General Availability of **Passwordless.dev**! GA improvements include:

- An all-new [admin console](admin-console.md) to help you quickly get started implementing passwordless, configuring settings, and monitoring users.
- A suite of updates to the [Javascript Client](frontend/javascript.md) and [API](api.md).

:::warning
**To users of the beta**, the GA release of passwordless.dev includes breaking changes to the API that will be released to a net-new service. All beta users sign up for the GA service as soon as they're able and make the following changes to their implementation:

- Replace existing API keys with your newly-created keys.
- Replace beta service API URLs with GA service URLs.
- Update your [frontend code](frontend/index.md) and [backend code](api.md) according to the documentation.

Data migration from the beta to GA service is not currently available, however beta service will remain live and available after GA release to give you time to make the move.
:::
