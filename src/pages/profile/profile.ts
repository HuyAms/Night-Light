import { Component } from '@angular/core';
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
              private toastCtrl: ToastController,
              private emailComposer: EmailComposer,
              private modalCtrl: ModalController,
              private viewCtrl: ViewController) {
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

  onSendEmail() {
    this.emailComposer.isAvailable().then((available: boolean) =>{
      if(available) {
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

  onDismiss() {
    this.viewCtrl.dismiss();
  }
}
