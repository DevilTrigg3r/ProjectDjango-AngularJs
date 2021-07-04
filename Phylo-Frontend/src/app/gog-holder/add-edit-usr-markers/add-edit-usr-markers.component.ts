/**
 * @file Component that holds the logic to perform updates and adds of markers
 * @author Gerard Garcia
 * @version 1.0
 * @date 21/05/2021
*/
import { Component, OnInit, Input } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';

// Models
import { Marker } from '../../models/marker';
import { SpecieMarker as Specie} from '../../models/specieMarker';

// Services
import { MarkersService } from '../../services/gog/markers/markers.service';
import { GogSharedService } from '../../services/gog/gog-shared/gog-shared.service';
import { GogNotificationService } from '../../services/gog/gog-notification/gog-notification.service';

@Component({
  selector: 'app-add-edit-usr-markers',
  templateUrl: './add-edit-usr-markers.component.html',
  styleUrls: ['./add-edit-usr-markers.component.css']
})
export class AddEditUsrMarkersComponent implements OnInit {

  // Variables with values setted by other components
  @Input() targetMarker: Marker;

  // Marker with values to perform and update or a delete
  tmpMarker: any = new Marker(null, null, null, null, null, new Date(), null, null, null, null, null);

  // Observable async with view
  speciesNamesAndIds$: Observable<Marker[]>;

  constructor(private markersService: MarkersService, private gogSharedService: GogSharedService, private gogNotificationService: GogNotificationService) { }

  /**
  * ngOnInit interface method
  * @author Gerard Garcia
  * @version 1.0
  * @date 21/05/2021
  * @memberof AddEditUsrMarkersComponent
  */
  ngOnInit(): void {
    Object.assign(this.tmpMarker, this.targetMarker);

    if(localStorage.getItem("loged_user") != null) {
      let authHeader: HttpHeaders = this.markersService.authHeader;
      authHeader = authHeader.set("Authorization", "Token " + JSON.parse(localStorage.getItem("loged_user")).key);
      this.speciesNamesAndIds$ = this.markersService.getAllSpecies(authHeader);
    }
  }

  /**
  * Adds a marker in the DB and display a message depending of the result.
  * @author Gerard Garcia
  * @version 1.0
  * @date 21/05/2021
  * @memberof AddEditUsrMarkersComponent
  */
  addMarker() {
    if(localStorage.getItem("loged_user") != null) {
      let session = JSON.parse(localStorage.getItem("loged_user"));
      let authHeader: HttpHeaders = this.markersService.authHeader;
      if(!isNaN(session.user_id)) {
        this.tmpMarker.user_id = session.user_id;
        authHeader = authHeader.set("Authorization", "Token " + session.key);
        this.markersService.addMarker(this.tmpMarker, authHeader).subscribe(data => {
          this.gogNotificationService.rechargeNeeded();
          this.gogNotificationService.markerCreated();
          this.tmpMarker.marker_id = data.marker_id;
          this.triggerCreateUpdate("add", this.tmpMarker);
          this.triggerCloseModal();
        }, error => {
          this.gogNotificationService.dbConnError();
          this.triggerCloseModal();
          this.triggerDbError();
        })
      } else {
        this.gogNotificationService.sessionError()
      }
    } else {
      this.gogNotificationService.permissionsIssue();
    }
  }

  /**
  * Update a marker in the DB and display a message depending of the result.
  * @author Gerard Garcia
  * @version 1.0
  * @date 21/05/2021
  * @memberof AddEditUsrMarkersComponent
  */
  updateMarker() {
    if(localStorage.getItem("loged_user") != null) {
      let session = JSON.parse(localStorage.getItem("loged_user"));
      if(!isNaN(session.user_id)) {
        if(this.tmpMarker.user_id == session.user_id) {
          let authHeader: HttpHeaders = this.markersService.authHeader;
          authHeader = authHeader.set("Authorization", "Token " + session.key);
          this.tmpMarker.user = session.user_id;
          this.markersService.updateMarker(this.tmpMarker, authHeader).subscribe(data => {
            this.gogNotificationService.rechargeNeeded();
            this.gogNotificationService.markerUpdated();
            this.triggerCreateUpdate("update", this.tmpMarker);
            this.triggerCloseModal();
          }, error => {
            this.gogNotificationService.dbConnError();
            this.triggerCloseModal();
            this.triggerDbError();
          });
        } else {
        this.gogNotificationService.markerAutorshipIssue();
      }} else {
        this.gogNotificationService.sessionError();
      }
    } else {
      this.gogNotificationService.permissionsIssue();
    }
  }

  /**
  * Checks if a marker id is an integer. Used in template.
  * @author Gerard Garcia
  * @version 1.0
  * @date 21/05/2021
  * @memberof AddEditUsrMarkersComponent
  */
  checkIfMarkerIdIsInteger(): boolean {
    return Number.isInteger(this.tmpMarker.marker_id);
  }

  /**
  * Communicates with ShowUsrMarkersComponent throught GogSharedService to close the modal box
  * @author Gerard Garcia
  * @version 1.0
  * @date 21/05/2021
  * @memberof AddEditUsrMarkersComponent
  */
  triggerCloseModal() {
    this.gogSharedService.createUpdateMarkerEvent("closeModal");
  }

  /**
  * Communicates with GogHolder throught GogSharedService to update the markers list locally
  * @author Gerard Garcia
  * @version 1.0
  * @date 21/05/2021
  * @param {string} action
  * @param {string} marker
  * @memberof AddEditUsrMarkersComponent
  */
  triggerCreateUpdate(action: string, marker: Marker) {
      this.gogSharedService.createUpdateMarkerEvent(["crud", action, marker]);
  }

  /**
  * Communicates with GogHolder throught GogSharedService to stop execution due a DB connection error
  * @author Gerard Garcia
  * @version 1.0
  * @date 21/05/2021
  * @memberof AddEditUsrMarkersComponent
  */
  triggerDbError() {
    this.gogSharedService.createUpdateMarkerEvent(["error"]);
  }
}
