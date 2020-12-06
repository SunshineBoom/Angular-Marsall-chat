import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';

import { User } from '@/_models';
import {UserService, AuthenticationService, ChatService} from '@/_services';

@Component({ templateUrl: 'home.component.html' })
export class HomeComponent implements OnInit {
  currentUser: User;
  chats: any;
  currentPage = 1;
  itemPerPage = 20;
  countNewMessage = 0;

  constructor(
    private authenticationService: AuthenticationService,
    private userService: UserService,
    private chatService: ChatService
  ) {
    this.currentUser = this.authenticationService.currentUserValue;
  }

  ngOnInit() {
    this.loadAllChats();
  }

  deleteUser(id: number) {
    this.userService.delete(id)
      .pipe(first())
      .subscribe(() => this.loadAllChats());
  }

  private loadAllChats() {
    this.chatService.getAll(this.currentPage, this.itemPerPage, this.countNewMessage)
      .pipe(first())
      .subscribe(chats => this.chats = chats);
  }
}
