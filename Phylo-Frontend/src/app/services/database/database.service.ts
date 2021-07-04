import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  readonly APIUrl = "http://127.0.0.1:8000";

  constructor(private http: HttpClient) { }

  getSpecList(): Observable<any[]> {
    return this.http.get<any[]>(this.APIUrl + '/api/species/', {
      headers: new HttpHeaders({
        'Authorization': "Token c88054cd5296ed19cb2d1a5b84c262b831012447"
      })
    });
  }
  getWebscrapping() {
    var hasdf = this.http.get<any[]>(this.APIUrl + '/api/webscraping', {
      headers: new HttpHeaders({
        'Authorization': "Token c88054cd5296ed19cb2d1a5b84c262b831012447"
      })
    });
    
    return hasdf
  }
}
