import {Component, ViewChild} from '@angular/core';
import {
  IonicPage, ModalController, NavController, NavParams, Slides,
  ToastController, ViewController,
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
import {ProfilePage} from "../profile/profile";


@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})

export class HomePage {
  @ViewChild(Slides) slides: Slides;

  defaultTab = 'discover';
  text: string;
  speaking: boolean = false;
  stories: Story[];
  mediaUrl = 'http://media.mw.metropolia.fi/wbma/uploads/';
  currentUser_id = localStorage.getItem('user_id');
  mode: string;
  singleStory_id: number;
  calledFromProfile: boolean;

  constructor(private textToSpeech: TextToSpeech,
              private socialSharing: SocialSharing,
              private storyProvider: StoryService,
              public navCtrl: NavController,
              public viewCtrl: ViewController,
              public navParams: NavParams,
              public modalCtrl: ModalController,
              private favouriteProvider: FavouriteService,
              private userProvider: UserService,
              private toastCtrl: ToastController,
              private commentProvider: CommentService) {
    this.mode = navParams.get('mode');
    this.singleStory_id = navParams.get('file_id');
    if (this.mode) {
      this.calledFromProfile = true;
    }
  }

  onSegmentChange(event) {
    let tab = event.value;
    if (tab === 'new') {
      console.log('new tab loaded');
    } else if (tab === 'hot') {
      // this.curTab = 'hot';
      console.log('hot tab loaded');
    }
    else if (tab === 'discover') {
      console.log('discover tab loaded');
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
    this.loadHomeContent()
  }

  onTextSpeech(title: string, text: string) {
    console.log('onTextSpeech: ' + text)
    if (this.speaking) {
      this.textToSpeech.speak({text: ''});  // <<< speak an empty string to interrupt.
      this.speaking = false;
      return;
    }
    this.speaking = true;
    this.textToSpeech.speak({text: `Title: ${title}, Story: ${text}`, locale: 'en-GB', rate: 1.5})
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
    console.log("onshare")
    this.socialSharing.share(message, subject, '', imageUrl)
      .then(() => {
        //success
      }).catch((e) => {
      //Error
    })
  }

  onClickLike(file_id, index) {
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

  unlike(file_id, index) {
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

  attachLikeCount(stories) {
    stories.map(story => {
      this.favouriteProvider.getFavById(story.file_id).subscribe(response => {
        story.likesCount = response.length;
        story.likedByUser = false;
        if (response.length !== 0) {
          response.forEach(like => {
            if (like.user_id == this.currentUser_id) story.likedByUser = true;
          });
        }
      });
    });
  }

  attachCommentCount(stories) {
    stories.map(story => {
      this.commentProvider.getCommentByPostId(story.file_id).subscribe(response => {
        story.commentCount = response.length;
      });
    });
  }

  ionViewDidLoad() {
    this.loadHomeContent();
  }

  loadHomeContent() {
    if(!this.calledFromProfile) {
      this.fetchStories();
    } else {
      this.fetchSingleStory(this.singleStory_id);
    }
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

      //add number of like to each story and indicate if it's been liked by user
      this.attachLikeCount(this.stories);

      //add comment counts to story
      this.attachCommentCount(this.stories);

    }, (error: HttpErrorResponse) => {
      this.presentToast(error.error.message);
    });
  }

  fetchSingleStory(file_id) {
    this.storyProvider.getSinglePost(file_id).subscribe(response => {

      this.stories = [];
      this.stories.push(response);

      //add username to story
      this.stories.map(story => {
        this.userProvider.getUserDataById(story.user_id).subscribe(response => {
          story.username = response.username;
        });
      });

      //add number of like to each story and indicate if it's been liked by user
      this.attachLikeCount(this.stories);

      //add comment counts to story
      this.attachCommentCount(this.stories);

    }, (error: HttpErrorResponse) => {
      this.presentToast(error.error.message);
    });
  }

  onGoToProfile(userId) {
    this.onPresentProfileModal(userId);
  }

  onPresentProfileModal(userId) {
    let profileModal = this.modalCtrl.create(ProfilePage, {user_id: userId});
    profileModal.present();
    profileModal.onDidDismiss(() => {
      this.onRefresh();
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

  onDismiss() {
    this.viewCtrl.dismiss();
  }
}
