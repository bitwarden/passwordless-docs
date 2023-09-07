# Running locally

## Simple example #1

* Admin console is accessible on `http://localhost:8080/`
* No permanent storage: In this example, the generated `config.json` and `Sqlite databases` will be lost.

```bash
docker pull bitwarden/passwordless
docker run \
  --publish 8080:8080 \
  --env BWP_DOMAIN_API_PORT=8080 \
  bitwarden/passwordless
```

## Simple example #2

* Admin console is accessible on `http://localhost:8080/`
* Permanent storage: In this example, the generated `config.json` and `Sqlite databases` will be retained on the host in directory `/your/directory`.

```bash
docker pull bitwarden/passwordless
docker run \
  --publish 8080:8080 \
  --volume /your/directory:/etc/bitwarden_passwordless \
  --env BWP_DOMAIN_API_PORT=8080 \
  bitwarden/passwordless
```

## Example with SSL

* Admin console is accessible on `https://localhost:8443/`
* Permanent storage: In this example, the generated `config.json` and `Sqlite databases` will be retained on the host in directory `/your/directory`.

```bash
docker pull bitwarden/passwordless
docker run \
  --publish 8443:8443 \
  --volume /your/directory:/etc/bitwarden_passwordless \
  --env BWP_DOMAIN_API_PORT=8443 \
  --env BWP_ENABLE_SSL=true \
  bitwarden/passwordless
```

:::warning
After executing the `docker run` command, you will locate the SSL certificates either within your designated directory on the host system or within the container at the path `/etc/bitwarden_passwordless.`

To ensure proper functionality, it is imperative to register the `ssl.crt` certificate on your local machine. Failure to do so may result in your web browser flagging the SSL certificate as invalid, consequently preventing the WebAuthn functionality from operating, as the WebAuthn API will not be exposed in insecure contexts.
:::