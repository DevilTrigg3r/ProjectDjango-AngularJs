import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthorsService {
  URI: string;
  constructor(private http: HttpClient) {
    this.URI = "http://127.0.0.1:8000/api/get_blast_authors/Homo sapiens/HBB";
   }
   get_authors_data(){
    return this.http.get<any>(this.URI);
   }
}
