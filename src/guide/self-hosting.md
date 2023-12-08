# Self-hosting <Badge text="Beta" type="warning"/>

::: danger Important
The option to self-host is an enterprise feature and is currently in the BETA phase of development. It is meant for experimentation and discovery purposes.
All features and configuration could change in the future. DO NOT use this in production environments.
:::

The Docker image will allow you to set up your self-hosted instances in less than 5 minutes.

## Getting Started

In order to retain settings and data from self-hosting Passwordless, it is recommended that you set up a directory for
storing the generated configuration file and database. Otherwise, the database and configuration file will be deleted when with the container.

### Installation and running

To get up and running, execute the lines below.

```bash
docker pull bitwarden/passwordless
docker run \
  --publish 5701:5701 \
  --volume {your-host-directory}:/etc/bitwarden_passwordless \
  bitwarden/passwordless
```

You should now be able to access your own `Passwordless.dev` instance at:

- Admin Console: `https://localhost:5701`
- API: `https://localhost:5701/api`

From here, you can continue to the [Get started](get-started.md) in order to set up your organization and application.

### Logging

If you would like to view the logs of Admin Console and Api, you can do so with the following commands.

```bash
docker exec -it {name-of-container} tail /var/log/bitwarden_passwordless/api.log
```

```bash
docker exec -it {name-of-container} tail /var/log/bitwarden_passwordless/admin.log
```

### Communication

By default, a file will be used for an email that the system would send. The body of the email will be appended to the file instead of being
sent out.  This is important for creating an organization and inviting administrators to the Admin Console.  To configure your own
mail provider, please see the [e-mail](self-hosting/configuration.md#e-mail) section of the [configuration](self-hosting/configuration.md) docs.

The default file location for the `mail.md` files are below:
- `/app/Admin/mail.md`
- `/app/Api/mail.md`

For access to these files, either execute into the running container or use the two commands to print the files' contents.

For Admin Console:
```bash
docker exec -it {name-of-container} cat /app/AdminConsole/mail.md
```
For Api:
```bash
docker exec -it {name-of-container} cat /app/Api/mail.md
```

## Known Issues

- There is no active sync between self-hosted Admin Console and the cloud hosted [Admin Console](https://admin.passwordless.dev).
- You cannot upgrade your self-hosted organization to a new higher tier plan.

## More Information

For further configuration options, please see the pages below.

- [Configuration](self-hosting/configuration.md)
- [Running Locally](self-hosting/running-locally.md) <Badge text="examples" type="warning"/>
- [Health-checks](self-hosting/health-checks.md)
- [Advanced](self-hosting/advanced.md)
