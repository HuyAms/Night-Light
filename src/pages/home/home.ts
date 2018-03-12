import {Component, ViewChild} from '@angular/core';
import {
  ActionSheetController,
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
import {CommentService} from "../../providers/comment.service";
import {ProfilePage} from "../profile/profile";
import {SettingsService} from "../../providers/settings.service";
import {Subject} from "rxjs/Subject";
import {TagService} from "../../providers/tag.service.";


@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})

export class HomePage {
  @ViewChild(Slides) slides: Slides;
  text: string;
  speaking: boolean = false;
  stories: Story[];
  storiesTemp: Story[];
  mediaUrl = 'http://media.mw.metropolia.fi/wbma/uploads/';
  currentUser_id = localStorage.getItem('user_id');
  curTab: string = 'discover';
  mode: string;
  singleStory_id: number;
  calledFromProfile: boolean;
  likeDoneSubject = new Subject<Boolean>();


  constructor(private textToSpeech: TextToSpeech,
              private socialSharing: SocialSharing,
              private storyService: StoryService,
              public navCtrl: NavController,
              public viewCtrl: ViewController,
              public navParams: NavParams,
              public modalCtrl: ModalController,
              private favoriteService: FavouriteService,
              private userService: UserService,
              private toastCtrl: ToastController,
              private commentService: CommentService,
              private settingsService: SettingsService,
              private actionSheetCtrl: ActionSheetController,
              private tagService: TagService) {
    this.mode = navParams.get('mode');
    this.singleStory_id = navParams.get('file_id');
    if (this.mode) {
      this.calledFromProfile = true;
    }
  }

  ionViewDidLoad() {
    this.loadHomeContent();
    this.handleTabsChange();
  }

  handleTabsChange() {
    this.likeDoneSubject.subscribe(
      (data) => {
        if (this.curTab === 'hot') {
          this.stories= this.storiesTemp.sort(this.compareStoriesByLike);
          this.slides.update();
        }
        else if (this.curTab === 'discover') {
          this.stories = this.shuffle(this.storiesTemp);
          this.slides.update();
        } else if (this.curTab === 'new') {
          this.stories = this.storiesTemp.reverse();
          this.slides.update();
        }
      }
    )
  }

  enableSound() {
    return this.settingsService.hasSound();
  }

  onPresentCommentModal(file_id: string, index) {
    let commentModal = this.modalCtrl.create(CommentsPage, {file_id: file_id});
    commentModal.present();
    commentModal.onDidDismiss(() => {
      this.refreshLike(file_id, index);
      this.refreshComment(file_id, index);
    })
  }

  onTextSpeech(title: string, text: string) {
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

  onDismiss() {
    this.viewCtrl.dismiss();
  }

  onShare(message: string, subject: string, imageUrl: string) {
    this.socialSharing.share(message, subject, '', imageUrl)
      .then(() => {
        //success
      }).catch((e) => {
      //Error
    })
  }

  onDelete(file_id) {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Delete this post?',
      buttons: [
        {
          text: 'Delete',
          role: 'destructive',
          icon: 'trash',
          handler: () => {
            this.storyService.deletePost(file_id).subscribe(response => {
              if (this.calledFromProfile) this.onDismiss();
            }, error => {
              this.presentToast(error);
            })
          }
        },{
          text: 'Cancel',
          role: 'cancel',
          icon: 'close',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    actionSheet.present();

  }

  onClickLike(file_id, index) {
    if (!this.stories[index].likedByUser) {
      this.like(file_id, index);
    } else this.unlike(file_id, index);

    //change liked state
    this.stories[index].likedByUser = !this.stories[index].likedByUser;
  }

  like(file_id, index) {
    this.favoriteService.postFav(file_id).subscribe(response => {
      this.refreshLike(file_id, index);
    }, (error: HttpErrorResponse) => {
      console.log(error.error.message);
    });
  }

  unlike(file_id, index) {
    this.favoriteService.deleteFav(file_id).subscribe(response => {
      this.refreshLike(file_id, index);
    }, (error: HttpErrorResponse) => {
      console.log(error.error.message);
    })
  }

  onRefresh(refresher) {
    this.loadHomeContent();
    this.slides.slideTo(0);
    refresher.complete();
  }

  refreshLike(file_id, index) {
    this.favoriteService.getFavById(file_id).subscribe(response => {
      this.stories[index].likesCount = response.length;
    });
  }

  refreshComment(file_id, index) {
    this.commentService.getCommentByPostId(file_id).subscribe(response => {
      this.stories[index].commentCount = response.length;
    });
  }

  loadHomeContent() {
    if (!this.calledFromProfile) {
      this.fetchStories();
    } else {
      this.fetchSingleStory(this.singleStory_id);
    }
  }

  onGoToProfile(userId) {
    this.onPresentProfileModal(userId);
  }

  onPresentProfileModal(userId) {
    let profileModal = this.modalCtrl.create(ProfilePage, {user_id: userId, fromHome: 'true'});
    profileModal.present();
  }

  presentToast(mess: string) {
    let toast = this.toastCtrl.create({
      message: mess,
      duration: 1500,
      position: 'bottom'
    });

    toast.present();
  }

  attachAvatar(stories) {
    stories.map(story => {
      let tag = 'NiLiOfficial_ava_' + story.user_id;
      this.tagService.getStorybyTag(tag).subscribe(response => {
        if (response[0]) {
          story.user_ava = this.mediaUrl + response[0].filename;
        }
      });
      });
  }

  attachLikeCount(stories) {
    let like = 0;
    stories.map(story => {
      this.favoriteService.getFavById(story.file_id).subscribe(response => {
        story.likesCount = response.length;
        story.likedByUser = false;
        if (response.length !== 0) {
          response.forEach(like => {
            if (like.user_id == this.currentUser_id) story.likedByUser = true;
          });
        }
        like++;
        if (like == this.storiesTemp.length) {
          this.likeDoneSubject.next(true);
        }
      });
    });
  }

  attachCommentCount(stories) {
    stories.map(story => {
      this.commentService.getCommentByPostId(story.file_id).subscribe(response => {
        story.commentCount = response.length;
      });
    });
  }

  fetchSingleStory(file_id) {
    this.storyService.getSinglePost(file_id).subscribe(response => {

      this.stories = [];
      this.stories.push(response);
      this.storiesTemp = this.stories;

      //add username to story
      this.stories.map(story => {
        this.userService.getUserDataById(story.user_id).subscribe(response => {
          story.username = response.username;
        });
      });

      //add profile picture to stories
      this.attachAvatar(this.stories);

      //add number of like to each story and indicate if it's been liked by user
      this.attachLikeCount(this.stories);

      //add comment counts to story
      this.attachCommentCount(this.stories);

    }, (error: HttpErrorResponse) => {
      this.presentToast(error.error.message);
    });
  }

  fetchStories() {
    this.tagService.getAllPost().subscribe(response => {
      this.storiesTemp = response;

      //add username to story
      this.storiesTemp.map(story => {
        this.userService.getUserDataById(story.user_id).subscribe(response => {
          story.username = response.username;
        });
      });

      //add number of like to each story and indicate if it's been liked by user
      this.attachLikeCount(this.storiesTemp);

      //add profile picture to stories
      this.attachAvatar(this.storiesTemp);

      //add comment counts to story
      this.attachCommentCount(this.storiesTemp);

    }, (error: HttpErrorResponse) => {
      this.presentToast(error.error.message);
    })
  }


  onSegmentChange(event) {
    this.curTab = event.value;
    this.loadHomeContent();
    this.slides.slideTo(0, 0);
  }

  shuffle(stories: Story[]) {
    let shuffleStories = [...stories];
    let ctr = shuffleStories.length;
    let temp;
    let index;

    while (ctr > 0) {
      index = Math.floor(Math.random() * ctr);
      ctr--;

      temp = shuffleStories[ctr];
      shuffleStories[ctr] = shuffleStories[index];
      shuffleStories[index] = temp;
    }

    return shuffleStories;
  }

  compareStoriesByLike(a: Story, b: Story) {
    let likeA = a.likesCount;
    let likeB = b.likesCount;

    let comparison = 0;
    if (likeB > likeA) {
      comparison = 1;
    }
    else if (likeB < likeA) {
      comparison = -1;
    }

    return comparison;
  }
}
