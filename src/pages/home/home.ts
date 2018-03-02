import {Component} from '@angular/core';
import {ActionSheetController, IonicPage, NavController, NavParams} from 'ionic-angular';
import {TextToSpeech} from '@ionic-native/text-to-speech';
import {SocialSharing} from '@ionic-native/social-sharing';


@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {
  defaultTab = 'new';
  text: string
  speaking: boolean = false;

  constructor(private textToSpeech: TextToSpeech,
              private socialSharing: SocialSharing) {
  }

  onSegmentChange(event) {
    let tab = event.value;
    if (tab == 'new') {
      console.log('new tab loaded');
    } else {
      console.log('hot tab loaded');
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

  onShare() {
    let message = "This is title"
    let imageUrl = "https://user-images.githubusercontent.com/26871154/36926557-319fc0bc-1e81-11e8-859e-5c751b27f166.png";
    let subject = "Mail subject"

    this.socialSharing.share(message, subject, '', imageUrl)
      .then(() => {
        //success
      }).catch((e) => {
      //Error
    })
  }

}
