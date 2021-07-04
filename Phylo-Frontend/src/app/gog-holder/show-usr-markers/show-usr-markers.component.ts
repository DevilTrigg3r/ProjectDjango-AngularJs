/**
 * @file Component that holds all the logic for list, filter, and delete markers
 * @author Gerard Garcia
 * @version 1.0
 * @date 21/05/2021
*/
import { Component, OnInit, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';

// GOG Services
import { MarkersService} from '../../services/gog/markers/markers.service';
import { GogNotificationService } from '../../services/gog/gog-notification/gog-notification.service';
import { GogSharedService } from '../../services/gog/gog-shared/gog-shared.service';

// Models
import { Marker } from '../../models/marker';

@Component({
  selector: 'app-show-usr-markers',
  templateUrl: './show-usr-markers.component.html',
  styleUrls: ['./show-usr-markers.component.css']
})
export class ShowUsrMarkersComponent implements OnInit, OnChanges {
  // Interactuable DOM elements from code
  @ViewChild('closeButton') closeButton;

  // Variables with values setted by other components
  @Input() markersList: Marker[];
  @Input() markerQueryStatus: boolean;
  @Input() species: Array<any>;

  // List of markers that accomplish filter criterias
  filteredMarkersList: Marker[] = [];

  // Current page of pagination
  public currentPage: number;

  // Number of elements in each page
  public itemsPerPage: number = 5;

  // Number of markers
  public markersNumber: number;

  // Filter properties
  public countryCodeFilter: string;
  public dateBeforeFilter: Date;
  public dateAfterFilter: Date;
  public sciNameFilter: string;
  public collNameFilter: string;
  public identificationIdFilter: string;
  public autorshipFilter: boolean;

  // CRUD - Modal
  public targetMarker: Marker;
  public modalTitle: string;
  public showAddEditMarker: boolean = false;

  // Event holder that triggers when a marker CRUD operation is done
  closeModalSubscription: Subscription;

  constructor(private markersService: MarkersService, private gogSharedService: GogSharedService, private gogNotificationService: GogNotificationService) { 
    this.closeModalSubscription = this.gogSharedService.getCreateUpdateEvent().subscribe(data => {
      if(data == "closeModal") {
        this.closeButton.nativeElement.click();
        this.refreshMarkersList();
      }
    });
  }

  /**
  * ngOnInit interface method
  * @author Gerard Garcia
  * @version 1.0
  * @date 21/05/2021
  * @memberof ShowUsrMarkersComponent
  */
  ngOnInit(): void {
    this.refreshMarkersList();
  }

  /**
  * Creates a copy of the original list toapply filters
  * @author Gerard Garcia
  * @version 1.0
  * @date 21/05/2021
  * @memberof ShowUsrMarkersComponent
  */
  refreshMarkersList() {
      Object.assign(this.filteredMarkersList, this.markersList);
      this.filterMarkers();
  }

  /**
  * Check if a marker accomplish the user filter criterias
  * @author Gerard Garcia
  * @version 1.0
  * @date 21/05/2021
  * @memberof ShowUsrMarkersComponent
  */
  filterMarkers() {
    this.filteredMarkersList = this.markersList.
    filter(marker => {
      let validCountryCode: boolean = false;
      let validDateBefore: boolean = false;
      let validDateAfter: boolean = false;
      let validateScientificName: boolean = false;
      let validateColloquialName: boolean = false;
      let validateIdentification: boolean = false;
      let validateAuthorship: boolean = false;

      validateIdentification = this.checkStringFilter(this.identificationIdFilter, marker.identification_id);
      validCountryCode = this.checkStringFilter(this.countryCodeFilter, marker.country);
      validateColloquialName = this.checkStringFilter(this.collNameFilter, marker.colloquial_name);
      validateScientificName = this.checkStringFilter(this.sciNameFilter, marker.scientific_name);

      validDateBefore = this.checkDateBeforeFilter(marker.date, this.dateBeforeFilter);
      validDateAfter = this.checkDateAfterFilter(marker.date, this.dateAfterFilter);

      validateAuthorship = this.checkAutorshipFilter(this.autorshipFilter, marker.user_id);

      return validCountryCode && validateColloquialName && validateScientificName && 
      validDateBefore && validDateAfter && 
      validateIdentification &&
      validateAuthorship;
    })
    this.currentPage = 1;
    this.markersNumber = this.filteredMarkersList.length;
  }

  /**
  * Check if a owner of the marker is the logged user
  * @author Gerard Garcia
  * @version 1.0
  * @date 21/05/2021
  * @param {boolean} autorshipFilter
  * @param {string} markerUserId
  * @return {boolean}
  * @memberof ShowUsrMarkersComponent
  */
  checkAutorshipFilter(autorshipFilter, markerUserId) {
    if(autorshipFilter) {
      let sessionUserId = this.verifyUserSession();
      if(sessionUserId) {
        if(sessionUserId == markerUserId) {
          return true
        } else {
          return false
        }
      } else {
        return false;
         // notify throught shared service
      }
    } else {
      return true;
    }
  }

  /**
  * Check if a string accomplish a filter criteria
  * @author Gerard Garcia
  * @version 1.0
  * @date 21/05/2021
  * @param {string} filter
  * @param {string} value
  * @memberof ShowUsrMarkersComponent
  */
  checkStringFilter(filter: string, value: string) {
    if (filter && filter != "") {
      if (value.toLowerCase().indexOf
        (filter.toLowerCase()) != -1) {
          return true;
      } else {
        return false;
      }
    } else {
      return true;
    }
  }
 
  /**
  * Check if a date is after another
  * @author Gerard Garcia
  * @version 1.0
  * @date 21/05/2021
  * @param {string} markerDate
  * @param {string} filterDate
  * @return {boolean}
  * @memberof ShowUsrMarkersComponent
  */
  checkDateAfterFilter(markerDate, filterDate) {
    if(filterDate) {
      if(new Date(markerDate) > new Date(this.dateAfterFilter)) {
        return true;
      } else {
        return false
      }
    } else {
      return true;
    }
  }

  /**
  * Check if a date is before another
  * @author Gerard Garcia
  * @version 1.0
  * @date 21/05/2021
  * @param {string} markerDate
  * @param {string} filterDate
  * @return {|boolean}
  * @memberof ShowUsrMarkersComponent
  */
  checkDateBeforeFilter(markerDate, filterDate) {
    if(filterDate) {
      if(new Date(markerDate) < new Date(this.dateBeforeFilter)) {
        return true;
      } else {
        return false
      }
    } else {
      return true;
    }
  }

  /**
  * Verifies if the session user_id and token key are ok
  * @author Gerard Garcia
  * @version 1.0
  * @date 21/05/2021
  * @return {string|boolean}
  * @memberof GogHolderComponent
  */
     verifyUserSession() {
      if(localStorage.getItem("loged_user") != null) {
        let session = JSON.parse(localStorage.getItem("loged_user"));
        if(!isNaN(session.user_id) && session.key) {
          return session.user_id;
        }
      }
      return false;
    }

  /**
  * Function triggered when a change is detected in input variables.Checks if the variables were updated, then updates her value.
  * @author Gerard Garcia
  * @version 1.0
  * @date 21/05/2021
  * @param {SimpleChanges} changes
  * @memberof ShowUsrMarkersComponent
  */
  ngOnChanges(changes: SimpleChanges) {
    if (typeof changes.species !== 'undefined') {
      this.species = changes.species.currentValue;
    }

    if (typeof changes.markerQueryStatus !== 'undefined') {
      this.markerQueryStatus = changes.markerQueryStatus.currentValue;
    }
    
    if (typeof changes.markersList !== 'undefined') {
      this.markersList = changes.markersList.currentValue;

      let count_by_states = []
      let count_by_species = []
      for (let index = 0; index < this.markersList.length; index++) {
        if(count_by_states[this.markersList[index].country] !== undefined) {
          count_by_states[this.markersList[index].country]++;
        } else {
          count_by_states[this.markersList[index].country] = 0;
        }

        if(count_by_species[this.markersList[index].scientific_name] !== undefined) {
          count_by_species[this.markersList[index].scientific_name]++;
        } else {
          count_by_species[this.markersList[index].scientific_name] = 0;
        }
      }
    }
    this.refreshMarkersList();
  }

  /**
  * Deletes the the target marker if the session and authorship is fullfilled.
  * @author Gerard Garcia
  * @version 1.0
  * @date 21/05/2021
  * @param {Marker} marker
  * @memberof ShowUsrMarkersComponent
  */
  deleteMarker(marker: any) {
    this.targetMarker = marker;
    let session = this.verifySession();
    let ownershipFlag = this.verifyOwnership(session, this.targetMarker);
    if(ownershipFlag) {
      let authHeader: HttpHeaders = this.markersService.authHeader.set("Authorization", "Token " + session.key);
      if(confirm("Are you sure you want to remove this marker?")) {
        this.markersService.deleteMarker(this.targetMarker.marker_id, authHeader).subscribe(data => {
          this.gogNotificationService.markerDeleted();
          this.gogNotificationService.rechargeNeeded();
          this.triggerDelete("delete", this.targetMarker.marker_id);
        }, error => {
          this.gogNotificationService.dbConnError();
        })
      } else {
        this.closeButton.nativeElement.click();
      }
    } 
  }

  triggerDelete(action: string, markerId: number) {
    this.gogSharedService.createUpdateMarkerEvent(["crud", action, markerId])
  }

  // Add marker - modal
  /**
  * Opens the modal box with the form to add a new marker.
  * @author Gerard Garcia
  * @version 1.0
  * @date 21/05/2021
  * @memberof ShowUsrMarkersComponent
  */
  addMarkerClick() {
    if(localStorage.getItem("loged_user") != null) {
      this.modalTitle = "Add marker";
      this.showAddEditMarker = true;
    } else {

    }
  }

  /**
  * Close the modal box and sets the targetMarker to null.
  * @author Gerard Garcia
  * @version 1.0
  * @date 21/05/2021
  * @memberof ShowUsrMarkersComponent
  */
  closeMarkerClick() {
    this.targetMarker = new Marker(null, null, null, null, null, new Date(), null, null, null, null, null);
    this.showAddEditMarker = false;
    this.refreshMarkersList();
  }

  /**
  * Saves the target marker to edit and opens the modal box form.
  * @author Gerard Garcia
  * @version 1.0
  * @date 21/05/2021
  * @param {Marker} marker
  * @memberof ShowUsrMarkersComponent
  */
  editClick(marker: Marker) {
    
    this.targetMarker = marker;
    this.modalTitle = "Edit marker";
    this.showAddEditMarker = true;
  }

  verifyOwnership(session, marker: Marker) {
    if(session.user_id == marker.user_id) {
      return true;
    } else {
      this.gogNotificationService.markerAutorshipIssue();
      return false;
    }
  }

  verifySession() {
    if(localStorage.getItem("loged_user") != null) {
      let session = JSON.parse(localStorage.getItem("loged_user"));
      if(!isNaN(session.user_id)) {
          return session;
      } else {
        this.gogNotificationService.sessionError();
        return false;
      }
    } else {
      this.gogNotificationService.permissionsIssue();
      return false;
    }
  }
}