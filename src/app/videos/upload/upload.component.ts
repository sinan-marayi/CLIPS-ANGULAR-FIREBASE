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
import { ffmpegService } from 'src/app/services/ffmpeg.service';
import { combineLatest, forkJoin } from 'rxjs';

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
    private router: Router,
    public ffmpegService: ffmpegService
  ) {
    auth.user.subscribe((user) => (this.user = user));
    ffmpegService.init();
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
  screenshots: string[] = [];
  selectedScreenshot = '';
  screenshotUploadTask?: AngularFireUploadTask;

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
  async storeFile(event: Event) {
    if (this.ffmpegService.isRunning) {
      return;
    }
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

    this.screenshots = await this.ffmpegService.getScreenshot(this.file);
    this.selectedScreenshot = this.screenshots[0];

    this.showForm = true;
    this.title.setValue(this.file.name.replace(/\.[^/.]+$/, ''));
  }
  //ToUploadaFile
  async uploadFile() {
    if (!this.file) {
      return;
    }
    this.uploadForm.disable();
    this.inSubmission = true;
    this.showAlert = true;
    this.alertColor = 'blue';
    this.alertMsg = 'Video is uploading.....';
    const fileName = uuid();
    const clipPath = `clips/${fileName}.mp4`;

    //URLtoBlob
    const screenshotBlob = await this.ffmpegService.blobFormURL(
      this.selectedScreenshot
    );
    const screenshotPath = `screenshot/${fileName}.png`;

    //uploadVideo
    this.task = this.storage.upload(clipPath, this.file);

    //uploadScreenshot
    this.screenshotUploadTask = this.storage.upload(
      screenshotPath,
      screenshotBlob
    );

    //pathRefs
    const clipRef = this.storage.ref(clipPath);
    const screenshotRef = this.storage.ref(screenshotPath);

    //percentage
    combineLatest([
      this.task.percentageChanges(),
      this.screenshotUploadTask.percentageChanges(),
    ]).subscribe((progresses) => {
      let [taskProgress, screenshotProgress] = progresses;
      if (!taskProgress || !screenshotProgress) {
        return;
      }
      this.percentage =
        ((taskProgress as number) + (screenshotProgress as number)) / 200;
    });

    //storingDetailsInDB

    forkJoin([
      this.task.snapshotChanges(),
      this.screenshotUploadTask.snapshotChanges(),
    ])
      .pipe(
        switchMap(() => {
          return forkJoin([
            clipRef.getDownloadURL(),
            screenshotRef.getDownloadURL(),
          ]);
        })
      )
      .subscribe({
        next: async (urls) => {
          const [clipURL, screenshotURL] = urls;
          const clip = {
            uid: this.user?.uid as string,
            title: this.title.value,
            displayName: this.user?.displayName as string,
            fileName: `${fileName}.mp4`,
            url: clipURL,
            screenshotURL,
screenshotFileName:`${fileName}.png`,
            timeStamp: firebase.firestore.FieldValue.serverTimestamp(),
          };

          const clipDocRef = await this.clipsService.createClip(clip);

          this.alertColor = 'green';
          this.alertMsg =
            'Video uploaded Succssfully...Share your clip to the world';
          this.percentage = null;
          setTimeout(() => {
            this.router.navigate(['clip', clipDocRef.id]);
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
