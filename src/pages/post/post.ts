import {Component} from '@angular/core';
import {
  ActionSheetController,
  IonicPage, LoadingController, ModalController, NavController, NavParams, Platform,
  ToastController,
} from 'ionic-angular';
import {NgForm} from "@angular/forms";
import {StoryService} from '../../providers/story.service';
import {HttpErrorResponse} from '@angular/common/http';
import {PostTag} from '../../model/postTag';
import {HomePage} from '../home/home';
import {Story} from "../../model/story";
import {FavouriteService} from "../../providers/favourite.service";
import {CommentsPage} from "../comments/comments";
import {CameraService} from "../../providers/camera.service";


@IonicPage()
@Component({
  selector: 'page-post',
  templateUrl: 'post.html',
})
export class PostPage {

  img: any;
  imgPlaceHolder: string = 'assets/imgs/camera_placeholder.png';

  //Tag values to post tag to image
  postTag: PostTag = {
    file_id: 0,
    tag: 'nightlight'
  }

  constructor(public navCtrl: NavController,
              public actionsheetCtrl: ActionSheetController,
              private storyProvider: StoryService,
              private toastCtrl: ToastController,
              public platform: Platform,
              public loadingCtrl: LoadingController,
              public cameraService: CameraService) {
  }

  ionViewWillLoad() {
  }

  onSubmit(form: NgForm) {
    // //store file and info in formData
    // const formData = new FormData();
    // formData.append('title', form.value.title);
    // formData.append('description', form.value.description);
    // formData.append('file', this.file);
    //
    // //POST to server
    // this.storyProvider.upload(formData).subscribe(response => {
    //   console.log(response);
    //   //Get file_id from response and pass it to tagFile()
    //   this.postTag.file_id = response['file_id'];
    //   console.log(response['file_id']);
    //   this.tagFile();
    //   this.navCtrl.setRoot(HomePage);
    // }, (error: HttpErrorResponse) => {
    //   console.log(error.error.message);
    //   this.presentToast("Unable to post. Please check again");
    //   form.reset();
    // })
  }

  //post tag
  tagFile() {
    this.storyProvider.postTag(this.postTag).subscribe(response => {
      console.log(response);
    }, (error: HttpErrorResponse) => {
      console.log(error.error.message);
      console.log(this.postTag);
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

  onOpenCamera() {
    const actionsheet = this.actionsheetCtrl.create({
      title: 'Choose image',
      buttons: [
        {
          text: 'camera',
          icon: !this.platform.is('ios') ? 'camera' : null,
          handler: () => {
            this.takePicture();
          }
        },
        {
          text: !this.platform.is('ios') ? 'gallery' : 'camera roll',
          icon: !this.platform.is('ios') ? 'image' : null,
          handler: () => {
            this.getPicture();
          }
        },
        {
          text: 'cancel',
          icon: !this.platform.is('ios') ? 'close' : null,
          role: 'destructive',
          handler: () => {
            console.log('the user has cancelled the interaction.');
          }
        }
      ]
    });
    return actionsheet.present();
  }

  takePicture() {
    const loading = this.loadingCtrl.create();

    loading.present();
    return this.cameraService.getPictureFromCamera().then(picture => {
      if (picture) {
        this.img = picture;
      }
      loading.dismiss();
    }, error => {
      alert(error);
    });
  }

  getPicture() {
    const loading = this.loadingCtrl.create();

    loading.present();
    return this.cameraService.getPictureFromPhotoLibrary().then(picture => {
      if (picture) {
        this.img = picture;
      }
      loading.dismiss();
    }, error => {
      alert(error);
    });
  }

  getPreviewImage() {
    console.log(this.img);
    if (this.img) {
      console.log('imgae');
      return this.img;
    } else {
      console.log('imgPlaceHolder');

      return this.imgPlaceHolder;
    }
  }
}
