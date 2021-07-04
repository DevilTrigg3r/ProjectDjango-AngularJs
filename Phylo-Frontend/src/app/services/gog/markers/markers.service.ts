/**
 * @file Gog service to query API and perform CRUD of markers
 * @author Gerard Garcia
 * @version 1.0
 * @date 21/05/2021
*/
import { Injectable } from '@angular/core';

// API consumption imports
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

// Models
import { Marker } from '../../../models/marker';
import { Specie } from '../../../models/specie';

@Injectable({
  providedIn: 'root'
})
export class MarkersService {
  readonly APIUrl = "http://192.168.1.137:8000/api";
  readonly MediUrl = "http://192.168.1.137:8000/api/mapUpload";
  readonly authHeader = new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': "change" });

  constructor(private http: HttpClient) { }

  /**
  * Get markers from a specie and specific user
  * @author Gerard Garcia
  * @version 1.0
  * @date 21/05/2021
  * @param {number} specie_id
  * @param {number} user_id
  * @param {HttpHeaders} params
  * @return {Observable}
  * @memberof MarkersService
  */
  getMarkersList(specie_id: number, user_id: number, params: HttpHeaders): Observable<Marker[]> {
    return this.http.get<Marker[]>(this.APIUrl + `/markers_with_names/${specie_id}/${user_id}`, {headers: params});
    //.pipe(catchError(this.handleError<any>('getAllFriends', [])));
  }

  /**
  * Get info from the default species from backend
  * @author Gerard Garcia
  * @version 1.0
  * @date 21/05/2021
  * @return {Observable}
  * @memberof MarkersService
  */
  getDefaultSpecies(): Observable<Specie[]> {
    return this.http.get<Specie[]>(this.APIUrl + `/species/default`);
  }

  /**
  * Get info from all the species from backend
  * @author Gerard Garcia
  * @version 1.0
  * @date 21/05/2021
  * @param {HttpHeaders} params
  * @return {Observable}
  * @memberof MarkersService
  */
  getAllSpecies(params: HttpHeaders) {
    return this.http.get<any[]>(this.APIUrl + `/species/`, {headers: params});
  }

  /**
  * Get info from target specie from backend
  * @author Gerard Garcia
  * @version 1.0
  * @date 21/05/2021
  * @param {number} specie_id
  * @param {HttpHeaders} params
  * @return {Observable}
  * @memberof MarkersService
  */
  getTargetSpecie(specie_id, params: HttpHeaders): Observable<any> {
    return this.http.get<any[]>(this.APIUrl + `/species/${specie_id}`, {headers: params});
  }

  /**
  * Add marker in backend
  * @author Gerard Garcia
  * @version 1.0
  * @date 21/05/2021
  * @param {Marker} newMarker
  * @param {HttpHeaders} params
  * @return {Observable}
  * @memberof MarkersService
  */
  addMarker(newMarker: Marker, params: HttpHeaders): Observable<any> {
    return this.http.post<any[]>(this.APIUrl + `/markers/`, newMarker, {headers: params});
  }

  /**
  * Update marker in backend
  * @author Gerard Garcia
  * @version 1.0
  * @date 21/05/2021
  * @param {Marker} targetMarker
  * @param {HttpHeaders} params
  * @memberof MarkersService
  */
  updateMarker(targetMarker: Marker, params: HttpHeaders): Observable<any> {
    return this.http.put<any[]>(this.APIUrl + `/markers/${targetMarker.marker_id}`, targetMarker, {headers: params});
  }

  /**
  * Delete marker in backend
  * @author Gerard Garcia
  * @version 1.0
  * @date 21/05/2021
  * @param {number} targetMarkerId
  * @param {HttpHeaders} params
  * @return {Observable}
  * @memberof MarkersService
  */
  deleteMarker(targetMarkerId: number, params: HttpHeaders) {
    return this.http.delete<any[]>(this.APIUrl + `/markers/${targetMarkerId}`, {headers: params});
  }

  /**
  * Upload image to backend
  * @author Gerard Garcia
  * @version 1.0
  * @date 21/05/2021
  * @return {Observable}
  * @memberof MarkersService
  */
  uploadMapImage(image: any) {
    return this.http.post<any[]>(this.APIUrl + `/markers/save_map`, image);
  }

  private handleError<Marker> (operation: string = "operation", result?: any) {
    return(error: any): Observable<any> => {
      return result;
    }
  }
}
