import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FastaUploadService {
  private URI: string;
  constructor(private http: HttpClient) { 
    this.URI = "http://127.0.0.1:8000/api/blast/";
  }

  blast(seq, user_id, login_token, rand_int){

    let token = "Token "+login_token;

    let httpHeaders = new HttpHeaders({
      "Authorization": token 
    });

    let httpBody = {
      "sequence": seq,
      "user_id": user_id
    }

    var url = this.URI+rand_int;

    return this.http.post<any>(url, httpBody, {headers: httpHeaders});
  }
}