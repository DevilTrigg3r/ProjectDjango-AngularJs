import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SeqAlignmentService {
  private URI: string;
  constructor(private http: HttpClient) { 
    this.URI = "http://127.0.0.1:8000/api/seq_alignment/";
  }
  get_species(user_id, login_token){

    let url = this.URI+user_id;

    let token = "Token "+login_token;

    let httpHeaders = new HttpHeaders({
      "Authorization": token 
    });
    
    return this.http.get<any>(url, {headers: httpHeaders});

  }

}
