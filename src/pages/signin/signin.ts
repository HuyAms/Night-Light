import {Component} from '@angular/core';
import {AlertController, IonicPage, LoadingController, NavController, ToastController} from 'ionic-angular';
import {NgForm} from "@angular/forms";
import {TabsPage} from "../tabs/tabs";
import {AuthService} from '../../providers/auth.service';
import {HttpErrorResponse} from '@angular/common/http';
import {User} from '../../model/user';
import {UserService} from '../../providers/user.service';

@IonicPage()
@Component({
  selector: 'page-signin',
  templateUrl: 'signin.html',
})
export class SigninPage{
  isSignup = false;
  user: User = {
    username: '',
    password: '',
    email: '',
    full_name: ''
  }

  constructor(private navCtrl: NavController,
              private authProvider: AuthService,
              private alertCtrl: AlertController,
              private userProvider: UserService,
              private toastCtrl: ToastController,
              private loadingCtrl: LoadingController) {
  }

  onSubmit(form: NgForm) {
    if(this.isSignup !== true) {
      console.log(form.value);

      //Request signin
      this.user.username = form.value.username;
      this.user.password = form.value.password;
      this.initSignin();

      //Reset form
      form.reset();

    }
    else{
      //Request signup
      this.user.username = form.value.username;
      this.user.password = form.value.password;
      this.user.email = form.value.email;
      this.user.full_name = form.value.full_name;

      this.initSignup();

      //Reset form
      form.reset();

    }
  }

  presentSignInAlert(mess: string) {
    const alert = this.alertCtrl.create({
      title: 'Sign in failed',
      message: mess,
      buttons: ['Ok']
    });
    alert.present();
  }

  presentSignUpAlert(mess: string) {
    const alert = this.alertCtrl.create({
      title: 'Sign up failed',
      message: mess,
      buttons: ['Ok']
    });
    alert.present();
  }

  initSignin(){
    const loading = this.loadingCtrl.create({
      content: 'Signing you in ...'
    });
    loading.present();

    this.authProvider.login(this.user).subscribe(response => {
      //Save token
      localStorage.setItem('token', response['token']);

      this.saveUserData();

      loading.dismiss();

      //Set Root
      this.navCtrl.setRoot(TabsPage);

    }, (error: HttpErrorResponse) => {
      loading.dismiss();

      console.log(error.error.message);

      this.presentSignInAlert(error.error.message)
    });
  }

  initSignup(){
    const loading = this.loadingCtrl.create({
      content: 'Signing you up ...'
    });
    loading.present();

    this.authProvider.register(this.user).subscribe(response => {

      //Navigate to sign in
      this.isSignup = false;

      this.presentToast('User was created successfully');
      this.initSignin();

      loading.dismiss();

    }, (error: HttpErrorResponse) => {
      loading.dismiss();
      this.presentSignUpAlert(error.error.message)
    });
  }

  presentToast(mess) {
    let toast = this.toastCtrl.create({
      message: mess,
      duration: 3000,
      position: 'top'
    });

    toast.present();
  }

  goToSignup() {
    this.isSignup = true;
  }

  goToSignin() {
    this.isSignup = false;
  }

  saveUserData(){
    this.userProvider.getCurrentUserData().subscribe(response =>{
      console.log(response);

      //save user id
      localStorage.setItem('user_id', response['user_id']);
    });
  }


}
