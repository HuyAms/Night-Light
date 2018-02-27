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
import { AuthProvider } from '../providers/auth';
import {HttpClientModule} from "@angular/common/http";
import {Autoresize} from "../shared/autoresize.directive";

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    TabsPage,
    SigninPage,
    ProfilePage,
    PostPage,
    Autoresize
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
    PostPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    AuthProvider
  ]
})
export class AppModule {}
