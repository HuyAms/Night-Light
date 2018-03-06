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

  constructor(public viewCtrl: ViewController,
              public navParams: NavParams,
              public modalCtrl: ModalController,
              private commentService: CommentService,
              private userService: UserService,
              private actionSheetCtrl: ActionSheetController,
              private toastCtrl: ToastController) {
    this.file_id = navParams.get('file_id');
    this.myId = localStorage.getItem('user_id');
    console.log(this.myId);
    this.fetchComments();
  }


  fetchComments() {
    console.log(this.file_id);
    this.commentService.getCommentByPostId(this.file_id).subscribe(
      response => {
        this.comments = response;
        console.log(response);
        this.comments.map(comment => {
          this.userService.getUserDataById(comment.user_id).subscribe(
            user => {
              comment.username = user.username;
            }
          );
        });
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
      title: 'Delete your comment',
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
