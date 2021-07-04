import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Ortholog } from '../../models/ortholog';
import { Specie } from 'src/app/models/specie';
@Injectable({
  providedIn: 'root'
})
export class OrthologsService {
  URI_orthologs: string;
  URI_species: string;
  constructor(private http: HttpClient) { 
    this.URI_orthologs = "http://127.0.0.1:8000/api/specie_orthologs/"
    this.URI_species = "http://127.0.0.1:8000/api/species/"
  }
  get_species(login_token){
    let token = "Token "+login_token;
    let httpHeaders = new HttpHeaders({
      "Authorization": token 
    });
    return this.http.get<Specie[]>(this.URI_species, {headers: httpHeaders});
  }



  get_specie_orthologs(acc_number, login_token){
    let token = "Token "+login_token;
    
    let httpHeaders = new HttpHeaders({
      "Authorization": token 
    });

    let url = this.URI_orthologs+acc_number;
    console.log(url);
    return this.http.get<any>(url, {headers: httpHeaders});
  }
}
