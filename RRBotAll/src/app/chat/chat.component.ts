import { Component, OnInit, NgZone, ViewChild, ElementRef } from '@angular/core';
import { ChatService } from '../chat.service';
import { Message } from '../models/message.model';
declare const annyang: any;
declare var $: any;

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {
  @ViewChild('myButton', {static: false}) myButton: ElementRef;
  conversation: Message[] = [];
  inputMessage = '';
  voiceActiveSectionDisabled = true;
  voiceActiveSectionError = false;
  voiceActiveSectionSuccess = false;
  voiceActiveSectionListening = false;
  voiceText: any;
  imagePath: '../../assets/images/bot.png';
  constructor(private chatService: ChatService,
              private ngZone: NgZone) { }

  sendMessage() {
    this.chatService.sendMessageToBot(this.inputMessage);
    this.inputMessage = '';
  }

  ngOnInit() {
    this.chatService.getConversation().subscribe((conv: Message[]) => {
      this.conversation = conv;
      setTimeout(() => {
        $('.message-content-inner').stop().animate({ scrollTop: $('.message-content-inner')[0].scrollHeight + 500 }, 100);
      }, 100);
    });
    this.chatService.init();
  }
  onChipSelected($event) {
    this.chatService.sendMessageToBot($event);
  }

  clearConversation() {
    this.chatService.clear();
  }
  initializeVoiceRecognitionCallback(): void {
    annyang.addCallback(`error`, (err) => {
      if (err.error === `network`) {
        this.voiceText = `Internet is require`;
        annyang.abort();
        this.ngZone.run(() => this.voiceActiveSectionSuccess = true);
      } else if (this.voiceText === undefined) {
        console.log('initializeVoiceRecognitionCallback this.voiceText === undefined');
        this.ngZone.run(() => this.voiceActiveSectionError = true);
        annyang.abort();
      }
    });
    annyang.addCallback(`soundstart`, (res) => {
    console.log('soundstart');
    this.ngZone.run(() => this.voiceActiveSectionListening = true);
   });
    annyang.addCallback(`end`, () => {
    console.log('end()');
    if (this.voiceText === undefined) {
       this.ngZone.run(() => this.voiceActiveSectionError = true);
       annyang.abort();
     }
   });
    annyang.addCallback(`result`, (userSaid) => {
    // if ( index === 1) {
     this.ngZone.run(() => this.voiceActiveSectionError = false);
     const queryText: any = userSaid[0];
     this.voiceText = queryText;
     this.inputMessage = this.voiceText;
     const el: HTMLElement = this.myButton.nativeElement as HTMLElement;
     el.click();
     this.closeVoiceRecognition();
     this.ngZone.run(() => {
       console.log('called voiceActiveSectionListening');
       this.voiceActiveSectionListening = false;
       }
    );
     this.ngZone.run(() => {
      this.voiceActiveSectionSuccess = true;
      console.log('called voiceActiveSectionSuccess');
     }
     );
     throw Error();
   });

 }
 startVoiceRecognition(): void {
   console.log('startVoiceRecognition()');
   this.voiceActiveSectionDisabled = false;
   this.voiceActiveSectionError = false;
   this.voiceActiveSectionSuccess = false;
   this.voiceText = undefined;
   if (annyang ) {
   /*  const commands = {
      'demo-annyang': () => { }
    };
    annyang.addCommands(commands); */
    this.initializeVoiceRecognitionCallback();
    annyang.start({autoRestart: false, continuous: false});
  }
 }
 closeVoiceRecognition(): void {
   console.log('closeVoiceRecognition()');
   this.voiceActiveSectionDisabled = true;
   this.voiceActiveSectionError = false;
   this.voiceActiveSectionSuccess = false;
   this.voiceActiveSectionListening = false;
   if (annyang ) {
     console.log(121);
     annyang.abort();
   }
   this.voiceText = undefined;
 }
}

