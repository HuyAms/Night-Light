import {HttpClient} from '@angular/common/http';
import { Injectable } from '@angular/core';

/*
  Generated class for the FavouriteServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class FavouriteServiceProvider {

  constructor(public http: HttpClient) {
    console.log('Hello FavouriteServiceProvider Provider');
  }

  apiUrl = 'http://media.mw.metropolia.fi/wbma';

  getPostFavourite(postID: string) {
    return this.http.get(this.apiUrl + '/favourites/file/' + postID);
  }

}
