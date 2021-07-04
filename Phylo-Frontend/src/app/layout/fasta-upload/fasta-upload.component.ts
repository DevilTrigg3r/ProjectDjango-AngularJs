import { Component, OnInit } from '@angular/core';

//import cookie service
import { CookieService } from 'ngx-cookie-service';
import { FastaUploadService } from 'src/app/services/fasta-upload.service';



@Component({
  selector: 'app-fasta-upload',
  templateUrl: './fasta-upload.component.html',
  styleUrls: ['./fasta-upload.component.css']
})
export class FastaUploadComponent implements OnInit {
  randInt: number;
  randIntStr: string;
  fastaFile: string;
  fastaFileExtension: string;
  isFasta: boolean;
  fileContent: string = '';

  //login
  userLoged: boolean;
  userId: number;
  userToken: string;
  userName: string;
  userSurname: string;
  userRole: string;
  constructor(private fastaService: FastaUploadService, private cookieService : CookieService) {
    
   }

  ngOnInit(): void {
    this.checkLogged();
    this.isFasta;
    this.randInt = this.randomInt(0, 9999999999);
  }

  submitForm(form){
    if(this.userLoged){
      let expire = new Date();
      let time = Date.now() +  ((3600 * 1000) * 8);
      expire.setTime(time);
      this.randIntStr = this.randInt.toString();
      this.createCookie(this.cookieService, "gog-download-" + this.randIntStr, this.randInt, expire);
      this.fastaService.blast(this.fileContent, this.userId, this.userToken, this.randInt);
    }
    
  }
  onFileSelected(event): void {
    if(this.userLoged){
      if (event.target.files.length == 1) {
        this.fastaFile = event.target.files[0].name;
        this.fastaFileExtension = this.fastaFile.split(".").pop();//capture extension of uploaded file
        this.fastaFileExtension == "fasta" ? this.isFasta = true : this.isFasta = false;// verify if the file is .fasta
        let file = event.target.files[0];
        let fileReader = new FileReader();
        fileReader.onload = (e) => {
          this.fileContent = fileReader.result.toString();
          console.log("hola");
          console.log(this.fileContent);  
        }
        fileReader.readAsText(file);
        }
    }
    
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

  randomInt(min, max) { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  createCookie(cookieService: CookieService, name:string, value: number, expireDate){
    cookieService.set(name,JSON.stringify(value), expireDate);
  }

}