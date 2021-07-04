/**
 * @file Gog shared service to intercommunicate components
 * @author Gerard Garcia
 * @version 1.0
 * @date 21/05/2021
*/
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GogSharedService {

  // Subject object is observable and observer at the same time
  private createUpdateMarkerSubject = new Subject<any>();

  constructor() { }

  /**
  * Service subject emmits an empty stream when is called
  * @author Gerard Garcia
  * @version 1.0
  * @date 21/05/2021
  * @param {string|any[]|} message
  * @memberof GogSharedService
  */
  createUpdateMarkerEvent(message: string | any[]) {
    this.createUpdateMarkerSubject.next(message);
  }

  /**
  * Observes the subject in expectation of flows
  * @author Gerard Garcia
  * @version 1.0
  * @date 21/05/2021
  * @memberof GogSharedService
  */
  getCreateUpdateEvent(): Observable<any> {
    return this.createUpdateMarkerSubject.asObservable();
  }
}
