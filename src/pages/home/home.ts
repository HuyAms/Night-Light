import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the HomePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {
  defaultTab = 'new';

  constructor(public navCtrl: NavController, public navParams: NavParams) {
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


}
