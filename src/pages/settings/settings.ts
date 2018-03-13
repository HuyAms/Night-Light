import {Component} from '@angular/core';
import {
  App, IonicPage, ModalController, NavParams, ToastController, Toggle} from 'ionic-angular';
import {SigninPage} from "../signin/signin";
import {SettingsService} from "../../providers/settings.service";
import {EditProfilePage} from "../edit-profile/edit-profile";
import {AboutusPage} from "../aboutus/aboutus";
import {Story} from "../../model/story";

@IonicPage()
@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
})
export class SettingsPage {
  haveAva: boolean;
  userAva: Story;

  constructor(public navParams: NavParams,
              private settingsService: SettingsService,
              private modalCtrl: ModalController,
              private app: App,
              private toastCtrl: ToastController) {
    this.haveAva = navParams.get('haveAva');
    this.userAva = navParams.get('userAva');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SettingsPage');
  }

  onLogOut() {
    localStorage.clear();
    this.app.getRootNav().setRoot(SigninPage);
    this.presentToast("See you again!")

  }

  onSoundToggle(toggle: Toggle) {
    this.settingsService.setSound(toggle.checked);
  }

  checkSound() {
    return this.settingsService.hasSound();
  }

  onGridToggle(toggle: Toggle) {
    this.settingsService.setGrid(toggle.checked);
  }

  checkGrid() {
    return this.settingsService.isGrid();
  }


  onPresentEditProfileModal() {
    let editProfileModal = this.modalCtrl.create(EditProfilePage, {haveAva: false});
    if (this.userAva) {
      editProfileModal = this.modalCtrl.create(EditProfilePage, {haveAva: true, userAva: this.userAva});
    }
    editProfileModal.present();
  }

  onPresentAboutUsModal() {
    let aboutUsModal = this.modalCtrl.create(AboutusPage);
    aboutUsModal.present();
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
