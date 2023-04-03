import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { ClipsService } from '../services/clips.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-clips-list',
  templateUrl: './clips-list.component.html',
  styleUrls: ['./clips-list.component.css'],
  providers: [DatePipe],
})
export class ClipsListComponent implements OnInit, OnDestroy {
  constructor(public clipsService: ClipsService) {
    clipsService.getClips();
  }

  @Input() scrollabe = true;

  ngOnInit(): void {
    if (this.scrollabe) {
      window.addEventListener('scroll', this.handleScroll);
    }
  }

  handleScroll = () => {
    const { scrollTop, offsetHeight } = document.documentElement;
    const { innerHeight } = window;

    const bottomOfPage = Math.round(scrollTop) + innerHeight === offsetHeight;
    if (bottomOfPage) {
      this.clipsService.getClips();
    }
  };

  ngOnDestroy(): void {
    if (this.scrollabe) {
      window.removeEventListener('scroll', this.handleScroll);

      this.clipsService.pageClips = [];
    }
  }
}
