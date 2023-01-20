import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { ClipsService } from 'src/app/services/clips.service';
import IClip from 'src/app/models/clip.model';
import { ModalService } from 'src/app/services/modal.service';

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.css'],
})
export class ManageComponent implements OnInit {
  videoOrder = '1';
  clips: IClip[] = [];
  activeClip: IClip | null = null;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private clipService: ClipsService,
    private modalService: ModalService
  ) {
    route.queryParams.subscribe((query: Params) => {
      this.videoOrder = query.sort === '1' ? query.sort : '2';
    });
  }

  ngOnInit(): void {
    this.clipService.getUserClips().subscribe((docs) => {
      this.clips = [];
      docs.forEach((doc) => {
        this.clips.push({
          docID: doc.id,
          ...doc.data(),
        });
      });
      
    });
  }

  //video Sort
  clipsOrder(event: Event) {
    const { value } = event.target as HTMLSelectElement;
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        sort: value,
      },
    });
  }
  //to Edit Modal
  editClip(event: Event, clip: IClip) {
    event.preventDefault();
    this.activeClip = clip;
    this.modalService.toggleModal('editModal');
  }
  //to Update The Screen After Edit
  update(event: IClip) {
    let clip: IClip[] = this.clips.filter((clip) => {
      clip.docID === event.docID;
    });
    clip[0].title = event.title;
  }
  //to Delete a Clip
  deleteClip(event: Event, clip: IClip) {
    event.preventDefault();
    this.clipService.deleteClip(clip);

    this.clips.forEach((item, index) => {
      if (clip.docID === item.docID) {
        this.clips.splice(index, 1);
      }
    });
  }
}
