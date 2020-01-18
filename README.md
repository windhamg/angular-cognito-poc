# Angular/Cognito/Amplify Proof-of-Concept for Degree Search Application

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 8.3.23.


## Notes from Gary

Here's what I did to install/configure AWS Amplify under this vanilla Angular project:

 1. Ran `npm install aws-amplify aws-amplify-angular @types/node`.
 2. Added `"types":["node"]` to `compiler` section in `tsconfig.app.json`.
 3. Add the following to `polyfills.ts`:
    ```
    window as any).global = window;
    (window as any).process = {
    env: { DEBUG: undefined },
    };
    ```
 4. Added `amplifyAuthCfg` and `identityProvider` members to `environments/environment.ts`. The settings there point to a Cognito User Pool, in the `ua-uits-innovation-nonprod` AWS account, which is configured to use the Cirrus IdP Proxy as the Identity Provider.

### Code Modifications

#### `main.ts`

This is where we initialize the Amplify Auth configuration. This should be done in the main entry point of the application (hence we do it in `main.ts`).
```
// Amplify Configuration
import Auth from '@aws-amplify/auth';

Auth.configure(environment.amplifyAuthCfg);
```

#### `app/app.component.ts`

First we import our necessary libraries and config:
```
// Amplify Configuration
import { Hub } from '@aws-amplify/core';
import Auth from '@aws-amplify/auth';
import { environment } from '../environments/environment';
```

Next, we set-up an event listener (via Amplify's [Hub](https://aws-amplify.github.io/docs/js/hub#authentication-events)), within the controller's `constructor()` function:

```
constructor() {
    Hub.listen('auth', (data) => {
        const { payload } = data;
        this.onAuthEvent(payload);           
    });
}
```

We then provide a callback function, which is called by Hub when it receives any [authentication event](https://aws-amplify.github.io/docs/js/hub#authentication-events). If it is a `signIn` event, we retrieve the `currentSession` object from Amplify and dump it to the JS console. This object will include an `idToken`, which contains the raw, base64-encoded `jwtToken` as well as the parsed contents of the jwtToken (`payload`).

```
private onAuthEvent(payload) {
    console.log('A new auth event has happened: ', payload.data.username + ' has ' + payload.event);
    if (payload.event === 'signIn') {
      Auth.currentSession()
      .then(data => console.log(data))
    }
}
```

Finally, we provide a function for initiating the Cognito sign-in flow. We will call this function from an `onClick` event in the HTML:

```
handleLogin(event: Event) {
    // get current Auth config
    const config = Auth.configure(null);
    // retrieve pieces we need to build url
    const {
        domain,
        redirectSignIn,
        redirectSignOut,
        responseType } = <any>config.oauth;
    const clientId = config.userPoolWebClientId;
    // The url of the Cognito Hosted UI
    const url = 'https://' + domain + '/oauth2/authorize?redirect_uri=' + redirectSignIn + '&response_type=' + responseType + '&client_id=' + clientId + '&identity_provider=' + environment.identityProvider;
    // Launch hosted UI
    window.location.assign(url);
}
```

#### `app.component.html`

For this PoC we simply create a button on the toolbar and configure it to call the `handleLogin` function defined in our controller:

```
  <button (click)="handleLogin($event)" type="button">Login</button>
```

That's it! You will be able to see the output from the auth event (the `currentSession` object by opening up Chrome Developer Tools (or equivalent) and watching the console output).

Relevant Links:

 1. [AWS Amplify Docs for Authentication](https://aws-amplify.github.io/docs/js/authentication)
 2. [Amplify Auth class API reference](https://aws-amplify.github.io/amplify-js/api/classes/authclass.html)

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
