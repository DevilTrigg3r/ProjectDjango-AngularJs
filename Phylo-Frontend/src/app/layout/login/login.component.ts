import { Component, OnInit, ɵCREATE_ATTRIBUTE_DECORATOR__POST_R3__ } from '@angular/core';
import { User } from 'src/app/models/user';
import { LoginService } from 'src/app/services/login/login.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';
import { Login } from 'src/app/models/login';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  users: User[] = [];
  usersFiltered: User[] = [];
  password: string;
  username: string;
  loginForm: FormGroup;
  userLoged: boolean;
  constructor(private cookieService: CookieService, private formBuilder: FormBuilder, private loginService: LoginService) { }

  ngOnInit(): void {
    this.userLoged = false;
    if(this.cookieService.get('loggedUser')){
      this.userLoged = true;
    }
    this.password = "";
    this.username = "";
    this.loginForm = this.formBuilder.group({
      username: [''],
      password: ['']
    });
  }
  submitForm(val){
    console.log("username: ",val.username);
    console.log("passwd: ",val.password);
    this.loginForm.get('username').setValue(val.username);
    this.loginForm.get('password').setValue(val.password);
    console.log(this.loginForm);
    this.loginService.login(this.loginForm).subscribe(
      res => {
        this.loginService.get_user_token(res).subscribe(
          r => {
            console.log(r);
            this.cookieService.set( 'loggedUser', JSON.stringify(r), {expires: 1/24/2, sameSite: 'Lax'}); //login lasts 15 mins
            window.location.reload();
          }
        );
      });
   }
}