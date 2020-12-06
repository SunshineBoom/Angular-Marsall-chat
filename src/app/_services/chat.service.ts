import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';

import { Chat } from '@/_models';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  constructor(private http: HttpClient) { }

  getAll(currentPage: number, itemsPerPage: number, countNewMessage: number) {
    return this.http.get( `${environment.apiUrl}/chat?page=${currentPage}&limit=${itemsPerPage}&newMessagesOffset=${countNewMessage}`);
  }

  getChat(chatId: string, currentPage: number, itemsPerPage: number, countNewMessages: number) {
    return this.http.get(`${environment.apiUrl}/chat/${chatId}?page=${currentPage}&limit=${itemsPerPage}&newMessagesOffset=${countNewMessages}`);
  }
}
