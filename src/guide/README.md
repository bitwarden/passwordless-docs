
# Overview

Hey there, fellow web app developer! 👋

This guide will help you **add Face/Fingerprint/Security Key sign in** to your webapp and understand:

* What is passwordless.dev?
* Why would you use it? What do you gain?
* How does the passwordless.dev service work?
* How does the underlying technique work?

<PasswordlessDemo />
[Jump to example code →](demo-and-examples)

## What is passwordless.dev?

Passwordless.dev is a service that enables developers to use the next-gen technology for fast and secure sign in on the web - WebAuthn - without reading the w3c spec.

> WebAuthn is a new W3C Standard that is now supported in most browser. It allows a user to sign into a webpage using a number of methods, such as: *FaceID, Fingerprint scanning, Windows Hello Credentials or Security Key*.

**Passwordless.dev wraps all the complexity in using WebAuthn behind a simple API**. No need to worry about running the cryptography and storing public keys, we help you with that too.

The team who built passwordless.dev are also the creators and maintainers behind the open source project fido2-net-lib, one of the first libraries to reach 100% compliance in conformance testing.

## What do you gain from using it?

The Passwordless API helps you **get started with WebAuthn in minutes rather than weeks.**
WebAuthn is based on public key cryptography and which is quite complex. Passwordless.dev allows you to bring the features of WebAuthn to your users, rather than encoding key byte arrays correctly.

Notable features:

* Free starter plan
* Handles all cryptography and key storage
* Integrates nicely to your existing authentication
* Fully featured REST API
* Examples available (Node, PHP, .NET)
* GDPR Compliace built in

## Purpose

We built passwordless.dev and the open source library to make it really easy for developers to adopt WebAuthn. Adopting WebAuthn makes your users and data better protected against hacks based on password re-use and phishing attacks.