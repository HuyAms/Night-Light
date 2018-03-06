import { Component } from '@angular/core';
import {
  IonicPage, NavController, NavParams,
  ToastController,
} from 'ionic-angular';
import {UserService} from '../../providers/user.service';
import {User} from '../../model/user';
import {Story} from '../../model/story';
import {HttpErrorResponse} from '@angular/common/http';
import {StoryService} from '../../providers/story.service';

/**
 * Generated class for the ProfilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private userProvider: UserService,
              private storyProvider: StoryService,
              private toastCtrl: ToastController) {
  }

  curUser: User ={
    username: '',
    password: '',
    email: '',
    full_name: ''
  };

  mediaUrl = 'http://media.mw.metropolia.fi/wbma/uploads/';

  myStories: Story[];
  myStoriesNum: number;

  ionViewDidLoad() {
    this.getUserData();
    this.getUserStories();
  }

  getUserData() {
    this.userProvider.getUserData().subscribe(response =>{
      this.curUser.username = response['username'];
      this.curUser.email = response['email'];
      this.curUser.full_name = response['full_name'];
    }, (error: HttpErrorResponse) => {
      console.log(error.error.message);
      this.presentToast(error.error.message);
    });
  }

  getUserStories() {
    this.storyProvider.getPostByCurUser().subscribe(response => {
      this.myStories = response;
      this.myStoriesNum = this.myStories.length;
      console.log(this.myStories);
    },(error: HttpErrorResponse)=> {
      console.log(error.error.message);
      this.presentToast(error.error.message);
    });
  }

  presentToast(mess: string) {
    let toast = this.toastCtrl.create({
      message: mess,
      duration: 1500,
      position: 'bottom'
    });

    toast.present();
  }
}
