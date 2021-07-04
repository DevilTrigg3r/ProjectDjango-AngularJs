import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Subscription } from 'rxjs';

// WS Service
import { GogDownloadWebsocketService } from '../../../services/gog/gog-download-websocket/gog-download-websocket.service';
import { GogSharedService } from '../../../services/gog/gog-shared/gog-shared.service';

@Component({
  selector: 'app-download-notifications',
  templateUrl: './download-notifications.component.html',
  styleUrls: ['./download-notifications.component.css']
})
export class DownloadNotificationsComponent implements OnInit, OnDestroy, AfterViewInit {

  message: string;
  displayFlag: boolean = false;
  notifications: Subscription;

  constructor(private wsService: GogDownloadWebsocketService, private gogSharedService: GogSharedService, private cookieService : CookieService) {
  }

  ngAfterViewInit() {
    let gogKeys = Object.keys(this.cookieService.getAll());

    for (let index = 0; index < gogKeys.length; index++) {
      let currCoockie = this.cookieService.get(gogKeys[index])
      this.wsService.createWS(currCoockie).subscribe(data => {
        let result = JSON.parse(data as string);
        this.message = result["message"];
        this.displayFlag = true;
        this.sleepFnc(gogKeys, index);
      })
    }
  }
  

  ngOnInit(): void {

  }

  ngOnDestroy() {
    this.notifications.unsubscribe();
  }

  async sleepFnc(gogKeys, index) {
    await this.sleep(10000)
    this.displayFlag = false;
    this.message = null;
    //this.cookieService.delete(gogKeys[index])
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
