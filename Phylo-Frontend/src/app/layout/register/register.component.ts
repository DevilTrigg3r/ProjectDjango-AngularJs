import { Component, OnInit } from '@angular/core';
import { RegisterService } from 'src/app/services/register/register.service';
import { User } from '../../models/user';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  username: string;
  name: string;
  surname: string;
  mail: string;
  password: string;
  password_repeat: string;
  role: string;
  user: User;
  constructor(private registerService: RegisterService) { }

  ngOnInit(): void {
    this.username = "";
    this.name = "";
    this.surname = "";
    this.mail = "";
    this.password = "";
    this.password_repeat = "";
    this.role = "";
  }
  submitForm(val){
    console.warn(val);
    if(val.password == val.password_repeat){
      this.registerService.add_user(val).subscribe(data => console.log(data));
    }
  }

}
