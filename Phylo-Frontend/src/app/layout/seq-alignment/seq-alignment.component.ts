import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Directive, HostListener } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { SeqAlignmentService } from 'src/app/services/seq-alignment/seq-alignment.service';

@Component({
  selector: 'app-seq-alignment',
  templateUrl: './seq-alignment.component.html',
  styleUrls: ['./seq-alignment.component.css']
})

export class SeqAlignmentComponent implements OnInit {

  @ViewChild('canvas', { static: true }) 
  canvas: ElementRef<HTMLCanvasElement>;
  ctx;
  rects;
  canvasWidth;
  showCanvas: boolean;
  //login
  userLoged: boolean;
  userId: number;
  userToken: string;
  userName: string;
  userSurname: string;
  userRole: string;
  constructor(private cookieService: CookieService, private seqService: SeqAlignmentService) { }

  ngOnInit(): void {
    this.showCanvas = false;
    this.canvasWidth = 500;
    this.checkLogged();
    if(this.userLoged){
      this.seqService.get_species(0, this.userToken).subscribe(
        res => {
          console.log(res)
          console.log(this.userId);
          this.seqService.get_species(this.userId, this.userToken).subscribe(
            r => { console.log(r)
              if(res.lrngth > 0 && r.length > 0){
              
              }
              var array = [
                {scientific_name: "Homo sapiens", sequence: "TTGTGGGAACTAATGATGAGCAAGATTCTCGAGGCACGCAGAGGCTTGTGGGAACTAATGATGAGCAAGATTCTCGAGGCACGCAGAGGCTTGTGGGAACTAATGATGAGCAAGATTCTCGAGGCACGCAGAGGCTTGTGGGAACTAATGATGAGCAAGATTCTCGAGGCACGCAGAGGCTTGTGGGAACTAATGATGAGCAAGATTCTCGAGGCACGCAGAGGCTTGTGGGAACTAATGATGAGCAAGATTCTCGAGGCACGCAGAGGC"},
                {scientific_name:"Canis lupus familiaris", sequence: "ATGTTCCTGCTGTCGCGTCTCTCAGCAAGAGCACATGTTCCTGCTGTCGCGTCTCTCAGCAAGAGCACATGTTCCTGCTGTCGCGTCTCTCAGCAAGAGCACATGTTCCTGCTGTCGCGTCTCTCAGCAAGAGCACATGTTCCTGCTGTCGCGTCTCTCAGCAAGAGCACATGTTCCTGCTGTCGCGTCTCTCAGCAAGAGCACATGTTCCTGCTGTCGCGTCTCTCAGCAAGAGCACATGTTCCTGCTGTCGCGTCTCTCAGCAAGAGCAC"},
                {scientific_name:"Octopus sp", sequence:"CTTGATAATTACTTGGAAAAAAGCGAGAGATTTGCGGAGTCAAAGATTAATATTCAAAGCTTGATAATTACTTGGAAAAAAGCGAGAGATTTGCGGAGTCAAAGATTAATATTCAAAGCTTGATAATTACTTGGAAAAAAGCGAGAGATTTGCGGAGTCAAAGATTAATATTCAAAGCTTGATAATTACTTGGAAAAAAGCGAGAGATTTGCGGAGTCAAAGATTAATATTCAAAG"},
                {scientific_name:"Octopus sp", sequence: "ATGGTGAAATTGCTTGATAATTACTTGGAAAAAAGCGAGAGATTTGCGGAGTCAAAGATTAATATTCCATGGTGAAATTGCTTGATAATTACTTGGAAAAAAGCGAGAGATTTGCGGAGTCAAAGATTAATATTCCATGGTGAAATTGCTTGATAATTACTTGGAAAAAAGCGAGAGATTTGCGGAGTCAAAGATTAATATTCCATGGTGAAATTGCTTGATAATTACTTGGAAAAAAGCGAGAGATTTGCGGAGTCAAAGATTAATATTCCATGGTGAAATTGCTTGATAATTACTTGGAAAAAAGCGAGAGATTTGCGGAGTCAAAGATTAATATTCCATGGTGAAATTGCTTGATAATTACTTGGAAAAAAGCGAGAGATTTGCGGAGTCAAAGATTAATATTCCATGGTGAAATTGCTTGATAATTACTTGGAAAAAAGCGAGAGATTTGCGGAGTCAAAGATTAATATTCCATGGTGAAATTGCTTGATAATTACTTGGAAAAAAGCGAGAGATTTGCGGAGTCAAAGATTAATATTCCATGGTGAAATTGCTTGATAATTACTTGGAAAAAAGCGAGAGATTTGCGGAGTCAAAGATTAATATTCCATGGTGAAATTGCTTGATAATTACTTGGAAAAAAGCGAGAGATTTGCGGAGTCAAAGATTAATATTCCATGGTGAAATTGCTTGATAATTACTTGGAAAAAAGCGAGAGATTTGCGGAGTCAAAGATTAATATTCCATGGTGAAATTGCTTGATAATTACTTGGAAAAAAGCGAGAGATTTGCGGAGTCAAAGATTAATATTCCATGGTGAAATTGCTTGATAATTACTTGGAAAAAAGCGAGAGATTTGCGGAGTCAAAGATTAATATTCCATGGTGAAATTGCTTGATAATTACTTGGAAAAAAGCGAGAGATTTGCGGAGTCAAAGATTAATATTCCATGGTGAAATTGCTTGATAATTACTTGGAAAAAAGCGAGAGATTTGCGGAGTCAAAGATTAATATTCC"}
                ];
            // check if context exist
            // list of rectangles to render
            this.rects = this.dict_list_format(array);
            // get context
            this.ctx = this.canvas.nativeElement.getContext('2d');
            this.ctx.nativeElement?.addEventListener('click', function(e) {
              console.log('click: ' + e.offsetX + '/' + e.offsetY);
              var rect = this.collides(this.rects, e.offsetX, e.offsetY);
              if (rect) {
                  console.log('collision: ' + rect.x + '/' + rect.y);
              } else {
                  console.log('no collision');
              }
          }, false);
          
          
            if (this.ctx) {
                for (var i = 0, len = this.rects.length; i < len; i++) {
                  if(this.rects[i]["color"]){
                    this.ctx.fillStyle=this.rects[i]["color"];
                  } else{
                    this.ctx.fillStyle="lightgray"
                  }
                  this.ctx.fillRect(this.rects[i].x, this.rects[i].y, this.rects[i].w, this.rects[i].h);
                  this.ctx.fillStyle="black";
                  this.ctx.font = 'bold 10px Arial';
                  this.ctx.fillText(this.rects[i].val, this.rects[i].x+6, this.rects[i].y+14);
                }
            }

            }
          );
        }
      );
      } 
      
    }
    


checkLogged(){
  this.userLoged = false;
  if(this.cookieService.get('loggedUser')){
    let cookie_value = JSON.parse(this.cookieService.get('loggedUser'));
    let cookie_value_json = JSON.parse(cookie_value)
    this.userLoged = true;
    this.userId = cookie_value_json["id"];
    this.userToken = cookie_value_json["key"];
    this.userName = cookie_value_json["name"];
    this.userSurname = cookie_value_json["surname"];
    this.userRole = cookie_value_json["role"];
  }
}



  collides(rects, x, y) {
    var isCollision = false;
    for (var i = 0, len = rects.length; i < len; i++) {
        var left = rects[i].x, right = rects[i].x+rects[i].w;
        var top = rects[i].y, bottom = rects[i].y+rects[i].h;
        if (right >= x
            && left <= x
            && bottom >= y
            && top <= y) {
            isCollision = rects[i];
        }
    }
    return isCollision;
}




dict_list_format(dict_list){
  let w = 20
  let h = 20
  let x = 0
  let y = 0
  let new_dict = []
  let color = "gray"
  for (let i = 0; i < dict_list.length; i++) {
      x = 0
      y = 20*i
      new_dict.push({x: x, y:y, h:h, w:200, val:dict_list[i]["scientific_name"], color: "lightgray"})
      x = 200
        for (let j = 1; j < dict_list[i]["sequence"].length; j++) {
          
          if(j%50 == 0){
            x = 0
            y += 20*(dict_list.length+1)
            new_dict.push({x: x, y:y, h:h, w:200, val:dict_list[i]["scientific_name"], color: "lightgray"})
            x = 200
          }
          let letter = dict_list[i]["sequence"][j].toUpperCase();
          switch (letter) {
            case "A":
              color = "orange";
              break;
            case "T":
              color = "green";
              break;
            case "C":
              color = "blue";
              break;
            case "G":
              color = "red";
              break;
            default:
              color = "purple"
              break;
          }
          new_dict.push({x: x, y:y, h:h, w:w, val:letter, color: color})
          x+=21
        }
    y = 0
  }
  return new_dict
  }







  canvasClick(e){
    console.log('click: ' + e.offsetX + '/' + e.offsetY);
    var rect = this.collides(this.rects, e.offsetX, e.offsetY);
    if (rect) {
        console.log('collision: ' + rect["x"] + '/' + rect["y"]);
    } else {
        console.log('no collision');
    }
  }
}
