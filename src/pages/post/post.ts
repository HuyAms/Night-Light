import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {NgForm} from "@angular/forms";
import { Camera, CameraOptions } from '@ionic-native/camera';
import {PostInfo} from '../../app/interface/postInfo';
import {StoryService} from '../../providers/story.service';
import {HttpErrorResponse} from '@angular/common/http';
import {PostTag} from '../../app/interface/postTag';
import {HomePage} from '../home/home';


@IonicPage()
@Component({
  selector: 'page-post',
  templateUrl: 'post.html',
})
export class PostPage {

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private camera: Camera,
              private storyProvider: StoryService){
  }

  imageURI: string;
  imageFileName: string;

  postInfo: PostInfo = {
    file: '',
    title: '',
    description: ''
  };
  //Tag values to post tag to image
  postTag: PostTag = {
    fileId: '',
    tag: 'nightlight' //need to reevaluate
  }

  onSubmit(form: NgForm) {
    console.log(form.value);
    //assign post info
    this.postInfo.description = form.value.description;
    this.postInfo.title = form.value.title;
    this.postInfo.file = this.imageURI;
    //POST story
    this.storyProvider.upload(this.postInfo).subscribe(response => {
      console.log(response);
      //Post tage to file
      this.postTag.fileId = response['file_id'];
      this.tagFile();
      //return to homepage
      this.navCtrl.setRoot(HomePage);
    }, (error: HttpErrorResponse) => {
      console.log(error.error.message);
    });
  }

  onOpenCamera() {
    const options: CameraOptions = {
      quality: 100,
      encodingType: this.camera.EncodingType.JPEG,
      destinationType: this.camera.DestinationType.FILE_URI,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY, //allow get image from local storage
      mediaType: this.camera.MediaType.PICTURE,
      correctOrientation: true
    }

    this.camera.getPicture(options).then((imageData) => {
      //imageData is image JPEG file that we need to send to server
      console.log(imageData)
      this.imageURI = imageData; //get image's URI
    }, (err) => {
      console.log(err);
    });

  }
  //post tag
  tagFile(){
    this.storyProvider.postTag(this.postTag).subscribe(response => {
      console.log(response);
    }, error => {
      console.log(error.error.message);
    })
  }

}
