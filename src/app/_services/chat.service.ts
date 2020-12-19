import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';

import {Chat, Photo} from '@/_models';
import { environment } from '../../environments/environment';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  constructor(private http: HttpClient) { }

  getAll(chatsType: string, currentPage: number, itemsPerPage: number, countNewMessage: number): Observable<any> {
    return this.http.get( `${environment.apiUrl}/chat?chatsType=${chatsType}&page=${currentPage}&limit=${itemsPerPage}&newMessagesOffset=${countNewMessage}`);
  }

  getChat(chatId: string, currentPage: number, itemsPerPage: number, countNewMessages: number): Observable<any>  {
    return this.http.get(`${environment.apiUrl}/chat/${chatId}?page=${currentPage}&limit=${itemsPerPage}&newMessagesOffset=${countNewMessages}`);
  }
  getChatPreview(chatId: string): Observable<any> {
    return this.http.get(`${environment.apiUrl}/chat/preview/${chatId}`);
  }
  uploadImage(imageForm: FormData): Observable<any>{
    return  this.http.post( `${environment.apiUrl}/chat/upload-image`, imageForm);
  }
  setViewed(ids: number[]): Observable<any> {
    return  this.http.post(`${environment.apiUrl}/chat/set-viewed`, ids);
  }
}
