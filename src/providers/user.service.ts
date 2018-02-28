import {HttpClient, HttpHeaders} from "@angular/common/http";

export class UserService {

  apiUrl = 'http://media.mw.metropolia.fi/wbma';

  constructor(public http: HttpClient) {
  }


  getUserData() {
    const settings = {
      headers: new HttpHeaders().set('x-access-token', localStorage.getItem('token'))
    };
    return this.http.get(this.apiUrl + '/users/user', settings);
  }

}
