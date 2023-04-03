import { Injectable } from '@angular/core';
import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg';
import { BinaryLike } from 'crypto';

@Injectable({
  providedIn: 'root',
})
export class ffmpegService {
  isReady = false;
  isRunning = false;
  private ffmpeg;

  constructor() {
    this.ffmpeg = createFFmpeg({ log: true });
  }

  async init() {
    if (this.isReady) {
      return;
    }
    await this.ffmpeg.load();
    this.isReady = true;
  }

  async getScreenshot(file: File) {
    this.isRunning = true;
    let data = await fetchFile(file);
    this.ffmpeg.FS('writeFile', file.name, data);

    const seconds = [1, 2, 3];
    const commands: string[] = [];

    seconds.forEach((second) => {
      commands.push(
        //input
        '-i',
        file.name,
        //output options
        '-ss',
        `00:00:0${second}`,
        '-frames:v',
        '1',
        '-filter:v',
        'scale=510:-1',
        //output
        `output_0${second}.png`
      );
    });

    await this.ffmpeg.run(...commands);

    let screenshots: string[] = [];

    seconds.forEach((second) => {
      const screenshotBinary = this.ffmpeg.FS(
        'readFile',
        `output_0${second}.png`
      );

      const screenshotBlob = new Blob([screenshotBinary.buffer as BinaryLike], {
        type: 'image/png',
      });

      const screenshotURL = URL.createObjectURL(screenshotBlob);
      screenshots.push(screenshotURL);
    });
    this.isRunning = false;
    return screenshots;
  }

  async blobFormURL(url: string) {
    const response = await fetch(url);
    let blob = await response.blob();

    return blob;
  }
}
