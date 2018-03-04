import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Injectable } from '@angular/core';

/*
  Generated class for the FavouriteServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class FavouriteService {

  apiUrl = 'http://media.mw.metropolia.fi/wbma';

  constructor(public http: HttpClient) {
    console.log('Hello FavouriteServiceProvider Provider');
  }

  getFavById(postID: string) {
    return this.http.get(this.apiUrl + '/favourites/file/' + postID);
  }

  postFav(file_id) {
    const settings = {
      headers: new HttpHeaders().set('x-access-token', localStorage.getItem('token'))
    };

    return this.http.post(this.apiUrl + '/favourites', file_id, settings);
  }
}
