import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';

import {Chat, Message, User} from '@/_models';
import {UserService, AuthenticationService, ChatService} from '@/_services';
import {MessagesService} from '@/_services/messages.service';
import {Subscription} from 'rxjs';
import {element} from 'protractor';

@Component({ templateUrl: 'home.component.html' })
export class HomeComponent implements OnInit {
  currentUser: User;
  chats: Chat[];
  chatsType = 'all';
  currentPage = 1;
  itemsPerPage = 20;
  canLoadMore = true;
  countNewMessage = 0;
  messagesSubscription: Subscription;
  issetChat = false;
  issetChaIndex = null;
  isNeedUpdateUnreadCount = false;

  constructor(
    private authenticationService: AuthenticationService,
    private userService: UserService,
    private chatService: ChatService,
    private messageService: MessagesService
  ) {
    this.currentUser = this.authenticationService.currentUserValue;
  }

  ngOnInit(): void {
    this.loadAllChats();
    this.messagesSubscription = this.messageService.getMessage()
      .subscribe((message: Message) => {
        let chatID = message.messageFrom;

        if (chatID === this.currentUser.id) {
          chatID = message.messageTo;
        } else {
          this.isNeedUpdateUnreadCount = true;
        }

        if (this.chats) {
          for (let index = 0; index < this.chats.length; index++) {
            if (this.chats[index].chatSenderId === chatID) {
              this.issetChat = true;
              this.issetChaIndex = index;
              break;
            }
          }
        }
        if (this.issetChat === true) {
          this.updateChatAndMoveUp(this.issetChaIndex);
        }else {
          this.loadChat(message.messageFrom);
        }
      });
  }

  updateChatAndMoveUp(index: number): void {
    const neededChat = this.chats.splice(index, 1)[0];
    this.chats.unshift(neededChat);
    if (this.isNeedUpdateUnreadCount) {
      this.chats[0].unread++;
      this.chats[0].messageContent = this.chats[0].messageContent.substring(0, 40);
      this.isNeedUpdateUnreadCount = false;
    }
  }

  loadChat(chatID: string): void {
    this.chatService.getChatPreview(chatID)
      .pipe(first())
      .subscribe(chatPreview => {
        this.chats.unshift(chatPreview);
        this.countNewMessage++;
      });
  }


  private loadAllChats(): void {
    this.chatService.getAll(this.chatsType, this.currentPage, this.itemsPerPage, this.countNewMessage)
      .pipe(first())
      .subscribe((chats: Chat[]) => {
        if (this.chats === undefined) {
          this.chats = chats;
        } else {
          for (const chat of chats) {
            this.chats.push(chat);
          }
        }
        if (chats.length < this.itemsPerPage) {
          this.canLoadMore = false;
        }
      });
  }

  changeChatsType(type: string): void {
    this.chatsType = type;
    this.currentPage = 1;
    this.chats = [];
    this.countNewMessage = 0;
    this.loadAllChats();
  }

  onScroll(event): void {
    const leftSpace = event.target.scrollHeight - event.target.scrollTop;
    if (leftSpace < 1200 && this.canLoadMore) {
      this.currentPage++;
      this.loadAllChats();
    }
  }
}
