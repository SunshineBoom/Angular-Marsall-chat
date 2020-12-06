import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AuthenticationService, ChatService } from '@/_services';
import { first } from 'rxjs/operators';
import { User } from '@/_models';
import { ActivatedRoute } from '@angular/router';

@Component({
  templateUrl: './chat.component.html'
})
export class ChatComponent implements OnInit {
  currentUser: User;
  chatID: string;
  messagesData: any;
  currentPage = 1;
  itemsPerPage = 20;
  countNewMessages = 0;
  loaded = false;
  @ViewChild('messagesItems') private messagesItemsContainer: ElementRef;

  constructor(
    private authenticationService: AuthenticationService,
    private chatService: ChatService,
    private route: ActivatedRoute
  ) {
    this.chatID = this.route.snapshot.params.chatID;
    this.currentUser = this.authenticationService.currentUserValue;
  }

  ngOnInit(): void {
    this.messagesData = this.loadCurrentChat();
  }

  private loadCurrentChat(): void {
    this.chatService.getChat(this.chatID, this.currentPage, this.itemsPerPage, this.countNewMessages)
      .pipe(first())
      .subscribe(messagesData => { this.messagesData = messagesData; this.loaded = true });
  }
  scrollToBottom(): void {
    if (typeof(this.messagesItemsContainer) !== 'undefined') {
      console.log(this.messagesItemsContainer.nativeElement);
      this.messagesItemsContainer.nativeElement.scrollTop = this.messagesItemsContainer.nativeElement.scrollHeight;
    }
  }

}
