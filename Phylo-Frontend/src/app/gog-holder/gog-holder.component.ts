/**
 * @file Component that holds all the logic for the displaying and managing all the GOG components
 * @author Gerard Garcia
 * @version 1.0
 * @date 21/05/2021
*/
import { Component, OnInit } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { ChangeDetectorRef } from '@angular/core';

// Services
import { MarkersService } from '../services/gog/markers/markers.service';
import { GogSharedService } from '../services/gog/gog-shared/gog-shared.service';

// Models
import { Marker } from '../models/marker';

@Component({
  selector: 'app-gog-holder',
  templateUrl: './gog-holder.component.html',
  styleUrls: ['./gog-holder.component.css']
})
export class GogHolderComponent implements OnInit {

  // List of markers
  markersList: Marker[] = [];

  // Markers observable status
  markerQueryStatus: boolean = false;

  // Error flag
  markerQueryError: boolean = false;

  // Species array
  targetSpecieReady: boolean = false;
  defaultSpeciesReady: boolean = false;
  species: Array<any> = [];

  // Session status
  sessionStatus: boolean = false;

  // User id
  userId: number;
  targetSpecieId: number = 1;

  // Session
  session: any = null;

  // Event holder that triggers when a marker CRUD operation is done
  notifications: Subscription;

  constructor(private markersService: MarkersService, private gogSharedService: GogSharedService, private cdr: ChangeDetectorRef) {
    this.notifications = this.gogSharedService.getCreateUpdateEvent().subscribe(data => {
      switch (data[0]) {
        case "error":
          this.sessionStatus = false;
          this.markerQueryError = true;
          cdr.detectChanges();
          break;
        case 'crud':
          this.initUpdateListWorker(data);
          break;
      }
    });
   }

  /**
  * ngOnInit interface method
  * @author Gerard Garcia
  * @version 1.0
  * @date 21/05/2021
  * @memberof GogHolderComponent
  */
  ngOnInit(): void {
    this.hardcodeSession();
    this.verifyUserSession();
    if(localStorage.getItem("loged_user") != null) {
      this.session = JSON.parse(localStorage.getItem("loged_user"));
      this.userId = this.session.user_id;
      this.cGetTargetSpecie(this.targetSpecieId);
      this.cGetDefaultSpecies();
    } else {
      this.markerQueryError = true;
    }
  }

  /**
  * Verifies if the session user_id and token key are ok
  * @author Gerard Garcia
  * @version 1.0
  * @date 21/05/2021
  * @memberof GogHolderComponent
  */
  verifyUserSession() {
    if(localStorage.getItem("loged_user") != null) {
      let session = JSON.parse(localStorage.getItem("loged_user"));
      if(!isNaN(session.user_id) && session.key) {
        this.sessionStatus = true;
      }
    }
  }

  /**
  * Prepares the species objects with status flags and then perfoms the markers queries
  * @author Gerard Garcia
  * @version 1.0
  * @date 21/05/2021
  * @memberof GogHolderComponent
  */
  cPrepareQueryMarkers() {
    if(this.targetSpecieReady && this.defaultSpeciesReady) {
      for (let index = 0; index < this.species.length; index++) {
        this.species[index].finished =  false;
        this.species[index].empty =  false;
        this.species[index].error =  false;
      }
      
      for (let index = 0; index < this.species.length; index++) {
        this.cGetMarkersList(this.species[index].specie_id, this.userId, index);
      }
    }
  }

  /**
  * Get the target specie
  * @author Gerard Garcia
  * @version 1.0
  * @date 21/05/2021
  * @param {number} specie_id
  * @memberof GogHolderComponent
  */
  cGetTargetSpecie(specie_id) {
    let authHeader: HttpHeaders = this.markersService.authHeader;
    authHeader = authHeader.set("Authorization", "Token " + this.session.key);

    this.markersService.getTargetSpecie(specie_id, authHeader).subscribe(data => {
      this.species = this.species.concat(data);
      this.targetSpecieReady = true;
      this.cPrepareQueryMarkers();
    },
    error => {
      this.markerQueryError = true;
    })
  }

  /**
  * Get the default species
  * @author Gerard Garcia
  * @version 1.0
  * @date 21/05/2021
  * @memberof GogHolderComponent
  */
  cGetDefaultSpecies() {
    this.markersService.getDefaultSpecies().subscribe(data => {
      this.species = this.species.concat(data);
      this.defaultSpeciesReady = true;
      this.cPrepareQueryMarkers();
    },
    error => {
      this.markerQueryError = true;
    })
  }

  /**
  * Get markers of a specificu specie and user
  * @author Gerard Garcia
  * @version 1.0
  * @date 21/05/2021
  * @param {number} specie_id
  * @param {number} user_id
  * @param {number} localArrayIndex
  * @memberof GogHolderComponent
  */
  cGetMarkersList(specie_id: number, user_id: number, localArrayIndex: number) {
    let authHeader: HttpHeaders = this.markersService.authHeader;
    authHeader = authHeader.set("Authorization", "Token " + this.session.key);

    this.markersService.getMarkersList(specie_id, user_id, authHeader).subscribe(data => {
      this.markersList = this.markersList.concat(data);
      if(data.length != 0) {
        this.species[localArrayIndex].empty = false;
      } else {
        this.species[localArrayIndex].empty = true;
      }
      this.species[localArrayIndex].finished = true;
    },
    error => {
      this.species[localArrayIndex].finished = true;
      this.species[localArrayIndex].empty = true;
      this.species[localArrayIndex].error = true;
      this.markerQueryError = true;
    },
    () => {
      this.markerQueryStatus = true;
    })
  }

  /**
  * Verify if the client browser supports WebWorkers. If it does, updates the marker list in the WebWorker, if not, updates it in the main thread as fallback
  * @author Gerard Garcia
  * @version 1.0
  * @date 21/05/2021
  * @param {sting[]} params
  * @memberof MapViewComponent
  */
  initUpdateListWorker(params: string[]) {
    if(typeof Worker !== "undefined") {
      const updateListWorker = new Worker("../workers/add-update-delete-markers-list.worker", {type: "module", name: "updateListWorker"});
      updateListWorker.onmessage = data => {
        this.markersList = data.data;
      }
      updateListWorker.postMessage([params, this.markersList, this.species]);
    } else {
      switch (params[1]) {
        case "add":
          this.addMarkerToList(params[2] as unknown as Marker);
          break;
        case "update":
          this.updateMarkerFromList(params[2] as unknown as Marker);
          break;
        case "delete":
          this.delteMarkerFromList(params[2]);
          break;
      }
    }
  }
  
  addMarkerToList(marker: Marker) {
    for (let index = 0; index < this.species.length; index++) {
      if(this.species[index].specie_id == marker.specie_id) {
        marker.scientific_name = this.species[index].scientific_name;
        marker.colloquial_name = this.species[index].colloquial_name;
        this.markersList.push(marker);
      }
    }
  }

  updateMarkerFromList(marker: Marker) {
    for (let index = 0; index < this.markersList.length; index++) {
      if(this.markersList[index].marker_id == marker.marker_id) {
        this.markersList[index] = marker;
        break;
      }
    }
  }

  delteMarkerFromList(marker_id: string) {
    let marker_id_cast = Number.parseInt(marker_id);
    for (let index = 0; index < this.markersList.length; index++) {
      if(this.markersList[index].marker_id == marker_id_cast) {
        // Very important: array.splice method doesn't modifies the length correctly. We must delete the value firstly and then the empty indexes to trigger a change event.
        delete this.markersList[index];
        this.markersList = this.markersList.filter(Boolean)
        break;
      }
    }
  }

  /**
  * Creates a fake session for development and testing purposes
  * @author Gerard Garcia
  * @version 1.0
  * @date 21/05/2021
  * @memberof GogHolderComponent
  */
  hardcodeSession() {
    if(localStorage.getItem("loged_user") == null) {
      let r = {"user_id": 1, "name": "martino", "surname": "martino", "role": "martino", "key": "c88054cd5296ed19cb2d1a5b84c262b831012447"}
      localStorage.setItem('loged_user', JSON.stringify(r));
    }
  }
}
