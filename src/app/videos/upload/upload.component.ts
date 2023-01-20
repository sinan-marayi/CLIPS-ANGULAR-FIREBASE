import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {
  AngularFireStorage,
  AngularFireUploadTask,
} from '@angular/fire/compat/storage';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { v4 as uuid } from 'uuid';
import { last, switchMap } from 'rxjs/operators';
import firebase from 'firebase/compat/app';
import { ClipsService } from 'src/app/services/clips.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css'],
})
export class UploadComponent implements OnInit, OnDestroy {
  constructor(
    private storage: AngularFireStorage,
    private auth: AngularFireAuth,
    private clipsService: ClipsService,
    private router:Router
  ) {
    auth.user.subscribe((user) => (this.user = user));
  }

  isDragover = false;
  file: File | null = null;
  showForm = false;
  showAlert = false;
  alertMsg = '';
  alertColor = 'blue';
  inSubmission = false;
  percentage: number | null = null;
  user: firebase.User | null = null;
  task?: AngularFireUploadTask;

  ngOnInit(): void {}
  ngOnDestroy(): void {
    this.task?.cancel();
  }
  title = new FormControl('', {
    validators: [Validators.required, Validators.minLength(3)],
    nonNullable: true,
  });

  uploadForm = new FormGroup({ title: this.title });

  //FileStoring
  storeFile(event: Event) {
    console.log(event);
    this.isDragover = false;
    this.showAlert = false;
    this.file = (event as DragEvent).dataTransfer
      ? (event as DragEvent).dataTransfer?.files.item(0) ?? null
      : (event.target as HTMLInputElement).files?.item(0) ?? null;
    if (!this.file || this.file.type !== 'video/mp4') {
      this.showAlert = true;
      this.alertColor = 'red';
      this.alertMsg = 'Please add a mp4 file';
      return;
    }
    this.showForm = true;
    this.title.setValue(this.file.name.replace(/\.[^/.]+$/, ''));
  }
  //ToUploadaFile
  async uploadFile() {
    if(!this.file){
      return
    }
    this.uploadForm.disable();
    this.inSubmission = true;
    this.showAlert = true;
    this.alertColor = 'blue';
    this.alertMsg = 'Video is uploading.....';
    const fileName = uuid();
    const clipPath = `clips/${fileName}.mp4`;
    this.task = this.storage.upload(clipPath, this.file);
    const clipRef = this.storage.ref(clipPath);
    this.task.percentageChanges().subscribe((progress) => {
      this.percentage = (progress as number) / 100;
    });
    this.task
      .snapshotChanges()
      .pipe(
        last(),
        switchMap(() => {
          return clipRef.getDownloadURL();
        })
      )
      .subscribe({
        next:async (url) => {
          const clip = {
            uid: this.user?.uid as string,
            title: this.title.value,
            displayName: this.user?.displayName as string,
            fileName: `${fileName}.mp4`,
            url,
            timeStamp:firebase.firestore.FieldValue.serverTimestamp()
          };
          const clipDocRef = await this.clipsService.createClip(clip);

          this.alertColor = 'green';
          this.alertMsg =
            'Video uploaded Succssfully...Share your clip to the world';
          this.percentage = null;
          setTimeout(() => {
            this.router.navigate(['clip',clipDocRef.id])
          }, 1000);
        },
        error: (error) => {
          this.uploadForm.enable();
          this.inSubmission = false;
          this.alertColor = 'red';
          this.alertMsg =
            'failed...please try again later. Please ensure that the Network and file size is less than 20MB';
          this.percentage = null;
        },
      });
  }
}
