# Self-hosting

The Docker image will allow you to setup your self-hosted instances in less than 5 minutes.

## Getting Started

The following `Docker` command will pull the container locally.

```bash
docker run --publish 5072:8080 --volume /Users/username/passwordless_cache:/etc/bitwarden_passwordless --env BWP_DOMAIN_API_PORT=5072 bitwarden/passwordless
```

You should now be able to access your own `Passwordless.dev` instance at:
* Admin Console: `http://localhost:5072`
* API: `http://localhost:5072/api`

## More Information

* [Configuration](self-hosting/configuration)
* [Running Locally](self-hosting/running-locally) <Badge text="example" type="warning"/>
* [Advanced](self-hosting/advanced)
* [Health-checks](self-hosting/health-checks)
