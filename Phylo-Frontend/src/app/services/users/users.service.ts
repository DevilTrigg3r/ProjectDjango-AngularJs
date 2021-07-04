import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private URI: string;
  constructor(private http: HttpClient) { 
    this.URI = "http://127.0.0.1:8000/api/users";
  }
  getAll(admin_token){
    let token = "Token "+admin_token;
    let httpHeaders = new HttpHeaders({
      "Authorization": token 
    });

    return this.http.get<any>(this.URI, {headers: httpHeaders});
  }
  updateUserById(){

  }
  removeUserById(user_id, admin_token){
    var url = this.URI+"/"+user_id;
    console.log("url: ",url);
    
    let token = "Token "+admin_token;
    console.log("token: ", token);
    let httpHeaders = new HttpHeaders({
      "Authorization": token 
    });
    return this.http.delete<any>(url, {headers: httpHeaders});
  }

}
