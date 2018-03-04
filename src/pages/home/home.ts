import {Component} from '@angular/core';
import {ActionSheetController, IonicPage, NavController, NavParams} from 'ionic-angular';
import {TextToSpeech} from '@ionic-native/text-to-speech';
import {SocialSharing} from '@ionic-native/social-sharing';
import {StoryService} from '../../providers/story.service';
import {HttpErrorResponse} from '@angular/common/http';
import {Story} from '../../model/story';
import {CommentsPage} from "../comments/comments";
import {FavouriteServiceProvider} from '../../providers/favourite-service';


@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {
  defaultTab = 'discover';
  text: string;
  speaking: boolean = false;

  storyList: Story[] = Array();
  postUrl: string;
  curPosition: number;

  curTab: string;
  favNumber: number = 0;

  constructor(private textToSpeech: TextToSpeech,
              private socialSharing: SocialSharing,
              private storyProvider: StoryService,
              private navCtrl: NavController,
              private favouriteProvider: FavouriteServiceProvider) {
  }

  onSegmentChange(event) {
    let tab = event.value;
    if (tab === 'new') {
      this.curTab = 'new';
      this.curPosition = 0;
      this.postUrl =this.storyProvider.mediaUrl + this.storyList[this.curPosition]['filename'];
      console.log('new tab loaded');
    } else if (tab === 'hot'){
      this.curTab = 'hot';
      console.log('hot tab loaded');
    }
    else if(tab === 'discover'){
      this.curTab = 'discover';
      this.onDiscover();
      console.log('discover tab loaded');
    }
  }

  onRefresh() {
    console.log('refresh')
  }

  onTextSpeech() {
    if (this.speaking) {
      this.textToSpeech.speak({text: ''});  // <<< speak an empty string to interrupt.
      this.speaking = false;
      return;
    }
    this.speaking = true;
    this.textToSpeech.speak({text: this.text, locale: 'en-US', rate: 1.5})
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

  onShare() {
    let message = "This is title"
    let imageUrl = "https://user-images.githubusercontent.com/26871154/36926557-319fc0bc-1e81-11e8-859e-5c751b27f166.png";
    let subject = "Mail subject"

    this.socialSharing.share(message, subject, '', imageUrl)
      .then(() => {
        //success
      }).catch((e) => {
      //Error
    })
  }

  //This point down is still testing

  onNext(){
    console.log(this.curPosition);
    if(this.curTab === 'discover') {
      this.onDiscover();
    }
    else if(this.curTab === 'hot'){}
    else{
      if (this.curPosition >= (this.storyList.length - 1)) {
        this.curPosition = 0;
      }
      else {
        this.curPosition++;
      }
      this.postUrl = this.storyProvider.mediaUrl +
        this.storyList[this.curPosition]['filename'];
    }
  }

  onPrevious(){
    if(this.curPosition <= 0){
      this.curPosition = this.storyList.length - 1;
      console.log(this.storyList.length);
    }
    else{
      this.curPosition--;
    }
    this.postUrl =this.storyProvider.mediaUrl + this.storyList[this.curPosition]['filename'];
  }

  onComment(){
    this.navCtrl.push(CommentsPage, {
      postID: "1"
    });
  }

  onDiscover(){
    let ranObj = this.storyList[Math.floor(Math.random()*this.storyList.length)];
    this.postUrl = this.storyProvider.mediaUrl + ranObj['filename'];
  }

  onHot(){

  }

  ionViewDidLoad(){
    this.curTab = 'discover';
    this.storyProvider.getAllPost().subscribe((response: Object[] = Array()) => {
      //let postArray: any = response;
      response.forEach((myPost) => {
        let story = new Story();

        story.title = myPost['title'];
        story.description = myPost['description'];
        story.file_id = myPost['file_id'];
        story.filename = myPost['filename'];

        //add like to story
        this.getFavorite(story.file_id);
        console.log(this.favNumber);
        story.favourite = this.favNumber;

        this.storyList.push(story);
      });
      console.log(this.storyList);
      this.onDiscover();
      //Pass results to postArray
    }, (error: HttpErrorResponse) => {
      console.log(error.error.message);
    });
  }

  getFavorite(file_id){
    console.log(file_id);
    this.favouriteProvider.getPostFavourite(file_id).subscribe((response: Object[] = Array()) =>{
      this.favNumber = response.length;
      }, (error: HttpErrorResponse) => {
      console.log(error.error.message);
    });
  }
}
