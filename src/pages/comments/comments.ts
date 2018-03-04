import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {CommentServiceProvider} from "../../providers/comment.service";
import {NgForm} from "@angular/forms";

@IonicPage()
@Component({
  selector: 'page-comments',
  templateUrl: 'comments.html',
})
export class CommentsPage {
  file_id: string;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public commentService: CommentServiceProvider) {
    this.file_id = navParams.get('file_id');
  }

  postComment(form: NgForm) {
    const newComment = {
      file_id: this.file_id,
      comment: form.value.Comment
    }
    return this.commentService.postComment(newComment).subscribe();
  }

  ionViewDidLoad() {

  }

}
