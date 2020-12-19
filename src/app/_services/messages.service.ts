import { Injectable } from '@angular/core';
import { Router, NavigationStart, } from '@angular/router';
import {BehaviorSubject, Observable, Subject} from 'rxjs';
import { Message } from '@/_models';
import { Paho } from 'ng2-mqtt/mqttws31';
import {environment} from '../../environments/environment';
import { AuthenticationService } from '@/_services/authentication.service';

@Injectable({ providedIn: 'root'})
export class MessagesService {
  private client;
  private messageSubject: BehaviorSubject<Message>;

  constructor(private  authService: AuthenticationService) {
    if (this.authService.currentUserValue){
      this.client = new Paho.MQTT.Client(environment.ws.host, Number(environment.ws.port), '_' + Math.random().toString(36). substr(0, 16));
      this.client.onMessageArrived = this.onMessageArrived.bind(this);
      this.client.onConnectionLost = this.onConnectionLost.bind(this);
      this.client.connect({onSuccess: this.onConnect.bind(this)});

      this.messageSubject = new BehaviorSubject<Message>(null);
    }
  }
  onConnect(): void {
    this.client.subscribe('/messages/' + this.authService.currentUserValue.id);
  }
  onMessageArrived(message: any): void{
    const messageDecoded = JSON.parse(message.payloadString);
    if (messageDecoded !== null && typeof(messageDecoded.messageContent) !== 'undefined' && messageDecoded.messageContent.length > 0) {
      this.messageSubject.next(messageDecoded);
    }
  }
  onConnectionLost(responseObject): void {
    if (responseObject.errorCode !== 0) {
      console.log('onConnectionLost:' + responseObject.errorMessage);
    }
  }
  public getMessage(): Observable<Message>{
    return this.messageSubject.asObservable();
  }

  sendMessage(message: Message): void {
    const messageToSend = new Paho.MQTT.Message(JSON.stringify(message));
    messageToSend.destinationName = environment.ws.topic;
    this.client.send(messageToSend);
  }
}
