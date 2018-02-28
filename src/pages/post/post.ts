import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {NgForm} from "@angular/forms";
import { Camera, CameraOptions } from '@ionic-native/camera';


@IonicPage()
@Component({
  selector: 'page-post',
  templateUrl: 'post.html',
})
export class PostPage {

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private camera: Camera) {
  }


  onSubmit(form: NgForm) {
    console.log(form)
  }

  onOpenCamera() {
    const options: CameraOptions = {
      quality: 100,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      correctOrientation: true
    }

    this.camera.getPicture(options).then((imageData) => {
      //imageData is image JPEG file that we need to send to server
      console.log(imageData)

    }, (err) => {
      console.log(err)
    });

  }

}
