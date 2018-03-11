import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Injectable } from '@angular/core';
import {Story} from "../model/story";
import {Observable} from "rxjs/Observable";

/*
  Generated class for the TagProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class TagService {
  apiUrl = 'http://media.mw.metropolia.fi/wbma';

  constructor(public http: HttpClient) {
    console.log('Hello TagProvider Provider');
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

  getTag(file_id) {
    return this.http.get(this.apiUrl + '/tags/file/' + file_id);
  }

}
