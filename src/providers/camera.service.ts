import { Injectable } from '@angular/core';
import { Camera } from '@ionic-native/camera';
import {normalizeURL, Platform} from 'ionic-angular';

@Injectable()
export class CameraService {

  constructor(private camera: Camera, private platform: Platform) {
  }

  getPictureFromCamera() {
    return new Promise((resolve, reject) => {
      const options: CameraOptions = {
        quality: 100,
        destinationType: this.platform.is('ios') ? this.camera.DestinationType.FILE_URI : this.camera.DestinationType.DATA_URL,
        encodingType: this.camera.EncodingType.JPEG,
        mediaType: this.camera.MediaType.PICTURE
      }

      this.camera.getPicture(options).then((imageData) => {

        let base64Image = null;

        //get photo from the camera based on platform type
        if (this.platform.is('ios'))
          base64Image = normalizeURL(imageData);
        else
          base64Image = "data:image/jpeg;base64," + imageData;

        resolve(base64Image);

      }, (error) => {
        console.debug("Unable to obtain picture: " + error, "app");
        reject(error);
      });
    })

  }

  getPictureFromPhotoLibrary() {
    return new Promise((resolve, reject) => {
      let cameraOptions = {
        sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
        destinationType: this.camera.DestinationType.FILE_URI,
        quality: 100,
        targetWidth: 1000,
        targetHeight: 1000,
        encodingType: this.camera.EncodingType.JPEG,
        correctOrientation: true
      }

      this.camera.getPicture(cameraOptions).then((file_uri) => {

        resolve(normalizeURL(file_uri));
      }, (error) => {
        console.debug("Unable to obtain picture: " + error, "app");
        reject(error);
      });
    })
  }
}
