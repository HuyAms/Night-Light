import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Injectable } from '@angular/core';
import {Observable} from "rxjs/Observable";
import {Favourite} from "../model/Favourite";

@Injectable()
export class FavouriteService {

  apiUrl = 'http://media.mw.metropolia.fi/wbma';

  constructor(public http: HttpClient) {
  }

  getFavById(file_id): Observable<Favourite[]>{
    return this.http.get<Favourite[]>(this.apiUrl + '/favourites/file/' + file_id);
  }

  postFav(file_id) {
    const settings = {
      headers: new HttpHeaders().set('x-access-token', localStorage.getItem('token'))
    };
    const body = {'file_id': +file_id};
    return this.http.post(this.apiUrl + '/favourites', body, settings);
  }

  deleteFav(file_id) {
    const settings = {
      headers: new HttpHeaders().set('x-access-token', localStorage.getItem('token'))
    };

    return this.http.delete(this.apiUrl + '/favourites/file/' + file_id, settings);
  }
}
