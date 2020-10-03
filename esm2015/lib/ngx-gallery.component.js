import { __decorate } from "tslib";
import { Component, OnInit, DoCheck, AfterViewInit, EventEmitter, Output, ViewChild, HostBinding, ElementRef, HostListener, Input } from '@angular/core';
import { NgxGalleryHelperService } from './ngx-gallery-helper.service';
import { NgxGalleryOptions } from './ngx-gallery-options';
import { NgxGalleryOrderedImage } from './ngx-gallery-ordered-image.model';
import { NgxGalleryPreviewComponent } from './ngx-gallery-preview/ngx-gallery-preview.component';
import { NgxGalleryImageComponent } from './ngx-gallery-image/ngx-gallery-image.component';
import { NgxGalleryThumbnailsComponent } from './ngx-gallery-thumbnails/ngx-gallery-thumbnails.component';
import { NgxGalleryLayout } from './ngx-gallery-layout.model';
let NgxGalleryComponent = class NgxGalleryComponent {
    constructor(myElement) {
        this.myElement = myElement;
        this.imagesReady = new EventEmitter();
        this.change = new EventEmitter();
        this.previewOpen = new EventEmitter();
        this.previewClose = new EventEmitter();
        this.previewChange = new EventEmitter();
        this.oldImagesLength = 0;
        this.selectedIndex = 0;
        this.breakpoint = undefined;
        this.prevBreakpoint = undefined;
    }
    ngOnInit() {
        this.options = this.options.map((opt) => new NgxGalleryOptions(opt));
        this.sortOptions();
        this.setBreakpoint();
        this.setOptions();
        this.checkFullWidth();
        if (this.currentOptions) {
            this.selectedIndex = this.currentOptions.startIndex;
        }
    }
    ngDoCheck() {
        if (this.images !== undefined && (this.images.length !== this.oldImagesLength)
            || (this.images !== this.oldImages)) {
            this.oldImagesLength = this.images.length;
            this.oldImages = this.images;
            this.setOptions();
            this.setImages();
            if (this.images && this.images.length) {
                this.imagesReady.emit();
            }
            if (this.image) {
                this.image.reset(this.currentOptions.startIndex);
            }
            if (this.currentOptions.thumbnailsAutoHide && this.currentOptions.thumbnails
                && this.images.length <= 1) {
                this.currentOptions.thumbnails = false;
                this.currentOptions.imageArrows = false;
            }
            this.resetThumbnails();
        }
    }
    ngAfterViewInit() {
        this.checkFullWidth();
    }
    onResize() {
        this.setBreakpoint();
        if (this.prevBreakpoint !== this.breakpoint) {
            this.setOptions();
            this.resetThumbnails();
        }
        if (this.currentOptions && this.currentOptions.fullWidth) {
            if (this.fullWidthTimeout) {
                clearTimeout(this.fullWidthTimeout);
            }
            this.fullWidthTimeout = setTimeout(() => {
                this.checkFullWidth();
            }, 200);
        }
    }
    getImageHeight() {
        return (this.currentOptions && this.currentOptions.thumbnails) ?
            this.currentOptions.imagePercent + '%' : '100%';
    }
    getThumbnailsHeight() {
        if (this.currentOptions && this.currentOptions.image) {
            return 'calc(' + this.currentOptions.thumbnailsPercent + '% - '
                + this.currentOptions.thumbnailsMargin + 'px)';
        }
        else {
            return '100%';
        }
    }
    getThumbnailsMarginTop() {
        if (this.currentOptions && this.currentOptions.layout === NgxGalleryLayout.ThumbnailsBottom) {
            return this.currentOptions.thumbnailsMargin + 'px';
        }
        else {
            return '0px';
        }
    }
    getThumbnailsMarginBottom() {
        if (this.currentOptions && this.currentOptions.layout === NgxGalleryLayout.ThumbnailsTop) {
            return this.currentOptions.thumbnailsMargin + 'px';
        }
        else {
            return '0px';
        }
    }
    openPreview(index) {
        if (this.currentOptions.previewCustom) {
            this.currentOptions.previewCustom(index);
        }
        else {
            this.previewEnabled = true;
            this.preview.open(index);
        }
    }
    onPreviewOpen() {
        this.previewOpen.emit();
        if (this.image && this.image.autoPlay) {
            this.image.stopAutoPlay();
        }
    }
    onPreviewClose() {
        this.previewEnabled = false;
        this.previewClose.emit();
        if (this.image && this.image.autoPlay) {
            this.image.startAutoPlay();
        }
    }
    selectFromImage(index) {
        this.select(index);
    }
    selectFromThumbnails(index) {
        this.select(index);
        if (this.currentOptions && this.currentOptions.thumbnails && this.currentOptions.preview
            && (!this.currentOptions.image || this.currentOptions.thumbnailsRemainingCount)) {
            this.openPreview(this.selectedIndex);
        }
    }
    show(index) {
        this.select(index);
    }
    showNext() {
        this.image.showNext();
    }
    showPrev() {
        this.image.showPrev();
    }
    canShowNext() {
        if (this.images && this.currentOptions) {
            return (this.currentOptions.imageInfinityMove || this.selectedIndex < this.images.length - 1)
                ? true : false;
        }
        else {
            return false;
        }
    }
    canShowPrev() {
        if (this.images && this.currentOptions) {
            return (this.currentOptions.imageInfinityMove || this.selectedIndex > 0) ? true : false;
        }
        else {
            return false;
        }
    }
    previewSelect(index) {
        this.previewChange.emit({ index, image: this.images[index] });
    }
    moveThumbnailsRight() {
        this.thubmnails.moveRight();
    }
    moveThumbnailsLeft() {
        this.thubmnails.moveLeft();
    }
    canMoveThumbnailsRight() {
        return this.thubmnails.canMoveRight();
    }
    canMoveThumbnailsLeft() {
        return this.thubmnails.canMoveLeft();
    }
    resetThumbnails() {
        if (this.thubmnails) {
            this.thubmnails.reset(this.currentOptions.startIndex);
        }
    }
    select(index) {
        this.selectedIndex = index;
        this.change.emit({
            index,
            image: this.images[index]
        });
    }
    checkFullWidth() {
        if (this.currentOptions && this.currentOptions.fullWidth) {
            this.width = document.body.clientWidth + 'px';
            this.left = (-(document.body.clientWidth -
                this.myElement.nativeElement.parentNode.innerWidth) / 2) + 'px';
        }
    }
    setImages() {
        this.smallImages = this.images.map((img) => img.small);
        this.mediumImages = this.images.map((img, i) => new NgxGalleryOrderedImage({
            src: img.medium,
            index: i,
            size: img.mediumSize
        }));
        this.bigImages = this.images.map((img) => img.big);
        this.descriptions = this.images.map((img) => img.description);
        this.links = this.images.map((img) => img.url);
        this.labels = this.images.map((img) => img.label);
    }
    setBreakpoint() {
        this.prevBreakpoint = this.breakpoint;
        let breakpoints;
        if (typeof window !== 'undefined') {
            breakpoints = this.options.filter((opt) => opt.breakpoint >= window.innerWidth)
                .map((opt) => opt.breakpoint);
        }
        if (breakpoints && breakpoints.length) {
            this.breakpoint = breakpoints.pop();
        }
        else {
            this.breakpoint = undefined;
        }
    }
    sortOptions() {
        this.options = [
            ...this.options.filter((a) => a.breakpoint === undefined),
            ...this.options
                .filter((a) => a.breakpoint !== undefined)
                .sort((a, b) => b.breakpoint - a.breakpoint)
        ];
    }
    setOptions() {
        this.currentOptions = new NgxGalleryOptions({});
        this.options
            .filter((opt) => opt.breakpoint === undefined || opt.breakpoint >= this.breakpoint)
            .map((opt) => this.combineOptions(this.currentOptions, opt));
        this.width = this.currentOptions.width;
        this.height = this.currentOptions.height;
    }
    combineOptions(first, second) {
        Object.keys(second).map((val) => first[val] = second[val] !== undefined ? second[val] : first[val]);
    }
};
NgxGalleryComponent.ctorParameters = () => [
    { type: ElementRef }
];
__decorate([
    Input()
], NgxGalleryComponent.prototype, "options", void 0);
__decorate([
    Input()
], NgxGalleryComponent.prototype, "images", void 0);
__decorate([
    Output()
], NgxGalleryComponent.prototype, "imagesReady", void 0);
__decorate([
    Output()
], NgxGalleryComponent.prototype, "change", void 0);
__decorate([
    Output()
], NgxGalleryComponent.prototype, "previewOpen", void 0);
__decorate([
    Output()
], NgxGalleryComponent.prototype, "previewClose", void 0);
__decorate([
    Output()
], NgxGalleryComponent.prototype, "previewChange", void 0);
__decorate([
    ViewChild(NgxGalleryPreviewComponent)
], NgxGalleryComponent.prototype, "preview", void 0);
__decorate([
    ViewChild(NgxGalleryImageComponent)
], NgxGalleryComponent.prototype, "image", void 0);
__decorate([
    ViewChild(NgxGalleryThumbnailsComponent)
], NgxGalleryComponent.prototype, "thubmnails", void 0);
__decorate([
    HostBinding('style.width')
], NgxGalleryComponent.prototype, "width", void 0);
__decorate([
    HostBinding('style.height')
], NgxGalleryComponent.prototype, "height", void 0);
__decorate([
    HostBinding('style.left')
], NgxGalleryComponent.prototype, "left", void 0);
__decorate([
    HostListener('window:resize')
], NgxGalleryComponent.prototype, "onResize", null);
NgxGalleryComponent = __decorate([
    Component({
        selector: 'ngx-gallery',
        template: `
    <div class="ngx-gallery-layout {{currentOptions?.layout}}">
      <ngx-gallery-image *ngIf="currentOptions?.image" [style.height]="getImageHeight()" [images]="mediumImages" [clickable]="currentOptions?.preview" [selectedIndex]="selectedIndex" [arrows]="currentOptions?.imageArrows" [arrowsAutoHide]="currentOptions?.imageArrowsAutoHide" [arrowPrevIcon]="currentOptions?.arrowPrevIcon" [arrowNextIcon]="currentOptions?.arrowNextIcon" [swipe]="currentOptions?.imageSwipe" [animation]="currentOptions?.imageAnimation" [size]="currentOptions?.imageSize" [autoPlay]="currentOptions?.imageAutoPlay" [autoPlayInterval]="currentOptions?.imageAutoPlayInterval" [autoPlayPauseOnHover]="currentOptions?.imageAutoPlayPauseOnHover" [infinityMove]="currentOptions?.imageInfinityMove"  [lazyLoading]="currentOptions?.lazyLoading" [actions]="currentOptions?.imageActions" [descriptions]="descriptions" [showDescription]="currentOptions?.imageDescription" [bullets]="currentOptions?.imageBullets" (onClick)="openPreview($event)" (onActiveChange)="selectFromImage($event)"></ngx-gallery-image>

      <ngx-gallery-thumbnails *ngIf="currentOptions?.thumbnails" [style.marginTop]="getThumbnailsMarginTop()" [style.marginBottom]="getThumbnailsMarginBottom()" [style.height]="getThumbnailsHeight()" [images]="smallImages" [links]="currentOptions?.thumbnailsAsLinks ? links : []" [labels]="labels" [linkTarget]="currentOptions?.linkTarget" [selectedIndex]="selectedIndex" [columns]="currentOptions?.thumbnailsColumns" [rows]="currentOptions?.thumbnailsRows" [margin]="currentOptions?.thumbnailMargin" [arrows]="currentOptions?.thumbnailsArrows" [arrowsAutoHide]="currentOptions?.thumbnailsArrowsAutoHide" [arrowPrevIcon]="currentOptions?.arrowPrevIcon" [arrowNextIcon]="currentOptions?.arrowNextIcon" [clickable]="currentOptions?.image || currentOptions?.preview" [swipe]="currentOptions?.thumbnailsSwipe" [size]="currentOptions?.thumbnailSize" [moveSize]="currentOptions?.thumbnailsMoveSize" [order]="currentOptions?.thumbnailsOrder" [remainingCount]="currentOptions?.thumbnailsRemainingCount" [lazyLoading]="currentOptions?.lazyLoading" [actions]="currentOptions?.thumbnailActions"  (onActiveChange)="selectFromThumbnails($event)"></ngx-gallery-thumbnails>

      <ngx-gallery-preview [images]="bigImages" [descriptions]="descriptions" [showDescription]="currentOptions?.previewDescription" [arrowPrevIcon]="currentOptions?.arrowPrevIcon" [arrowNextIcon]="currentOptions?.arrowNextIcon" [closeIcon]="currentOptions?.closeIcon" [fullscreenIcon]="currentOptions?.fullscreenIcon" [spinnerIcon]="currentOptions?.spinnerIcon" [arrows]="currentOptions?.previewArrows" [arrowsAutoHide]="currentOptions?.previewArrowsAutoHide" [swipe]="currentOptions?.previewSwipe" [fullscreen]="currentOptions?.previewFullscreen" [forceFullscreen]="currentOptions?.previewForceFullscreen" [closeOnClick]="currentOptions?.previewCloseOnClick" [closeOnEsc]="currentOptions?.previewCloseOnEsc" [keyboardNavigation]="currentOptions?.previewKeyboardNavigation" [animation]="currentOptions?.previewAnimation" [autoPlay]="currentOptions?.previewAutoPlay" [autoPlayInterval]="currentOptions?.previewAutoPlayInterval" [autoPlayPauseOnHover]="currentOptions?.previewAutoPlayPauseOnHover" [infinityMove]="currentOptions?.previewInfinityMove" [zoom]="currentOptions?.previewZoom" [zoomStep]="currentOptions?.previewZoomStep" [zoomMax]="currentOptions?.previewZoomMax" [zoomMin]="currentOptions?.previewZoomMin" [zoomInIcon]="currentOptions?.zoomInIcon" [zoomOutIcon]="currentOptions?.zoomOutIcon" [actions]="currentOptions?.actions" [rotate]="currentOptions?.previewRotate" [rotateLeftIcon]="currentOptions?.rotateLeftIcon" [rotateRightIcon]="currentOptions?.rotateRightIcon" [download]="currentOptions?.previewDownload" [downloadIcon]="currentOptions?.downloadIcon" [bullets]="currentOptions?.previewBullets" (onClose)="onPreviewClose()" (onOpen)="onPreviewOpen()" (onActiveChange)="previewSelect($event)" [class.ngx-gallery-active]="previewEnabled"></ngx-gallery-preview>
    </div>
  `,
        providers: [NgxGalleryHelperService],
        styles: [":host{display:inline-block}:host>*{float:left}:host>>>*{box-sizing:border-box}:host>>>.ngx-gallery-icon{color:#fff;font-size:25px;position:absolute;z-index:2000;display:inline-block}:host>>>.ngx-gallery-icon .ngx-gallery-icon-content{display:block}:host>>>.ngx-gallery-clickable{cursor:pointer}:host>>>.ngx-gallery-icons-wrapper .ngx-gallery-icon{position:relative;margin-right:5px;margin-top:5px;font-size:20px;cursor:pointer}:host>>>.ngx-gallery-icons-wrapper{float:right}:host .ngx-gallery-layout{width:100%;height:100%;display:-webkit-box;display:flex;-webkit-box-orient:vertical;-webkit-box-direction:normal;flex-direction:column}:host .ngx-gallery-layout.thumbnails-top ngx-gallery-image{-webkit-box-ordinal-group:3;order:2}:host .ngx-gallery-layout.thumbnails-top ngx-gallery-thumbnails{-webkit-box-ordinal-group:2;order:1}:host .ngx-gallery-layout.thumbnails-bottom ngx-gallery-image{-webkit-box-ordinal-group:2;order:1}:host .ngx-gallery-layout.thumbnails-bottom ngx-gallery-thumbnails{-webkit-box-ordinal-group:3;order:2}"]
    })
], NgxGalleryComponent);
export { NgxGalleryComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmd4LWdhbGxlcnkuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Im5nOi8vbmd4LWdhbGxlcnktOS8iLCJzb3VyY2VzIjpbImxpYi9uZ3gtZ2FsbGVyeS5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSxFQUFFLE9BQU8sRUFBRSxhQUFhLEVBQUUsWUFBWSxFQUFFLE1BQU0sRUFBRSxTQUFTLEVBQUUsV0FBVyxFQUFFLFVBQVUsRUFBRSxZQUFZLEVBQUUsS0FBSyxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBRXpKLE9BQU8sRUFBRSx1QkFBdUIsRUFBRSxNQUFNLDhCQUE4QixDQUFDO0FBQ3ZFLE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxNQUFNLHVCQUF1QixDQUFDO0FBRzFELE9BQU8sRUFBRSxzQkFBc0IsRUFBRSxNQUFNLG1DQUFtQyxDQUFDO0FBQzNFLE9BQU8sRUFBRSwwQkFBMEIsRUFBRSxNQUFNLHFEQUFxRCxDQUFDO0FBQ2pHLE9BQU8sRUFBRSx3QkFBd0IsRUFBRSxNQUFNLGlEQUFpRCxDQUFDO0FBQzNGLE9BQU8sRUFBRSw2QkFBNkIsRUFBRSxNQUFNLDJEQUEyRCxDQUFDO0FBQzFHLE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLDRCQUE0QixDQUFDO0FBZ0I5RCxJQUFhLG1CQUFtQixHQUFoQyxNQUFhLG1CQUFtQjtJQXFDOUIsWUFBb0IsU0FBcUI7UUFBckIsY0FBUyxHQUFULFNBQVMsQ0FBWTtRQWpDL0IsZ0JBQVcsR0FBRyxJQUFJLFlBQVksRUFBRSxDQUFDO1FBQ2pDLFdBQU0sR0FBRyxJQUFJLFlBQVksRUFBOEMsQ0FBQztRQUN4RSxnQkFBVyxHQUFHLElBQUksWUFBWSxFQUFFLENBQUM7UUFDakMsaUJBQVksR0FBRyxJQUFJLFlBQVksRUFBRSxDQUFDO1FBQ2xDLGtCQUFhLEdBQUcsSUFBSSxZQUFZLEVBQThDLENBQUM7UUFVekYsb0JBQWUsR0FBRyxDQUFDLENBQUM7UUFFcEIsa0JBQWEsR0FBRyxDQUFDLENBQUM7UUFLVixlQUFVLEdBQXVCLFNBQVMsQ0FBQztRQUMzQyxtQkFBYyxHQUF1QixTQUFTLENBQUM7SUFXWCxDQUFDO0lBRTdDLFFBQVE7UUFDSixJQUFJLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxFQUFFLEVBQUUsQ0FBQyxJQUFJLGlCQUFpQixDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFDckUsSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDO1FBQ25CLElBQUksQ0FBQyxhQUFhLEVBQUUsQ0FBQztRQUNyQixJQUFJLENBQUMsVUFBVSxFQUFFLENBQUM7UUFDbEIsSUFBSSxDQUFDLGNBQWMsRUFBRSxDQUFDO1FBQ3RCLElBQUksSUFBSSxDQUFDLGNBQWMsRUFBRTtZQUNyQixJQUFJLENBQUMsYUFBYSxHQUFXLElBQUksQ0FBQyxjQUFjLENBQUMsVUFBVSxDQUFDO1NBQy9EO0lBQ0wsQ0FBQztJQUVELFNBQVM7UUFDTCxJQUFJLElBQUksQ0FBQyxNQUFNLEtBQUssU0FBUyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLEtBQUssSUFBSSxDQUFDLGVBQWUsQ0FBQztlQUN2RSxDQUFDLElBQUksQ0FBQyxNQUFNLEtBQUssSUFBSSxDQUFDLFNBQVMsQ0FBQyxFQUFFO1lBQ3JDLElBQUksQ0FBQyxlQUFlLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUM7WUFDMUMsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDO1lBQzdCLElBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQztZQUNsQixJQUFJLENBQUMsU0FBUyxFQUFFLENBQUM7WUFFakIsSUFBSSxJQUFJLENBQUMsTUFBTSxJQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxFQUFFO2dCQUNuQyxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksRUFBRSxDQUFDO2FBQzNCO1lBRUQsSUFBSSxJQUFJLENBQUMsS0FBSyxFQUFFO2dCQUNaLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFTLElBQUksQ0FBQyxjQUFjLENBQUMsVUFBVSxDQUFDLENBQUM7YUFDNUQ7WUFFRCxJQUFJLElBQUksQ0FBQyxjQUFjLENBQUMsa0JBQWtCLElBQUksSUFBSSxDQUFDLGNBQWMsQ0FBQyxVQUFVO21CQUNyRSxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sSUFBSSxDQUFDLEVBQUU7Z0JBQzVCLElBQUksQ0FBQyxjQUFjLENBQUMsVUFBVSxHQUFHLEtBQUssQ0FBQztnQkFDdkMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxXQUFXLEdBQUcsS0FBSyxDQUFDO2FBQzNDO1lBRUQsSUFBSSxDQUFDLGVBQWUsRUFBRSxDQUFDO1NBQzFCO0lBQ0wsQ0FBQztJQUVELGVBQWU7UUFDWCxJQUFJLENBQUMsY0FBYyxFQUFFLENBQUM7SUFDMUIsQ0FBQztJQUU4QixRQUFRO1FBQ25DLElBQUksQ0FBQyxhQUFhLEVBQUUsQ0FBQztRQUVyQixJQUFJLElBQUksQ0FBQyxjQUFjLEtBQUssSUFBSSxDQUFDLFVBQVUsRUFBRTtZQUN6QyxJQUFJLENBQUMsVUFBVSxFQUFFLENBQUM7WUFDbEIsSUFBSSxDQUFDLGVBQWUsRUFBRSxDQUFDO1NBQzFCO1FBRUQsSUFBSSxJQUFJLENBQUMsY0FBYyxJQUFJLElBQUksQ0FBQyxjQUFjLENBQUMsU0FBUyxFQUFFO1lBRXRELElBQUksSUFBSSxDQUFDLGdCQUFnQixFQUFFO2dCQUN2QixZQUFZLENBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLENBQUM7YUFDdkM7WUFFRCxJQUFJLENBQUMsZ0JBQWdCLEdBQUcsVUFBVSxDQUFDLEdBQUcsRUFBRTtnQkFDcEMsSUFBSSxDQUFDLGNBQWMsRUFBRSxDQUFDO1lBQzFCLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQztTQUNYO0lBQ0wsQ0FBQztJQUVELGNBQWM7UUFDVixPQUFPLENBQUMsSUFBSSxDQUFDLGNBQWMsSUFBSSxJQUFJLENBQUMsY0FBYyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUM7WUFDNUQsSUFBSSxDQUFDLGNBQWMsQ0FBQyxZQUFZLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUM7SUFDeEQsQ0FBQztJQUVELG1CQUFtQjtRQUNmLElBQUksSUFBSSxDQUFDLGNBQWMsSUFBSSxJQUFJLENBQUMsY0FBYyxDQUFDLEtBQUssRUFBRTtZQUNsRCxPQUFPLE9BQU8sR0FBRyxJQUFJLENBQUMsY0FBYyxDQUFDLGlCQUFpQixHQUFHLE1BQU07a0JBQzdELElBQUksQ0FBQyxjQUFjLENBQUMsZ0JBQWdCLEdBQUcsS0FBSyxDQUFDO1NBQ2xEO2FBQU07WUFDSCxPQUFPLE1BQU0sQ0FBQztTQUNqQjtJQUNMLENBQUM7SUFFRCxzQkFBc0I7UUFDbEIsSUFBSSxJQUFJLENBQUMsY0FBYyxJQUFJLElBQUksQ0FBQyxjQUFjLENBQUMsTUFBTSxLQUFLLGdCQUFnQixDQUFDLGdCQUFnQixFQUFFO1lBQ3pGLE9BQU8sSUFBSSxDQUFDLGNBQWMsQ0FBQyxnQkFBZ0IsR0FBRyxJQUFJLENBQUM7U0FDdEQ7YUFBTTtZQUNILE9BQU8sS0FBSyxDQUFDO1NBQ2hCO0lBQ0wsQ0FBQztJQUVELHlCQUF5QjtRQUNyQixJQUFJLElBQUksQ0FBQyxjQUFjLElBQUksSUFBSSxDQUFDLGNBQWMsQ0FBQyxNQUFNLEtBQUssZ0JBQWdCLENBQUMsYUFBYSxFQUFFO1lBQ3RGLE9BQU8sSUFBSSxDQUFDLGNBQWMsQ0FBQyxnQkFBZ0IsR0FBRyxJQUFJLENBQUM7U0FDdEQ7YUFBTTtZQUNILE9BQU8sS0FBSyxDQUFDO1NBQ2hCO0lBQ0wsQ0FBQztJQUVELFdBQVcsQ0FBQyxLQUFhO1FBQ3JCLElBQUksSUFBSSxDQUFDLGNBQWMsQ0FBQyxhQUFhLEVBQUU7WUFDbkMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLENBQUM7U0FDNUM7YUFBTTtZQUNILElBQUksQ0FBQyxjQUFjLEdBQUcsSUFBSSxDQUFDO1lBQzNCLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1NBQzVCO0lBQ0wsQ0FBQztJQUVELGFBQWE7UUFDVCxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksRUFBRSxDQUFDO1FBRXhCLElBQUksSUFBSSxDQUFDLEtBQUssSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsRUFBRTtZQUNuQyxJQUFJLENBQUMsS0FBSyxDQUFDLFlBQVksRUFBRSxDQUFDO1NBQzdCO0lBQ0wsQ0FBQztJQUVELGNBQWM7UUFDVixJQUFJLENBQUMsY0FBYyxHQUFHLEtBQUssQ0FBQztRQUM1QixJQUFJLENBQUMsWUFBWSxDQUFDLElBQUksRUFBRSxDQUFDO1FBRXpCLElBQUksSUFBSSxDQUFDLEtBQUssSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsRUFBRTtZQUNuQyxJQUFJLENBQUMsS0FBSyxDQUFDLGFBQWEsRUFBRSxDQUFDO1NBQzlCO0lBQ0wsQ0FBQztJQUVELGVBQWUsQ0FBQyxLQUFhO1FBQ3pCLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDdkIsQ0FBQztJQUVELG9CQUFvQixDQUFDLEtBQWE7UUFDOUIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUVuQixJQUFJLElBQUksQ0FBQyxjQUFjLElBQUksSUFBSSxDQUFDLGNBQWMsQ0FBQyxVQUFVLElBQUksSUFBSSxDQUFDLGNBQWMsQ0FBQyxPQUFPO2VBQ2pGLENBQUMsQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLEtBQUssSUFBSSxJQUFJLENBQUMsY0FBYyxDQUFDLHdCQUF3QixDQUFDLEVBQUU7WUFDakYsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUM7U0FDeEM7SUFDTCxDQUFDO0lBRUQsSUFBSSxDQUFDLEtBQWE7UUFDZCxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ3ZCLENBQUM7SUFFRCxRQUFRO1FBQ0osSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLEVBQUUsQ0FBQztJQUMxQixDQUFDO0lBRUQsUUFBUTtRQUNKLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxFQUFFLENBQUM7SUFDMUIsQ0FBQztJQUVELFdBQVc7UUFDUCxJQUFJLElBQUksQ0FBQyxNQUFNLElBQUksSUFBSSxDQUFDLGNBQWMsRUFBRTtZQUNwQyxPQUFPLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxpQkFBaUIsSUFBSSxJQUFJLENBQUMsYUFBYSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQztnQkFDekYsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDO1NBQ3RCO2FBQU07WUFDSCxPQUFPLEtBQUssQ0FBQztTQUNoQjtJQUNMLENBQUM7SUFFRCxXQUFXO1FBQ1AsSUFBSSxJQUFJLENBQUMsTUFBTSxJQUFJLElBQUksQ0FBQyxjQUFjLEVBQUU7WUFDcEMsT0FBTyxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsaUJBQWlCLElBQUksSUFBSSxDQUFDLGFBQWEsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUM7U0FDM0Y7YUFBTTtZQUNILE9BQU8sS0FBSyxDQUFDO1NBQ2hCO0lBQ0wsQ0FBQztJQUVELGFBQWEsQ0FBQyxLQUFhO1FBQ3ZCLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLEVBQUMsS0FBSyxFQUFFLEtBQUssRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxFQUFDLENBQUMsQ0FBQztJQUNoRSxDQUFDO0lBRUQsbUJBQW1CO1FBQ2YsSUFBSSxDQUFDLFVBQVUsQ0FBQyxTQUFTLEVBQUUsQ0FBQztJQUNoQyxDQUFDO0lBRUQsa0JBQWtCO1FBQ2QsSUFBSSxDQUFDLFVBQVUsQ0FBQyxRQUFRLEVBQUUsQ0FBQztJQUMvQixDQUFDO0lBRUQsc0JBQXNCO1FBQ2xCLE9BQU8sSUFBSSxDQUFDLFVBQVUsQ0FBQyxZQUFZLEVBQUUsQ0FBQztJQUMxQyxDQUFDO0lBRUQscUJBQXFCO1FBQ2pCLE9BQU8sSUFBSSxDQUFDLFVBQVUsQ0FBQyxXQUFXLEVBQUUsQ0FBQztJQUN6QyxDQUFDO0lBRU8sZUFBZTtRQUNuQixJQUFJLElBQUksQ0FBQyxVQUFVLEVBQUU7WUFDakIsSUFBSSxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQVMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxVQUFVLENBQUMsQ0FBQztTQUNqRTtJQUNMLENBQUM7SUFFTyxNQUFNLENBQUMsS0FBYTtRQUN4QixJQUFJLENBQUMsYUFBYSxHQUFHLEtBQUssQ0FBQztRQUUzQixJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQztZQUNiLEtBQUs7WUFDTCxLQUFLLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUM7U0FDNUIsQ0FBQyxDQUFDO0lBQ1AsQ0FBQztJQUVPLGNBQWM7UUFDbEIsSUFBSSxJQUFJLENBQUMsY0FBYyxJQUFJLElBQUksQ0FBQyxjQUFjLENBQUMsU0FBUyxFQUFFO1lBQ3RELElBQUksQ0FBQyxLQUFLLEdBQUcsUUFBUSxDQUFDLElBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDO1lBQzlDLElBQUksQ0FBQyxJQUFJLEdBQUcsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxXQUFXO2dCQUNwQyxJQUFJLENBQUMsU0FBUyxDQUFDLGFBQWEsQ0FBQyxVQUFVLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDO1NBQ3ZFO0lBQ0wsQ0FBQztJQUVPLFNBQVM7UUFDYixJQUFJLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxFQUFFLEVBQUUsQ0FBUyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDL0QsSUFBSSxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDLElBQUksc0JBQXNCLENBQUM7WUFDdkUsR0FBRyxFQUFFLEdBQUcsQ0FBQyxNQUFNO1lBQ2YsS0FBSyxFQUFFLENBQUM7WUFDUixJQUFJLEVBQUUsR0FBRyxDQUFDLFVBQVU7U0FDdkIsQ0FBQyxDQUFDLENBQUM7UUFDSixJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxFQUFFLEVBQUUsQ0FBUyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDM0QsSUFBSSxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsRUFBRSxFQUFFLENBQVMsR0FBRyxDQUFDLFdBQVcsQ0FBQyxDQUFDO1FBQ3RFLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLEVBQUUsRUFBRSxDQUFTLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUN2RCxJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxFQUFFLEVBQUUsQ0FBUyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDOUQsQ0FBQztJQUVPLGFBQWE7UUFDakIsSUFBSSxDQUFDLGNBQWMsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDO1FBQ3RDLElBQUksV0FBVyxDQUFDO1FBRWhCLElBQUksT0FBTyxNQUFNLEtBQUssV0FBVyxFQUFFO1lBQy9CLFdBQVcsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEdBQUcsRUFBRSxFQUFFLENBQUMsR0FBRyxDQUFDLFVBQVUsSUFBSSxNQUFNLENBQUMsVUFBVSxDQUFDO2lCQUMxRSxHQUFHLENBQUMsQ0FBQyxHQUFHLEVBQUUsRUFBRSxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsQ0FBQztTQUNyQztRQUVELElBQUksV0FBVyxJQUFJLFdBQVcsQ0FBQyxNQUFNLEVBQUU7WUFDbkMsSUFBSSxDQUFDLFVBQVUsR0FBRyxXQUFXLENBQUMsR0FBRyxFQUFFLENBQUM7U0FDdkM7YUFBTTtZQUNILElBQUksQ0FBQyxVQUFVLEdBQUcsU0FBUyxDQUFDO1NBQy9CO0lBQ0wsQ0FBQztJQUVPLFdBQVc7UUFDZixJQUFJLENBQUMsT0FBTyxHQUFHO1lBQ1gsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLFVBQVUsS0FBSyxTQUFTLENBQUM7WUFDekQsR0FBRyxJQUFJLENBQUMsT0FBTztpQkFDVixNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxVQUFVLEtBQUssU0FBUyxDQUFDO2lCQUN6QyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsVUFBVSxHQUFHLENBQUMsQ0FBQyxVQUFVLENBQUM7U0FDbkQsQ0FBQztJQUNOLENBQUM7SUFFTyxVQUFVO1FBQ2QsSUFBSSxDQUFDLGNBQWMsR0FBRyxJQUFJLGlCQUFpQixDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBRWhELElBQUksQ0FBQyxPQUFPO2FBQ1AsTUFBTSxDQUFDLENBQUMsR0FBRyxFQUFFLEVBQUUsQ0FBQyxHQUFHLENBQUMsVUFBVSxLQUFLLFNBQVMsSUFBSSxHQUFHLENBQUMsVUFBVSxJQUFJLElBQUksQ0FBQyxVQUFVLENBQUM7YUFDbEYsR0FBRyxDQUFDLENBQUMsR0FBRyxFQUFFLEVBQUUsQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxjQUFjLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQztRQUVqRSxJQUFJLENBQUMsS0FBSyxHQUFXLElBQUksQ0FBQyxjQUFjLENBQUMsS0FBSyxDQUFDO1FBQy9DLElBQUksQ0FBQyxNQUFNLEdBQVcsSUFBSSxDQUFDLGNBQWMsQ0FBQyxNQUFNLENBQUM7SUFDckQsQ0FBQztJQUVPLGNBQWMsQ0FBQyxLQUF3QixFQUFFLE1BQXlCO1FBQ3RFLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxFQUFFLEVBQUUsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLEdBQUcsTUFBTSxDQUFDLEdBQUcsQ0FBQyxLQUFLLFNBQVMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztJQUN4RyxDQUFDO0NBQ0YsQ0FBQTs7WUFoUWdDLFVBQVU7O0FBcENoQztJQUFSLEtBQUssRUFBRTtvREFBOEI7QUFDN0I7SUFBUixLQUFLLEVBQUU7bURBQTJCO0FBRXpCO0lBQVQsTUFBTSxFQUFFO3dEQUFrQztBQUNqQztJQUFULE1BQU0sRUFBRTttREFBeUU7QUFDeEU7SUFBVCxNQUFNLEVBQUU7d0RBQWtDO0FBQ2pDO0lBQVQsTUFBTSxFQUFFO3lEQUFtQztBQUNsQztJQUFULE1BQU0sRUFBRTswREFBZ0Y7QUFxQmxEO0lBQXRDLFNBQVMsQ0FBQywwQkFBMEIsQ0FBQztvREFBcUM7QUFDdEM7SUFBcEMsU0FBUyxDQUFDLHdCQUF3QixDQUFDO2tEQUFpQztBQUMzQjtJQUF6QyxTQUFTLENBQUMsNkJBQTZCLENBQUM7dURBQTJDO0FBRXhEO0lBQTNCLFdBQVcsQ0FBQyxhQUFhLENBQUM7a0RBQWU7QUFDYjtJQUE1QixXQUFXLENBQUMsY0FBYyxDQUFDO21EQUFnQjtBQUNqQjtJQUExQixXQUFXLENBQUMsWUFBWSxDQUFDO2lEQUFjO0FBNkNUO0lBQTlCLFlBQVksQ0FBQyxlQUFlLENBQUM7bURBa0I3QjtBQWxHVSxtQkFBbUI7SUFkL0IsU0FBUyxDQUFDO1FBQ1QsUUFBUSxFQUFFLGFBQWE7UUFDdkIsUUFBUSxFQUFFOzs7Ozs7OztHQVFUO1FBRUQsU0FBUyxFQUFFLENBQUMsdUJBQXVCLENBQUM7O0tBQ3JDLENBQUM7R0FDVyxtQkFBbUIsQ0FxUy9CO1NBclNZLG1CQUFtQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbXBvbmVudCwgT25Jbml0LCBEb0NoZWNrLCBBZnRlclZpZXdJbml0LCBFdmVudEVtaXR0ZXIsIE91dHB1dCwgVmlld0NoaWxkLCBIb3N0QmluZGluZywgRWxlbWVudFJlZiwgSG9zdExpc3RlbmVyLCBJbnB1dCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgU2FmZVJlc291cmNlVXJsIH0gZnJvbSAnQGFuZ3VsYXIvcGxhdGZvcm0tYnJvd3Nlcic7XG5pbXBvcnQgeyBOZ3hHYWxsZXJ5SGVscGVyU2VydmljZSB9IGZyb20gJy4vbmd4LWdhbGxlcnktaGVscGVyLnNlcnZpY2UnO1xuaW1wb3J0IHsgTmd4R2FsbGVyeU9wdGlvbnMgfSBmcm9tICcuL25neC1nYWxsZXJ5LW9wdGlvbnMnO1xuaW1wb3J0IHsgTmd4R2FsbGVyeUltYWdlU2l6ZSB9IGZyb20gJy4vbmd4LWdhbGxlcnktaW1hZ2Utc2l6ZS5tb2RlbCc7XG5pbXBvcnQgeyBOZ3hHYWxsZXJ5SW1hZ2UgfSBmcm9tICcuL25neC1nYWxsZXJ5LWltYWdlLm1vZGVsJztcbmltcG9ydCB7IE5neEdhbGxlcnlPcmRlcmVkSW1hZ2UgfSBmcm9tICcuL25neC1nYWxsZXJ5LW9yZGVyZWQtaW1hZ2UubW9kZWwnO1xuaW1wb3J0IHsgTmd4R2FsbGVyeVByZXZpZXdDb21wb25lbnQgfSBmcm9tICcuL25neC1nYWxsZXJ5LXByZXZpZXcvbmd4LWdhbGxlcnktcHJldmlldy5jb21wb25lbnQnO1xuaW1wb3J0IHsgTmd4R2FsbGVyeUltYWdlQ29tcG9uZW50IH0gZnJvbSAnLi9uZ3gtZ2FsbGVyeS1pbWFnZS9uZ3gtZ2FsbGVyeS1pbWFnZS5jb21wb25lbnQnO1xuaW1wb3J0IHsgTmd4R2FsbGVyeVRodW1ibmFpbHNDb21wb25lbnQgfSBmcm9tICcuL25neC1nYWxsZXJ5LXRodW1ibmFpbHMvbmd4LWdhbGxlcnktdGh1bWJuYWlscy5jb21wb25lbnQnO1xuaW1wb3J0IHsgTmd4R2FsbGVyeUxheW91dCB9IGZyb20gJy4vbmd4LWdhbGxlcnktbGF5b3V0Lm1vZGVsJztcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnbmd4LWdhbGxlcnknLFxuICB0ZW1wbGF0ZTogYFxuICAgIDxkaXYgY2xhc3M9XCJuZ3gtZ2FsbGVyeS1sYXlvdXQge3tjdXJyZW50T3B0aW9ucz8ubGF5b3V0fX1cIj5cbiAgICAgIDxuZ3gtZ2FsbGVyeS1pbWFnZSAqbmdJZj1cImN1cnJlbnRPcHRpb25zPy5pbWFnZVwiIFtzdHlsZS5oZWlnaHRdPVwiZ2V0SW1hZ2VIZWlnaHQoKVwiIFtpbWFnZXNdPVwibWVkaXVtSW1hZ2VzXCIgW2NsaWNrYWJsZV09XCJjdXJyZW50T3B0aW9ucz8ucHJldmlld1wiIFtzZWxlY3RlZEluZGV4XT1cInNlbGVjdGVkSW5kZXhcIiBbYXJyb3dzXT1cImN1cnJlbnRPcHRpb25zPy5pbWFnZUFycm93c1wiIFthcnJvd3NBdXRvSGlkZV09XCJjdXJyZW50T3B0aW9ucz8uaW1hZ2VBcnJvd3NBdXRvSGlkZVwiIFthcnJvd1ByZXZJY29uXT1cImN1cnJlbnRPcHRpb25zPy5hcnJvd1ByZXZJY29uXCIgW2Fycm93TmV4dEljb25dPVwiY3VycmVudE9wdGlvbnM/LmFycm93TmV4dEljb25cIiBbc3dpcGVdPVwiY3VycmVudE9wdGlvbnM/LmltYWdlU3dpcGVcIiBbYW5pbWF0aW9uXT1cImN1cnJlbnRPcHRpb25zPy5pbWFnZUFuaW1hdGlvblwiIFtzaXplXT1cImN1cnJlbnRPcHRpb25zPy5pbWFnZVNpemVcIiBbYXV0b1BsYXldPVwiY3VycmVudE9wdGlvbnM/LmltYWdlQXV0b1BsYXlcIiBbYXV0b1BsYXlJbnRlcnZhbF09XCJjdXJyZW50T3B0aW9ucz8uaW1hZ2VBdXRvUGxheUludGVydmFsXCIgW2F1dG9QbGF5UGF1c2VPbkhvdmVyXT1cImN1cnJlbnRPcHRpb25zPy5pbWFnZUF1dG9QbGF5UGF1c2VPbkhvdmVyXCIgW2luZmluaXR5TW92ZV09XCJjdXJyZW50T3B0aW9ucz8uaW1hZ2VJbmZpbml0eU1vdmVcIiAgW2xhenlMb2FkaW5nXT1cImN1cnJlbnRPcHRpb25zPy5sYXp5TG9hZGluZ1wiIFthY3Rpb25zXT1cImN1cnJlbnRPcHRpb25zPy5pbWFnZUFjdGlvbnNcIiBbZGVzY3JpcHRpb25zXT1cImRlc2NyaXB0aW9uc1wiIFtzaG93RGVzY3JpcHRpb25dPVwiY3VycmVudE9wdGlvbnM/LmltYWdlRGVzY3JpcHRpb25cIiBbYnVsbGV0c109XCJjdXJyZW50T3B0aW9ucz8uaW1hZ2VCdWxsZXRzXCIgKG9uQ2xpY2spPVwib3BlblByZXZpZXcoJGV2ZW50KVwiIChvbkFjdGl2ZUNoYW5nZSk9XCJzZWxlY3RGcm9tSW1hZ2UoJGV2ZW50KVwiPjwvbmd4LWdhbGxlcnktaW1hZ2U+XG5cbiAgICAgIDxuZ3gtZ2FsbGVyeS10aHVtYm5haWxzICpuZ0lmPVwiY3VycmVudE9wdGlvbnM/LnRodW1ibmFpbHNcIiBbc3R5bGUubWFyZ2luVG9wXT1cImdldFRodW1ibmFpbHNNYXJnaW5Ub3AoKVwiIFtzdHlsZS5tYXJnaW5Cb3R0b21dPVwiZ2V0VGh1bWJuYWlsc01hcmdpbkJvdHRvbSgpXCIgW3N0eWxlLmhlaWdodF09XCJnZXRUaHVtYm5haWxzSGVpZ2h0KClcIiBbaW1hZ2VzXT1cInNtYWxsSW1hZ2VzXCIgW2xpbmtzXT1cImN1cnJlbnRPcHRpb25zPy50aHVtYm5haWxzQXNMaW5rcyA/IGxpbmtzIDogW11cIiBbbGFiZWxzXT1cImxhYmVsc1wiIFtsaW5rVGFyZ2V0XT1cImN1cnJlbnRPcHRpb25zPy5saW5rVGFyZ2V0XCIgW3NlbGVjdGVkSW5kZXhdPVwic2VsZWN0ZWRJbmRleFwiIFtjb2x1bW5zXT1cImN1cnJlbnRPcHRpb25zPy50aHVtYm5haWxzQ29sdW1uc1wiIFtyb3dzXT1cImN1cnJlbnRPcHRpb25zPy50aHVtYm5haWxzUm93c1wiIFttYXJnaW5dPVwiY3VycmVudE9wdGlvbnM/LnRodW1ibmFpbE1hcmdpblwiIFthcnJvd3NdPVwiY3VycmVudE9wdGlvbnM/LnRodW1ibmFpbHNBcnJvd3NcIiBbYXJyb3dzQXV0b0hpZGVdPVwiY3VycmVudE9wdGlvbnM/LnRodW1ibmFpbHNBcnJvd3NBdXRvSGlkZVwiIFthcnJvd1ByZXZJY29uXT1cImN1cnJlbnRPcHRpb25zPy5hcnJvd1ByZXZJY29uXCIgW2Fycm93TmV4dEljb25dPVwiY3VycmVudE9wdGlvbnM/LmFycm93TmV4dEljb25cIiBbY2xpY2thYmxlXT1cImN1cnJlbnRPcHRpb25zPy5pbWFnZSB8fCBjdXJyZW50T3B0aW9ucz8ucHJldmlld1wiIFtzd2lwZV09XCJjdXJyZW50T3B0aW9ucz8udGh1bWJuYWlsc1N3aXBlXCIgW3NpemVdPVwiY3VycmVudE9wdGlvbnM/LnRodW1ibmFpbFNpemVcIiBbbW92ZVNpemVdPVwiY3VycmVudE9wdGlvbnM/LnRodW1ibmFpbHNNb3ZlU2l6ZVwiIFtvcmRlcl09XCJjdXJyZW50T3B0aW9ucz8udGh1bWJuYWlsc09yZGVyXCIgW3JlbWFpbmluZ0NvdW50XT1cImN1cnJlbnRPcHRpb25zPy50aHVtYm5haWxzUmVtYWluaW5nQ291bnRcIiBbbGF6eUxvYWRpbmddPVwiY3VycmVudE9wdGlvbnM/LmxhenlMb2FkaW5nXCIgW2FjdGlvbnNdPVwiY3VycmVudE9wdGlvbnM/LnRodW1ibmFpbEFjdGlvbnNcIiAgKG9uQWN0aXZlQ2hhbmdlKT1cInNlbGVjdEZyb21UaHVtYm5haWxzKCRldmVudClcIj48L25neC1nYWxsZXJ5LXRodW1ibmFpbHM+XG5cbiAgICAgIDxuZ3gtZ2FsbGVyeS1wcmV2aWV3IFtpbWFnZXNdPVwiYmlnSW1hZ2VzXCIgW2Rlc2NyaXB0aW9uc109XCJkZXNjcmlwdGlvbnNcIiBbc2hvd0Rlc2NyaXB0aW9uXT1cImN1cnJlbnRPcHRpb25zPy5wcmV2aWV3RGVzY3JpcHRpb25cIiBbYXJyb3dQcmV2SWNvbl09XCJjdXJyZW50T3B0aW9ucz8uYXJyb3dQcmV2SWNvblwiIFthcnJvd05leHRJY29uXT1cImN1cnJlbnRPcHRpb25zPy5hcnJvd05leHRJY29uXCIgW2Nsb3NlSWNvbl09XCJjdXJyZW50T3B0aW9ucz8uY2xvc2VJY29uXCIgW2Z1bGxzY3JlZW5JY29uXT1cImN1cnJlbnRPcHRpb25zPy5mdWxsc2NyZWVuSWNvblwiIFtzcGlubmVySWNvbl09XCJjdXJyZW50T3B0aW9ucz8uc3Bpbm5lckljb25cIiBbYXJyb3dzXT1cImN1cnJlbnRPcHRpb25zPy5wcmV2aWV3QXJyb3dzXCIgW2Fycm93c0F1dG9IaWRlXT1cImN1cnJlbnRPcHRpb25zPy5wcmV2aWV3QXJyb3dzQXV0b0hpZGVcIiBbc3dpcGVdPVwiY3VycmVudE9wdGlvbnM/LnByZXZpZXdTd2lwZVwiIFtmdWxsc2NyZWVuXT1cImN1cnJlbnRPcHRpb25zPy5wcmV2aWV3RnVsbHNjcmVlblwiIFtmb3JjZUZ1bGxzY3JlZW5dPVwiY3VycmVudE9wdGlvbnM/LnByZXZpZXdGb3JjZUZ1bGxzY3JlZW5cIiBbY2xvc2VPbkNsaWNrXT1cImN1cnJlbnRPcHRpb25zPy5wcmV2aWV3Q2xvc2VPbkNsaWNrXCIgW2Nsb3NlT25Fc2NdPVwiY3VycmVudE9wdGlvbnM/LnByZXZpZXdDbG9zZU9uRXNjXCIgW2tleWJvYXJkTmF2aWdhdGlvbl09XCJjdXJyZW50T3B0aW9ucz8ucHJldmlld0tleWJvYXJkTmF2aWdhdGlvblwiIFthbmltYXRpb25dPVwiY3VycmVudE9wdGlvbnM/LnByZXZpZXdBbmltYXRpb25cIiBbYXV0b1BsYXldPVwiY3VycmVudE9wdGlvbnM/LnByZXZpZXdBdXRvUGxheVwiIFthdXRvUGxheUludGVydmFsXT1cImN1cnJlbnRPcHRpb25zPy5wcmV2aWV3QXV0b1BsYXlJbnRlcnZhbFwiIFthdXRvUGxheVBhdXNlT25Ib3Zlcl09XCJjdXJyZW50T3B0aW9ucz8ucHJldmlld0F1dG9QbGF5UGF1c2VPbkhvdmVyXCIgW2luZmluaXR5TW92ZV09XCJjdXJyZW50T3B0aW9ucz8ucHJldmlld0luZmluaXR5TW92ZVwiIFt6b29tXT1cImN1cnJlbnRPcHRpb25zPy5wcmV2aWV3Wm9vbVwiIFt6b29tU3RlcF09XCJjdXJyZW50T3B0aW9ucz8ucHJldmlld1pvb21TdGVwXCIgW3pvb21NYXhdPVwiY3VycmVudE9wdGlvbnM/LnByZXZpZXdab29tTWF4XCIgW3pvb21NaW5dPVwiY3VycmVudE9wdGlvbnM/LnByZXZpZXdab29tTWluXCIgW3pvb21Jbkljb25dPVwiY3VycmVudE9wdGlvbnM/Lnpvb21Jbkljb25cIiBbem9vbU91dEljb25dPVwiY3VycmVudE9wdGlvbnM/Lnpvb21PdXRJY29uXCIgW2FjdGlvbnNdPVwiY3VycmVudE9wdGlvbnM/LmFjdGlvbnNcIiBbcm90YXRlXT1cImN1cnJlbnRPcHRpb25zPy5wcmV2aWV3Um90YXRlXCIgW3JvdGF0ZUxlZnRJY29uXT1cImN1cnJlbnRPcHRpb25zPy5yb3RhdGVMZWZ0SWNvblwiIFtyb3RhdGVSaWdodEljb25dPVwiY3VycmVudE9wdGlvbnM/LnJvdGF0ZVJpZ2h0SWNvblwiIFtkb3dubG9hZF09XCJjdXJyZW50T3B0aW9ucz8ucHJldmlld0Rvd25sb2FkXCIgW2Rvd25sb2FkSWNvbl09XCJjdXJyZW50T3B0aW9ucz8uZG93bmxvYWRJY29uXCIgW2J1bGxldHNdPVwiY3VycmVudE9wdGlvbnM/LnByZXZpZXdCdWxsZXRzXCIgKG9uQ2xvc2UpPVwib25QcmV2aWV3Q2xvc2UoKVwiIChvbk9wZW4pPVwib25QcmV2aWV3T3BlbigpXCIgKG9uQWN0aXZlQ2hhbmdlKT1cInByZXZpZXdTZWxlY3QoJGV2ZW50KVwiIFtjbGFzcy5uZ3gtZ2FsbGVyeS1hY3RpdmVdPVwicHJldmlld0VuYWJsZWRcIj48L25neC1nYWxsZXJ5LXByZXZpZXc+XG4gICAgPC9kaXY+XG4gIGAsXG4gIHN0eWxlVXJsczogWycuL25neC1nYWxsZXJ5LmNvbXBvbmVudC5zY3NzJ10sXG4gIHByb3ZpZGVyczogW05neEdhbGxlcnlIZWxwZXJTZXJ2aWNlXVxufSlcbmV4cG9ydCBjbGFzcyBOZ3hHYWxsZXJ5Q29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0LCBEb0NoZWNrLCBBZnRlclZpZXdJbml0IHtcbiAgQElucHV0KCkgb3B0aW9uczogTmd4R2FsbGVyeU9wdGlvbnNbXTtcbiAgQElucHV0KCkgaW1hZ2VzOiBOZ3hHYWxsZXJ5SW1hZ2VbXTtcblxuICBAT3V0cHV0KCkgaW1hZ2VzUmVhZHkgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG4gIEBPdXRwdXQoKSBjaGFuZ2UgPSBuZXcgRXZlbnRFbWl0dGVyPHsgaW5kZXg6IG51bWJlcjsgaW1hZ2U6IE5neEdhbGxlcnlJbWFnZTsgfT4oKTtcbiAgQE91dHB1dCgpIHByZXZpZXdPcGVuID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuICBAT3V0cHV0KCkgcHJldmlld0Nsb3NlID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuICBAT3V0cHV0KCkgcHJldmlld0NoYW5nZSA9IG5ldyBFdmVudEVtaXR0ZXI8eyBpbmRleDogbnVtYmVyOyBpbWFnZTogTmd4R2FsbGVyeUltYWdlOyB9PigpO1xuXG4gIHNtYWxsSW1hZ2VzOiBzdHJpbmdbXSB8IFNhZmVSZXNvdXJjZVVybFtdO1xuICBtZWRpdW1JbWFnZXM6IE5neEdhbGxlcnlPcmRlcmVkSW1hZ2VbXTtcbiAgYmlnSW1hZ2VzOiBzdHJpbmdbXSB8IFNhZmVSZXNvdXJjZVVybFtdO1xuICBkZXNjcmlwdGlvbnM6IHN0cmluZ1tdO1xuICBsaW5rczogc3RyaW5nW107XG4gIGxhYmVsczogc3RyaW5nW107XG5cbiAgb2xkSW1hZ2VzOiBOZ3hHYWxsZXJ5SW1hZ2VbXTtcbiAgb2xkSW1hZ2VzTGVuZ3RoID0gMDtcblxuICBzZWxlY3RlZEluZGV4ID0gMDtcbiAgcHJldmlld0VuYWJsZWQ6IGJvb2xlYW47XG5cbiAgY3VycmVudE9wdGlvbnM6IE5neEdhbGxlcnlPcHRpb25zO1xuXG4gIHByaXZhdGUgYnJlYWtwb2ludDogbnVtYmVyIHwgdW5kZWZpbmVkID0gdW5kZWZpbmVkO1xuICBwcml2YXRlIHByZXZCcmVha3BvaW50OiBudW1iZXIgfCB1bmRlZmluZWQgPSB1bmRlZmluZWQ7XG4gIHByaXZhdGUgZnVsbFdpZHRoVGltZW91dDogYW55O1xuXG4gIEBWaWV3Q2hpbGQoTmd4R2FsbGVyeVByZXZpZXdDb21wb25lbnQpIHByZXZpZXc6IE5neEdhbGxlcnlQcmV2aWV3Q29tcG9uZW50O1xuICBAVmlld0NoaWxkKE5neEdhbGxlcnlJbWFnZUNvbXBvbmVudCkgaW1hZ2U6IE5neEdhbGxlcnlJbWFnZUNvbXBvbmVudDtcbiAgQFZpZXdDaGlsZChOZ3hHYWxsZXJ5VGh1bWJuYWlsc0NvbXBvbmVudCkgdGh1Ym1uYWlsczogTmd4R2FsbGVyeVRodW1ibmFpbHNDb21wb25lbnQ7XG5cbiAgQEhvc3RCaW5kaW5nKCdzdHlsZS53aWR0aCcpIHdpZHRoOiBzdHJpbmc7XG4gIEBIb3N0QmluZGluZygnc3R5bGUuaGVpZ2h0JykgaGVpZ2h0OiBzdHJpbmc7XG4gIEBIb3N0QmluZGluZygnc3R5bGUubGVmdCcpIGxlZnQ6IHN0cmluZztcblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIG15RWxlbWVudDogRWxlbWVudFJlZikge31cblxuICBuZ09uSW5pdCgpIHtcbiAgICAgIHRoaXMub3B0aW9ucyA9IHRoaXMub3B0aW9ucy5tYXAoKG9wdCkgPT4gbmV3IE5neEdhbGxlcnlPcHRpb25zKG9wdCkpO1xuICAgICAgdGhpcy5zb3J0T3B0aW9ucygpO1xuICAgICAgdGhpcy5zZXRCcmVha3BvaW50KCk7XG4gICAgICB0aGlzLnNldE9wdGlvbnMoKTtcbiAgICAgIHRoaXMuY2hlY2tGdWxsV2lkdGgoKTtcbiAgICAgIGlmICh0aGlzLmN1cnJlbnRPcHRpb25zKSB7XG4gICAgICAgICAgdGhpcy5zZWxlY3RlZEluZGV4ID0gPG51bWJlcj50aGlzLmN1cnJlbnRPcHRpb25zLnN0YXJ0SW5kZXg7XG4gICAgICB9XG4gIH1cblxuICBuZ0RvQ2hlY2soKTogdm9pZCB7XG4gICAgICBpZiAodGhpcy5pbWFnZXMgIT09IHVuZGVmaW5lZCAmJiAodGhpcy5pbWFnZXMubGVuZ3RoICE9PSB0aGlzLm9sZEltYWdlc0xlbmd0aClcbiAgICAgICAgICB8fCAodGhpcy5pbWFnZXMgIT09IHRoaXMub2xkSW1hZ2VzKSkge1xuICAgICAgICAgIHRoaXMub2xkSW1hZ2VzTGVuZ3RoID0gdGhpcy5pbWFnZXMubGVuZ3RoO1xuICAgICAgICAgIHRoaXMub2xkSW1hZ2VzID0gdGhpcy5pbWFnZXM7XG4gICAgICAgICAgdGhpcy5zZXRPcHRpb25zKCk7XG4gICAgICAgICAgdGhpcy5zZXRJbWFnZXMoKTtcblxuICAgICAgICAgIGlmICh0aGlzLmltYWdlcyAmJiB0aGlzLmltYWdlcy5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgdGhpcy5pbWFnZXNSZWFkeS5lbWl0KCk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKHRoaXMuaW1hZ2UpIHtcbiAgICAgICAgICAgICAgdGhpcy5pbWFnZS5yZXNldCg8bnVtYmVyPnRoaXMuY3VycmVudE9wdGlvbnMuc3RhcnRJbmRleCk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKHRoaXMuY3VycmVudE9wdGlvbnMudGh1bWJuYWlsc0F1dG9IaWRlICYmIHRoaXMuY3VycmVudE9wdGlvbnMudGh1bWJuYWlsc1xuICAgICAgICAgICAgICAmJiB0aGlzLmltYWdlcy5sZW5ndGggPD0gMSkge1xuICAgICAgICAgICAgICB0aGlzLmN1cnJlbnRPcHRpb25zLnRodW1ibmFpbHMgPSBmYWxzZTtcbiAgICAgICAgICAgICAgdGhpcy5jdXJyZW50T3B0aW9ucy5pbWFnZUFycm93cyA9IGZhbHNlO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHRoaXMucmVzZXRUaHVtYm5haWxzKCk7XG4gICAgICB9XG4gIH1cblxuICBuZ0FmdGVyVmlld0luaXQoKTogdm9pZCB7XG4gICAgICB0aGlzLmNoZWNrRnVsbFdpZHRoKCk7XG4gIH1cblxuICBASG9zdExpc3RlbmVyKCd3aW5kb3c6cmVzaXplJykgb25SZXNpemUoKSB7XG4gICAgICB0aGlzLnNldEJyZWFrcG9pbnQoKTtcblxuICAgICAgaWYgKHRoaXMucHJldkJyZWFrcG9pbnQgIT09IHRoaXMuYnJlYWtwb2ludCkge1xuICAgICAgICAgIHRoaXMuc2V0T3B0aW9ucygpO1xuICAgICAgICAgIHRoaXMucmVzZXRUaHVtYm5haWxzKCk7XG4gICAgICB9XG5cbiAgICAgIGlmICh0aGlzLmN1cnJlbnRPcHRpb25zICYmIHRoaXMuY3VycmVudE9wdGlvbnMuZnVsbFdpZHRoKSB7XG5cbiAgICAgICAgICBpZiAodGhpcy5mdWxsV2lkdGhUaW1lb3V0KSB7XG4gICAgICAgICAgICAgIGNsZWFyVGltZW91dCh0aGlzLmZ1bGxXaWR0aFRpbWVvdXQpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHRoaXMuZnVsbFdpZHRoVGltZW91dCA9IHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgICB0aGlzLmNoZWNrRnVsbFdpZHRoKCk7XG4gICAgICAgICAgfSwgMjAwKTtcbiAgICAgIH1cbiAgfVxuXG4gIGdldEltYWdlSGVpZ2h0KCk6IHN0cmluZyB7XG4gICAgICByZXR1cm4gKHRoaXMuY3VycmVudE9wdGlvbnMgJiYgdGhpcy5jdXJyZW50T3B0aW9ucy50aHVtYm5haWxzKSA/XG4gICAgICAgICAgdGhpcy5jdXJyZW50T3B0aW9ucy5pbWFnZVBlcmNlbnQgKyAnJScgOiAnMTAwJSc7XG4gIH1cblxuICBnZXRUaHVtYm5haWxzSGVpZ2h0KCk6IHN0cmluZyB7XG4gICAgICBpZiAodGhpcy5jdXJyZW50T3B0aW9ucyAmJiB0aGlzLmN1cnJlbnRPcHRpb25zLmltYWdlKSB7XG4gICAgICAgICAgcmV0dXJuICdjYWxjKCcgKyB0aGlzLmN1cnJlbnRPcHRpb25zLnRodW1ibmFpbHNQZXJjZW50ICsgJyUgLSAnXG4gICAgICAgICAgKyB0aGlzLmN1cnJlbnRPcHRpb25zLnRodW1ibmFpbHNNYXJnaW4gKyAncHgpJztcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuICcxMDAlJztcbiAgICAgIH1cbiAgfVxuXG4gIGdldFRodW1ibmFpbHNNYXJnaW5Ub3AoKTogc3RyaW5nIHtcbiAgICAgIGlmICh0aGlzLmN1cnJlbnRPcHRpb25zICYmIHRoaXMuY3VycmVudE9wdGlvbnMubGF5b3V0ID09PSBOZ3hHYWxsZXJ5TGF5b3V0LlRodW1ibmFpbHNCb3R0b20pIHtcbiAgICAgICAgICByZXR1cm4gdGhpcy5jdXJyZW50T3B0aW9ucy50aHVtYm5haWxzTWFyZ2luICsgJ3B4JztcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuICcwcHgnO1xuICAgICAgfVxuICB9XG5cbiAgZ2V0VGh1bWJuYWlsc01hcmdpbkJvdHRvbSgpOiBzdHJpbmcge1xuICAgICAgaWYgKHRoaXMuY3VycmVudE9wdGlvbnMgJiYgdGhpcy5jdXJyZW50T3B0aW9ucy5sYXlvdXQgPT09IE5neEdhbGxlcnlMYXlvdXQuVGh1bWJuYWlsc1RvcCkge1xuICAgICAgICAgIHJldHVybiB0aGlzLmN1cnJlbnRPcHRpb25zLnRodW1ibmFpbHNNYXJnaW4gKyAncHgnO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gJzBweCc7XG4gICAgICB9XG4gIH1cblxuICBvcGVuUHJldmlldyhpbmRleDogbnVtYmVyKTogdm9pZCB7XG4gICAgICBpZiAodGhpcy5jdXJyZW50T3B0aW9ucy5wcmV2aWV3Q3VzdG9tKSB7XG4gICAgICAgICAgdGhpcy5jdXJyZW50T3B0aW9ucy5wcmV2aWV3Q3VzdG9tKGluZGV4KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5wcmV2aWV3RW5hYmxlZCA9IHRydWU7XG4gICAgICAgICAgdGhpcy5wcmV2aWV3Lm9wZW4oaW5kZXgpO1xuICAgICAgfVxuICB9XG5cbiAgb25QcmV2aWV3T3BlbigpOiB2b2lkIHtcbiAgICAgIHRoaXMucHJldmlld09wZW4uZW1pdCgpO1xuXG4gICAgICBpZiAodGhpcy5pbWFnZSAmJiB0aGlzLmltYWdlLmF1dG9QbGF5KSB7XG4gICAgICAgICAgdGhpcy5pbWFnZS5zdG9wQXV0b1BsYXkoKTtcbiAgICAgIH1cbiAgfVxuXG4gIG9uUHJldmlld0Nsb3NlKCk6IHZvaWQge1xuICAgICAgdGhpcy5wcmV2aWV3RW5hYmxlZCA9IGZhbHNlO1xuICAgICAgdGhpcy5wcmV2aWV3Q2xvc2UuZW1pdCgpO1xuXG4gICAgICBpZiAodGhpcy5pbWFnZSAmJiB0aGlzLmltYWdlLmF1dG9QbGF5KSB7XG4gICAgICAgICAgdGhpcy5pbWFnZS5zdGFydEF1dG9QbGF5KCk7XG4gICAgICB9XG4gIH1cblxuICBzZWxlY3RGcm9tSW1hZ2UoaW5kZXg6IG51bWJlcikge1xuICAgICAgdGhpcy5zZWxlY3QoaW5kZXgpO1xuICB9XG5cbiAgc2VsZWN0RnJvbVRodW1ibmFpbHMoaW5kZXg6IG51bWJlcikge1xuICAgICAgdGhpcy5zZWxlY3QoaW5kZXgpO1xuXG4gICAgICBpZiAodGhpcy5jdXJyZW50T3B0aW9ucyAmJiB0aGlzLmN1cnJlbnRPcHRpb25zLnRodW1ibmFpbHMgJiYgdGhpcy5jdXJyZW50T3B0aW9ucy5wcmV2aWV3XG4gICAgICAgICAgJiYgKCF0aGlzLmN1cnJlbnRPcHRpb25zLmltYWdlIHx8IHRoaXMuY3VycmVudE9wdGlvbnMudGh1bWJuYWlsc1JlbWFpbmluZ0NvdW50KSkge1xuICAgICAgICAgIHRoaXMub3BlblByZXZpZXcodGhpcy5zZWxlY3RlZEluZGV4KTtcbiAgICAgIH1cbiAgfVxuXG4gIHNob3coaW5kZXg6IG51bWJlcik6IHZvaWQge1xuICAgICAgdGhpcy5zZWxlY3QoaW5kZXgpO1xuICB9XG5cbiAgc2hvd05leHQoKTogdm9pZCB7XG4gICAgICB0aGlzLmltYWdlLnNob3dOZXh0KCk7XG4gIH1cblxuICBzaG93UHJldigpOiB2b2lkIHtcbiAgICAgIHRoaXMuaW1hZ2Uuc2hvd1ByZXYoKTtcbiAgfVxuXG4gIGNhblNob3dOZXh0KCk6IGJvb2xlYW4ge1xuICAgICAgaWYgKHRoaXMuaW1hZ2VzICYmIHRoaXMuY3VycmVudE9wdGlvbnMpIHtcbiAgICAgICAgICByZXR1cm4gKHRoaXMuY3VycmVudE9wdGlvbnMuaW1hZ2VJbmZpbml0eU1vdmUgfHwgdGhpcy5zZWxlY3RlZEluZGV4IDwgdGhpcy5pbWFnZXMubGVuZ3RoIC0gMSlcbiAgICAgICAgICAgICAgPyB0cnVlIDogZmFsc2U7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgfVxuXG4gIGNhblNob3dQcmV2KCk6IGJvb2xlYW4ge1xuICAgICAgaWYgKHRoaXMuaW1hZ2VzICYmIHRoaXMuY3VycmVudE9wdGlvbnMpIHtcbiAgICAgICAgICByZXR1cm4gKHRoaXMuY3VycmVudE9wdGlvbnMuaW1hZ2VJbmZpbml0eU1vdmUgfHwgdGhpcy5zZWxlY3RlZEluZGV4ID4gMCkgPyB0cnVlIDogZmFsc2U7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgfVxuXG4gIHByZXZpZXdTZWxlY3QoaW5kZXg6IG51bWJlcikge1xuICAgICAgdGhpcy5wcmV2aWV3Q2hhbmdlLmVtaXQoe2luZGV4LCBpbWFnZTogdGhpcy5pbWFnZXNbaW5kZXhdfSk7XG4gIH1cblxuICBtb3ZlVGh1bWJuYWlsc1JpZ2h0KCkge1xuICAgICAgdGhpcy50aHVibW5haWxzLm1vdmVSaWdodCgpO1xuICB9XG5cbiAgbW92ZVRodW1ibmFpbHNMZWZ0KCkge1xuICAgICAgdGhpcy50aHVibW5haWxzLm1vdmVMZWZ0KCk7XG4gIH1cblxuICBjYW5Nb3ZlVGh1bWJuYWlsc1JpZ2h0KCkge1xuICAgICAgcmV0dXJuIHRoaXMudGh1Ym1uYWlscy5jYW5Nb3ZlUmlnaHQoKTtcbiAgfVxuXG4gIGNhbk1vdmVUaHVtYm5haWxzTGVmdCgpIHtcbiAgICAgIHJldHVybiB0aGlzLnRodWJtbmFpbHMuY2FuTW92ZUxlZnQoKTtcbiAgfVxuXG4gIHByaXZhdGUgcmVzZXRUaHVtYm5haWxzKCkge1xuICAgICAgaWYgKHRoaXMudGh1Ym1uYWlscykge1xuICAgICAgICAgIHRoaXMudGh1Ym1uYWlscy5yZXNldCg8bnVtYmVyPnRoaXMuY3VycmVudE9wdGlvbnMuc3RhcnRJbmRleCk7XG4gICAgICB9XG4gIH1cblxuICBwcml2YXRlIHNlbGVjdChpbmRleDogbnVtYmVyKSB7XG4gICAgICB0aGlzLnNlbGVjdGVkSW5kZXggPSBpbmRleDtcblxuICAgICAgdGhpcy5jaGFuZ2UuZW1pdCh7XG4gICAgICAgICAgaW5kZXgsXG4gICAgICAgICAgaW1hZ2U6IHRoaXMuaW1hZ2VzW2luZGV4XVxuICAgICAgfSk7XG4gIH1cblxuICBwcml2YXRlIGNoZWNrRnVsbFdpZHRoKCk6IHZvaWQge1xuICAgICAgaWYgKHRoaXMuY3VycmVudE9wdGlvbnMgJiYgdGhpcy5jdXJyZW50T3B0aW9ucy5mdWxsV2lkdGgpIHtcbiAgICAgICAgICB0aGlzLndpZHRoID0gZG9jdW1lbnQuYm9keS5jbGllbnRXaWR0aCArICdweCc7XG4gICAgICAgICAgdGhpcy5sZWZ0ID0gKC0oZG9jdW1lbnQuYm9keS5jbGllbnRXaWR0aCAtXG4gICAgICAgICAgICAgIHRoaXMubXlFbGVtZW50Lm5hdGl2ZUVsZW1lbnQucGFyZW50Tm9kZS5pbm5lcldpZHRoKSAvIDIpICsgJ3B4JztcbiAgICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgc2V0SW1hZ2VzKCk6IHZvaWQge1xuICAgICAgdGhpcy5zbWFsbEltYWdlcyA9IHRoaXMuaW1hZ2VzLm1hcCgoaW1nKSA9PiA8c3RyaW5nPmltZy5zbWFsbCk7XG4gICAgICB0aGlzLm1lZGl1bUltYWdlcyA9IHRoaXMuaW1hZ2VzLm1hcCgoaW1nLCBpKSA9PiBuZXcgTmd4R2FsbGVyeU9yZGVyZWRJbWFnZSh7XG4gICAgICAgICAgc3JjOiBpbWcubWVkaXVtLFxuICAgICAgICAgIGluZGV4OiBpLFxuICAgICAgICAgIHNpemU6IGltZy5tZWRpdW1TaXplXG4gICAgICB9KSk7XG4gICAgICB0aGlzLmJpZ0ltYWdlcyA9IHRoaXMuaW1hZ2VzLm1hcCgoaW1nKSA9PiA8c3RyaW5nPmltZy5iaWcpO1xuICAgICAgdGhpcy5kZXNjcmlwdGlvbnMgPSB0aGlzLmltYWdlcy5tYXAoKGltZykgPT4gPHN0cmluZz5pbWcuZGVzY3JpcHRpb24pO1xuICAgICAgdGhpcy5saW5rcyA9IHRoaXMuaW1hZ2VzLm1hcCgoaW1nKSA9PiA8c3RyaW5nPmltZy51cmwpO1xuICAgICAgdGhpcy5sYWJlbHMgPSB0aGlzLmltYWdlcy5tYXAoKGltZykgPT4gPHN0cmluZz5pbWcubGFiZWwpO1xuICB9XG5cbiAgcHJpdmF0ZSBzZXRCcmVha3BvaW50KCk6IHZvaWQge1xuICAgICAgdGhpcy5wcmV2QnJlYWtwb2ludCA9IHRoaXMuYnJlYWtwb2ludDtcbiAgICAgIGxldCBicmVha3BvaW50cztcblxuICAgICAgaWYgKHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgYnJlYWtwb2ludHMgPSB0aGlzLm9wdGlvbnMuZmlsdGVyKChvcHQpID0+IG9wdC5icmVha3BvaW50ID49IHdpbmRvdy5pbm5lcldpZHRoKVxuICAgICAgICAgICAgICAubWFwKChvcHQpID0+IG9wdC5icmVha3BvaW50KTtcbiAgICAgIH1cblxuICAgICAgaWYgKGJyZWFrcG9pbnRzICYmIGJyZWFrcG9pbnRzLmxlbmd0aCkge1xuICAgICAgICAgIHRoaXMuYnJlYWtwb2ludCA9IGJyZWFrcG9pbnRzLnBvcCgpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLmJyZWFrcG9pbnQgPSB1bmRlZmluZWQ7XG4gICAgICB9XG4gIH1cblxuICBwcml2YXRlIHNvcnRPcHRpb25zKCk6IHZvaWQge1xuICAgICAgdGhpcy5vcHRpb25zID0gW1xuICAgICAgICAgIC4uLnRoaXMub3B0aW9ucy5maWx0ZXIoKGEpID0+IGEuYnJlYWtwb2ludCA9PT0gdW5kZWZpbmVkKSxcbiAgICAgICAgICAuLi50aGlzLm9wdGlvbnNcbiAgICAgICAgICAgICAgLmZpbHRlcigoYSkgPT4gYS5icmVha3BvaW50ICE9PSB1bmRlZmluZWQpXG4gICAgICAgICAgICAgIC5zb3J0KChhLCBiKSA9PiBiLmJyZWFrcG9pbnQgLSBhLmJyZWFrcG9pbnQpXG4gICAgICBdO1xuICB9XG5cbiAgcHJpdmF0ZSBzZXRPcHRpb25zKCk6IHZvaWQge1xuICAgICAgdGhpcy5jdXJyZW50T3B0aW9ucyA9IG5ldyBOZ3hHYWxsZXJ5T3B0aW9ucyh7fSk7XG5cbiAgICAgIHRoaXMub3B0aW9uc1xuICAgICAgICAgIC5maWx0ZXIoKG9wdCkgPT4gb3B0LmJyZWFrcG9pbnQgPT09IHVuZGVmaW5lZCB8fCBvcHQuYnJlYWtwb2ludCA+PSB0aGlzLmJyZWFrcG9pbnQpXG4gICAgICAgICAgLm1hcCgob3B0KSA9PiB0aGlzLmNvbWJpbmVPcHRpb25zKHRoaXMuY3VycmVudE9wdGlvbnMsIG9wdCkpO1xuXG4gICAgICB0aGlzLndpZHRoID0gPHN0cmluZz50aGlzLmN1cnJlbnRPcHRpb25zLndpZHRoO1xuICAgICAgdGhpcy5oZWlnaHQgPSA8c3RyaW5nPnRoaXMuY3VycmVudE9wdGlvbnMuaGVpZ2h0O1xuICB9XG5cbiAgcHJpdmF0ZSBjb21iaW5lT3B0aW9ucyhmaXJzdDogTmd4R2FsbGVyeU9wdGlvbnMsIHNlY29uZDogTmd4R2FsbGVyeU9wdGlvbnMpIHtcbiAgICAgIE9iamVjdC5rZXlzKHNlY29uZCkubWFwKCh2YWwpID0+IGZpcnN0W3ZhbF0gPSBzZWNvbmRbdmFsXSAhPT0gdW5kZWZpbmVkID8gc2Vjb25kW3ZhbF0gOiBmaXJzdFt2YWxdKTtcbiAgfVxufVxuIl19