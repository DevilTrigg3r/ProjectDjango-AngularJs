import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import * as jQuery from 'jquery';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  userLoged:boolean;
  classApplied = false;
  constructor(private cookieService: CookieService) { }  
  ngOnInit(): void {
    
    this.checkLogged();
  }
  checkLogged(){
    this.userLoged = false;
    if(this.cookieService.get('loggedUser')){
      this.userLoged = true;
    }
  }
  toggleClass(){
    this.classApplied = !this.classApplied;
  }

}
