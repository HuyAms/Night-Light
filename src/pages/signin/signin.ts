import {Component} from '@angular/core';
import {IonicPage, NavController} from 'ionic-angular';
import {NgForm} from "@angular/forms";
import {TabsPage} from "../tabs/tabs";
import {AuthProvider} from '../../providers/auth';
import {HttpErrorResponse} from '@angular/common/http';

@IonicPage()
@Component({
  selector: 'page-signin',
  templateUrl: 'signin.html',
})
export class SigninPage{
  isSignup = false;

  constructor(private navCtrl: NavController, private mediaProvider: AuthProvider) {
  }

  onSubmit(form: NgForm) {
    if(this.isSignup !== true) {
      console.log(form.value);
      this.mediaProvider.login(form.value).subscribe(response => {
        console.log(response['token']);

        //Save token
        localStorage.setItem('token', response['token']);

        //Reset form
        form.reset()

        //Set Root
        this.navCtrl.setRoot(TabsPage);
      }, (error: HttpErrorResponse) => {
        console.log(error.error.message);
      });
    }
    else{
      this.mediaProvider.register(form.value).subscribe(response => {
        console.log(response);

        //Reset form
        form.reset()

        //Navigate to sign in
        this.isSignup = false;

      }, (error: HttpErrorResponse) => {
        console.log(error.error.message);
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
