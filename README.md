# Bitwarden Passwordless.dev Documentation

Bitwarden Passwordless.dev is a software toolkit that helps developers build FIDO2 WebAuthn passkeys features for seamless authentication flows. This repository contains Passwordless.dev documentation, hosted at [docs.passwordless.dev](docs.passwordless.dev). The site uses Markdown and [VuePress](https://vuepress.vuejs.org/guide/).

Using Passwordless.dev means there's no need to read extensive W3C specification documentation, determine what cryptography to implement, or worry about managing stored public keys. The team behind Bitwarden will take care of that for you.

## Build and run

After you've cloned the repository, run the following commands:

- `yarn install` to install VuePress & dependencies
- `yarn run dev` to build and run the site on `http://localhost:8080`

If you're making changes, make sure to run `yarn run lint` before committing to ensure your code is formatted correctly.

## Contribute

We encourage all contributions to docs.passwordless.dev, whether that's opening issues to request edits or additions, or adding them yourself in PRs. We recommend checking out the [VuePress documentation](https://vuepress.vuejs.org/guide/getting-started.html) for help writing correctly formatted Markdown.

When contributing PRs, please do your best to follow these guidelines:

- Use present tense and active voice.
- Use sentence case in headers and other titles (e.g. "**C**reate **a**n **a**pplication").
- If you're adding a **new** article, add it to the `sidebar` object in `/src/.vuepress/config.js`.
- If you're adding **code examples**, please include comments to explain what each function, section of code, etc. is achieving.
- Keep punctuation to the minimum necessary.
- Always capitalize "Passwordless.dev" and "Bitwarden".
- Feel free to use **bold** text to emphasize words or phrases, but please avoid italics or underlines.
- Use numerals (e.g. 1, 2, 3) to represent numbers.
