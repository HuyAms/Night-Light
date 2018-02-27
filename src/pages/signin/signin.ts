import {Component} from '@angular/core';
import {IonicPage, NavController} from 'ionic-angular';
import {NgForm} from "@angular/forms";
import {TabsPage} from "../tabs/tabs";
import {MediaProvider} from '../../providers/media/media';
import {HttpErrorResponse} from '@angular/common/http';

@IonicPage()
@Component({
  selector: 'page-signin',
  templateUrl: 'signin.html',
})
export class SigninPage{
  isSignup = false;
  buttonTitle = 'Login';


  constructor(private navCtrl: NavController, private mediaProvider: MediaProvider) {
  }

  onSignin(form: NgForm) {
    if(this.isSignup !== true) {
      console.log(form.value);
      this.mediaProvider.login(form.value).subscribe(response => {
        console.log(response['token']);
        localStorage.setItem('token', response['token']);
        this.navCtrl.setRoot(TabsPage);
      }, (error: HttpErrorResponse) => {
        console.log(error.error.message);
      });
    }
    else{
      this.mediaProvider.register(form.value).subscribe(response => {
        console.log('User Creation successful');
        this.navCtrl.setRoot(SigninPage);
      }, (error: HttpErrorResponse) => {
        console.log(error.error.message);
      });
    }
  }

  ionViewDidLoad() {
    if (localStorage.getItem('token') !== null) {
      this.mediaProvider.getUserData().subscribe(response => {
        this.navCtrl.setRoot(TabsPage);
      }, (error: HttpErrorResponse) => {
        console.log(error);
      });
    }
  }


  goToSignup() {
    this.isSignup = true;
  }

  goToSignin() {
    this.isSignup = false;
  }

}
