import { Component, OnInit } from '@angular/core';
import { BackendConnectService } from 'src/app/services/PhyloTrees/backend-connect.service';
@Component({
  selector: 'app-phylogenetic-trees',
  templateUrl: './phylogenetic-trees.component.html',
  styleUrls: ['./phylogenetic-trees.component.css']
})

export class PhylogeneticTreesComponent implements OnInit {

  //Variables
  ShowGenBank: Boolean
  GenbankArray: any = []
  FillDIv: string
  FillDIvN: string
  //Filter and pagination
  SpeciesList: any = [];
  currentPage: number = 1;
  taxonfilter = '';

  //Data to send to Back End
  acc_number = '';
  specie = '';
  gene = '';
  sequence = '';

  constructor(private service: BackendConnectService) { }

  ngOnInit(): void {
    this.refreshSpecList();
    this.GotGenbanks();
  }

  refreshSpecList() {
    this.service.getSpecList().subscribe(data => {
      this.SpeciesList = data;
    })
  }

  UploadSequenceToBackEnd(data) {
    console.warn(data)
    this.service.sendSequenceToBackEnd(data["acc_number"], data["gene"], data["sequence"]).subscribe(
      res => console.log(res)
    )
  }

  // Cuando el usuario cliclea el <div>, el popup se abre
  mostrarMensaje() {
    var popup = document.getElementById("myPopup");
    popup.classList.toggle("show");
  }

  GotGenbanks() {
    this.service.getGenBanksFromBackEnd().subscribe(
      res => {
        console.log(res)
        this.GenbankArray = res;
        console.log(this.GenbankArray)  
      }
    )
  }

  onSelect(specie_id, scientific_name) {
    this.ShowGenBank = true;
    console.log(specie_id);
    console.log(scientific_name);
    this.FillDIvN = scientific_name;
    this.FillDIv = specie_id;
  }
}




