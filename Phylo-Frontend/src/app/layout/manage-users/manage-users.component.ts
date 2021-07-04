import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { User } from 'src/app/models/user';
import { UsersService } from 'src/app/services/users/users.service';

@Component({
  selector: 'app-manage-users',
  templateUrl: './manage-users.component.html',
  styleUrls: ['./manage-users.component.css']
})
export class ManageUsersComponent implements OnInit {
  users: User[];
  user_list: User[];
  
  //login
  userLoged: boolean;
  userId: number;
  userToken: string;
  userName: string;
  userSurname: string;
  userRole: string;

  constructor(private cookieService: CookieService, private userService: UsersService) { }

  ngOnInit(): void {
    this.checkLogged();

    if(this.userLoged && this.userRole == "admin"){
      var admin_token = this.userRole = JSON.parse(JSON.parse(this.cookieService.get('loggedUser')))[0]["key"];
      this.userService.getAll(admin_token).subscribe(
        res => {
          this.users = res;
          console.log("users: ",this.users);
          Object.assign(this.user_list, this.users);
        }
      );
    }
  }
  delete(val) {
    console.log(val);
    var admin_token = this.userRole = JSON.parse(JSON.parse(this.cookieService.get('loggedUser')))[0]["key"];
    this.userService.removeUserById(val, admin_token).subscribe(
      res => console.log("res: ",res)
    );
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
