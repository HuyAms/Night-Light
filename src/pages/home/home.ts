import {Component, ViewChild} from '@angular/core';
import {IonicPage, NavController, Slides} from 'ionic-angular';
import {TextToSpeech} from '@ionic-native/text-to-speech';
import {SocialSharing} from '@ionic-native/social-sharing';
import {StoryService} from '../../providers/story.service';
import {Story} from '../../model/story';
import {CommentsPage} from "../comments/comments";


@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})

export class HomePage {
  @ViewChild(Slides) slides: Slides;

  defaultTab = 'discover';
  text: string;
  speaking: boolean = false;
  stories: Story[]
  curTab: string;
  currentIndex: number
  numberOfStory: number
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
    this.fetchStories()
  }

  onTextSpeech(title: string, text: string) {
    console.log('onTextSpeech: ' + text)
    if (this.speaking) {
      this.textToSpeech.speak({text: ''});  // <<< speak an empty string to interrupt.
      this.speaking = false;
      return;
    }
    this.speaking = true;
    this.textToSpeech.speak({text:  `Title: ${title}, Story: ${text}`, locale: 'en-US', rate: 1.5})
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
    this.fetchStories()
  }

  fetchStories() {
    this.storyService.getAllPost().subscribe(response => {
      this.stories = response
      this.numberOfStory = this.stories.length;
    })
  }

  slideChanged() {
    this.currentIndex = this.slides.realIndex + 1;
  }
}
