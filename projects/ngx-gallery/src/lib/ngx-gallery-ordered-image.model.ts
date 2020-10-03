import { SafeResourceUrl } from '@angular/platform-browser';
import {NgxGalleryMediumImageSize} from './ngx-gallery-image.model';

export interface INgxGalleryOrderedImage {
    src: string | SafeResourceUrl;
    index: number;
    size?: NgxGalleryMediumImageSize;
    class?: string;
}

export class NgxGalleryOrderedImage implements INgxGalleryOrderedImage {
    src: string | SafeResourceUrl;
    index: number;
    size?: NgxGalleryMediumImageSize;
    class?: string;

    constructor(obj: INgxGalleryOrderedImage) {
        this.src = obj.src;
        this.index = obj.index;
        this.size = obj.size;
        this.class = obj.class ?? '';
    }
}
