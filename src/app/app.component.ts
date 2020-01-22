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
    if (payload.event == 'customOAuthState') {
      console.log("*** Custom OAuth state: " + payload.data);
    }
  }

  handleLogin(event: Event) {
    // need to use @ts-ignore in order to workaround bug: https://github.com/aws-amplify/amplify-js/issues/4155
    
    // @ts-ignore
    Auth.federatedSignIn({ provider: 'CirrusIdPGateway', customState: 'foo'});
  }
}
