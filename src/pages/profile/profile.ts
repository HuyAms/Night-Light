import {Component} from '@angular/core';
import {IonicPage, ModalController, NavController, NavParams, ToastController, ViewController,} from 'ionic-angular';
import {UserService} from '../../providers/user.service';
import {User} from '../../model/user';
import {Story} from '../../model/story';
import {HttpErrorResponse} from '@angular/common/http';
import {StoryService} from '../../providers/story.service';
import {HomePage} from "../home/home";
import {SettingsPage} from "../settings/settings";
import {EditProfilePage} from "../edit-profile/edit-profile";
import {MailcomposerPage} from "../mailcomposer/mailcomposer";
import {SettingsService} from "../../providers/settings.service";


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
              private userService: UserService,
              private storyService: StoryService,
              private toastCtrl: ToastController,
              private modalCtrl: ModalController,
              private settingsService: SettingsService) {
    this.user_id = navParams.get('user_id');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad')
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

  ionViewWillEnter() {
   if (!this.user_id) {
     this.getMyStories();
   }
  }

  checkGridMode() {
    return this.settingsService.isGrid();
  }

  getUserInfo(user_id) {
    this.userService.getUserDataById(user_id).subscribe(response => {
      this.curUser.username = response['username'];
      this.curUser.email = response['email'];
      this.curUser.full_name = response['full_name'];
    }, (error: HttpErrorResponse) => {
      console.log(error.error.message);
      this.presentToast(error.error.message);
    });
  }

  getUserStories(user_id) {
    this.storyService.getPostByUserId(user_id).subscribe(response => {
      this.stories = response;
      this.numStories = this.stories.length;
      console.log(this.stories);
    }, (error: HttpErrorResponse) => {
      console.log(error.error.message);
      this.presentToast(error.error.message);
    });
  }

  getMe() {
    this.userService.getCurrentUserData().subscribe(response => {
      this.curUser.username = response['username'];
      this.curUser.email = response['email'];
      this.curUser.full_name = response['full_name'];
    }, (error: HttpErrorResponse) => {
      console.log(error.error.message);
      this.presentToast(error.error.message);
    });
  }

  getMyStories() {
    this.storyService.getPostByCurUser().subscribe(response => {
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
    this.onPresentEmailComposer(this.curUser.email);
  }

  onPresentSinglePostModal(file_id) {
    let commentModal = this.modalCtrl.create(HomePage, {file_id: file_id, mode: 'singlePost'});
    commentModal.present();
  }

  onPresentEmailComposer(toEmail) {
    let emailComposer = this.modalCtrl.create(MailcomposerPage, {toEmail: toEmail});
    emailComposer.present();
  }

  onPresentEditProfileModal() {
    let editProfileModal = this.modalCtrl.create(EditProfilePage)
    editProfileModal.present();
    editProfileModal.onDidDismiss(() => {
      this.getMe();
      this.getMyStories();
    })
  }

  onDismiss() {
    this.viewCtrl.dismiss();
  }

  onSettings() {
    this.navCtrl.push(SettingsPage);
  }
}
