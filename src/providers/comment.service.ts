import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Comment} from "../model/comment";
import {Observable} from "rxjs/Observable";

/*
  Generated class for the CommentServiceProvider provider.
  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class CommentService {

  apiUrl = 'http://media.mw.metropolia.fi/wbma';

  constructor(public http: HttpClient) {
  }

  getCommentByPostId(postID): Observable<Comment[]> {
    return this.http.get<Comment[]>(this.apiUrl + '/comments/file/' + postID);
  }

  postComment(comment) {
    const settings = {
      headers: new HttpHeaders().set('x-access-token', localStorage.getItem('token'))
    };

    return this.http.post(this.apiUrl + '/comments', comment, settings);
  }


}
