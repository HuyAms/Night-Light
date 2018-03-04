import {Component} from '@angular/core';
import {ActionSheetController, IonicPage, NavController, NavParams} from 'ionic-angular';
import {TextToSpeech} from '@ionic-native/text-to-speech';
import {SocialSharing} from '@ionic-native/social-sharing';
import {StoryService} from '../../providers/story.service';
import {HttpErrorResponse} from '@angular/common/http';
import {Story} from '../../model/story';
import {CommentsPage} from "../comments/comments";
import {User} from "../../model/user";


@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})

export class HomePage {
  defaultTab = 'discover';
  text: string;
  speaking: boolean = false;
  postUrl: string;
  stories: Story[]
  curTab: string;
  mediaUrl = 'http://media.mw.metropolia.fi/wbma/uploads/';

  constructor(private textToSpeech: TextToSpeech,
              private socialSharing: SocialSharing,
              private storyService: StoryService,
              public navCtrl: NavController) {
  }

  onSegmentChange(event) {
    let tab = event.value;
    if (tab === 'new') {
      this.curTab = 'new';
      console.log('new tab loaded');
    } else if (tab === 'hot') {
      // this.curTab = 'hot';
      console.log('hot tab loaded');
    }
    else if (tab === 'discover') {
      this.curTab = 'discover';
      console.log('discover tab loaded');
    }
  }

  onRefresh() {
    console.log('refresh')
  }

  onTextSpeech() {
    if (this.speaking) {
      this.textToSpeech.speak({text: ''});  // <<< speak an empty string to interrupt.
      this.speaking = false;
      return;
    }
    this.speaking = true;
    this.textToSpeech.speak({text: this.text, locale: 'en-US', rate: 1.5})
      .then((val) => {
          this.speaking = false;
        },
        (reject) => {
          console.warn(reject);
          this.speaking = false;
        })
      .catch((err) => {
        console.error(err);
        this.speaking = false;
      });
  }

  onShare(message: string, subject: string, imageUrl: string) {
    console.log("onshare")
    this.socialSharing.share(message, subject, '', imageUrl)
      .then(() => {
        //success
      }).catch((e) => {
      //Error
    })
  }

  onComment(file_id: string) {
    this.navCtrl.push(CommentsPage, file_id);
  }

  ionViewDidLoad() {
    this.storyService.getAllPost().subscribe(response => {
      this.stories = response
      console.log(this.stories)
    })
  }
}
