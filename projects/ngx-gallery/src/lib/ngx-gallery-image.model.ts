import { SafeResourceUrl } from '@angular/platform-browser';

export interface INgxGalleryImage {
    small?: string | SafeResourceUrl;
    medium?: string | SafeResourceUrl;
    big?: string | SafeResourceUrl;
    description?: string;
    url?: string;
    label?: string;
    mediumSize?: NgxGalleryMediumImageSize;
}

export class NgxGalleryImage implements INgxGalleryImage {
    small?: string | SafeResourceUrl;
    medium?: string | SafeResourceUrl;
    big?: string | SafeResourceUrl;
    description?: string;
    url?: string;
    label?: string;
    mediumSize?: NgxGalleryMediumImageSize;

    constructor(obj: INgxGalleryImage) {
        this.small = obj.small;
        this.medium = obj.medium;
        this.big = obj.big;
        this.description = obj.description;
        this.url = obj.url;
        this.label = obj.label;
        this.mediumSize = obj.mediumSize;
    }
}

export interface INgxGalleryMediumImageSize {
  width: number;
  height: number;
}

export class NgxGalleryMediumImageSize implements INgxGalleryMediumImageSize {
  width: number;
  height: number;

  constructor(obj: INgxGalleryMediumImageSize) {
    this.width = obj.width;
    this.height = obj.height;
  }
}
