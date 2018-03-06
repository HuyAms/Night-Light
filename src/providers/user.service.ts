import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {User} from "../model/user";
import {Observable} from "rxjs/Observable";

@Injectable()
export class UserService {

  apiUrl = 'http://media.mw.metropolia.fi/wbma';

  constructor(public http: HttpClient) {
  }


  getCurrentUserData(): Observable<User>{
    const settings = {
      headers: new HttpHeaders().set('x-access-token', localStorage.getItem('token'))
    };
    return this.http.get<User>(this.apiUrl + '/users/user', settings);
  }

  editUserData(userInfo) {
    console.log(userInfo);
    const settings = {
      headers: new HttpHeaders().set('x-access-token', localStorage.getItem('token'))
    };
    return this.http.put(this.apiUrl + '/users', userInfo ,settings)
  }

  getUserDataById(user_id): Observable<User>{
    const settings = {
      headers: new HttpHeaders().set('x-access-token', localStorage.getItem('token'))
    };
    return this.http.get<User>(this.apiUrl + '/users/' + user_id, settings);
  }

}
