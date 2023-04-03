import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VideosRoutingModule } from './videos-routing.module';
import { ManageComponent } from './manage/manage.component';
import { UploadComponent } from './upload/upload.component';
import { SharedModule } from '../shared/shared.module';
import { ReactiveFormsModule } from "@angular/forms";
import { AngularFireStorageModule } from "@angular/fire/compat/storage";
import { EditComponent } from './edit/edit.component';
import { SafeURLPipe } from './pipes/safe-url.pipe';


@NgModule({
  declarations: [ManageComponent, UploadComponent, EditComponent, SafeURLPipe],
  imports: [CommonModule, VideosRoutingModule, SharedModule,ReactiveFormsModule,AngularFireStorageModule],
})
export class VideosModule {}
 