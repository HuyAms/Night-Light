import {BrowserModule} from '@angular/platform-browser';
import {ErrorHandler, NgModule} from '@angular/core';
import {IonicApp, IonicErrorHandler, IonicModule} from 'ionic-angular';
import {SplashScreen} from '@ionic-native/splash-screen';
import {StatusBar} from '@ionic-native/status-bar';

import {MyApp} from './app.component';
import {HomePage} from '../pages/home/home';
import {TabsPage} from "../pages/tabs/tabs";
import {SigninPage} from "../pages/signin/signin";
import {ProfilePage} from "../pages/profile/profile";
import {PostPage} from "../pages/post/post";
import {AuthService} from '../providers/auth.service';
import {HttpClientModule} from "@angular/common/http";
import {Autoresize} from "../shared/autoresize.directive";
import {StoryService} from "../providers/story.service";
import {UserService} from "../providers/user.service";
import {TextToSpeech} from '@ionic-native/text-to-speech';
import {SocialSharing} from '@ionic-native/social-sharing';
import {CommentService} from '../providers/comment.service';
import {CommentsPage} from "../pages/comments/comments";
import {FavouriteService} from '../providers/favourite.service';
import {ShortenPipe} from "../shared/shorten.pipe";
import {EmailComposer} from '@ionic-native/email-composer';
import {SettingsPage} from "../pages/settings/settings";
import {SettingsService} from "../providers/settings.service";
import {EditProfilePage} from "../pages/edit-profile/edit-profile";
import {AboutusPage} from "../pages/aboutus/aboutus";
import {CameraService} from "../providers/camera.service";
import {Vibration} from "@ionic-native/vibration";
import {MailcomposerPage} from "../pages/mailcomposer/mailcomposer";
import {Camera} from "@ionic-native/camera";



@NgModule({
  declarations: [
    MyApp,
    HomePage,
    TabsPage,
    SigninPage,
    ProfilePage,
    PostPage,
    Autoresize,
    CommentsPage,
    ShortenPipe,
    SettingsPage,
    EditProfilePage,
    AboutusPage,
    MailcomposerPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    HttpClientModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    TabsPage,
    SigninPage,
    ProfilePage,
    PostPage,
    CommentsPage,
    SettingsPage,
    EditProfilePage,
    AboutusPage,
    MailcomposerPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    AuthService,
    StoryService,
    UserService,
    TextToSpeech,
    SocialSharing,
    CommentService,
    FavouriteService,
    EmailComposer,
    SettingsService,
    CameraService,
    Vibration,
    Camera
  ]
})
export class AppModule {}
