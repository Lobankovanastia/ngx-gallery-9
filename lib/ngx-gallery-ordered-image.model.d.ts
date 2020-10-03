import { SafeResourceUrl } from '@angular/platform-browser';
import { NgxGalleryMediumImageSize } from './ngx-gallery-image.model';
export interface INgxGalleryOrderedImage {
    src: string | SafeResourceUrl;
    index: number;
    size?: NgxGalleryMediumImageSize;
    class?: string;
}
export declare class NgxGalleryOrderedImage implements INgxGalleryOrderedImage {
    src: string | SafeResourceUrl;
    index: number;
    size?: NgxGalleryMediumImageSize;
    class?: string;
    constructor(obj: INgxGalleryOrderedImage);
}
