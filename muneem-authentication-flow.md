# Muneem -- Authentication Flow Documentation

## 1. Overview

This document describes the authentication flow implemented in Muneem,
based on the supplied Next.js server actions and authentication helper.

The current implementation includes:

-   User registration
-   User login
-   Access-token and refresh-token cookie creation
-   Current-user verification
-   Logout

The diagrams and descriptions below reflect the code provided. Features
not shown in that code are explicitly identified as not established or
not implemented.

## 2. Overall Authentication Flow

``` mermaid
flowchart TD
    A([User opens Muneem]) --> B{Access token cookie exists?}

    B -- No --> C[Login or Register page]
    B -- Yes --> D[getCurrentUser]

    D --> E[Read accessToken cookie]
    E --> F{Token exists?}
    F -- No --> C
    F -- Yes --> G[verifyAccessToken]
    G --> H{Token valid?}
    H -- No --> C
    H -- Yes --> I[findUser using payload.email]

    I --> J{User exists and ID matches payload.sub?}
    J -- No --> C
    J -- Yes --> K([Return current user])

    C --> L{User action}
    L -- Register --> M[RegisterUser]
    L -- Login --> N[LoginUser]

    M --> O[Validate name, email and password]
    O --> P[Normalize email]
    P --> Q[findUser checks existing email]
    Q --> R{Email already exists?}
    R -- Yes --> S[Return email already exists]
    R -- No --> T[bcrypt.hash password]
    T --> U[Prisma creates User]
    U --> V[(PostgreSQL User table)]
    V --> W[Redirect to /login]

    N --> X[Validate email and password]
    X --> Y[Normalize email]
    Y --> Z[findUser searches by email]
    Z --> AA{User found?}
    AA -- No --> AB[Return invalid credentials]
    AA -- Yes --> AC[bcrypt.compare password]
    AC --> AD{Password matches?}
    AD -- No --> AB
    AD -- Yes --> AE[Generate access token]
    AE --> AF[Generate refresh token]
    AF --> AG[Set HTTP-only cookies]
    AG --> AH[Redirect to /dashboard]

    K --> AI[User uses application]
    AI --> AJ[User clicks Logout]
    AJ --> AK[logoutAction]
    AK --> AL[Delete accessToken cookie]
    AL --> AM[Delete refreshToken cookie]
    AM --> AN[Redirect to /login]
```

**Important:** The initial access-token check in this overview
represents the application deciding whether to call `getCurrentUser()`.
The supplied code does not show a complete middleware or
route-protection implementation.

## 3. Registration Flow

### Sequence

1.  The user submits their name, email and password.
2.  `RegisterUser()` receives the form data.
3.  The server checks that all three values are strings and are not
    empty.
4.  The email is trimmed and converted to lowercase.
5.  `findUser()` checks whether a user with that email already exists.
6.  If the email exists, the action returns `Email already exists.`
7.  Otherwise, `bcrypt.hash(password, 10)` generates a password hash.
8.  Prisma creates the user record in PostgreSQL.
9.  The user is redirected to `/login`.

### Registration diagram

``` mermaid
flowchart TD
    A([Register page]) --> B[Enter name, email and password]
    B --> C[Submit form]
    C --> D[RegisterUser server action]
    D --> E{All fields valid and non-empty?}
    E -- No --> F[Return validation error]
    E -- Yes --> G[Normalize email]
    G --> H[findUser]
    H --> I{Email already exists?}
    I -- Yes --> J[Return email already exists]
    I -- No --> K[Hash password with bcrypt]
    K --> L[Prisma User.create]
    L --> M[(PostgreSQL: User)]
    M --> N[redirect /login]
    N --> O([Login page])
```

### Database operations

  Operation   Purpose
  ----------- -----------------------------------------------
  SELECT      Check whether the email is already registered
  INSERT      Create the new user record

The original password is not stored. The bcrypt hash is stored in the
`User.password` field.

## 4. Login Flow

### Sequence

1.  The user submits their email and password.
2.  `LoginUser()` receives the form data.
3.  The server validates that both values are present.
4.  The email is trimmed and converted to lowercase.
5.  `findUser()` retrieves the user by email.
6.  If no user is found, the action returns `Invalid email or password.`
7.  `bcrypt.compare()` compares the submitted password with the stored
    password hash.
8.  If the password does not match, the same invalid-credentials message
    is returned.
9.  If the password matches, the server generates an access token and a
    refresh token.
10. Both tokens are stored in HTTP-only cookies.
11. The user is redirected to `/dashboard`.

### Login diagram

``` mermaid
flowchart TD
    A([Login page]) --> B[Enter email and password]
    B --> C[Submit form]
    C --> D[LoginUser server action]
    D --> E{Email and password present?}
    E -- No --> F[Return validation error]
    E -- Yes --> G[Normalize email]
    G --> H[findUser]
    H --> I{User found?}
    I -- No --> J[Return invalid credentials]
    I -- Yes --> K[bcrypt.compare]
    K --> L{Password matches?}
    L -- No --> J
    L -- Yes --> M[Generate access token]
    M --> N[Generate refresh token]
    N --> O[Set accessToken cookie]
    O --> P[Set refreshToken cookie]
    P --> Q[redirect /dashboard]
    Q --> R([Dashboard])
```

### Cookie configuration

  Cookie           HTTP-only   SameSite   Path   Max age
  ---------------- ----------- ---------- ------ ------------
  `accessToken`    Yes         Lax        `/`    15 minutes
  `refreshToken`   Yes         Lax        `/`    7 days

The `secure` option is enabled when `NODE_ENV` is `production`.

### Database operations

  Operation   Purpose
  ----------- ---------------------------------------
  SELECT      Retrieve the user by normalized email

Password verification takes place in application code using bcrypt; it
is not a database operation.

## 5. Get Current User Flow

The `getCurrentUser()` helper identifies the currently authenticated
user for server-side application operations.

### Sequence

1.  The function reads the request cookies using `cookies()`.
2.  It retrieves the `accessToken` cookie.
3.  If the cookie does not exist, it returns `null`.
4.  `verifyAccessToken()` verifies the token.
5.  If verification fails, the function returns `null`.
6.  The function looks up the user using the email in the verified token
    payload.
7.  If the user does not exist, it returns `null`.
8.  It compares the database user ID with the token's `sub` claim.
9.  If the IDs do not match, it returns `null`.
10. Otherwise, it returns the user's `id`, `name` and `email`.

### Current-user diagram

``` mermaid
flowchart TD
    A([Server-side operation needs current user]) --> B[getCurrentUser]
    B --> C[Read cookies]
    C --> D[Get accessToken]
    D --> E{Token exists?}
    E -- No --> F[Return null]
    E -- Yes --> G[verifyAccessToken]
    G --> H{Token valid?}
    H -- No --> F
    H -- Yes --> I[Read email and sub from payload]
    I --> J[findUser using payload.email]
    J --> K{User exists?}
    K -- No --> F
    K -- Yes --> L{String user.id equals payload.sub?}
    L -- No --> F
    L -- Yes --> M[Return id, name and email]
    M --> N([Authenticated user])
```

### Database operation

The `findUser()` service performs a user lookup by email. The exact SQL
depends on the implementation of that service.

The helper returns only:

``` typescript
{
    id: user.id,
    name: user.name,
    email: user.email
}
```

It does not return the password hash.

**Important:** `getCurrentUser()` returns `null` when authentication
cannot be established. A protected page or server action must check this
result and reject or redirect unauthenticated users. Defining this
helper alone does not automatically protect every route.

## 6. Logout Flow

### Sequence

1.  The user clicks the logout control.
2.  `logoutAction()` executes.
3.  The action obtains the cookie store.
4.  It deletes the `accessToken` cookie.
5.  It deletes the `refreshToken` cookie.
6.  The user is redirected to `/login`.

### Logout diagram

``` mermaid
flowchart TD
    A([User clicks Logout]) --> B[logoutAction]
    B --> C[Read cookie store]
    C --> D[Delete accessToken]
    D --> E[Delete refreshToken]
    E --> F[redirect /login]
    F --> G([Login page])
```

### Database operations

No database operation is performed by the supplied logout action.

The action removes the browser cookies. It does not revoke a previously
issued JWT on the server.

## 7. Authentication Component Architecture

The following diagram shows how the supplied functions and services
interact.

``` mermaid
flowchart TD
    A[Next.js application UI] --> B[RegisterUser]
    A --> C[LoginUser]
    A --> D[getCurrentUser]
    A --> E[logoutAction]

    B --> F[findUser]
    C --> F
    D --> F

    B --> G[bcrypt.hash]
    C --> H[bcrypt.compare]

    C --> I[generateAccessToken]
    C --> J[generateRefreshToken]
    D --> K[verifyAccessToken]

    C --> L[Set cookies]
    D --> M[Read cookies]
    E --> N[Delete cookies]

    F --> O[Prisma Client]
    O --> P[(PostgreSQL)]
```

## 8. Implementation Status

This table reflects only the code supplied for review.

  Feature                                      Status based on supplied code
  -------------------------------------------- ----------------------------------
  User registration                            Implemented
  Required-field validation                    Implemented
  Email normalization                          Implemented
  Duplicate-email lookup                       Implemented
  Password hashing                             Implemented
  User creation with Prisma                    Implemented
  Login validation                             Implemented
  User lookup during login                     Implemented
  Password verification                        Implemented
  Access-token generation                      Implemented
  Refresh-token generation                     Implemented
  HTTP-only cookie creation                    Implemented
  Current-user token verification              Implemented
  Database user and token subject comparison   Implemented
  Logout cookie deletion                       Implemented
  Refresh-token validation and renewal         Not shown
  Server-side token revocation                 Not shown
  Enforcement of protected routes              Not established by supplied code

## 9. Security and Design Notes

1.  **Database uniqueness:** The `User.email` unique constraint is the
    final protection against duplicate emails, including concurrent
    registration attempts. The application-level lookup alone cannot
    prevent a race condition.
2.  **JWT verification:** `verifyAccessToken()` should verify the
    signature, expiration and expected algorithm.
3.  **Refresh-token handling:** A refresh token is generated and stored,
    but the supplied code does not show a refresh endpoint or server
    action that validates it and issues a new access token.
4.  **Logout behavior:** Deleting cookies removes the browser's stored
    tokens, but does not invalidate a copied JWT. The access token can
    remain valid until expiration unless server-side revocation is
    implemented.
5.  **Route protection:** Protected pages and server actions must
    explicitly verify the current user. A client-side redirect alone is
    not an authorization boundary.
6.  **User ownership:** When creating or reading user-specific data,
    derive `userId` from the authenticated server-side user rather than
    trusting an ID sent by the browser.

## 10. Summary

Muneem's supplied authentication implementation follows this sequence:

-   Registration creates a user after validation and password hashing.
-   Login verifies credentials and issues access and refresh tokens.
-   `getCurrentUser()` validates the access token and confirms the user
    against PostgreSQL.
-   Logout deletes both authentication cookies.

The database is used to store and retrieve user information. JWTs carry
authentication claims, while HTTP-only cookies store the issued tokens
in the browser.

**Documentation accuracy:** This document describes the supplied
implementation. It does not claim that refresh-token renewal, token
revocation or complete protected-route enforcement has been implemented.
