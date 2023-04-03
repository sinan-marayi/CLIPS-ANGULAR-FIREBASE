import { TestBed } from '@angular/core/testing';

import { ffmpegService } from './ffmpeg.service';

describe('FfmpegService', () => {
  let service: ffmpegService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ffmpegService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
