import {Component} from '@angular/core';
import {AlertController, IonicPage, NavParams, ViewController} from 'ionic-angular';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {EmailComposer} from "@ionic-native/email-composer";


@IonicPage()
@Component({
  selector: 'page-mailcomposer',
  templateUrl: 'mailcomposer.html',
})
export class MailcomposerPage {
  emailForm: FormGroup;
  toEmail: string;

  constructor(public viewCtrl: ViewController,
              public navParams: NavParams,
              private alertCtrl: AlertController,
              private emailComposer: EmailComposer) {
    this.toEmail = navParams.get('toEmail');
    this.initializeForm();
  }

  initializeForm() {
    this.emailForm = new FormGroup({
      'subject': new FormControl('', Validators.required),
      'to': new FormControl(this.toEmail, Validators.required),
      'message': new FormControl('', Validators.required)
    });
  }

  //Contact function
  //Allow email sending
  sendMessage() {
    const value = this.emailForm.value;
    let to: string = value.to;
    let subject: string = value.subject;
    let message: string = value.message;

    this.emailComposer.isAvailable()
      .then((available: boolean) => {
        this.emailComposer.hasPermission()
          .then((isPermitted: boolean) => {

            let email = {
              to: to,
              subject: subject,
              body: message,
              isHtml: true
            };

            this.emailComposer.open(email);
          })
          .catch((error: any) => {
            console.log('No access permission granted');
            this.presentSignInAlert('No access permission granted');
          })
          .catch((error: any) => {
            console.log('User does not appear to have device e-mail account');
            this.presentSignInAlert('User does not appear to have device e-mail account');
            console.dir(error);
          });
      })
  }

  presentSignInAlert(mess: string) {
    const alert = this.alertCtrl.create({
      title: 'Signin failed',
      message: mess,
      buttons: ['Ok']
    });
    alert.present();
  }

  onDismiss() {
    this.viewCtrl.dismiss();
  }

}
