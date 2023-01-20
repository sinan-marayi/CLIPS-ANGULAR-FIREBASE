import {
  Component,
  OnInit,
  OnDestroy,
  Input,
  Output,
  OnChanges,
  EventEmitter,
} from '@angular/core';
import IClip from 'src/app/models/clip.model';
import { ModalService } from 'src/app/services/modal.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ClipsService } from 'src/app/services/clips.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css'],
})
export class EditComponent implements OnInit, OnDestroy, OnChanges {
  constructor(
    private modalService: ModalService,
    private clipService: ClipsService
  ) {}

  @Input() activeClip: IClip | null = null;
  showAlert = false;
  alertColor = 'blue';
  alertMsg = 'Please wait..! updating clip';
  inSubmission = false;
  @Output() update = new EventEmitter();

  title = new FormControl('', {
    validators: [Validators.required, Validators.minLength(3)],
    nonNullable: true,
  });
  editForm = new FormGroup({
    title: this.title,
  });

  ngOnInit(): void {
    this.modalService.register('editModal');
  }
  ngOnDestroy(): void {
    this.modalService.unregister('editModal');
  }
  ngOnChanges() {
    this.inSubmission = false;
    this.showAlert = false;
    this.title.setValue(this.activeClip?.title as string);
  }
  // ToEditTheTitle
  async editTitle(event: Event) {
    if (!this.activeClip) {
      return;
    }
    this.inSubmission = true;
    this.showAlert = true;
    this.alertColor = 'blue';
    this.alertMsg = 'Please Wait..! updating clip';
    event.preventDefault();
    try {
      await this.clipService.editClip(
        this.activeClip.docID as string,
        this.title.value
      );
    } catch (error) {
      this.inSubmission = false;
      this.showAlert = true;
      this.alertColor = 'red';
      this.alertMsg = 'Oops...something went wrong. Please try again';
      return;
    }

    this.activeClip.title = this.title.value;
    this.update.emit(this.activeClip);

    this.showAlert = true;
    this.alertColor = 'green';
    this.alertMsg = 'Clip Updated';
  }
}
