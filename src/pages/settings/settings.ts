import {Component} from '@angular/core';
import {App, IonicPage, ModalController, NavController, NavParams, Toggle, ViewController} from 'ionic-angular';
import {SigninPage} from "../signin/signin";
import {SettingsService} from "../../providers/settings.service";
import {EditProfilePage} from "../edit-profile/edit-profile";
import {AboutusPage} from "../aboutus/aboutus";

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
    let editProfileModal = this.modalCtrl.create(EditProfilePage);
    editProfileModal.present();
  }

  onPresentAboutUsModal() {
    let aboutUsModal = this.modalCtrl.create(AboutusPage);
    aboutUsModal.present();
  }

}
