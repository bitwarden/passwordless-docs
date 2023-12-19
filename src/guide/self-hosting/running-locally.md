# Running locally

## Simple example #1

- Admin console is accessible on `https://localhost:5042/`
- No permanent storage: In this example, the generated `config.json` and `Sqlite databases` will be lost.

```bash
docker pull bitwarden/passwordless-self-host:stable
docker run \
  --publish 5042:5701 \
  --env BWP_ENABLE_SSL=true \
  bitwarden/passwordless-self-host:stable
```

## Simple example #2

- Admin console is accessible on `http://localhost:5042/`
- Permanent storage: In this example, the generated `config.json` and `Sqlite databases` will be retained on the host in directory `/your/directory`.

```bash
docker pull bitwarden/passwordless-self-host:stable
docker run \
  --publish 5042:5701 \
  --volume /your/directory:/etc/bitwarden_passwordless \
  --env BWP_PORT=5042 \
  bitwarden/passwordless-self-host:stable
```

## Example with SSL

- Admin console is accessible on `https://localhost:5042/`
- Permanent storage: In this example, the generated `config.json` and `Sqlite databases` will be retained on the host in directory `/your/directory`.

```bash
docker pull bitwarden/passwordless-self-host:stable
docker run \
  --publish 5042:5701 \
  --volume /your/directory:/etc/bitwarden_passwordless \
  --env BWP_PORT=5042 \
  --env BWP_ENABLE_SSL=true \
  bitwarden/passwordless-self-host:stable
```

:::warning
After executing the `docker run` command, you will locate the SSL certificates either within your designated directory on the host system or within the container at the path `/etc/bitwarden_passwordless.`

To ensure proper functionality, it is imperative to register the `ssl.crt` certificate on your local machine. Failure to do so may result in your web browser flagging the SSL certificate as invalid, consequently preventing the WebAuthn functionality from operating, as the WebAuthn API will not be exposed in insecure contexts.
:::
