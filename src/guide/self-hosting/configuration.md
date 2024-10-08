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
  bitwarden/passwordless-self-host:stable
```

## Database

### Sqlite

By default, the container will use Sqlite if nothing else is specified. The data will be stored in the following locations:

- /etc/bitwarden_passwordless/api.db
- /etc/bitwarden_passwordless/admin.db

### Microsoft SQL Server

| Key                   | Default | Required | Description                                                                               |
| --------------------- | ------- | -------- | ----------------------------------------------------------------------------------------- |
| BWP_DB_PROVIDER       |         | Y        | [sqlserver/mssql] Both values will allow you to use Microsoft SQL Server.                 |
| BWP_DB_SERVER         |         | Y        | Hostname, for example 'localhost' or 'db.example.com'.                                    |
| BWP_DB_PORT           | 1433    | N        | [0-65536]                                                                                 |
| BWP_DB_DATABASE_API   | Api     | N        | Name for the 'Api' application's database on the Microsoft SQL Server instance.           |
| BWP_DB_DATABASE_ADMIN | Admin   | N        | Name for the 'Admin Console' application's database on the Microsoft SQL Server instance. |
| BWP_DB_USERNAME       | sa      | N        |                                                                                           |
| BWP_DB_PASSWORD       |         | Y        |                                                                                           |

## Environment variables

| Key                   | Default   | Required | Description                                                                                                                                           |
| --------------------- | --------- | -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| BWP_ENABLE_SSL        | false     | N        | [true/false] See warning below.                                                                                                                       |
| BWP_PORT              | 5701      | N        | [0-65536] Only required if you don't use a reverse proxy.                                                                                             |
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

If you are using a load balancer or reverse proxy, you can leave it set to false and handle SSL termination there.

Read the 'WebAuthn' specification here: [See specification](https://www.w3.org/TR/webauthn-2/#web-authentication-api).
:::

## E-mail

Email is used by Passwordless Admin Console to notify administrators of changes to their organization. This is specifically useful for verifying administrators when first signing up.

By default, all e-mail communication is written to a file:

- `/app/mail.md`

When using the default configuration, the following command will output the contents of the file.

```bash
docker exec -it {name-of-container} cat /app/mail.md
```

### JSON

Reference: [Configuration in ASP.NET Core](https://learn.microsoft.com/en-us/aspnet/core/fundamentals/configuration/?view=aspnetcore-8.0)

What is important is to configure ‘Mail.From' as shown below. This is required to have a fallback e-mail address to send e-mails from. On the 'Mail.Providers’ is an array, which is an ordered list of e-mail providers that we will attempt to execute in order if they fail. To configure an e-mail provider, see the sub sections below.

```json
"Mail": {
  "From": "johndoe@example.com",
  "Providers": [
    {
      // Provider 1
    },
    {
      // Provider 2
    },
    {
      ...
    }
  ]
},
```

#### AWS

```json
{
  "Name": "aws",
  "AccessKey": "aws_access_key_id",
  "SecretKey": "aws_secret_key",
  "Region": "us-west-2"
}
```

#### File

```json
{
  "Name": "file",
  "Path": "/path/on/your/machine" //(optional)
}
```

#### SendGrid

```json
{
  "Name": "sendgrid",
  "ApiKey": "sendgrid_api_key"
}
```

#### SMTP

```json
{
  "Name": "smtp",
  "Host": "smtp.example.com",
  "Port": 123,
  "Username": "johndoe",
  "Password": "YourPassword123!",
  "StartTls": true/false,
  "Ssl": true/false,
  "SslOverride": true/false,
  "TrustServer": true/false // skips SSL certificate validation when set to `true`.
}
```

Example with SendGrid:

```json
{
  "Name": "smtp",
  "Host": "smtp.sendgrid.net",
  "Port": 465,
  "Username": "apikey",
  "Password": "<your-sendgrid-api-key>",
  "StartTls": false,
  "Ssl": true,
  "SslOverride": false,
  "TrustServer": true
}
```

### Environment variables

Reference: [Configuration in ASP.NET Core](https://learn.microsoft.com/en-us/aspnet/core/fundamentals/configuration/?view=aspnetcore-8.0)

<!-- prettier-ignore -->
What is important is to configure ‘Mail__From' as shown below. This is required to have a fallback e-mail address to send e-mails from. On the 'Mail__Providers’ is an array, which is an ordered list of e-mail providers that we will attempt to execute in order if they fail. To configure an e-mail provider, see the sub sections below.

Arrays start at zero so we configure AWS to be the first in line to attempt to send e-mails from, if that fails, we fall back to SendGrid.

```bash
-e Mail__From='johndoe@example.com'
-e Mail__FromName='John Doe'
-e Mail__Providers__0__Name='aws'
-e Mail__Providers__0__AccessKey='aws_access_key_id'
-e Mail__Providers__0__SecretKey='aws_secret_key'
-e Mail__Providers__1__Name='sendgrid'
-e Mail__Providers__1__ApiKey='sendgrid_api_key'
```

In the vendor specific examples below, we will always use '#' as the provider index.

#### AWS

```bash
-e Mail__Providers__#__Name='aws'
-e Mail__Providers__#__AccessKey='aws_access_key_id'
-e Mail__Providers__#__SecretKey='aws_secret_key'
-e Mail__Providers__#__Region='us-west-2'
```

#### File

```bash
-e Mail__Providers__#__Name='file'
-e Mail__Providers__#__Path='/path/on/your/machine' #(optional)
```

#### SendGrid

```bash
-e Mail__Providers__#__Name='sendgrid'
-e Mail__Providers__#__ApiKey='sendgrid_api_key'
```

#### SMTP

```bash
-e Mail__Providers__#__Name='smtp'
-e Mail__Providers__#__Host='smtp.example.com'
-e Mail__Providers__#__Port=123
-e Mail__Providers__#__Username='johndoe'
-e Mail__Providers__#__Password='YourPassword123!'
-e Mail__Providers__#__StartTls=true/false
-e Mail__Providers__#__Ssl=true/false
-e Mail__Providers__#__SslOverride=true/false
-e Mail__Providers__#__TrustServer=true/false # skips SSL certificate validation when set to `true`.
```

Example with SendGrid:

```bash
-e Mail__Providers__#__Name='smtp'
-e Mail__Providers__#__Host='smtp.sendgrid.net'
-e Mail__Providers__#__Port=465
-e Mail__Providers__#__Username='apikey'
-e Mail__Providers__#__Password='<your-sendgrid-api-key>'
-e Mail__Providers__#__StartTls=false
-e Mail__Providers__#__Ssl=true
-e Mail__Providers__#__SslOverride=false
-e Mail__Providers__#__TrustServer=true
```

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

It is recommended that you have them generated automatically, the first time you run `bitwarden/passwordless-self-host`.
