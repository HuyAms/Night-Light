import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Injectable } from '@angular/core';

/*
  Generated class for the AuthService provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class AuthService {

  apiUrl = 'http://media.mw.metropolia.fi/wbma';

  constructor(public http: HttpClient) {
  }

  login(user) {
    const settings = {
      headers: new HttpHeaders().set('Content-Type', 'application/json'),
    };
    return this.http.post(this.apiUrl + '/login', user, settings);
  }

  register(user) {
    return this.http.post(this.apiUrl + '/users', user);
  }

}
