import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface Message {
  taskId: number;
}

@Injectable({
  providedIn: 'root'
})

export class GogDownloadWebsocketService {

  readonly wsURL = "ws://localhost:8000/ws/downloadService/";

  constructor() { }

  createWS(id: string) {
    let ws = new WebSocket(this.wsURL + id)

    return new Observable(
      observer => {
        ws.onmessage = (event) => observer.next(event.data);
        ws.onerror = (event) => observer.error(event);
        ws.onclose = (event) => observer.complete();
        return () => ws.close(1000, "Disconnected");
      }
    )
  }

  checkDownloads(ws: WebSocket) {
    if(ws.readyState) {
      ws.send("checkDownloads");
      return "Downloads query send";
    } else {
      return "The socket is closed or busy"
    }
  }
}
