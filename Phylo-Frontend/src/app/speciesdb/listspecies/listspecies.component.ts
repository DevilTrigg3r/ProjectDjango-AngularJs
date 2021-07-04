import { Component, OnInit } from '@angular/core';
import { DatabaseService } from 'src/app/services/database/database.service';

@Component({
  selector: 'app-listspecies',
  templateUrl: './listspecies.component.html',
  styleUrls: ['./listspecies.component.css']
})
export class ListspeciesComponent implements OnInit {

  constructor(private service:DatabaseService) { }
  SpeciesList:any=[];
  page: number = 1;
  filterspecies = '';
  filtertaxon = '';
  filtercolloquial = '';
  ngOnInit(): void {
    this.refreshSpecList();
  }

  refreshSpecList(){
    this.service.getSpecList().subscribe(data=>{
      this.SpeciesList=data;

    })
  }

}
