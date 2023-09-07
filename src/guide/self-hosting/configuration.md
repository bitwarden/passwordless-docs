# Configuration

## Ports

The container will expose port `8080` (http) or `8443` (https). Only one of them will be active depending on whether SSL is enabled with the `BWP_ENABLE_SSL` flag, see below.

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

## Environment variables

| Key                   | Default   | Required | Description                                                                                                                                           |
|-----------------------|-----------|----------|-------------------------------------------------------------------------------------------------------------------------------------------------------|
| BWP_ENABLE_ADMIN      | true      | N        | [true/false]                                                                                                                                          |
| BWP_ENABLE_SSL        | false     | N        | [true/false] See warning below.                                                                                                                       |
| BWP_DOMAIN_API_PORT   |           | Y        | [0-65536] This will determine the port your self-hosted instance will be accessible from.                                                             |
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