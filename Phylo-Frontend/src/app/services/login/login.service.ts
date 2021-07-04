import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { User } from '../../models/user';
import { Observable } from 'rxjs';
import { Login } from 'src/app/models/login';
@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private URI_token: string; //contains the url of the api
  private URI_user: string; //contains the url of the api
  users: User[];
  constructor(private http: HttpClient) {
    this.URI_token = "http://127.0.0.1:8000/api/token_auth"; //api url for users
    this.URI_user = "http://127.0.0.1:8000/api/user_token/"; //api url for users
   }
  /**
  * function to get a token
  */
  login(loginForm){
    const formData = new FormData();
    console.log("login form: ", loginForm)
    formData.append('username', loginForm.get('username').value);
    formData.append('password', loginForm.get('password').value);
    return this.http.post<any>(this.URI_token, formData);
  }
  get_user_token(token){
    let url = this.URI_user+token;
    return this.http.get<Login>(url);
  }
}
