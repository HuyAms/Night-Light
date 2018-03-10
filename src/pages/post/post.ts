import {Component} from '@angular/core';
import {
  ActionSheetController,
  IonicPage,
  LoadingController,
  NavController,
  Platform,
  ToastController,
} from 'ionic-angular';
import {NgForm} from "@angular/forms";
import {StoryService} from '../../providers/story.service';
import {HttpErrorResponse} from '@angular/common/http';
import {PostTag} from '../../model/postTag';
import {CameraService} from "../../providers/camera.service";
import {MediaService} from "../../providers/media.service";
import {HomePage} from "../home/home";

@IonicPage()
@Component({
  selector: 'page-post',
  templateUrl: 'post.html',
})
export class PostPage {

  imageURI:any;
  imgPlaceHolder: string = 'assets/imgs/camera_placeholder.png';

  //Tag values to post tag to image
  postTag: PostTag = {
    file_id: 0,
    tag: 'nightlight'
  }

  constructor(public navCtrl: NavController,
              private actionsheetCtrl: ActionSheetController,
              private storyProvider: StoryService,
              private toastCtrl: ToastController,
              private platform: Platform,
              private loadingCtrl: LoadingController,
              private cameraService: CameraService,
              private mediaService: MediaService) {
  }

  ionViewWillLoad() {
  }

  onSubmit(form: NgForm) {
    console.log('submittt')
    const title = form.value.title;
    const description = form.value.description;
    if (this.imageURI) {
      this.mediaService.uploadFile(title, description, this.imageURI)
        .then(response => {
          console.log('upload successfully')
          this.postTag.file_id = response['file_id'];
          this.presentToast( response['file_id'] + '');
          this.presentToast("upload successfully");
          console.log(this.postTag.file_id);
          this.tagFile();
          this.navCtrl.setRoot(HomePage);
          form.reset();
        })
        .catch(error => {
          console.log(error);
          this.presentToast("Unable to post. Please check again");
        })
    } else {
      this.presentToast("Please select a picture");
    }
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
            console.log('take picture');
          }
        },
        {
          text: !this.platform.is('ios') ? 'gallery' : 'camera roll',
          icon: !this.platform.is('ios') ? 'image' : null,
          handler: () => {
            this.getPicture();
            console.log('get picture');
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
    this.cameraService.getPictureFromCamera()
      .then(data => {
        this.imageURI = data;
        console.log(this.imageURI);
      })
      .catch(error => {
        console.log(error);
      });
  }

  getPicture() {
    this.cameraService.getPictureFromPhotoLibrary()
      .then(data => {
        this.imageURI = data;
        console.log(this.imageURI);
      })
      .catch(error => {
        console.log(error);
      });
  }
}
