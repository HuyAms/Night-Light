import {Component} from '@angular/core';
import {IonicPage, NavParams, ViewController} from 'ionic-angular';
import {CommentService} from "../../providers/comment.service";
import {Comment} from "../../model/comment";
import {HttpErrorResponse} from "@angular/common/http";
import {UserService} from "../../providers/user.service";
import {User} from "../../model/user";

@IonicPage()
@Component({
  selector: 'page-comments',
  templateUrl: 'comments.html',
})
export class CommentsPage {
  file_id: string;
  user: User;
  comments: Comment[];
  comment: string = '';

  constructor(public viewCtrl: ViewController,
              public navParams: NavParams,
              public commentService: CommentService,
              public userService: UserService) {
    this.file_id = navParams.get('file_id');

    this.fetchComments();
  }


  fetchComments() {
    console.log(this.file_id);
    this.commentService.getCommentByPostId(this.file_id).subscribe(
      response => {
        this.comments = response;
        console.log(response);
      }, (error: HttpErrorResponse) => {
        //console.log(error.error.message);
      }
    );
  }

  fetchUserInfo(userId) {
    this.userService.getUserDataById(userId).subscribe(
      response => {
        this.user = response;
      }, (error: HttpErrorResponse) => {
        //error
      }

    )
  }

  postComment() {
    const newComment = {
      file_id: this.file_id,
      comment: this.comment
    }
    this.commentService.postComment(newComment).subscribe(
      response => {
        console.log(response);
        this.fetchComments();
      }
    );
    this.comment = '';
  }

  onDismiss() {
    this.viewCtrl.dismiss();
  }

}
