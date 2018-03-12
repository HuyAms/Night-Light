import {Component} from '@angular/core';
import {
  ActionSheetController, IonicPage, ModalController, NavParams, ToastController,
  ViewController,
} from 'ionic-angular';
import {CommentService} from "../../providers/comment.service";
import {Comment} from "../../model/comment";
import {HttpErrorResponse} from "@angular/common/http";
import {UserService} from "../../providers/user.service";
import {User} from "../../model/user";
import {ProfilePage} from "../profile/profile";
import {TagService} from "../../providers/tag.service.";

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
  myId: string;
  mediaUrl = 'http://media.mw.metropolia.fi/wbma/uploads/';

  constructor(public viewCtrl: ViewController,
              public navParams: NavParams,
              public modalCtrl: ModalController,
              private commentService: CommentService,
              private userService: UserService,
              private actionSheetCtrl: ActionSheetController,
              private toastCtrl: ToastController,
              private tagService: TagService) {
    this.file_id = navParams.get('file_id');
    this.myId = localStorage.getItem('user_id');
    this.fetchComments();
  }

attachUserInfo(comments) {
  comments.map(comment => {
    this.userService.getUserDataById(comment.user_id).subscribe(
      user => {
        comment.username = user.username;
      }
    );

    let tag = 'NiLiOfficial_ava_' + comment.user_id;
    this.tagService.getStorybyTag(tag).subscribe(response => {
      if (response[0]) {
        comment.user_ava = this.mediaUrl + response[0].filename;
      }
    });
  });
}

  fetchComments() {
    this.commentService.getCommentByPostId(this.file_id).subscribe(
      response => {
        this.comments = response;

        this.attachUserInfo(this.comments);

      }, (error: HttpErrorResponse) => {
        this.presentToast(error.error.message);
      }
    );
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
      }, (error: HttpErrorResponse) => {
        this.presentToast(error.error.message);
      }
    );
    this.comment = '';
  }

  onDismiss() {
    this.viewCtrl.dismiss();
  }

  onDelete(commentId) {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Delete your comment?',
      buttons: [
        {
          text: 'Delete',
          role: 'destructive',
          handler: () => {
            this.commentService.deleteComment(commentId).subscribe(
              response => {
                //success
                this.fetchComments();
              }, (error: HttpErrorResponse) => {
                this.presentToast(error.error.message);
              }
            )
          }
        },{
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    actionSheet.present();
  }

  presentToast(mess: string) {
    let toast = this.toastCtrl.create({
      message: mess,
      duration: 1500,
      position: 'bottom'
    });

    toast.present();
  }

  onGoToProfile(userId) {
    this.onPresentProfileModal(userId);
  }

  onPresentProfileModal(userId) {
    let profileModal = this.modalCtrl.create(ProfilePage, {user_id: userId});
    profileModal.present();
    profileModal.onDidDismiss(() => {
      this.fetchComments();
    })
  }
}
