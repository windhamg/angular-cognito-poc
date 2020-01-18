import { Component } from '@angular/core';
// Amplify Configuration
import { Hub } from '@aws-amplify/core';
import Auth from '@aws-amplify/auth';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'angular-cognito-m2';

  constructor() {
    Hub.listen('auth', (data) => {
        const { payload } = data;
        this.onAuthEvent(payload);           
    });
  }

  private onAuthEvent(payload) {
    console.log('A new auth event has happened: ', payload.data.username + ' has ' + payload.event);
    if (payload.event === 'signIn') {
      Auth.currentSession()
      .then(data => console.log(data))
    }
  }

  handleLogin(event: Event) {
    const config = Auth.configure(null);
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
}
