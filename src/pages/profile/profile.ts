import {Component} from '@angular/core';
import {
  IonicPage, ModalController, NavController, NavParams,
  ToastController, ViewController,
} from 'ionic-angular';
import {UserService} from '../../providers/user.service';
import {User} from '../../model/user';
import {Story} from '../../model/story';
import {HttpErrorResponse} from '@angular/common/http';
import {StoryService} from '../../providers/story.service';
import { EmailComposer } from '@ionic-native/email-composer';
import {HomePage} from "../home/home";
import {SettingsPageModule} from "../settings/settings.module";
import {SettingsPage} from "../settings/settings";


@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {

  user_id: string;
  isMe: boolean;
  curUser: User = {
    username: '',
    password: '',
    email: '',
    full_name: ''
  };

  mediaUrl = 'http://media.mw.metropolia.fi/wbma/uploads/';

  stories: Story[];
  numStories: number;

  constructor(public navCtrl: NavController,
              public viewCtrl: ViewController,
              public navParams: NavParams,
              private userProvider: UserService,
              private storyProvider: StoryService,
              private toastCtrl: ToastController,
              private emailComposer: EmailComposer,
              private modalCtrl: ModalController) {
    this.user_id = navParams.get('user_id');
  }

  ionViewDidLoad() {
    if (this.user_id) {
      this.getUserInfo(this.user_id);
      this.getUserStories(this.user_id);
      this.isMe = false;
    } else {
      this.getMe();
      this.getMyStories();
      this.isMe = true;
    }
  }

  getUserInfo(user_id) {
    this.userProvider.getUserDataById(user_id).subscribe(response => {
      this.curUser.username = response['username'];
      this.curUser.email = response['email'];
      this.curUser.full_name = response['full_name'];
    }, (error: HttpErrorResponse) => {
      console.log(error.error.message);
      this.presentToast(error.error.message);
    });
  }

  getUserStories(user_id) {
    this.storyProvider.getPostByUserId(user_id).subscribe(response => {
      this.stories = response;
      this.numStories = this.stories.length;
      console.log(this.stories);
    }, (error: HttpErrorResponse) => {
      console.log(error.error.message);
      this.presentToast(error.error.message);
    });
  }

  getMe() {
    this.userProvider.getUserData().subscribe(response => {
      this.curUser.username = response['username'];
      this.curUser.email = response['email'];
      this.curUser.full_name = response['full_name'];
    }, (error: HttpErrorResponse) => {
      console.log(error.error.message);
      this.presentToast(error.error.message);
    });
  }

  getMyStories() {
    this.storyProvider.getPostByCurUser().subscribe(response => {
      this.stories = response;
      this.numStories = this.stories.length;
      console.log(this.stories);
    }, (error: HttpErrorResponse) => {
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

  onSendEmail() {
    this.emailComposer.isAvailable().then((available: boolean) => {
      if (available) {
        let email = {
          to: this.curUser.email,
          subject: 'Greeting',
          isHtml: true
        };
        this.emailComposer.open(email);
      } else {
        //Email app not available
      }
    }).catch(e => console.log(e));
  }

  onPresentSinglePostModal(file_id) {
    let commentModal = this.modalCtrl.create(HomePage, {file_id: file_id, mode: 'singlePost'});
    commentModal.present();
  }

  onEditProfile() {
    console.log('Edit Profile Clicked')
  }

  onDismiss() {
    this.viewCtrl.dismiss();
  }

  onSettings() {
    this.navCtrl.push(SettingsPage);
  }
}
