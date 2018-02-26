import {Component} from '@angular/core';
import {IonicPage, NavController} from 'ionic-angular';
import {NgForm} from "@angular/forms";
import {TabsPage} from "../tabs/tabs";

@IonicPage()
@Component({
  selector: 'page-signin',
  templateUrl: 'signin.html',
})
export class SigninPage {
  isSignup = false;
  buttonTitle = 'Login';

  constructor(private navCtrl: NavController) {
  }

  onSignin(form: NgForm) {
    console.log(form);
    this.navCtrl.push(TabsPage);
  }

  goToSignup() {
    this.isSignup = true;
  }

  goToSignin() {
    this.isSignup = false;
  }

}
