/**
 * @file Gog service for personalized status messages
 * @author Gerard Garcia
 * @version 1.0
 * @date 21/05/2021
*/
import { Injectable } from '@angular/core';
import { NotificationService } from '../../notification/notification.service';

@Injectable({
  providedIn: 'root'
})
export class GogNotificationService {

  constructor(private notificationService: NotificationService) { }

  /**
  * Displays a message when the session id is not a integer
  * @author Gerard Garcia
  * @version 1.0
  * @date 21/05/2021
  * @memberof GogNotificationService
  */
  sessionError() {
    this.notificationService.messageError("There is a problem with your session. Close and reopen it.", "Session error");
  }

  /**
  * Displays a message when a user is not logged in
  * @author Gerard Garcia
  * @version 1.0
  * @date 21/05/2021
  * @memberof GogNotificationService
  */
  permissionsIssue() {
    this.notificationService.messageError("To do this, login first.", "Permissions error");
  }

  /**
  * Displays a message when a delete, update, add operation is completed succesfully
  * @author Gerard Garcia
  * @version 1.0
  * @date 21/05/2021
  * @memberof GogNotificationService
  */
  rechargeNeeded() {
    this.notificationService.messageInfo("To see the changes, refresh the page.", "Refresh the page")
  }

  /**
  * Displays a message when a user tries to do a delete, update operation to a not owned marker
  * @author Gerard Garcia
  * @version 1.0
  * @date 21/05/2021
  * @memberof GogNotificationService
  */
  markerAutorshipIssue() {
    this.notificationService.messageWarning("You are not the owner of this marker.", "Autorship issue");
  }

  /**
  * Displays a message when a marker is updated succesfully
  * @author Gerard Garcia
  * @version 1.0
  * @date 21/05/2021
  * @memberof GogNotificationService
  */
  markerUpdated() {
    this.notificationService.messageSuccess("Marker updated succesfully.", "Updated successfully");
  }

  /**
  * Displays a message when a marker is created succesfully
  * @author Gerard Garcia
  * @version 1.0
  * @date 21/05/2021
  * @memberof GogNotificationService
  */
  markerCreated() {
    this.notificationService.messageSuccess("Marker created succesfully.", "Created successfully");
  }

  /**
  * Displays a message when a marker is deleted succesfully
  * @author Gerard Garcia
  * @version 1.0
  * @date 21/05/2021
  * @memberof GogNotificationService
  */
  markerDeleted() {
    this.notificationService.messageSuccess("Marker deleted succesfully.", "Deleted successfully");
  }

  /**
  * Displays a  generic message when there is not connection with the backend or it returns an error
  * @author Gerard Garcia
  * @version 1.0
  * @date 21/05/2021
  * @memberof GogNotificationService
  */
  dbConnError() {
    this.notificationService.dbConnError();
  }
  
}
