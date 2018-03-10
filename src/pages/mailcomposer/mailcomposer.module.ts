import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MailcomposerPage } from './mailcomposer';

@NgModule({
  declarations: [
    MailcomposerPage,
  ],
  imports: [
    IonicPageModule.forChild(MailcomposerPage),
  ],
})
export class MailcomposerPageModule {}
