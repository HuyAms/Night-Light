import {Component} from '@angular/core';
import {App, IonicPage, ModalController, NavController, NavParams, Toggle, ViewController} from 'ionic-angular';
import {SigninPage} from "../signin/signin";
import {SettingsService} from "../../providers/settings.service";
import {EditProfilePage} from "../edit-profile/edit-profile";

@IonicPage()
@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
})
export class SettingsPage {

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public viewCtrl: ViewController,
              private settingsService: SettingsService,
              private modalCtrl: ModalController,
              private app: App) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SettingsPage');
  }

  onLogOut() {
    localStorage.clear();
    this.app.getRootNav().setRoot(SigninPage);
  }

  onAltThemeToggle(toggle: Toggle) {
    this.settingsService.setIsAltTheme(toggle.checked);
  }

  onSoundToggle(toggle: Toggle) {
    this.settingsService.setSound(toggle.checked);
  }

  checkAltTheme() {
    return this.settingsService.isAltTheme();
  }

  checkSound() {
    return this.settingsService.hasSound();
  }

  onPresentEditProfileModal() {
    let editProfileModal = this.modalCtrl.create(EditProfilePage)
    editProfileModal.present();
  }

}
