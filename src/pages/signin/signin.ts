import {Component} from '@angular/core';
import {IonicPage, NavController, ToastController} from 'ionic-angular';
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
              private toastCtrl: ToastController,
              private userProvider: UserService) {
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

  presentToast(mess: string) {
    let toast = this.toastCtrl.create({
      message: mess,
      duration: 1500,
      position: 'bottom'
    });

    toast.present();
  }

  initSignin(){
    this.authProvider.login(this.user).subscribe(response => {
      console.log(response['token']);

      //Save token
      localStorage.setItem('token', response['token']);

      this.saveUserData();

      //Set Root
      this.navCtrl.setRoot(TabsPage);

    }, (error: HttpErrorResponse) => {
      console.log(error.error.message);

      this.presentToast(error.error.message)
    });
  }

  initSignup(){
    this.authProvider.register(this.user).subscribe(response => {
      console.log(response);

      //Navigate to sign in
      this.isSignup = false;

      this.presentToast('User was created sucessfully');
      this.initSignin();

    }, (error: HttpErrorResponse) => {
      console.log(error.error.message);
      this.presentToast(error.error.message)
    });
  }

  goToSignup() {
    this.isSignup = true;
  }

  goToSignin() {
    this.isSignup = false;
  }

  saveUserData(){
    this.userProvider.getUserData().subscribe(response =>{
      console.log(response);

      //save user id
      localStorage.setItem('user_id', response['user_id']);
    });
  }
}
