import {Component} from '@angular/core';
import {IonicPage, NavController, ToastController} from 'ionic-angular';
import {NgForm} from "@angular/forms";
import {TabsPage} from "../tabs/tabs";
import {AuthService} from '../../providers/auth.service';
import {HttpErrorResponse} from '@angular/common/http';

@IonicPage()
@Component({
  selector: 'page-signin',
  templateUrl: 'signin.html',
})
export class SigninPage{
  isSignup = false;

  constructor(private navCtrl: NavController,
              private authProvider: AuthService,
              private toastCtrl: ToastController) {
  }

  onSubmit(form: NgForm) {
    if(this.isSignup !== true) {
      console.log(form.value);
      this.authProvider.login(form.value).subscribe(response => {
        console.log(response['token']);

        //Save token
        localStorage.setItem('token', response['token']);

        //Reset form
        form.reset()

        //Set Root
        this.navCtrl.setRoot(TabsPage);

      }, (error: HttpErrorResponse) => {
        console.log(error.error.message);

        this.presentToast(error.error.message)
      });
    }
    else{
      this.authProvider.register(form.value).subscribe(response => {
        console.log(response);

        //Reset form
        form.reset()

        //Navigate to sign in
        this.isSignup = false;

        this.presentToast('User was created sucessfully')

      }, (error: HttpErrorResponse) => {
        console.log(error.error.message);
        this.presentToast(error.error.message)
      });
    }
  }

  presentToast(mess: string) {
    let toast = this.toastCtrl.create({
      message: mess,
      duration: 1500,
      position: 'bottom'
    });

    toast.present();
  }

  goToSignup() {
    this.isSignup = true;
  }

  goToSignin() {
    this.isSignup = false;
  }

}
