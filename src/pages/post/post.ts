import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {NgForm} from "@angular/forms";
import {StoryService} from '../../providers/story.service';
import {HttpErrorResponse} from '@angular/common/http';
import {PostTag} from '../../model/postTag';
import {HomePage} from '../home/home';


@IonicPage()
@Component({
  selector: 'page-post',
  templateUrl: 'post.html',
})
export class PostPage {

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private storyProvider: StoryService){
  }

  file: File;

  //Tag values to post tag to image
  postTag: PostTag = {
    file_id: 0,
    tag: 'nightlight'
  }

  setFile(evt){
    console.log(evt.target.files[0]);
    this.file = evt.target.files[0];
  }

  onSubmit(form: NgForm) {
    console.log(form.value);
    //store file and info in formData
    const formData = new FormData();
    formData.append('title', form.value.title);
    formData.append('description', form.value.description);
    formData.append('file', this.file);
    //POST to server
    this.storyProvider.upload(formData).subscribe(response =>{
      console.log(response);
      //Get file_id from response and pass it to tagFile()
      this.postTag.file_id = response['file_id'];
      console.log(response['file_id']);
      this.tagFile();
      this.navCtrl.setRoot(HomePage);
    },(error: HttpErrorResponse)=>{
      console.log(error.error.message);
    })
  }
  //post tag
  tagFile(){
    this.storyProvider.postTag(this.postTag).subscribe(response => {
      console.log(response);
    }, (error: HttpErrorResponse) => {
      console.log(error.error.message);
      console.log(this.postTag);
    })
  }

}
