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
  currentIndex: number = 1;
  numberOfStory: number;
  mediaUrl = 'http://media.mw.metropolia.fi/wbma/uploads/';

  constructor(private textToSpeech: TextToSpeech,
              private socialSharing: SocialSharing,
              private storyService: StoryService,
              public navCtrl: NavController,
              public modalCtrl: ModalController,
              private favouriteProvider: FavouriteService,
              private userProvider: UserService,
              private toastCtrl: ToastController,
              private commentProvider: CommentService) {
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

  onPresentCommentModal(file_id: string) {
    let commentModal = this.modalCtrl.create(CommentsPage, {file_id: file_id});
    commentModal.present();
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
    console.log("onshare")
    this.socialSharing.share(message, subject, '', imageUrl)
      .then(() => {
        //success
      }).catch((e) => {
      //Error
    })
  }

  onLike(file_id, index){

    this.favouriteProvider.postFav(file_id).subscribe(response => {
      console.log(response);
    }, (error: HttpErrorResponse) => {
      console.log(error.error.message);
    });

    //refresh like
    this.favouriteProvider.getFavById(file_id).subscribe(response => {
      this.stories[index].likesCount = response.length;
      console.log("new like count: " +this.stories[index].likesCount);
    });
  }

  onUnlike(file_id){
    this.favouriteProvider.deleteFav(file_id).subscribe(response => {
      console.log(response);
    }, (error: HttpErrorResponse) => {
      console.log(error.error.message);
    })
  }

  ionViewDidLoad() {
    this.fetchStories()
  }

  fetchStories() {
    this.storyService.getAllPost().subscribe(response => {
      this.stories = response;
      this.numberOfStory = this.stories.length;

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
        });
      });

      //add comment counts to story
      this.stories.map(story => {
        this.commentProvider.getCommentByPostId(story.file_id).subscribe(response => {
          story.commentCount = response.length;
        });
      });


    }, (error: HttpErrorResponse) => {
      this.presentToast(error.error.message);
    });
  }

  slideChanged() {
    this.currentIndex = this.slides.realIndex + 1;
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
