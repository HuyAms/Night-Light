import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams, ToastController, ViewController} from 'ionic-angular';
import {User} from "../../model/user";
import {UserService} from "../../providers/user.service";
import {NgForm} from "@angular/forms";
import {HttpErrorResponse} from "@angular/common/http";
import {PostTag} from "../../model/postTag";
import {StoryService} from "../../providers/story.service";
import {ProfilePage} from "../profile/profile";
import {Story} from "../../model/story";

@IonicPage()
@Component({
  selector: 'page-edit-profile',
  templateUrl: 'edit-profile.html',
})
export class EditProfilePage {
  file: File;
  inputFileEmpty: boolean = true;
  img: any;
  user:User = {
    username : '',
    password: '',
    full_name: '',
    email: ''
  }
  user_id = localStorage.getItem('user_id');
  passwordChange: boolean;
  currentAva: Story;
  haveAva: boolean;
  mediaUrl = 'http://media.mw.metropolia.fi/wbma/uploads/';

  //Tag values to post tag to image
  avaTag: PostTag = {
    file_id: 0,
    tag: 'nightlight/ava/' + this.user_id
  }

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private viewCtrl: ViewController,
              public toastCtrl: ToastController,
              private userProvider: UserService,
              private storyProvider: StoryService) {
    this.haveAva = navParams.get('haveAva');
    this.currentAva = navParams.get('userAva');
    if(this.haveAva) {
      this.img = this.mediaUrl + this.currentAva.filename
    } else {
      this.img = '../../assets/imgs/Generic-Profile.png';
    }
  }

  ionViewDidLoad() {
    this.requestUserInfo();
  }

  requestUserInfo() {
    this.userProvider.getUserDataById(this.user_id).subscribe(response => {
      this.user = response;
      this.user.password = '';
      console.log(this.user);
      console.log(this.img);
    })
  }

  setFile(evt){
    console.log(evt.target.files[0]);

    let reader = new FileReader();

    reader.onload = (event:any) => {
      this.img = event.target.result;
    }
    reader.readAsDataURL(evt.target.files[0]);

    this.file = evt.target.files[0];
    this.inputFileEmpty = false;
  }

  checkPasswordMatch(password, rePassword) {
    return password === rePassword;
  }

  checkPasswordChange(password, rePassword) {
    console.log(password + ":" + rePassword);
    if (password === '' && rePassword === '') this.passwordChange = false;
    else this.passwordChange = true;
  }

  changeAva(form: NgForm) {
    //store ava and info in formData
    const formData = new FormData();
    formData.append('file', this.file);
    formData.append('description', form.value.aboutme);

    //POST ava to server
    this.storyProvider.upload(formData).subscribe(response => {
      console.log(response);
      //Get file_id from response and pass it to tagFile()
      this.avaTag.file_id = response['file_id'];
      this.tagFile();
    }, (error: HttpErrorResponse) => {
      console.log(error.error.message);
      this.presentToast("Unable to post. Please check again");
    })
  }

  changeWithPassword(form: NgForm) {
    if(this.checkPasswordMatch(form.value.password, form.value.rePassword)){
      let newUserInfo = {
        username: form.value.username,
        password: form.value.password,
        email: form.value.email
      }

      //this.changeAva(form);

      //PUT to server
      this.userProvider.editUserData(newUserInfo).subscribe(response => {
        console.log(response);

        this.presentToast("All changes saved.");
        this.navCtrl.setRoot(ProfilePage);
      }, (error: HttpErrorResponse) => {
        console.log(error.error.message);
        this.presentToast("Unable to save changes. Please check again");
        form.reset();
      })
    } else {
      this.presentToast("Passwords do not match, please try again!")
    }
  }

  changeWithoutPassword(form: NgForm) {
    let newUserInfo = {
      username: form.value.username,
      email: form.value.email
    }

    //this.changeAva(form);

    //PUT to server
    this.userProvider.editUserData(newUserInfo).subscribe(response => {
      console.log(response);

      this.presentToast("All changes saved.");
      this.navCtrl.setRoot(ProfilePage);
    }, (error: HttpErrorResponse) => {
      console.log(error.error.message);
      this.presentToast("Unable to save changes. Please check again");
      form.reset();
    })
  }

  onSubmit(form: NgForm) {
    this.checkPasswordChange(form.value.password, form.value.rePassword);
    if (this.passwordChange) {
      console.log("change with password");
      this.changeWithPassword(form);
    } else {
      console.log("change without password");
      this.changeWithoutPassword(form);
    }
  }

  //ava tag
  tagFile(){
    this.storyProvider.postTag(this.avaTag).subscribe(response => {
      console.log(response);
    }, (error: HttpErrorResponse) => {
      console.log(error.error.message);
      console.log(this.avaTag);
      this.presentToast(error.error.message);
    })
  }

  presentToast(mess: string) {
    let toast = this.toastCtrl.create({
      message: mess,
      duration: 1500,
      position: 'bottom'
    });

    toast.present();
  }

  onDismiss() {
    this.viewCtrl.dismiss();
  }

}
