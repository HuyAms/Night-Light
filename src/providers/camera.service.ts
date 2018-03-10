import {Injectable} from '@angular/core';
import {Camera} from '@ionic-native/camera';

@Injectable()
export class CameraService {

  constructor(private camera: Camera) {
  }

  getPictureFromCamera() {
    return new Promise((resolve, reject) => {

      const options: CameraOptions = {
        quality: 100,
        destinationType: this.camera.DestinationType.FILE_URI,
        sourceType: this.camera.PictureSourceType.CAMERA
      }

      this.camera.getPicture(options).then((imageData) => {
        resolve(imageData);
      }, (error) => {
        console.debug("Unable to obtain picture: " + error, "app");
        reject(error);
      });
    })

  }

  getPictureFromPhotoLibrary() {
    return new Promise((resolve, reject) => {

      const options: CameraOptions = {
        quality: 100,
        destinationType: this.camera.DestinationType.FILE_URI,
        sourceType: this.camera.PictureSourceType.PHOTOLIBRARY
      }

      this.camera.getPicture(options).then((imgData) => {
        resolve(imgData);
      }, (error) => {
        console.debug("Unable to obtain picture: " + error, "app");
        reject(error);
      });
    })
  }
}
