// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  identityProvider: 'CirrusIdPGateway',
  amplifyAuthCfg: {
    Auth: {
      oauth: {
        domain: 'uarizona-cirrus-idp-test.auth.us-west-2.amazoncognito.com',
        scope: ['phone', 'email', 'profile', 'openid', 'aws.cognito.signin.user.admin'],
        redirectSignIn: 'http://localhost:4200/',
        redirectSignOut: 'http://localhost:4200/',
        responseType: 'code' // or token
      },
      region: 'us-west-2',
      userPoolId: 'us-west-2_ZsVDSkI5z',
      userPoolWebClientId: '6a1ellbm5tkkcpjspn0kjjitk1'
    }
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
