import {Component, ViewChild} from '@angular/core';
import {
  IonicPage, ModalController, NavController, Slides,
  ToastController,
} from 'ionic-angular';
import {TextToSpeech} from '@ionic-native/text-to-speech';
import {SocialSharing} from '@ionic-native/social-sharing';
import {StoryService} from '../../providers/story.service';
import {Story} from '../../model/story';
import {CommentsPage} from "../comments/comments";
import {FavouriteService} from '../../providers/favourite.service';
import {HttpErrorResponse} from '@angular/common/http';
import {UserService} from '../../providers/user.service';
import {Favourite} from "../../model/Favourite";
import {CommentService} from "../../providers/comment.service";
import {User} from '../../model/user';


@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})

export class HomePage {
  @ViewChild(Slides) slides: Slides;

  defaultTab = 'new';
  text: string;
  speaking: boolean = false;
  stories: Story[];
  mediaUrl = 'http://media.mw.metropolia.fi/wbma/uploads/';
  currentUser_id = localStorage.getItem('user_id');
  curTab: string;

  constructor(private textToSpeech: TextToSpeech,
              private socialSharing: SocialSharing,
              private storyProvider: StoryService,
              public navCtrl: NavController,
              public modalCtrl: ModalController,
              private favouriteProvider: FavouriteService,
              private userProvider: UserService,
              private toastCtrl: ToastController,
              private commentProvider: CommentService) {
  }

  onSegmentChange(event) {
    this.curTab = event.value;
    if (this.curTab === 'new') {
      console.log('new tab loaded');
      this.fetchStories();
      console.log(this.stories);
    } else if (this.curTab === 'hot') {
      // this.curTab = 'hot';
      console.log('hot tab loaded');
      this.stories.sort(this.compare);
    }
    else if (this.curTab === 'discover') {
      console.log('discover tab loaded');
      this.stories = this.shuffle(this.stories);
    }
  }

  onPresentCommentModal(file_id: string, index) {
    let commentModal = this.modalCtrl.create(CommentsPage, {file_id: file_id});
    commentModal.present();
    commentModal.onDidDismiss(() => {
      this.refreshLike(file_id, index);
      this.refreshComment(file_id, index);
    })
  }

  onRefresh() {
    this.fetchStories()
  }

  onTextSpeech(title: string, text: string) {
    console.log('onTextSpeech: ' + text)
    if (this.speaking) {
      this.textToSpeech.speak({text: ''});  // <<< speak an empty string to interrupt.
      this.speaking = false;
      return;
    }
    this.speaking = true;
    this.textToSpeech.speak({text:  `Title: ${title}, Story: ${text}`, locale: 'en-US', rate: 1.5})
      .then((val) => {
          this.speaking = false;
        },
        (reject) => {
          console.warn(reject);
          this.speaking = false;
        })
      .catch((err) => {
        console.error(err);
        this.speaking = false;
      });
  }

  onShare(message: string, subject: string, imageUrl: string) {
    console.log("onshare");
    this.socialSharing.share(message, subject, '', imageUrl)
      .then(() => {
        //success
      }).catch((e) => {
      //Error
    })
  }

  onClickLike(file_id, index){
    if (!this.stories[index].likedByUser) {
      this.like(file_id, index);
    } else this.unlike(file_id, index);

    //change liked state
    this.stories[index].likedByUser = !this.stories[index].likedByUser;
  }

  like(file_id, index) {
    this.favouriteProvider.postFav(file_id).subscribe(response => {
      console.log(response);
      this.refreshLike(file_id, index);
    }, (error: HttpErrorResponse) => {
      console.log(error.error.message);
    });
  }

  unlike(file_id, index){
    this.favouriteProvider.deleteFav(file_id).subscribe(response => {
      console.log(response);
      this.refreshLike(file_id, index);
    }, (error: HttpErrorResponse) => {
      console.log(error.error.message);
    })
  }

  refreshLike(file_id, index) {
    this.favouriteProvider.getFavById(file_id).subscribe(response => {
      this.stories[index].likesCount = response.length;
      console.log("new like count: " + this.stories[index].likesCount);
    });
  }

  refreshComment(file_id, index) {
    this.commentProvider.getCommentByPostId(file_id).subscribe(response => {
      this.stories[index].commentCount = response.length;
      console.log("new comment count: " + this.stories[index].commentCount);
    });
  }

  ionViewDidLoad() {
    this.fetchStories()
  }

  fetchStories() {
    this.storyProvider.getAllPost().subscribe(response => {
      this.stories = response;

      //add username to story
      this.stories.map(story => {
        this.userProvider.getUserDataById(story.user_id).subscribe(response => {
          story.username = response.username;
        });
      });

      //add like counts to story and indicate if story has been liked by current user
      this.stories.map(story => {
        this.favouriteProvider.getFavById(story.file_id).subscribe(response => {
          story.likesCount = response.length;
          story.likedByUser = false;
          if(response.length !== 0) {
            response.forEach(like => {
              if (like.user_id == this.currentUser_id) story.likedByUser = true;
            });
          }
        });
      });

      //add comment counts to story
      this.stories.map(story => {
        this.commentProvider.getCommentByPostId(story.file_id).subscribe(response => {
          story.commentCount = response.length;
        });
      });

      if(this.curTab === 'discover'){
        this.stories = this.shuffle(this.stories);
      }
      else if(this.curTab === 'hot') {
        this.stories.sort(this.compare);
      }

      console.log(this.stories);
    }, (error: HttpErrorResponse) => {
      this.presentToast(error.error.message);
    });

  }

  onDiscover(){

  }

  onHot(){

    console.log(this.stories);
  }


  presentToast(mess: string) {
    let toast = this.toastCtrl.create({
      message: mess,
      duration: 1500,
      position: 'bottom'
    });

    toast.present();
  }

  shuffle(arr: Array<Story>){
    let ctr = arr.length;
    let temp;
    let index;

    while(ctr > 0){
      index = Math.floor(Math.random()*ctr);
      ctr--;

      temp = arr[ctr];
      arr[ctr] = arr[index];
      arr[index] = temp;
    }

    return arr;
  }

  compare(a, b){
    const likeA: number = a.likesCount;
    const likeB: number = b.likesCount;

    let comparison = 0;
    if(likeA > likeB){
      comparison = 1;
    }
    else if(likeA < likeB){
      comparison = -1;
    }

    return comparison;
  }
}
