# Self-hosting

The Docker image will allow you to setup your self-hosted instances in less than 5 minutes.

## Getting Started

The following `Docker` command will pull the container locally.

```bash
docker run --publish 8080:5701 --volume /Users/username/passwordless_cache:/etc/bitwarden_passwordless --env BWP_DOMAIN_API_PORT=8080 bitwarden/passwordless
```

You should now be able to access your own `Passwordless.dev` instance at:

- Admin Console: `http://localhost:8080`
- API: `http://localhost:8080/api`

## More Information

- [Configuration](self-hosting/configuration)
- [Running Locally](self-hosting/running-locally) <Badge text="example" type="warning"/>
- [Advanced](self-hosting/advanced)
- [Health-checks](self-hosting/health-checks)
