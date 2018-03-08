import {Component} from '@angular/core';
import {IonicPage, NavParams, ViewController} from 'ionic-angular';
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

  // retrieveAttachment() {
  //   console.log('ionViewDidLoad MailcomposerPage');
  // }

  sendMessage() {
    const value = this.emailForm.value;
    let to: string = value.subject.to;
    let subject: string = value.subject;
    let message: string = value.message;


    this.emailComposer.isAvailable()
      .then((available: boolean) => {
        this.emailComposer.hasPermission()
          .then((isPermitted: boolean) => {

            let email = {
              to: to,
              attachments: [
                'file://img/logo.png',
                'res://icon.png',
                'base64:icon.png//iVBORw0KGgoAAAANSUhEUg...',
                'file://README.pdf'
              ],
              subject: subject,
              body: message,
              isHtml: true
            };

            this.emailComposer.open(email);
          })
          .catch((error: any) => {
            console.log('No access permission granted');
          })
          .catch((error: any) => {
            console.log('User does not appear to have device e-mail account');
            console.dir(error);
          });
      })
  }

  onDismiss() {
    this.viewCtrl.dismiss();
  }

}
