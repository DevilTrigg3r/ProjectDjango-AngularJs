/**
 * @file Base service to make status messages
 * @author Gerard Garcia
 * @version 1.0
 * @date 21/05/2021
*/
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(private toastr: ToastrService) { }

  /**
  * Spawns a green message
  * @author Gerard Garcia
  * @version 1.0
  * @date 21/05/2021
  * @param {string} message
  * @param {string} title
  * @memberof NotificationService
  */
  messageSuccess(message: string, title: string) {
    this.toastr.success(message, title)
  }

  /**
  * Spawns a dark orange message
  * @author Gerard Garcia
  * @version 1.0
  * @date 21/05/2021
  * @param {string} message
  * @param {string} title
  * @memberof NotificationService
  */
  messageWarning(message: string, title: string) {
    this.toastr.warning(message, title)
  }

  /**
  * Spawns a red message
  * @author Gerard Garcia
  * @version 1.0
  * @date 21/05/2021
  * @param {string} message
  * @param {string} title
  * @memberof NotificationService
  */
  messageError(message: string, title: string) {
    this.toastr.error(message, title)
  }

  /**
  * Spawns a yellow message
  * @author Gerard Garcia
  * @version 1.0
  * @date 21/05/2021
  * @param {string} message
  * @param {string} title
  * @memberof NotificationService
  */
  messageInfo(message: string, title: string) {
    this.toastr.info(message, title)
  }

  /**
  * Spawns a generic red error message when there is not connection with the backend or it returns an error
  * @author Gerard Garcia
  * @version 1.0
  * @date 21/05/2021
  * @memberof NotificationService
  */
  dbConnError() {
    this.toastr.error("There is a connection problem with the database. Contact the administrator", "Connection error")
  }
}
