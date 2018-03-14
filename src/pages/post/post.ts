import { Component } from '@angular/core';
import {IonicPage, NavController, ToastController} from 'ionic-angular';
import {NgForm} from "@angular/forms";
import {StoryService} from '../../providers/story.service';
import {HttpErrorResponse} from '@angular/common/http';
import {PostTag} from '../../model/postTag';
import {HomePage} from '../home/home';
import {TagService} from "../../providers/tag.service.";


@IonicPage()
@Component({
  selector: 'page-post',
  templateUrl: 'post.html',
})
export class PostPage {

  constructor(public navCtrl: NavController,
              private storyService: StoryService,
              private tagService: TagService,
              private toastCtrl: ToastController){
  }

  file: File;
  inputFileEmpty: boolean = true;
  img: any;

  //Tag values to post tag to image
  postTag: PostTag = {
    file_id: 0,
    tag: 'NiLiOfficial'
  }

  setFile(evt){
    if (evt.target.files[0]) {
      let reader = new FileReader();

      reader.onload = (event: any) => {
        this.img = event.target.result;
      }
      reader.readAsDataURL(evt.target.files[0]);

      this.file = evt.target.files[0];
      this.inputFileEmpty = false;
    }
  }

  onSubmit(form: NgForm) {
    if(!this.inputFileEmpty) {
      console.log(form.value);

      //store file and info in formData
      const formData = new FormData();
      formData.append('title', form.value.title);
      formData.append('description', form.value.description);
      formData.append('file', this.file);

      //POST to server
      this.storyService.upload(formData).subscribe(response => {
        //Get file_id from response and pass it to tagFile()
        this.postTag.file_id = response['file_id'];
        this.tagFile();
        this.presentToast("Thanks for sharing your story!")
        this.navCtrl.setRoot(HomePage);
      }, (error: HttpErrorResponse) => {
        console.log(error.error.message);
        this.presentToast("Unable to post. Please check again");
        form.reset();
      })
    } else this.presentToast("Please attach a picture!")
  }

  //post tag
  tagFile(){
    this.tagService.postTag(this.postTag).subscribe(response => {
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

}
