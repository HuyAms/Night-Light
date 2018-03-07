import { Component } from '@angular/core';
import {IonicPage, NavController, NavParams, Toggle} from 'ionic-angular';
import {SigninPage} from "../signin/signin";
import {SettingsService} from "../../providers/settings.service";

@IonicPage()
@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
})
export class SettingsPage {

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private settingsService: SettingsService) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SettingsPage');
  }

  onLogOut() {
    localStorage.clear();
    this.navCtrl.setRoot(SigninPage);
    this.navCtrl.popToRoot();
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

}
