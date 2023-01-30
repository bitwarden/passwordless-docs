# REST API Operations

The following API operations are available:

[[toc]]

## Register - Create token

To register a credential for a user, your backend calls the passwordless api:

Required information:

```http
POST https://v3.passwordless.dev/register/token HTTP/1.1
ApiSecret: demo:secret:yyy
Content-Type: application/json

{ "userId: "123", "username": "anders@passwordless.dev", "displayName": "Anders Åberg" }
```

Response:

```json
"wWdDh02ItIvnCKT_02ItIvn..."
```
This token is used to begin a registration event.

Additional parameters available in the POST request body:

```js
{
  userId: "123", // WebAuthn userHandle. Maxium 64 bytes. Used to identify a user after succesfull login.
  displayname: "Anders Åberg", // WebAuthn displayname, used in UI. Never stored in database.
  username: "anders@passwordless.dev", // WebAuthn username, used in UI. Never stored in database.
  attType: "None", // WebAuthn AttestationType, can be "direct", "indirect" and "none. Default is none.
  authType: "platform", // Webauthn AuthenticationType, can be "platform" (triggers faceid/touchid/windows hello) or "cross-platform" (triggers security-key). Default is platform.
  userVerification: "preferred" // Webauhtn UserVerification. Can be "required", "preferred" or "discourage" . Default is preferred".
  expiresAt: "2021-08-01T14:43:03Z", // Datetime when token is set to expire encoded using UTC ISO 8601-1:2019. Defaults to curren time in utc + 120seconds. 
}
```


## Sign in - Verify token

```http
POST https://v3.passwordless.dev/signin/verify HTTP/1.1
ApiSecret: demo:secret:yyy
Content-Type: application/json

{ "token": "zzz" }
```

response:
```json
{
  "success": true,
  "username": "anders@user.com",
  "timestamp": "2021-05-19T13:12:20.4691748Z",
  "rpid": "localhost",
  "origin": "http://localhost:3000",
  "device": "Firefox, Windows 10",
  "country": "SE",
  "nickname": null,
  "expiresAt": "2021-05-19T13:14:20.4691749Z"
}

```

## Alias
Sets aliases for the userid, so that a sign in can be initiated with a username or email.
Any existing aliases for that user are overwritten.
Alias are only stored as a hash to ensure user privacy. They are never returned in any API respones.

Rules:
* Alias has to be unique to the specified userId. 
* Alias can be maxium 250 chars long
* Maximum of 10 alias

<CodeSwitcher :languages="{js:'JavaScript',http:'HTTP'}">
<template v-slot:js>

```js
// your backend app.js
const payload = {
    userId: "123",
    aliases: ["anders@passwordless.dev"] // Allow signin to be initiated without knowing userid
};

// Make a HTTPS POST to `/register/token` with the UserId (using your ApiSecret)...
var token = await fetch(apiurl + "/alias", {
    method: "POST",
    body: JSON.stringify(payload),
    headers: { ApiSecret: API_SECRET, 'Content-Type': 'application/json'}
});
```

</template>
<template v-slot:http>

```http
POST https://v3.passwordless.dev/alias
ApiSecret: demo:secret:yyy
Content-Type: application/json

{ "UserId": "123", "aliases": ["anders@passwordless.dev"]} 
```
</template>
</CodeSwitcher>

## List Credentials for user

List all credentials for a certain userId

<CodeSwitcher :languages="{js:'JavaScript',http:'HTTP'}">
<template v-slot:js>

```js
// your backend app.js
const payload = {
    userId: "123"
};

// Make a HTTPS POST to `/register/token` with the UserId (using your ApiSecret)...
var credentials = await fetch(apiurl + "/credentials/list", {
    method: "POST",
    body: JSON.stringify(payload),
    headers: { ApiSecret: API_SECRET, 'Content-Type': 'application/json'}
});
```
</template>
<template v-slot:http>

```http
GET /credentials/list?userId=USERID HTTP/1.1
ApiSecret: demo:secret:yyy
```
</template>
</CodeSwitcher>



Response 200 ok:

```json
[
    {
        "aaGuid": "08987058-cadc-4b81-b6e1-30de50dcbe96",
        "country": "",
        "createdAt": "2021-08-01T01:29:49.7492687Z",
        "credType": "none",
        "descriptor": {
            "id": "qgB2ZetBhi0rIcaQK8_HrLQzXXfwKia46_PNjUC2L_w",
            "type": "public-key"
        },
        "device": "Firefox, Windows 10",
        "lastUsedAt": "2021-08-01T01:30:01.7528872Z",
        "origin": "http://example.com:3000",
        "publicKey": "pAEDAzkBACBZAQDK7vyAAihWxVR7lT0nlhfzVtcnlTUNRynJvUxbdu0C+R57G51MlSYhJhhv9UTx5qkyiz2nanvDX14cSqbAsCu7DjgXVVxLQT5C0QbrI8ZSdWv00Hkp5HGXpdmTTy5hHzTywaz4QwBJG92u5bwpVRkzH3C3JFI6uLt5QW5XdIG/bTqYozP8f+Gxh33ecyS9Vr4v56E3vl1+/E/dlTU8utCuoFBNjcQzocWX9XzPBMr5YfWuH2BBuiVo75US52GOIT6UQHth58Bq3ja2+E746dcCFJQoi1GN5xYru5jBQtGkBebgnmgz10QI5/a3I8MZSg7NFljccG+6nY++LY92OO6zIUMBAAE=",
        "rpid": "example.com",
        "signatureCounter": 1,
        "userHandle": "ODIzMzI2OTk2",
        "userId": "123",
        "nickname": "Home laptop"
    }
]
```

## Delete credentials for user

Delete a certain credential for a user

```http
POST /credentials/delete HTTP/1.1
ApiSecret: demo:secret:yyy
Content-Type: application/json

{
    "CredentialId":"qgB2ZetBhi0rIcaQK8_HrLQzXXfwKia46_PNjUC2L_w"
}
```

Returns 200 OK

## Others

These API endpoints are secondary and/or internal.

### Delete your account at passwordless.dev

If you want to delete your account and all data stored.

**Please note: This will not delete your data immediately.**
All admin emails connected to the account will receive a warning email with a link to abort the deletion process.
After 24 hours your API keys will be frozen.
After 14 days your data will be permanently deleted.

```http
POST /account/delete HTTP/1.1
ApiSecret: demo:secret:yyy
```

Returns 200 OK

<!-- ### Register - Begin

Internal - This API is used by the Passwordless Client JS library

```http
POST https://v3.passwordless.dev/register/begin HTTP/1.1
ApiKey: demo:public:6b08891222194fd1992465f8668f
Content-Type: application/json

{"token":"P-lP40PXvYzanr5BpaR14A:_UeZDzlAjl-TDLd1MK-OMO4AethFV2flVejX06Z_CyUCaijmRGjOoBVrRX4kkRCY","RPID":"localhost","Origin":"http://localhost:3000"}
```

Response:

```json
{
  "data": {
    "rp": { "id": "localhost", "name": null },
    "user": { "name": "test_user", "id": "dGVzdF91c2Vy", "displayName": null },
    "challenge": "9jouMw-UgSis_lWlKcpn5Q",
    "pubKeyCredParams": [
      { "type": "public-key", "alg": -7 },
      { "type": "public-key", "alg": -257 },
      { "type": "public-key", "alg": -37 },
      { "type": "public-key", "alg": -35 },
      { "type": "public-key", "alg": -258 },
      { "type": "public-key", "alg": -38 },
      { "type": "public-key", "alg": -36 },
      { "type": "public-key", "alg": -259 },
      { "type": "public-key", "alg": -39 },
      { "type": "public-key", "alg": -8 }
    ],
    "timeout": 60000,
    "attestation": "none",
    "authenticatorSelection": {
      "requireResidentKey": false,
      "userVerification": "preferred"
    },
    "excludeCredentials": [],
    "extensions": {
      "exts": true,
      "uvi": true,
      "loc": true,
      "uvm": true,
      "biometricPerfBounds": { "FAR": 3.4028235e38, "FRR": 3.4028235e38 }
    },
    "status": "ok",
    "errorMessage": ""
  },
  "sessionId": "ZbiFQ1QLgVBVa5N2whoHyg:ByTuwQF1rnkYincVeA4P_7pg00NgUxw89gg-C1kPJob_E2-uI6akvd6qfZ4fS1f8pj5n274D7b0RNTj13Ln69YJNy50ZneTSSOY354Ps_gxBLQnS9XNscK3u-lnYDeZ56VFEMnnZBrEmc_TMtLgJHdh6nZpUsTT0HH69NXbl0em4KNCSJVrk92ouZxTJq8YGI5VbfwXu6zfzyBObjxcdhRKd4UBSEWCZT0OV880KWvBtxFaay7E05H4kif20Au_4mHEvzAJs5oo9jPCIHwyrn-a0g9FyR-EapOCu8jmvxd6AHKMV8eOyGtNceYTSxEuyvaG8BhAPPvdC5GidAIGaeVTsf4ol2y-IzrngLnBsEY8JO7ysSCDzHrqQ0p8pdvxhuUKPBpG5AxTm1FULaY9PNKVH2HNhXQ7KDY8OFgCvB1zcB8PqCgi8MPeFKn-jkwkEsvXYJM8Q4SKagBqSn_H6CfHkhd3VkJYGJBqL9wMYLfju5rAaXFOcR6-NjfaPliNdjv57-xg8ffMvTvpNf-mpKwe8kT9HxbGhbkU48A_h7ermMidDHST1XCmlM8AhT8UiDFaGoyy2-LVzXnllQT9uiAiFdehMc26Y5_7jJczZcfSkuw_DP8H_P-0riW6EhHH8VGY7Rb4JHyrXhXE2KFQPv7Gcgf3DsD_WhzIZRZOY-M5tNWSbIwk-uA99D9Bb8zCKkdGLaEwwI93QsLZ7Wl2nRKQnKijhb6vg21PmqXHgIcJfvFWFMBrndPLVU7z67Q2CzLgwUKaTnkvBU7LMCICs9_5BV1SCVTMZlYarvpwA6TriW9Hg2SDiucIGgCAjMqW8Pre_rVpbRqOvqosur3LyHcHjoLsytwMqB8s3PUGoehKmiFlBds3g01CGW5K0-Uck"
}
```

### Register - Complete

Internal - This API is used by the Passwordless Client JS library

```http
POST https://v3.passwordless.dev/register/complete HTTP/1.1
ApiKey: demo:public:6b08891222194fd1992465f8668f
Content-Type: application/json

{
   "response":{
      "id":"M_HGNhr1ELH45hlEpVEE-Uek2YQOC_9_fmAS1yWsfH8",
      "rawId":"M_HGNhr1ELH45hlEpVEE-Uek2YQOC_9_fmAS1yWsfH8",
      "type":"public-key",
      "extensions":{
         
      },
      "response":{
         "AttestationObject":"o2NmbXRkbm9uZWdhdHRTdG10oGhhdXRoRGF0YVkBZ0mWDeWIDoxodDQXD2R2YFuP5K65ooYyx5lc87qDHZdjRQAAAAAAAAAAAAAAAAAAAAAAAAAAACAz8cY2GvUQsfjmGUSlUQT5R6TZhA4L_39-YBLXJax8f6QBAwM5AQAgWQEAxg1pNtQU3wuOg5X9Rbz5ofVlBD0hD2qQojpxx2_fPi89bd21DHyTNA2TDLLtu4czINYf7cbBU07I8_WY-sbDtQwHV38MvzI5dwaoa18F1InzOm5j2q7eYe-irBDB8-92G5FME6_rj11dYyjbx6nK2Tt9M2EkBKXNxyMGrowkW2CLMDVxeOaH8IyqJYWILM1R6eNrOk2TBczTO83zNE6rQN7pkZHPF1zsC5YRnpA32obkZQU-i4-Lubp5kV_64yy5kIIugog3O8CVSn43NNxukYG5r6VqD4C0By0rPqEJBm0F3WepP0I4M1rg7cVKCUK-GMwYR11drhzwnuxWY2MuDSFDAQAB",
         "clientDataJson":"eyJ0eXBlIjoid2ViYXV0aG4uY3JlYXRlIiwiY2hhbGxlbmdlIjoiOWpvdU13LVVnU2lzX2xXbEtjcG41USIsIm9yaWdpbiI6Imh0dHA6Ly9sb2NhbGhvc3Q6MzAwMCIsImNyb3NzT3JpZ2luIjpmYWxzZX0"
      }
   },
   "sessionId":"ZbiFQ1QLgVBVa5N2whoHyg:ByTuwQF1rnkYincVeA4P_7pg00NgUxw89gg-C1kPJob_E2-uI6akvd6qfZ4fS1f8pj5n274D7b0RNTj13Ln69YJNy50ZneTSSOY354Ps_gxBLQnS9XNscK3u-lnYDeZ56VFEMnnZBrEmc_TMtLgJHdh6nZpUsTT0HH69NXbl0em4KNCSJVrk92ouZxTJq8YGI5VbfwXu6zfzyBObjxcdhRKd4UBSEWCZT0OV880KWvBtxFaay7E05H4kif20Au_4mHEvzAJs5oo9jPCIHwyrn-a0g9FyR-EapOCu8jmvxd6AHKMV8eOyGtNceYTSxEuyvaG8BhAPPvdC5GidAIGaeVTsf4ol2y-IzrngLnBsEY8JO7ysSCDzHrqQ0p8pdvxhuUKPBpG5AxTm1FULaY9PNKVH2HNhXQ7KDY8OFgCvB1zcB8PqCgi8MPeFKn-jkwkEsvXYJM8Q4SKagBqSn_H6CfHkhd3VkJYGJBqL9wMYLfju5rAaXFOcR6-NjfaPliNdjv57-xg8ffMvTvpNf-mpKwe8kT9HxbGhbkU48A_h7ermMidDHST1XCmlM8AhT8UiDFaGoyy2-LVzXnllQT9uiAiFdehMc26Y5_7jJczZcfSkuw_DP8H_P-0riW6EhHH8VGY7Rb4JHyrXhXE2KFQPv7Gcgf3DsD_WhzIZRZOY-M5tNWSbIwk-uA99D9Bb8zCKkdGLaEwwI93QsLZ7Wl2nRKQnKijhb6vg21PmqXHgIcJfvFWFMBrndPLVU7z67Q2CzLgwUKaTnkvBU7LMCICs9_5BV1SCVTMZlYarvpwA6TriW9Hg2SDiucIGgCAjMqW8Pre_rVpbRqOvqosur3LyHcHjoLsytwMqB8s3PUGoehKmiFlBds3g01CGW5K0-Uck",
   "RPID":"localhost",
   "Origin":"http://localhost:3000"
}
```

### Sign in - Begin

Internal - This API is used by the Passwordless Client JS library

```http
POST https://v3.passwordless.dev/signin/begin HTTP/1.1
ApiKey: demo:public:6b08891222194fd1992465f8668f
Content-Type: application/json

{"username":"test_user","RPID":"localhost","Origin":"http://localhost:3000"}
```

Response:

```json
{
  "data": {
    "challenge": "Xt8jaU-dj2nCCMznu6G8Hw",
    "timeout": 60000,
    "rpId": "localhost",
    "allowCredentials": [
      {
        "type": "public-key",
        "id": "M_HGNhr1ELH45hlEpVEE-Uek2YQOC_9_fmAS1yWsfH8"
      }
    ],
    "userVerification": "discouraged",
    "extensions": {
      "txAuthSimple": "FIDO",
      "txAuthGenericArg": {
        "contentType": "text/plain",
        "content": "RklETw=="
      },
      "uvi": true,
      "loc": true,
      "uvm": true
    },
    "status": "ok",
    "errorMessage": ""
  },
  "sessionId": "zqlqr8EsuR9QVcDWwTZhHA:_1QW8x_v5E7HnnnBe_2Rd4oBmrG-Ogc-jA6l4P3AZfqxiKq22Dj3fGm7Y_4SrR4eD00PTllNT9DPYsQCanSNpZNx_hfhDGltfxC7VBoSU73yWy55wDj2929St1Jtea3PJN0ZOczlY84Ws_q1ewRd0-zj4fXArpJ6jOiQu-i48yAbdyc18wXJxDxkVXv6w5cAMhHMKQs4c0oaJwR9-0Cr0knCQ9aZan-7gsnMzt05wGmfZ1L5VPcvHMSAxAeAYB8IGgctThluXxMsR0kZpVsPTrV2pOwGp-01VVDU60qOngRs5F4RkrMClUxj2ok3y3lStgMEngUMdRg"
}
```

### Sign in - Complete

Internal - This API is used by the Passwordless Client JS library

```http
POST https://v3.passwordless.dev/signin/complete HTTP/1.1
ApiKey: demo:public:6b08891222194fd1992465f8668f
Content-Type: application/json

{
   "response":{
      "id":"M_HGNhr1ELH45hlEpVEE-Uek2YQOC_9_fmAS1yWsfH8",
      "rawId":"M_HGNhr1ELH45hlEpVEE-Uek2YQOC_9_fmAS1yWsfH8",
      "type":"public-key",
      "extensions":{
         
      },
      "response":{
         "authenticatorData":"SZYN5YgOjGh0NBcPZHZgW4_krrmihjLHmVzzuoMdl2MFAAAAAQ",
         "clientDataJson":"eyJ0eXBlIjoid2ViYXV0aG4uZ2V0IiwiY2hhbGxlbmdlIjoiWHQ4amFVLWRqMm5FSU16bnU2RzhIdyIsIm9yaWdpbiI6Imh0dHA6Ly9sb2NhbGhvc3Q6MzAwMCIsImNyb3NzT3JpZ2luIjpmYWxzZX0",
         "signature":"FWqjYDCZvVYMWctEFmeekaCnRs7kiWJLRMrVcOM02UHO3vT1wkAqn6iusaGQGDXQkwJvGWMgkDeF8BMQHfyRmB_MK4mMxrgAHnBxUbiMsL7Ld01chQZia2_4G8wkU3a0OvaFPduXRE1ahzpmctAJF70jmpv6O3rvlif-CL1kVkeXRLeqA2nwYX2ogfbQMtzYNmcETM4QG5S8JZkczitESOX4R1UVScqC4051zMgfZAElaVVjrb8574bYggPp-vlA18-DUvumTaQKfiQquZVaYCieAw2Trwkt_bxaHCZ1rU8Po2KbiViy2F9TDBJIAV6iDPo951IJ3L5I21k_i2WcbA"
      }
   },
   "sessionId":"zqlqr8EsuR9QVcDWwTZhHA:_1QW8x_v5E7HnnnBe_2Rd4oBmrG-Ogc-jA6l4P3AZfqxiKq22Dj3fGm7Y_4SrR4eD00PTllNT9DPYsQCanSNpZNx_hfhDGltfxC7VBoSU73yWy55wDj2929St1Jtea3PJN0ZOczlY84Ws_q1ewRd0-zj4fXArpJ6jOiQu-i48yAbdyc18wXJxDxkVXv6w5ch0vv9GjPD_HXSf5mTsO2pQKstZuXzPSsvTF72cVPsCJ8ZAfOFpxf28e-qLDyuklfVt4G87uY847AQkNySRdCuaA3KABvzgLTzDwC7tmnfHc90bMYnNsTA2a3XBbil8gtaEneRCURYFH7N-b12qEBihd3-nHkRd6Dkz2H3i_o1VDMtkmpC55jv6Y87xKJk9eexKGbXLnbi4su8RNPeuCrF5AurNsSy5XBaHcrbUfcDhyxxBHEPXGV6uilm4OHCCxqYvvOuH4P2DLAMhHMKQs4c0oaJwR9-0Cr0knCQ9aZan-7gsnMzt05wGmfZ1L5VPcvHMSAxAeAYB8IGgctThluXxMsR0kZpVsPTrV2pOwGp-01VVDU60qOngRs5F4RkrMClUxj2ok3y3lStgMEngUMdRg",
   "RPID":"localhost",
   "Origin":"http://localhost:3000"
}
```

Response:

```json
{
  "data": "zDM3wmUMaXjKole4EUKYbw:kSmJNcfcGiAxsHmEb2VPwBPc9hsMlvGg5HJS4zIjmnKbMvRj4oEIy_Ld9vZHoGW7KoGZAL9zDVGuDAQYcO4eiCIvjcGb2Oq-40svSgWWOVClG9UfXw7UaSlwMkBlG5Op"
}
``` -->
