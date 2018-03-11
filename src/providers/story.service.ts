import {HttpClient, HttpErrorResponse, HttpHeaders} from "@angular/common/http";
import {Injectable} from "@angular/core";
import "rxjs/add/operator/map";
import {Story} from "../model/story";
import {Observable} from "rxjs/Observable";


@Injectable()
export class StoryService {
  apiUrl = 'http://media.mw.metropolia.fi/wbma';
  mediaUrl = 'http://media.mw.metropolia.fi/wbma/uploads/';

  constructor(public http: HttpClient) {
  }

  upload(formData) {
    const settings = {
      headers: new HttpHeaders().set('x-access-token', localStorage.getItem('token'))
    };

    return this.http.post(this.apiUrl + '/media', formData, settings);
  }

  getSinglePost(id: number): Observable<Story>{
    return this.http.get<Story>(this.apiUrl + '/media/' + id);
  }

  getPostByCurUser(): Observable<Story[]>{
    const settings = {
      headers: new HttpHeaders().set('x-access-token', localStorage.getItem('token'))
    };
    return this.http.get<Story[]>(this.apiUrl + '/media/user/', settings);
  }

  getPostByUserId(user_id): Observable<Story[]>{
    const settings = {
      headers: new HttpHeaders().set('x-access-token', localStorage.getItem('token'))
    };
    return this.http.get<Story[]>(this.apiUrl + '/media/user/' + user_id, settings);
  }

  putPostInfo(file_id, postInfo){
    const settings = {
      headers: new HttpHeaders().set('x-access-token', localStorage.getItem('token'))
    };
    return this.http.put(this.apiUrl + '/media/' + file_id, postInfo, settings);
  }

  deletePost(file_id){
    const settings = {
      headers: new HttpHeaders().set('x-access-token', localStorage.getItem('token'))
    };
    return this.http.delete(this.apiUrl + '/media/' + file_id, settings);
  }

}
