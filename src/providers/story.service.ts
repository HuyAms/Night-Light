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

  getSinglePost(id: String){
    return this.http.get(this.apiUrl + '/media/' + id).subscribe(response => {
      console.log(response);
    }, (error: HttpErrorResponse) => {
      console.log(error.error.message);
    });
  }

  getAllPost(): Observable<Story[]>{
    return this.http.get<Story[]>(this.apiUrl + '/tags/nightlight');
  }

  postTag(postTag) {
    const settings = {
      headers: new HttpHeaders().set('x-access-token', localStorage.getItem('token'))
    };

    return this.http.post(this.apiUrl + '/tags', postTag, settings);
  }

  getPostByUserId(user_id){
    const settings = {
      headers: new HttpHeaders().set('x-access-token', localStorage.getItem('token'))
    };
    return this.http.get<Story[]>(this.apiUrl + '/media/user/' + user_id, settings);
  }


}
