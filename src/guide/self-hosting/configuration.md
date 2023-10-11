# Configuration

## Ports

The container will expose port `5701`. You can map this to any port you want on your host machine.

Internally the `AdminConsole` and `Api` will both communicate internally using ports 5000 and 5001. Network traffic will by default not leave the container.

## Volumes

You will want to mount persistent storage for your running Docker container. It is very important that you map the container's path `/etc/bitwarden_passwordless`. Then you can be confident your settings and Sqlite database, assuming you don't use any other databases, persist between updates, migrations, etc.

:::warning
Failure to mount persistent storage, will:
- Result in loss of configuration if you're dependent on `/etc/bitwarden_passwordless/config.json`.
- Result in loss of data only when using Sqlite.
:::

```bash
$ docker run -d \
  --name passwordless \
  --mount source=/your/persistent/storage,target=/etc/bitwarden_passwordless \
  bitwarden/passwordless:latest
```

## Database

### Sqlite

By default, the container will use Sqlite if nothing else is specified. The data will be stored in the following locations:
- /etc/bitwarden_passwordless/api.db
- /etc/bitwarden_passwordless/admin.db

### Microsoft SQL Server

| Key                   | Default | Required | Description                                                                               |
|-----------------------|---------|----------|-------------------------------------------------------------------------------------------|
| BWP_DB_PROVIDER       |         | Y        | [sqlserver/mssql] Both values will allow you to use Microsoft SQL Server.                 |
| BWP_DB_SERVER         |         | Y        | Hostname, for example 'localhost' or 'db.example.com'.                                    |
| BWP_DB_PORT           | 1433    | N        | [0-65536]                                                                                 |
| BWP_DB_DATABASE_API   | Api     | N        | Name for the 'Api' application's database on the Microsoft SQL Server instance.           |
| BWP_DB_DATABASE_ADMIN | Admin   | N        | Name for the 'Admin Console' application's database on the Microsoft SQL Server instance. |
| BWP_DB_USERNAME       | sa      | N        |                                                                                           |
| BWP_DB_PASSWORD       |         | Y        |                                                                                           |

## Environment variables

| Key                   | Default   | Required | Description                                                                                                                                           |
|-----------------------|-----------|----------|-------------------------------------------------------------------------------------------------------------------------------------------------------|
| BWP_ENABLE_SSL        | false     | N        | [true/false] See warning below.                                                                                                                       |
| BWP_PORT              | 5701      | Y        | [0-65536] This will determine the port your self-hosted instance will be accessible from.                                                             |
| BWP_DOMAIN            | localhost | N        | [example.com] This will be the domain your self-hosted instance will be accessible from. It is important it matches for everything to work correctly. |
| BWP_DB_PROVIDER       |           | N        | [mssql/sqlserver/] Defaults to using Sqlite if not set                                                                                                |
| BWP_DB_SERVER         |           | N        | For any non-file hosted database, enter its domain name. Required for Microsoft SQL Server.                                                           |
| BWP_DB_PORT           |           | N        | [0-65536] For any non-file hosted database, enter the port. Required for Microsoft SQL Server.                                                        |
| BWP_DB_DATABASE_API   |           | N        | Database name for the API. Required for Microsoft SQL Server.                                                                                         |
| BWP_DB_DATABASE_ADMIN |           | N        | Database name for the Admin Console. Required for Microsoft SQL Server.                                                                               |
| BWP_DB_USERNAME       |           | N        | Username for the user connecting to the database. Required for Microsoft SQL Server.                                                                  |
| BWP_DB_PASSWORD       |           | N        | Password for the user connecting to the database. Required for Microsoft SQL Server.                                                                  |

:::warning
Setting SSL with `BWP_ENABLE_SSL` is required in [insecure contexts](https://w3c.github.io/webappsec-secure-contexts/#secure-contexts). Running the container locally on 'localhost' is considered a secure context.

Read the 'WebAuthn' specification here: [See specification](https://www.w3.org/TR/webauthn-2/#web-authentication-api)'.
:::

## E-mail

By default, all e-mail communication happens to a file:
* `/app/Admin/mail.md`
* `/app/Api/mail.md`.

It's recommended you configure the SMTP parameters below:

| Key                  | Default | Required | Description                                                                             |
|----------------------|---------|----------|-----------------------------------------------------------------------------------------|
| BWP_SMTP_FROM        |         | Y        | Use your sender e-mail.                                                                 |
| BWP_SMTP_USERNAME    |         | Y        |                                                                                         |
| BWP_SMTP_PASSWORD    |         | Y        |                                                                                         |
| BWP_SMTP_HOST        |         | Y        | Hostname                                                                                |
| BWP_SMTP_PORT        |         | Y        | [0-65535]                                                                               |
| BWP_SMTP_STARTTLS    | false   | N        | [true/false]                                                                            |
| BWP_SMTP_SSL         | false   | N        | [true/false]                                                                            |
| BWP_SMTP_TRUSTSERVER | false   | N        | [true/false] Allows you to skip certificate validation. Not recommended for production. |

:::warning
To verify e-mailing is working correctly:
* Create an admin with a new organization.
* Invite an admin to an existing organization.
:::

### SendGrid example with SSL

For verifying e-mailing is working correctly, you can use health-checks, read more [here](health-checks).

```bash

* BWP_SMTP_FROM: you@example.com
* BWP_SMTP_USERNAME: apikey
* BWP_SMTP_PASSWORD: <your-api-key>
* BWP_SMTP_HOST: smtp.sendgrid.net
* BWP_SMTP_PORT: 465
* BWP_SMTP_SSL: true
* BWP_SMTP_TRUSTSERVER: true (for local testing)

## config.json

:::warning
Requirements:
- Persistent storage, see 'Volumes'.
:::

`/etc/bitwarden_passwordless/config.json` is only generated when you have not specified the following environment variables:


If you mount `/etc/bitwarden_passwordless` to your host. You can specify a `config.json`.

If the following keys do not exist, they will be generated automatically:
- Passwordless::ApiKey
- Passwordless::ApiSecret
- PasswordlessManagement::ManagementKey
- SALT_KEY

It is recommended that you have them generated automatically, the first time you run `bitwarden/passwordless`.