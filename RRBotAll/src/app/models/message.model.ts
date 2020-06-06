abstract class BaseMessage {
    msgTime = new Date().getTime();
    type = 'text';
    botImg  = 'https://media1.tenor.com/images/417b164404395c70a1bbd36b44c1ef10/tenor.gif?itemid=15839692';
    userImg = 'http://www.vasterad.com/themes/hireo/images/user-avatar-placeholder.png';
    sentBy = 'bot';
}
export class Message extends BaseMessage {
    text: any;
    sentBy: string;
    constructor(o) {
        super();
        this.text = o.content;
        this.sentBy = o.sentBy;
    }
}

export class RichMessage extends BaseMessage {
    type: string;
    imageUrl: string;
    text: string;
    videoUrl: string;
    audioUrl: string;
    webUrl: string;
    docUrl: string;
    chips: any[];
    constructor(o) {
        super();
        this.type = o.type;
        this.text = o.text;
        this.imageUrl = o.imageUrl;
        this.videoUrl = o.videoUrl;
        this.audioUrl = o.audioUrl;
        this.webUrl = o.webUrl;
        this.docUrl = o.docUrl;
        this.chips = o.chips;
    }
}
