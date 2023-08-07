# Frontend Framework Examples

You can use Passwordless.dev with any frontend framework by implementing calls to the Passwordless.dev API, but this document will provide some code examples, guidelines, and other help integrating Passwordless.dev with popular frameworks.

## Vue 3 <Badge text="example" type="warning"/>

Coming Soon.

## React 17 <Badge text="example" type="warning"/> <Badge text="demo" type="tip"/>

First of all, create your react application as described [here](https://create-react-app.dev/).

Once you've generated your React app, we want to install our client library:

```bash
npm install @passwordlessdev/passwordless-client
```

Our login page could contain something like:

```javascript
import {useContext, useRef, useState} from "react";
import authContext from "../context/AuthProvider";
import * as Passwordless from "@passwordlessdev/passwordless-client";
import YourBackendClient from "../services/YourBackendClient";
import {PASSWORDLESS_API_KEY, PASSWORDLESS_API_URL} from "../configuration/PasswordlessOptions";

export default function LoginPage() {
    const errRef = useRef();
    const [errMsg, setErrMsg] = useState("");
    const [success, setSuccess] = useState(false);
    const { setAuth }  = useContext(authContext);

    const handleSubmit = async (e) => {
        e.preventDefault();

        // In case of self-hosting PASSWORDLESS_API_URL will be different than https://v4.passwordless.dev
        const passwordless = new Passwordless.Client({
            apiUrl: PASSWORDLESS_API_URL,
            apiKey: PASSWORDLESS_API_KEY
        });
        const yourBackendClient = new YourBackendClient()
        
        // First we obtain our token
        const token = await passwordless.signinWithDiscoverable();
        if (!token) {
            return;
        }

        // Then you verify on your backend the validity of the token.
        const verifiedToken = await yourBackendClient.signIn(token.token);

        // Your backend could return a JWT token for example if your token is deemed to be valid.
        localStorage.setItem('jwt', verifiedToken.jwt);

        // We are good to proceed.
        setAuth({ verifiedToken });
        setSuccess(true);
    }

    return (
        <>
            {success ? (
                <section>
                    <h1>You are logged in!</h1>
                    <br />
                    <p>{/* <a href="#">Go to Home</a> */}</p>
                </section>
            ) : (
                <section>
                    <p
                        ref={errRef}
                        className={errMsg ? "errmsg" : "offscreen"}
                        aria-live="assertive"
                    >
                        {errMsg}
                    </p>
                    <h1>Sign In</h1>
                    <button onClick={handleSubmit}>Sign In</button>
                    <p>
                        Need an Account?
                        <br />
                        <span className="line">
              <a href="#">Sign Up</a>
            </span>
                    </p>
                </section>
            )}
        </>
    );
}
```

Our registration page could look like this.

```javascript
import {useEffect, useRef, useState} from "react";
import * as Passwordless from "@passwordlessdev/passwordless-client";
import {PASSWORDLESS_API_KEY, PASSWORDLESS_API_URL} from "../configuration/PasswordlessOptions";
import { ToastContainer, toast } from 'react-toastify';
import YourBackendClient from "../services/YourBackendClient";

export default function RegisterPage() {
    const userRef = useRef();
    const firstNameRef = useRef();
    const lastNameRef = useRef();
    const aliasRef = useRef();
    const errRef = useRef();
    const [user, setUser] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [alias, setAlias] = useState("");
    const [errMsg, setErrMsg] = useState("");

    useEffect(() => {
        userRef.current.focus();
    }, []);


    useEffect(() => {
        setErrMsg("");
    }, [user]);

    const handleSubmit = async (e) => {
        let registerToken = null;
        try {
            const yourBackendClient = new YourBackendClient();

            // In our application we could for example store extra fields like firstName and lastName as well aside from username and the alias for our token.
            registerToken = await yourBackendClient.register(user, firstName, lastName, alias);
        }
        catch (error)
        {
            toast(error.message, {
                className: 'toast-error'
            });
        }

        // If an error previously happened, 'registerToken' will be null, so you don't want to register a token with your authenticator.
        if (registerToken) {
            const p = new Passwordless.Client({
                apiKey: PASSWORDLESS_API_KEY,
                apiUrl: PASSWORDLESS_API_URL
            });
            const finalResponse = await p.register(registerToken.token, alias);

            if (finalResponse) {
                toast(`Registered '${alias}'!`);
            }
        }
    };

    return (
        <>
            <section>
                <p
                    ref={errRef}
                    className={errMsg ? "errmsg" : "offscreen"}
                    aria-live="assertive"
                >
                    {errMsg}
                </p>
                <h1>Register</h1>
                <label htmlFor="username">Username:</label>
                <input
                    type="text"
                    id="username"
                    ref={userRef}
                    autoComplete="off"
                    onChange={(e) => setUser(e.target.value)}
                    value={user}
                    required
                    aria-describedby="uidnote"
                />
                <label htmlFor="firstname">FirstName:</label>
                <input
                    type="text"
                    id="firstName"
                    ref={firstNameRef}
                    autoComplete="off"
                    onChange={(e) => setFirstName(e.target.value)}
                    value={firstName}
                    required
                    aria-describedby="uidnote"
                />
                <label htmlFor="lastname">LastName:</label>
                <input
                    type="text"
                    id="lastname"
                    ref={lastNameRef}
                    autoComplete="off"
                    onChange={(e) => setLastName(e.target.value)}
                    value={lastName}
                    required
                    aria-describedby="uidnote"
                />
                <label htmlFor="alias">Alias:</label>
                <input
                    type="text"
                    id="alias"
                    ref={aliasRef}
                    autoComplete="off"
                    onChange={(e) => setAlias(e.target.value)}
                    value={alias}
                    required
                    aria-describedby="uidnote"
                />
                <button onClick={handleSubmit}>Register</button>
                <p>Already registered?</p>
                <ToastContainer />
            </section>
        </>
    );
}
```

The `AuthContext` and `AuthProvider` will manage our authenticated state.

```javascript
import { createContext, useState } from "react";

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState({});
    return (
        <AuthContext.Provider value={{ auth, setAuth }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
```

Our `useAuth` React hook:

```javascript
import { useContext } from "react";
import AuthContext from "../context/AuthProvider";

const useAuth = () => {
    return useContext(AuthContext);
}

export default useAuth;
```