import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams, ToastController, ViewController} from 'ionic-angular';
import {User} from "../../model/user";
import {UserService} from "../../providers/user.service";
import {NgForm} from "@angular/forms";
import {HttpErrorResponse} from "@angular/common/http";
import {PostTag} from "../../model/postTag";
import {StoryService} from "../../providers/story.service";
import {Story} from "../../model/story";
import {TagService} from "../../providers/tag.service.";

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
  avaChange: boolean;
  aboutChange: boolean;
  currentAva: Story;
  haveAva: boolean;
  mediaUrl = 'http://media.mw.metropolia.fi/wbma/uploads/';

  //Tag values to post tag to image
  avaTag: PostTag = {
    file_id: 0,
    tag: 'NiLiOfficial_ava_' + this.user_id
  }

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private viewCtrl: ViewController,
              public toastCtrl: ToastController,
              private userProvider: UserService,
              private storyService: StoryService,
              private tagService: TagService) {
    this.haveAva = navParams.get('haveAva');
    this.currentAva = navParams.get('userAva');
    if(this.haveAva) {
      this.img = this.mediaUrl + this.currentAva.filename;
    } else {
      this.img = 'assets/imgs/Generic-Profile.png';
    }
  }

  ionViewDidLoad() {
    this.requestUserInfo();
  }

  requestUserInfo() {
    this.userProvider.getUserDataById(this.user_id).subscribe(response => {
      this.user = response;
      this.user.password = '';
    })
  }

  setFile(evt){
    this.avaChange = true;
    if (evt.target.files[0]) {
      this.avaChange = true;

      let reader = new FileReader();

      reader.onload = (event: any) => {
        this.img = event.target.result;
      }
      reader.readAsDataURL(evt.target.files[0]);

      this.file = evt.target.files[0];
      this.inputFileEmpty = false;
    }
  }

  checkPasswordMatch(password, rePassword) {
    return password === rePassword;
  }

  checkPasswordChange(password, rePassword) {
    if (password === '' && rePassword === '') this.passwordChange = false;
    else this.passwordChange = true;
  }

  checkAboutChange(aboutme: string, description: string) {
    console.log(aboutme + " : " + description);
    this.aboutChange = aboutme !== description;
  }

  changeAva(form: NgForm) {
    //store ava and info in formData
    const formData = new FormData();
    formData.append('file', this.file);
    formData.append('description', form.value.aboutme);

    //POST ava to server
    this.storyService.upload(formData).subscribe(response => {
      console.log(response);

      //Get file_id from response and pass it to tagFile()
      this.avaTag.file_id = response['file_id'];
      this.tagFile();

      //Delete old profile pic
      if (this.currentAva) {
        this.storyService.deletePost(this.currentAva.file_id).subscribe(response => {
          console.log(response);
        }, (error: HttpErrorResponse) => {
          this.presentToast("Unable to post. Please check again");
        })
      }
    }, (error: HttpErrorResponse) => {
      this.presentToast("Unable to change. Please check again");
    });
  }

  changeAboutMeOnly(aboutMe: string) {
    //store ava and info in formData
    let description = {
      description: aboutMe
    }
    //PUT old ava with new 'about me' to server
    this.storyService.putPostInfo(this.currentAva.file_id, description).subscribe(response => {
      console.log(response);
    }, (error: HttpErrorResponse) => {
      console.log(error);
      this.presentToast("Unable to change. Please check again");
    });
  }

  changeWithPassword(form: NgForm) {
    if(this.checkPasswordMatch(form.value.password, form.value.rePassword)){
      let newUserInfo = {
        username: form.value.username,
        password: form.value.password,
        email: form.value.email
      }

      if (this.avaChange) {
        this.changeAva(form);
      } else if (this.aboutChange) {
        this.changeAboutMeOnly(form.value.aboutme);
      }

      //PUT to server
      this.userProvider.editUserData(newUserInfo).subscribe(response => {
        console.log(response);

        this.presentToast("All changes saved.");
        this.onDismiss();
      }, (error: HttpErrorResponse) => {
        this.presentToast("Unable to save changes. Please check again");
        form.reset();
      })
    } else {
      this.presentToast("Passwords do not match. Please try again!")
    }
  }

  changeWithoutPassword(form: NgForm) {
    let newUserInfo = {
      username: form.value.username,
      email: form.value.email
    }

    if (this.avaChange) {
      this.changeAva(form);
    } else if (this.aboutChange) {
      console.log("Desc only");
      this.changeAboutMeOnly(form.value.aboutme);
    }

    //PUT to server
    this.userProvider.editUserData(newUserInfo).subscribe(response => {
      console.log(response);

      this.presentToast("All changes saved.");
      this.onDismiss();
    }, (error: HttpErrorResponse) => {
      this.presentToast("Unable to save changes. Please check again");
      form.reset();
    })
  }

  onSubmit(form: NgForm) {
    this.checkPasswordChange(form.value.password, form.value.rePassword);
    if(this.haveAva) this.checkAboutChange(form.value.aboutme, this.currentAva.description);
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
    this.tagService.postTag(this.avaTag).subscribe(response => {
      console.log(response);
    }, (error: HttpErrorResponse) => {
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
