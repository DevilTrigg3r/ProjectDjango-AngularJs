import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from 'src/app/models/user';
import { HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {
  private URI: string; //contains the url of the api
  
  constructor(private http: HttpClient) { 
    this.URI = "http://127.0.0.1:8000/api/register/";
  }
  add_user(val): Observable<User> {
    let user = {
      user_id: 0,
      password: val.password,
      username: val.username,
      email: val.mail,
      name: val.name,
      surname: val.surname,
      role: "admin"
    }
    return this.http.post<any>(this.URI, user);
  }
}
