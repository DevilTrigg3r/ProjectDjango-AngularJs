import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import * as jQuery from 'jquery';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  //login
  userLoged: boolean;
  userId: number;
  userToken: string;
  userName: string;
  userSurname: string;
  userRole: string;
  constructor(private cookieService: CookieService) { }

  ngOnInit(): void {
    this.checkLogged();
  }

  logout(){
    this.cookieService.delete('loggedUser');
    window.location.reload();
  }

  checkLogged(){
    this.userLoged = false;
    if(this.cookieService.get('loggedUser')){
      let cookie_value = JSON.parse(this.cookieService.get('loggedUser'));
      let cookie_value_json = JSON.parse(cookie_value)[0]
      this.userLoged = true;
      this.userId = cookie_value_json["id"];
      this.userToken = cookie_value_json["key"];
      this.userName = cookie_value_json["name"];
      this.userSurname = cookie_value_json["surname"];
      this.userRole = cookie_value_json["role"];
    }
  }
  
}
