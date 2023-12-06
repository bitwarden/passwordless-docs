# React

## How to

First of all, create your react application as described [here](https://create-react-app.dev/).

Once you've generated your React app, we want to install our client library:

```bash
npm install @passwordlessdev/passwordless-client
```

Our login page could contain something like:

```javascript
import { useContext, useRef, useState } from 'react';
import authContext from '../context/AuthProvider';
import * as Passwordless from '@passwordlessdev/passwordless-client';
import YourBackendClient from '../services/YourBackendClient';
import { PASSWORDLESS_API_KEY, PASSWORDLESS_API_URL } from '../configuration/PasswordlessOptions';

export default function LoginPage() {
  const errRef = useRef();
  const [errMsg, setErrMsg] = useState('');
  const [success, setSuccess] = useState(false);
  const { setAuth } = useContext(authContext);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // In case of self-hosting PASSWORDLESS_API_URL will be different than https://v4.passwordless.dev
    const passwordless = new Passwordless.Client({
      apiUrl: PASSWORDLESS_API_URL,
      apiKey: PASSWORDLESS_API_KEY
    });
    const yourBackendClient = new YourBackendClient();

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
  };

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
          <p ref={errRef} className={errMsg ? 'errmsg' : 'offscreen'} aria-live="assertive">
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
import { useEffect, useRef, useState } from 'react';
import * as Passwordless from '@passwordlessdev/passwordless-client';
import { PASSWORDLESS_API_KEY, PASSWORDLESS_API_URL } from '../configuration/PasswordlessOptions';
import { ToastContainer, toast } from 'react-toastify';
import YourBackendClient from '../services/YourBackendClient';

export default function RegisterPage() {
  const userRef = useRef();
  const firstNameRef = useRef();
  const lastNameRef = useRef();
  const aliasRef = useRef();
  const errRef = useRef();
  const [user, setUser] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [alias, setAlias] = useState('');
  const [errMsg, setErrMsg] = useState('');

  useEffect(() => {
    userRef.current.focus();
  }, []);

  useEffect(() => {
    setErrMsg('');
  }, [user]);

  const handleSubmit = async (e) => {
    let registerToken = null;
    try {
      const yourBackendClient = new YourBackendClient();

      // In our application we could for example store extra fields like firstName and lastName as well aside from username and the alias for our token.
      registerToken = await yourBackendClient.register(user, firstName, lastName, alias);
    } catch (error) {
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
        <p ref={errRef} className={errMsg ? 'errmsg' : 'offscreen'} aria-live="assertive">
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

Suppose you have multiple components that need access to authentication-related data, such as whether a user is logged in or not. Instead of passing this data as props through the component hierarchy, you can use this `AuthContext` to provide the authentication state and update function to any component that needs it. This reduces the need for prop drilling and makes the code cleaner and more maintainable.

```javascript
import { createContext, useState } from 'react';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({});
  return <AuthContext.Provider value={{ auth, setAuth }}>{children}</AuthContext.Provider>;
};

export default AuthContext;
```

For example, you can use the `useContext` hook in child components to access the auth state and setAuth function provided by the AuthContext.Provider.

```javascript
import { useContext } from 'react';
import AuthContext from '../context/AuthProvider';

const useAuth = () => {
  return useContext(AuthContext);
};

export default useAuth;
```

Our `index.jsx`: `AuthProvider` will wrap your entire application, making authentication state available to all components that consume it.

```javascript
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App';
import { AuthProvider } from './context/AuthProvider';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </AuthProvider>
  </React.StrictMode>
);
```

We will need to be able to decode the JWT token, and read what roles the user has assigned.

```javascript
import { useLocation, Navigate, Outlet } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import jwtDecode from 'jwt-decode';

function hasMatchingRole(allowedRoles, userRoles) {
  if (!allowedRoles || allowedRoles.length === 0) {
    return true;
  }

  for (let i = 0; i < allowedRoles.length; i++) {
    if (userRoles.indexOf(allowedRoles[i]) !== -1) {
      return true;
    }
  }

  return false;
}

const RequireAuth = ({ allowedRoles }) => {
  const { auth } = useAuth();
  const location = useLocation();

  let isAllowed = true;

  if (allowedRoles) {
    if (auth?.verifiedToken?.jwt) {
      const decodedToken = jwtDecode(auth.verifiedToken.jwt);
      isAllowed = hasMatchingRole(allowedRoles, decodedToken.role);
    } else {
      isAllowed = false;
    }
  }

  // Do you want to redirect to a specific page or show an error message?
  return isAllowed ? (
    <Outlet />
  ) : auth?.verifiedToken ? (
    <Navigate to="/unauthorized" state={{ from: location }} replace />
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );
};

export default RequireAuth;
```

In our `app.jsx` or wherever your routing is, you can define your routes as follows whether you require specific roles for to access a certain route.

```javascript
import React, { Component } from 'react';
import { Route, Routes } from 'react-router-dom';
import UserPage from './pages/UserPage';
import AdminPage from './pages/AdminPage';
import PublicPage from './pages/PublicPage';
import Layout from './components/Layout';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import RequireAuth from './components/RequireAuth';
import { ROLE_ADMIN, ROLE_USER } from './constants/Roles';
import UnauthorizedPage from './pages/UnauthorizedPage';
import 'react-toastify/dist/ReactToastify.css';

class App extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Layout>
        <Routes>
          <Route exact path="/" element={<PublicPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="unauthorized" element={<UnauthorizedPage />} />

          <Route element={<RequireAuth allowedRoles={[ROLE_USER]} />}>
            <Route path="/user" element={<UserPage />} />
          </Route>

          <Route element={<RequireAuth allowedRoles={[ROLE_ADMIN]} />}>
            <Route path="/admin" element={<AdminPage />} />
          </Route>
        </Routes>
      </Layout>
    );
  }
}

export default App;
```

## References

- [Sample app](https://github.com/passwordless/passwordless-react-example)
