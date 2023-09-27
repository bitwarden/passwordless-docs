# Health Checks

We have added some health-check endpoints to the API, so that you can monitor the status of both the AdminConsole and the API.


## API
### Simple

The simple health-check endpoint does not check any dependencies, and only validates that the given endpoint is reachable. You can use it to check whether your container is still running, or to validate your port mapping or DNS configuration.

```bash
curl https://yourdomain.com:5701/api/health/http
```

Returns a `200 OK` if the API is running with the body `Healthy`.

### Database

To validate that your database configuration has been done correctly, you can use the database health-check endpoint. This endpoint will validate that the database is reachable, and that the database schema is up-to-date.

```bash
curl https://yourdomain.com:5701/api/health/storage
```

Will return the following response as a `200 OK`. When the database is not configured correctly or unreachable, it will return a `503 Service Unavailable`.

For a successful response, like the one below you may find the following keys under `results`:

- `orm`: Relates to Microsoft's ORM called Entity Framework. If this fails, it may relate to the database schema not being up-to-date.
- `sqlite`: Relates to the Sqlite database. If this fails, it may relate to the database file not being accessible.
- `mssql`: Relates to Microsoft SQL Server. If this fails, it may relate to the database not being accessible.

```json
{
    "status": "Healthy",
    "elapsedMilliseconds": 72.8363,
    "results": {
        "orm": {
            "status": "Healthy",
            "elapsedMilliseconds": 72.3092,
            "data": {}
        },
        "sqlite": {
            "status": "Healthy",
            "elapsedMilliseconds": 12.8241,
            "data": {}
        }
    }
}
```

### E-mailing

To validate that your e-mail configuration has been done correctly, you can use the e-mail health-check endpoint. This endpoint will validate that the e-mail server is reachable, and that the e-mail credentials are correct.

```bash
curl https://yourdomain.com:5701/api/health/mail
```

#### Default (Not configured)

By default, all e-mails are written to a file inside the container if no SMTP or PostMark configuration have been provided.

You can spot this by looking at the `results` key, which will contain the following:

```json
{
    "status": "Healthy",
    "elapsedMilliseconds": 1.8225,
    "results": {}
}
```

If the `results` key does not contain any children such as `smtp` or `postmark`, it means that the e-mail configuration has not been provided.

A valid `smtp` configuration, would return a response like below:

```json
{
    "status": "Healthy",
    "elapsedMilliseconds": 1.8225,
    "results": {
        "smtp": {
            "status": "Healthy",
            "elapsedMilliseconds": 1.4473,
            "data": {}
        }
    }
}
```

While an invalid smtp configuration would return a `503 Service Unavailable`.