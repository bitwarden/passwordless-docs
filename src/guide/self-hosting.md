# Self-hosting <Badge text="Beta" type="warning"/>

The option to self-host is an enterprise feature. This is currently in the BETA phase of development. It is meant for experimentation and discovery purposes.
DO NOT use this in production environments.

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

## Known Issues

- There is no active sync between self-hosted Admin Console and the cloud hosted [Admin Console](https://admin.passwordless.dev).
- You cannot upgrade your self-hosted organization to a new higher tier plan.

## More Information

For further configuration options, please see the pages below.

- [Configuration](self-hosting/configuration.md)
- [Running Locally](self-hosting/running-locally.md) <Badge text="examples" type="warning"/>
- [Health-checks](self-hosting/health-checks.md)
- [Advanced](self-hosting/advanced.md)
