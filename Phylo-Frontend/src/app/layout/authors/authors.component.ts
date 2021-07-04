import { Component, OnInit } from '@angular/core';
import { namespace } from 'd3-selection';
import * as fg from 'force-graph';
import { CookieService } from 'ngx-cookie-service';
import { AuthorsService } from 'src/app/services/authors_graph/authors.service';

@Component({
  selector: 'app-authors',
  templateUrl: './authors.component.html',
  styleUrls: ['./authors.component.css']
})
export class AuthorsComponent implements OnInit {
  isChecked:boolean = false;
  authors;
  userLoged: boolean;
  constructor(private cookieService: CookieService, private authorsService: AuthorsService) { }

  ngOnInit(): void {
    this.userLoged = false;
    if(this.cookieService.get('loggedUser')){
      this.userLoged = true;
    }
    if(this.userLoged){
      
      this.authorsService.get_authors_data().subscribe(
        res => {
          const graph = fg.default()
          (document.getElementById('graph'))
          .backgroundColor('#101020')
          .linkColor(() => 'rgba(255,255,255,0.2)')
          .nodeLabel('id')
          .nodeVal('value')
          .linkDirectionalParticles(1)
          .nodeRelSize(5)
          .nodeAutoColorBy('user')
          .onNodeDragEnd(node => {
            node.fx = node.x;
            node.fy = node.y;
          })
          .graphData(res);
        });  
    }
    
    
  }

  display_graph(){
    (this.isChecked ? true: false);
    if(!this.isChecked){
      this.authorsService.get_authors_data().subscribe(
        res => {
          const graph = fg.default()
          (document.getElementById('graph'))
          .backgroundColor('#101020')
          .linkColor(() => 'rgba(255,255,255,0.2)')
          .nodeLabel('id')
          .nodeVal('value')
          .linkDirectionalParticles(1)
          .nodeRelSize(5)
          .nodeAutoColorBy('user')
          .onNodeDragEnd(node => {
            node.fx = node.x;
            node.fy = node.y;
          })
          .nodeCanvasObject((node, ctx, globalScale) => {
            const label = node["id"].toString();
            const fontSize = 12/globalScale;
            ctx.font = `${fontSize}px Sans-Serif`;
            const textWidth = ctx.measureText(label).width;
            const bckgDimensions = [textWidth, fontSize].map(n => n + fontSize * 0.2); // some padding
  
            ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
  
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillStyle = "orange";
            ctx.fillText(label, node.x, node.y);
            })
          .graphData(res);
        });
    }else{
      this.authorsService.get_authors_data().subscribe(
        res => {
          const graph = fg.default()  
          (document.getElementById('graph'))
          .backgroundColor('#101020')
          .linkColor(() => 'rgba(255,255,255,0.2)')
          .nodeLabel('id')
          .nodeVal('value')
          .linkDirectionalParticles(1)
          .nodeRelSize(5)
          .nodeAutoColorBy('user')
          .onNodeDragEnd(node => {
            node.fx = node.x;
            node.fy = node.y;
          })
          .graphData(res);
        });
    }
  }
}