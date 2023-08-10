# Node.js

This Node.js implementation is done in only a few lines of code. A [register](api/#register-token) function might look something like:

```js
app.get("/create-token", async (req, res) => {

  const alias = req.query.alias;
  
  // Generate a new userid or grab the userid from session, cookie etc
  const payload = {
    userId: getRandomInt(),
    username: alias,
    aliases: [alias] // We can also set aliases for the userid, so that signin can be initiated without knowing the userid
  };

  // Send the username to the passwordless api to get a token
  var response = await fetch("https://v4.passwordless.dev/register/token", {
    method: "POST",
    body: JSON.stringify(payload),
    headers: { ApiSecret: API_SECRET, 'Content-Type': 'application/json'}
  });

  var responseData = await response.json();
  console.log("passwordless api response", response.status, response.statusText, responseData);
    
  if(response.status == 200) {
    console.log("received token: ", responseData.token);
  } else {
    // Handle or log any API error, { errorCode: "unknown_credentials", "title": "This is what is wrong", "details": "..."}
  }

  res.status(response.status);
  res.send(responseData);
});
```

## References

* [Open the Node.js example on Github](https://github.com/passwordless/passwordless-nodejs-example)

* If you just want to see the Node.js demo run, we host an example at [demo-backend.passwordless.dev](https://demo-backend.passwordless.dev/)