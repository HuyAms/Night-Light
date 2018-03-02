import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { TextToSpeech } from '@ionic-native/text-to-speech';


@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {
  defaultTab = 'new';
  text: string
  speaking : boolean = false;

  constructor(private textToSpeech: TextToSpeech) {
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

  stop() {
    this.textToSpeech.stop()
  }

  sayText(){
    if(this.speaking){
      this.textToSpeech.speak({text: ''});  // <<< speak an empty string to interrupt.
      this.speaking = false;
      return;
    }
    this.speaking = true;
    this.textToSpeech.speak( {text: this.text, locale: 'en-US', rate: 1.5} )
      .then((val) => { this.speaking = false;  },
        (reject) => {console.warn(reject); this.speaking = false; })
      .catch((err) => {console.error(err); this.speaking = false; });
  }


}
