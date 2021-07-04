import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GogCommonService {

  // API Base URL
  readonly APIUrl = "http://192.168.1.137:8000/api";
  
  constructor() { }
}
