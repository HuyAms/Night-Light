import { Component } from '@angular/core';
import {IonicPage, ViewController} from 'ionic-angular';

/**
 * Generated class for the AboutusPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-aboutus',
  templateUrl: 'aboutus.html',
})
export class AboutusPage {

  constructor( private viewCtrl: ViewController){}

  teams = [
    {
      imageUrl: 'assets/imgs/HuyTrinh.jpg',
      quote: 'Dreams don\'t work unless you do.',
      name: 'Huy Trinh',
      position: 'Software Developer'
    },
    {
      imageUrl: 'assets/imgs/TuanLe.jpg',
      quote: 'Everything happens for a reason.',
      name: 'Tuan Le',
      position: 'Software Developer'
    },
    {
      imageUrl: 'assets/imgs/ThanhTran.jpg',
      quote: 'People didn\'t normally hate bugs. Then came IT.',
      name: 'Thanh Tran',
      position: 'Software Developer'
    }
  ];

  onDismiss() {
    this.viewCtrl.dismiss();
  }
}
