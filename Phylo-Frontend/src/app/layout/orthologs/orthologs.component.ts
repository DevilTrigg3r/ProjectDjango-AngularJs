import { Component, OnInit, ɵgetDebugNode__POST_R3__ } from '@angular/core';
import { filter } from 'd3-array';
import { CookieService } from 'ngx-cookie-service';
import { Specie } from 'src/app/models/specie';
import { OrthologsService } from 'src/app/services/othologs/orthologs.service';
import { Ortholog } from '../../models/ortholog';

@Component({
  selector: 'app-orthologs',
  templateUrl: './orthologs.component.html',
  styleUrls: ['./orthologs.component.css']
})
export class OrthologsComponent implements OnInit {
  
  species: Specie[] = [];
  species_list: Specie[] = [];
  orthologs: Ortholog[] = [];
  orthologs_list: Ortholog[] = [];
  orthologs_list_d3;
  chosen_specie: string = "";
  dict_keys = [];

  //status
  status: string = "Select a specie to view its orthologs";

  //variables to plot
  //plot data
  productSales: any[];
  speciesScore: any[];
  speciesDistance: any[];
  speciesSeqLength: any[];
  //plot features
  view: any[];
  schemeType: string; //'ordinal' or 'linear'
  gradient: boolean;
  xAxis: boolean;
  yAxis: boolean;
  legendTitle: string; //title of the legend
  legendPosition: string; //['right', 'below']
  legend: boolean; 
  showXAxisLabel: boolean;
  showYAxisLabel: boolean;
  xAxisLabel: string;
  yAxisLabel1: string;
  yAxisLabel2: string;
  yAxisLabel3: string;
  animations: boolean; //animations onload
  showGridLines: boolean; //grtid lines
  showDataLabel: boolean; //numbers on bars
  barPadding: number;
  tooltipDisabled: boolean;
  roundEdges: boolean;

  //Pagination
  totalLength: number;
  page:number = 1;
  itemsPerPage: number = 10;

  //filters
  orthologName: string = "";
  orthologsFiltered: Ortholog[] = [];

  //login
  userLoged: boolean;
  userId: number;
  userToken: string;
  userName: string;
  userSurname: string;
  userRole: string;
  constructor(private cookieService: CookieService, private orthService: OrthologsService) { }

  ngOnInit(): void {
    this.checkLogged();
    if(this.userLoged){
      let user_token = JSON.parse(this.cookieService.get('loggedUser'));
      var cookie_value = JSON.parse(user_token)[0];
      user_token = cookie_value["key"];
      this.orthService.get_species(user_token).subscribe(
        res => {
          console.log(res);
          this.species = res;
          Object.assign(this.species_list, this.species);
        },
        err => console.log(err)
      );
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
  onOptionsSelected(value){
    this.checkLogged();
    this.species.forEach(specie => {
      if(specie['taxon_id'] == value){
        this.chosen_specie = specie['colloquial_name']+" - "+specie['scientific_name']
      }
    });

    if(this.userLoged){
      let cookie = JSON.parse(this.cookieService.get('loggedUser'));
      let cookie_value = JSON.parse(cookie)[0];
      let user_token = cookie_value["key"];
      this.orthService.get_specie_orthologs(value, user_token).subscribe(
        res => {this.orthologs = res;
          Object.assign(this.orthologs_list, this.orthologs);
          (res.length > 0 ? this.status="":this.status="No orthologs found")
          this.plots();
        },
        err => console.log(err)
      );
    }
    
  }
  plots(){
    this.speciesDistance = this.modifiedDict(this.orthologs, ["species", "distance"]);
    this.speciesScore = this.modifiedDict(this.orthologs, ["species", "score"]);
    this.speciesSeqLength = this.modifiedDict(this.orthologs, ["species", "sequence_length"]);
    this.view = [screen.width -50, 700];
    this.schemeType = 'ordinal';
    this.gradient = false;
    this.xAxis = true;
    this.yAxis = true;
    this.legendTitle = 'Species Name';
    this.legendPosition = 'below';
    this.legend = true;
    this.showXAxisLabel = true;
    this.showYAxisLabel = true;
    this.xAxisLabel = 'Scientific name';
    this.yAxisLabel1 = 'Distance';
    this.yAxisLabel2 = 'Score';
    this.yAxisLabel3 = 'Sequence Length';
    this.animations = true;
    this.showGridLines = true;
    this.showDataLabel = true;
    this.barPadding = 0.1;
    this.tooltipDisabled = false;
    this.roundEdges = false;
 }

 modifiedDict(data: any[], keys: string[]){
  var new_data: any[] = [];
  data.forEach(element => {
    var new_item: {} = {}
    for (const [key, value] of Object.entries(element)) {
      if(key == keys[0]){
        new_item["name"] = value;
      }
      if(key == keys[1]){
        new_item["value"] = value;
      }
    }
    new_data.push(new_item);
  });
  return new_data;
 }
}
 