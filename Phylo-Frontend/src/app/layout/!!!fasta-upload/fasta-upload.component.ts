import { Component, OnInit } from '@angular/core';

//import cookie service
import { CookieService } from 'ngx-cookie-service';

// Import GOG shared services
import { GogSharedService } from '../../services/gog/gog-shared/gog-shared.service';



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
  constructor(private gogSharedService: GogSharedService, private cookieService : CookieService) {
    
   }

  ngOnInit(): void {
    this.randInt = randomInt(0, 9999999999);
  }

  submitForm(form){
    let expire = new Date();
    var time = Date.now() +  ((3600 * 1000) * 8);
    expire.setTime(time);
    this.randIntStr = this.randInt.toString();
    createCookie(this.cookieService, `gog-download-${this.randIntStr}`, this.randInt, expire);
    this.gogSharedService.createUpdateMarkerEvent(["checkDownloads", this.randInt]);
    console.log(this.fastaFile);
  }
  onFileSelected(event): void {
    console.log(event.target.files.length);
    if (event.target.files.length == 1) {
      this.fastaFile = event.target.files[0].name;
      this.fastaFileExtension = this.fastaFile.split(".").pop();//capture extension of uploaded file
      this.fastaFileExtension == "fasta" ? this.isFasta = true : this.isFasta = false;// verify if the file is .fasta
    }
  }

}
function randomInt(min, max) { // min and max included 
  return Math.floor(Math.random() * (max - min + 1) + min);
}
function createCookie(cookieService: CookieService, name:string, value: number, expireDate){
    cookieService.set(name,JSON.stringify(value), expireDate);
}