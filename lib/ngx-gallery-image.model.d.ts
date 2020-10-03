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
export declare class NgxGalleryImage implements INgxGalleryImage {
    small?: string | SafeResourceUrl;
    medium?: string | SafeResourceUrl;
    big?: string | SafeResourceUrl;
    description?: string;
    url?: string;
    label?: string;
    mediumSize?: NgxGalleryMediumImageSize;
    constructor(obj: INgxGalleryImage);
}
export interface INgxGalleryMediumImageSize {
    width: number;
    height: number;
}
export declare class NgxGalleryMediumImageSize implements INgxGalleryMediumImageSize {
    width: number;
    height: number;
    constructor(obj: INgxGalleryMediumImageSize);
}
