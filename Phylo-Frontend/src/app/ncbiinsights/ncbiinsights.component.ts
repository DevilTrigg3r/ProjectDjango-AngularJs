import { Component, OnInit } from '@angular/core';
import { DatabaseService } from 'src/app/services/database/database.service';

@Component({
  selector: 'app-ncbiinsights',
  templateUrl: './ncbiinsights.component.html',
  styleUrls: ['./ncbiinsights.component.css']
})
export class NcbiinsightsComponent implements OnInit {
  Insights: any = [];
  videos = [
    {
      video: 'GQigLJ6iV4Y'
    }/* ,
    {
      video: 'ZAtP0x9eb0A'
    },
    {
      video: 'QIZ8QH6JcC8'
    } */

    

  ]
  constructor(private service: DatabaseService) { }
  
  ngOnInit(): void {
    this.refreshNcbiInsights()

    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    document.body.appendChild(tag);

  }
  refreshNcbiInsights() {
    this.service.getWebscrapping().subscribe(res => {
      this.Insights = res;


    });
  }
}
