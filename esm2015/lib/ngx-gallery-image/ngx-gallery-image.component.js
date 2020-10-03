import { __decorate, __param } from "tslib";
import { Component, OnInit, OnChanges, Input, Output, EventEmitter, ElementRef, SimpleChanges, HostListener, AfterViewInit, Inject, PLATFORM_ID, AfterContentInit, AfterViewChecked } from '@angular/core';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';
import { NgxGalleryHelperService } from '../ngx-gallery-helper.service';
import { NgxGalleryAnimation } from '../ngx-gallery-animation.model';
import { isPlatformBrowser } from '@angular/common';
import { NgxGalleryMediumImageSize } from '../ngx-gallery-image.model';
let NgxGalleryImageComponent = class NgxGalleryImageComponent {
    constructor(sanitization, elementRef, helperService, platformId) {
        this.sanitization = sanitization;
        this.elementRef = elementRef;
        this.helperService = helperService;
        this.platformId = platformId;
        this.onClick = new EventEmitter();
        this.onActiveChange = new EventEmitter();
        this.canChangeImage = true;
    }
    ngOnInit() {
        if (this.arrows && this.arrowsAutoHide) {
            this.arrows = false;
        }
        if (this.autoPlay) {
            this.startAutoPlay();
        }
    }
    ngOnChanges(changes) {
        if (changes['swipe']) {
            this.helperService.manageSwipe(this.swipe, this.elementRef, 'image', () => this.showNext(), () => this.showPrev());
        }
    }
    ngAfterViewChecked() {
        if (isPlatformBrowser(this.platformId) &&
            (this.elementSize === undefined ||
                this.elementSize.width !== this.elementRef.nativeElement.offsetWidth ||
                this.elementSize.height !== this.elementRef.nativeElement.offsetHeight)) {
            this.setSizesAndClasses();
        }
    }
    onMouseEnter() {
        if (this.arrowsAutoHide && !this.arrows) {
            this.arrows = true;
        }
        if (this.autoPlay && this.autoPlayPauseOnHover) {
            this.stopAutoPlay();
        }
    }
    onMouseLeave() {
        if (this.arrowsAutoHide && this.arrows) {
            this.arrows = false;
        }
        if (this.autoPlay && this.autoPlayPauseOnHover) {
            this.startAutoPlay();
        }
    }
    reset(index) {
        this.selectedIndex = index;
    }
    setImageClasses() {
        if (this.elementSize === undefined) {
            return;
        }
        for (const image of this.images) {
            if (image.size !== undefined && image.size !== null) {
                image.class = image.size.width <= this.elementSize.width && image.size.height <= this.elementSize.height ?
                    ' display-background-auto' :
                    ' display-background-contain';
            }
            else {
                image.class = ' display-background-contain';
            }
        }
    }
    getImages() {
        if (!this.images) {
            return [];
        }
        if (this.lazyLoading) {
            let indexes = [this.selectedIndex];
            let prevIndex = this.selectedIndex - 1;
            if (prevIndex === -1 && this.infinityMove) {
                indexes.push(this.images.length - 1);
            }
            else if (prevIndex >= 0) {
                indexes.push(prevIndex);
            }
            let nextIndex = this.selectedIndex + 1;
            if (nextIndex == this.images.length && this.infinityMove) {
                indexes.push(0);
            }
            else if (nextIndex < this.images.length) {
                indexes.push(nextIndex);
            }
            return this.images.filter((img, i) => indexes.indexOf(i) != -1);
        }
        else {
            return this.images;
        }
    }
    startAutoPlay() {
        this.stopAutoPlay();
        this.timer = setInterval(() => {
            if (!this.showNext()) {
                this.selectedIndex = -1;
                this.showNext();
            }
        }, this.autoPlayInterval);
    }
    stopAutoPlay() {
        if (this.timer) {
            clearInterval(this.timer);
        }
    }
    handleClick(event, index) {
        if (this.clickable) {
            this.onClick.emit(index);
            event.stopPropagation();
            event.preventDefault();
        }
    }
    show(index) {
        this.selectedIndex = index;
        this.onActiveChange.emit(this.selectedIndex);
        this.setChangeTimeout();
    }
    showNext() {
        if (this.canShowNext() && this.canChangeImage) {
            this.selectedIndex++;
            if (this.selectedIndex === this.images.length) {
                this.selectedIndex = 0;
            }
            this.onActiveChange.emit(this.selectedIndex);
            this.setChangeTimeout();
            return true;
        }
        else {
            return false;
        }
    }
    showPrev() {
        if (this.canShowPrev() && this.canChangeImage) {
            this.selectedIndex--;
            if (this.selectedIndex < 0) {
                this.selectedIndex = this.images.length - 1;
            }
            this.onActiveChange.emit(this.selectedIndex);
            this.setChangeTimeout();
        }
    }
    setChangeTimeout() {
        this.canChangeImage = false;
        let timeout = 1000;
        if (this.animation === NgxGalleryAnimation.Slide
            || this.animation === NgxGalleryAnimation.Fade) {
            timeout = 500;
        }
        setTimeout(() => {
            this.canChangeImage = true;
        }, timeout);
    }
    canShowNext() {
        if (this.images) {
            return this.infinityMove || this.selectedIndex < this.images.length - 1
                ? true : false;
        }
        else {
            return false;
        }
    }
    canShowPrev() {
        if (this.images) {
            return this.infinityMove || this.selectedIndex > 0 ? true : false;
        }
        else {
            return false;
        }
    }
    getSafeUrl(image) {
        return this.sanitization.bypassSecurityTrustStyle(this.helperService.getBackgroundUrl(image));
    }
    setSizesAndClasses() {
        this.elementSize = new NgxGalleryMediumImageSize({
            width: this.elementRef.nativeElement.offsetWidth,
            height: this.elementRef.nativeElement.offsetHeight
        });
        this.setImageClasses();
    }
};
NgxGalleryImageComponent.ctorParameters = () => [
    { type: DomSanitizer },
    { type: ElementRef },
    { type: NgxGalleryHelperService },
    { type: undefined, decorators: [{ type: Inject, args: [PLATFORM_ID,] }] }
];
__decorate([
    Input()
], NgxGalleryImageComponent.prototype, "images", void 0);
__decorate([
    Input()
], NgxGalleryImageComponent.prototype, "clickable", void 0);
__decorate([
    Input()
], NgxGalleryImageComponent.prototype, "selectedIndex", void 0);
__decorate([
    Input()
], NgxGalleryImageComponent.prototype, "arrows", void 0);
__decorate([
    Input()
], NgxGalleryImageComponent.prototype, "arrowsAutoHide", void 0);
__decorate([
    Input()
], NgxGalleryImageComponent.prototype, "swipe", void 0);
__decorate([
    Input()
], NgxGalleryImageComponent.prototype, "animation", void 0);
__decorate([
    Input()
], NgxGalleryImageComponent.prototype, "size", void 0);
__decorate([
    Input()
], NgxGalleryImageComponent.prototype, "arrowPrevIcon", void 0);
__decorate([
    Input()
], NgxGalleryImageComponent.prototype, "arrowNextIcon", void 0);
__decorate([
    Input()
], NgxGalleryImageComponent.prototype, "autoPlay", void 0);
__decorate([
    Input()
], NgxGalleryImageComponent.prototype, "autoPlayInterval", void 0);
__decorate([
    Input()
], NgxGalleryImageComponent.prototype, "autoPlayPauseOnHover", void 0);
__decorate([
    Input()
], NgxGalleryImageComponent.prototype, "infinityMove", void 0);
__decorate([
    Input()
], NgxGalleryImageComponent.prototype, "lazyLoading", void 0);
__decorate([
    Input()
], NgxGalleryImageComponent.prototype, "actions", void 0);
__decorate([
    Input()
], NgxGalleryImageComponent.prototype, "descriptions", void 0);
__decorate([
    Input()
], NgxGalleryImageComponent.prototype, "showDescription", void 0);
__decorate([
    Input()
], NgxGalleryImageComponent.prototype, "bullets", void 0);
__decorate([
    Output()
], NgxGalleryImageComponent.prototype, "onClick", void 0);
__decorate([
    Output()
], NgxGalleryImageComponent.prototype, "onActiveChange", void 0);
__decorate([
    HostListener('mouseenter')
], NgxGalleryImageComponent.prototype, "onMouseEnter", null);
__decorate([
    HostListener('mouseleave')
], NgxGalleryImageComponent.prototype, "onMouseLeave", null);
NgxGalleryImageComponent = __decorate([
    Component({
        selector: 'ngx-gallery-image',
        template: "<div class=\"ngx-gallery-image-wrapper ngx-gallery-animation-{{animation}} ngx-gallery-image-size-{{size}}\">\n    <div\n        *ngFor=\"let image of getImages(); let i = index;\"\n        class=\"ngx-gallery-image{{ image.class }}\"\n        [ngClass]=\"{ 'ngx-gallery-active': selectedIndex == image.index, 'ngx-gallery-inactive-left': selectedIndex > image.index, 'ngx-gallery-inactive-right': selectedIndex < image.index, 'ngx-gallery-clickable': clickable }\"\n        [style.background-image]=\"getSafeUrl(image.src)\"\n        (click)=\"handleClick($event, image.index)\" >\n        <div class=\"ngx-gallery-icons-wrapper\">\n            <ngx-gallery-action *ngFor=\"let action of actions\" [icon]=\"action.icon\" [disabled]=\"action.disabled\" [titleText]=\"action.titleText\" (onClick)=\"action.onClick($event, image.index)\"></ngx-gallery-action>\n        </div>\n        <div class=\"ngx-gallery-image-text\" *ngIf=\"showDescription && descriptions[image.index]\" [innerHTML]=\"descriptions[image.index]\" (click)=\"$event.stopPropagation()\"></div>\n    </div>\n</div>\n<ngx-gallery-bullets *ngIf=\"bullets\" [count]=\"images.length\" [active]=\"selectedIndex\" (onChange)=\"show($event)\"></ngx-gallery-bullets>\n<ngx-gallery-arrows class=\"ngx-gallery-image-size-{{size}}\" *ngIf=\"arrows\" (onPrevClick)=\"showPrev()\" (onNextClick)=\"showNext()\" [prevDisabled]=\"!canShowPrev()\" [nextDisabled]=\"!canShowNext()\" [arrowPrevIcon]=\"arrowPrevIcon\" [arrowNextIcon]=\"arrowNextIcon\"></ngx-gallery-arrows>\n",
        styles: [":host{width:100%;display:inline-block;position:relative}.ngx-gallery-image-wrapper{width:100%;height:100%;position:absolute;left:0;top:0;overflow:hidden}.ngx-gallery-image{background-position:center;background-repeat:no-repeat;height:100%;width:100%;position:absolute;top:0}.ngx-gallery-image.ngx-gallery-active{z-index:1000}.ngx-gallery-image-size-cover .ngx-gallery-image{background-size:cover}.ngx-gallery-image-size-contain .ngx-gallery-image{background-size:contain}.ngx-gallery-animation-fade .ngx-gallery-image{left:0;opacity:0;-webkit-transition:.5s ease-in-out;transition:.5s ease-in-out}.ngx-gallery-animation-fade .ngx-gallery-image.ngx-gallery-active{opacity:1}.ngx-gallery-animation-slide .ngx-gallery-image{-webkit-transition:.5s ease-in-out;transition:.5s ease-in-out}.ngx-gallery-animation-slide .ngx-gallery-image.ngx-gallery-active{left:0}.ngx-gallery-animation-slide .ngx-gallery-image.ngx-gallery-inactive-left{left:-100%}.ngx-gallery-animation-slide .ngx-gallery-image.ngx-gallery-inactive-right{left:100%}.ngx-gallery-animation-rotate .ngx-gallery-image{-webkit-transition:1s;transition:1s;-webkit-transform:scale(3.5,3.5) rotate(90deg);transform:scale(3.5,3.5) rotate(90deg);left:0;opacity:0}.ngx-gallery-animation-rotate .ngx-gallery-image.ngx-gallery-active{-webkit-transform:scale(1,1) rotate(0);transform:scale(1,1) rotate(0);opacity:1}.ngx-gallery-animation-zoom .ngx-gallery-image{-webkit-transition:1s;transition:1s;-webkit-transform:scale(2.5,2.5);transform:scale(2.5,2.5);left:0;opacity:0}.ngx-gallery-animation-zoom .ngx-gallery-image.ngx-gallery-active{-webkit-transform:scale(1,1);transform:scale(1,1);opacity:1}.ngx-gallery-image-text{width:100%;background:rgba(0,0,0,.7);padding:10px;text-align:center;color:#fff;font-size:16px;position:absolute;bottom:0;z-index:10}.display-background-auto{background-size:auto!important}.display-background-contain{background-size:contain!important}"]
    }),
    __param(3, Inject(PLATFORM_ID))
], NgxGalleryImageComponent);
export { NgxGalleryImageComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmd4LWdhbGxlcnktaW1hZ2UuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Im5nOi8vbmd4LWdhbGxlcnktOS8iLCJzb3VyY2VzIjpbImxpYi9uZ3gtZ2FsbGVyeS1pbWFnZS9uZ3gtZ2FsbGVyeS1pbWFnZS5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFDTCxTQUFTLEVBQ1QsTUFBTSxFQUNOLFNBQVMsRUFDVCxLQUFLLEVBQ0wsTUFBTSxFQUNOLFlBQVksRUFDWixVQUFVLEVBQ1YsYUFBYSxFQUNiLFlBQVksRUFDWixhQUFhLEVBQUUsTUFBTSxFQUFFLFdBQVcsRUFBRSxnQkFBZ0IsRUFBRSxnQkFBZ0IsRUFDdkUsTUFBTSxlQUFlLENBQUM7QUFHdkIsT0FBTyxFQUFFLFlBQVksRUFBRSxTQUFTLEVBQUUsTUFBTSwyQkFBMkIsQ0FBQztBQUNwRSxPQUFPLEVBQUUsdUJBQXVCLEVBQUUsTUFBTSwrQkFBK0IsQ0FBQztBQUN4RSxPQUFPLEVBQUUsbUJBQW1CLEVBQUUsTUFBTSxnQ0FBZ0MsQ0FBQztBQUNyRSxPQUFPLEVBQUMsaUJBQWlCLEVBQUMsTUFBTSxpQkFBaUIsQ0FBQztBQUNsRCxPQUFPLEVBQUMseUJBQXlCLEVBQUMsTUFBTSw0QkFBNEIsQ0FBQztBQU9yRSxJQUFhLHdCQUF3QixHQUFyQyxNQUFhLHdCQUF3QjtJQThCbkMsWUFDVSxZQUEwQixFQUMxQixVQUFzQixFQUN0QixhQUFzQyxFQUNqQixVQUFlO1FBSHBDLGlCQUFZLEdBQVosWUFBWSxDQUFjO1FBQzFCLGVBQVUsR0FBVixVQUFVLENBQVk7UUFDdEIsa0JBQWEsR0FBYixhQUFhLENBQXlCO1FBQ2pCLGVBQVUsR0FBVixVQUFVLENBQUs7UUFicEMsWUFBTyxHQUFHLElBQUksWUFBWSxFQUFFLENBQUM7UUFDN0IsbUJBQWMsR0FBRyxJQUFJLFlBQVksRUFBRSxDQUFDO1FBSTlDLG1CQUFjLEdBQUcsSUFBSSxDQUFDO0lBU25CLENBQUM7SUFFSixR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O0FBQ3RCO0lBQVIsS0FBSyxFQUFFOzZEQUFzQjtBQUNyQjtJQUFSLEtBQUssRUFBRTt5REFBNkI7QUFDNUI7SUFBUixLQUFLLEVBQUU7OERBQXdCO0FBQ3ZCO0lBQVIsS0FBSyxFQUFFO2lFQUEwQjtBQUN6QjtJQUFSLEtBQUssRUFBRTt5REFBa0I7QUFFaEI7SUFBVCxNQUFNLEVBQUU7eURBQThCO0FBQzdCO0lBQVQsTUFBTSxFQUFFO2dFQUFxQztBQTRDbEI7SUFBM0IsWUFBWSxDQUFDLFlBQVksQ0FBQzs0REFRMUI7QUFFMkI7SUFBM0IsWUFBWSxDQUFDLFlBQVksQ0FBQzs0REFRMUI7QUFwRlUsd0JBQXdCO0lBTHBDLFNBQVMsQ0FBQztRQUNULFFBQVEsRUFBRSxtQkFBbUI7UUFDN0IsKy9DQUFpRDs7S0FFbEQsQ0FBQztJQW1DRyxXQUFBLE1BQU0sQ0FBQyxXQUFXLENBQUMsQ0FBQTtHQWxDWCx3QkFBd0IsQ0E4T3BDO1NBOU9ZLHdCQUF3QiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XG4gIENvbXBvbmVudCxcbiAgT25Jbml0LFxuICBPbkNoYW5nZXMsXG4gIElucHV0LFxuICBPdXRwdXQsXG4gIEV2ZW50RW1pdHRlcixcbiAgRWxlbWVudFJlZixcbiAgU2ltcGxlQ2hhbmdlcyxcbiAgSG9zdExpc3RlbmVyLFxuICBBZnRlclZpZXdJbml0LCBJbmplY3QsIFBMQVRGT1JNX0lELCBBZnRlckNvbnRlbnRJbml0LCBBZnRlclZpZXdDaGVja2VkXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgTmd4R2FsbGVyeU9yZGVyZWRJbWFnZSB9IGZyb20gJy4uL25neC1nYWxsZXJ5LW9yZGVyZWQtaW1hZ2UubW9kZWwnO1xuaW1wb3J0IHsgTmd4R2FsbGVyeUFjdGlvbiB9IGZyb20gJy4uL25neC1nYWxsZXJ5LWFjdGlvbi5tb2RlbCc7XG5pbXBvcnQgeyBEb21TYW5pdGl6ZXIsIFNhZmVTdHlsZSB9IGZyb20gJ0Bhbmd1bGFyL3BsYXRmb3JtLWJyb3dzZXInO1xuaW1wb3J0IHsgTmd4R2FsbGVyeUhlbHBlclNlcnZpY2UgfSBmcm9tICcuLi9uZ3gtZ2FsbGVyeS1oZWxwZXIuc2VydmljZSc7XG5pbXBvcnQgeyBOZ3hHYWxsZXJ5QW5pbWF0aW9uIH0gZnJvbSAnLi4vbmd4LWdhbGxlcnktYW5pbWF0aW9uLm1vZGVsJztcbmltcG9ydCB7aXNQbGF0Zm9ybUJyb3dzZXJ9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQge05neEdhbGxlcnlNZWRpdW1JbWFnZVNpemV9IGZyb20gJy4uL25neC1nYWxsZXJ5LWltYWdlLm1vZGVsJztcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnbmd4LWdhbGxlcnktaW1hZ2UnLFxuICB0ZW1wbGF0ZVVybDogJy4vbmd4LWdhbGxlcnktaW1hZ2UuY29tcG9uZW50Lmh0bWwnLFxuICBzdHlsZVVybHM6IFsnLi9uZ3gtZ2FsbGVyeS1pbWFnZS5jb21wb25lbnQuc2NzcyddXG59KVxuZXhwb3J0IGNsYXNzIE5neEdhbGxlcnlJbWFnZUNvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCwgT25DaGFuZ2VzLCBBZnRlclZpZXdDaGVja2VkIHtcbiAgQElucHV0KCkgaW1hZ2VzOiBOZ3hHYWxsZXJ5T3JkZXJlZEltYWdlW107XG4gIEBJbnB1dCgpIGNsaWNrYWJsZTogYm9vbGVhbjtcbiAgQElucHV0KCkgc2VsZWN0ZWRJbmRleDogbnVtYmVyO1xuICBASW5wdXQoKSBhcnJvd3M6IGJvb2xlYW47XG4gIEBJbnB1dCgpIGFycm93c0F1dG9IaWRlOiBib29sZWFuO1xuICBASW5wdXQoKSBzd2lwZTogYm9vbGVhbjtcbiAgQElucHV0KCkgYW5pbWF0aW9uOiBzdHJpbmc7XG4gIEBJbnB1dCgpIHNpemU6IHN0cmluZztcbiAgQElucHV0KCkgYXJyb3dQcmV2SWNvbjogc3RyaW5nO1xuICBASW5wdXQoKSBhcnJvd05leHRJY29uOiBzdHJpbmc7XG4gIEBJbnB1dCgpIGF1dG9QbGF5OiBib29sZWFuO1xuICBASW5wdXQoKSBhdXRvUGxheUludGVydmFsOiBudW1iZXI7XG4gIEBJbnB1dCgpIGF1dG9QbGF5UGF1c2VPbkhvdmVyOiBib29sZWFuO1xuICBASW5wdXQoKSBpbmZpbml0eU1vdmU6IGJvb2xlYW47XG4gIEBJbnB1dCgpIGxhenlMb2FkaW5nOiBib29sZWFuO1xuICBASW5wdXQoKSBhY3Rpb25zOiBOZ3hHYWxsZXJ5QWN0aW9uW107XG4gIEBJbnB1dCgpIGRlc2NyaXB0aW9uczogc3RyaW5nW107XG4gIEBJbnB1dCgpIHNob3dEZXNjcmlwdGlvbjogYm9vbGVhbjtcbiAgQElucHV0KCkgYnVsbGV0czogYm9vbGVhbjtcblxuICBAT3V0cHV0KCkgb25DbGljayA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcbiAgQE91dHB1dCgpIG9uQWN0aXZlQ2hhbmdlID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuXG4gIHByaXZhdGUgZWxlbWVudFNpemU6IE5neEdhbGxlcnlNZWRpdW1JbWFnZVNpemU7XG5cbiAgY2FuQ2hhbmdlSW1hZ2UgPSB0cnVlO1xuXG4gIHByaXZhdGUgdGltZXI7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSBzYW5pdGl6YXRpb246IERvbVNhbml0aXplcixcbiAgICBwcml2YXRlIGVsZW1lbnRSZWY6IEVsZW1lbnRSZWYsXG4gICAgcHJpdmF0ZSBoZWxwZXJTZXJ2aWNlOiBOZ3hHYWxsZXJ5SGVscGVyU2VydmljZSxcbiAgICBASW5qZWN0KFBMQVRGT1JNX0lEKSBwcml2YXRlIHBsYXRmb3JtSWQ6IGFueVxuICApIHt9XG5cbiAgbmdPbkluaXQoKTogdm9pZCB7XG4gICAgICBpZiAodGhpcy5hcnJvd3MgJiYgdGhpcy5hcnJvd3NBdXRvSGlkZSkge1xuICAgICAgICAgIHRoaXMuYXJyb3dzID0gZmFsc2U7XG4gICAgICB9XG5cbiAgICAgIGlmICh0aGlzLmF1dG9QbGF5KSB7XG4gICAgICAgICAgdGhpcy5zdGFydEF1dG9QbGF5KCk7XG4gICAgICB9XG4gIH1cblxuICBuZ09uQ2hhbmdlcyhjaGFuZ2VzOiBTaW1wbGVDaGFuZ2VzKTogdm9pZCB7XG4gICAgICBpZiAoY2hhbmdlc1snc3dpcGUnXSkge1xuICAgICAgICAgIHRoaXMuaGVscGVyU2VydmljZS5tYW5hZ2VTd2lwZSh0aGlzLnN3aXBlLCB0aGlzLmVsZW1lbnRSZWYsICdpbWFnZScsICgpID0+IHRoaXMuc2hvd05leHQoKSwgKCkgPT4gdGhpcy5zaG93UHJldigpKTtcbiAgICAgIH1cbiAgfVxuXG4gIG5nQWZ0ZXJWaWV3Q2hlY2tlZCgpOiB2b2lkIHtcbiAgICBpZiAoXG4gICAgICBpc1BsYXRmb3JtQnJvd3Nlcih0aGlzLnBsYXRmb3JtSWQpICYmXG4gICAgICAoXG4gICAgICAgIHRoaXMuZWxlbWVudFNpemUgPT09IHVuZGVmaW5lZCB8fFxuICAgICAgICB0aGlzLmVsZW1lbnRTaXplLndpZHRoICE9PSB0aGlzLmVsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5vZmZzZXRXaWR0aCB8fFxuICAgICAgICB0aGlzLmVsZW1lbnRTaXplLmhlaWdodCAhPT0gdGhpcy5lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQub2Zmc2V0SGVpZ2h0XG4gICAgICApXG4gICAgKSB7XG4gICAgICB0aGlzLnNldFNpemVzQW5kQ2xhc3NlcygpO1xuICAgIH1cbiAgfVxuXG4gIEBIb3N0TGlzdGVuZXIoJ21vdXNlZW50ZXInKSBvbk1vdXNlRW50ZXIoKSB7XG4gICAgICBpZiAodGhpcy5hcnJvd3NBdXRvSGlkZSAmJiAhdGhpcy5hcnJvd3MpIHtcbiAgICAgICAgICB0aGlzLmFycm93cyA9IHRydWU7XG4gICAgICB9XG5cbiAgICAgIGlmICh0aGlzLmF1dG9QbGF5ICYmIHRoaXMuYXV0b1BsYXlQYXVzZU9uSG92ZXIpIHtcbiAgICAgICAgICB0aGlzLnN0b3BBdXRvUGxheSgpO1xuICAgICAgfVxuICB9XG5cbiAgQEhvc3RMaXN0ZW5lcignbW91c2VsZWF2ZScpIG9uTW91c2VMZWF2ZSgpIHtcbiAgICAgIGlmICh0aGlzLmFycm93c0F1dG9IaWRlICYmIHRoaXMuYXJyb3dzKSB7XG4gICAgICAgICAgdGhpcy5hcnJvd3MgPSBmYWxzZTtcbiAgICAgIH1cblxuICAgICAgaWYgKHRoaXMuYXV0b1BsYXkgJiYgdGhpcy5hdXRvUGxheVBhdXNlT25Ib3Zlcikge1xuICAgICAgICAgIHRoaXMuc3RhcnRBdXRvUGxheSgpO1xuICAgICAgfVxuICB9XG5cbiAgcmVzZXQoaW5kZXg6IG51bWJlcik6IHZvaWQge1xuICAgICAgdGhpcy5zZWxlY3RlZEluZGV4ID0gaW5kZXg7XG4gIH1cblxuICBzZXRJbWFnZUNsYXNzZXMoKTogdm9pZCB7XG4gICAgaWYgKHRoaXMuZWxlbWVudFNpemUgPT09IHVuZGVmaW5lZCkgeyByZXR1cm47IH1cbiAgICBmb3IgKGNvbnN0IGltYWdlIG9mIHRoaXMuaW1hZ2VzKSB7XG4gICAgICBpZiAoaW1hZ2Uuc2l6ZSAhPT0gdW5kZWZpbmVkICYmIGltYWdlLnNpemUgIT09IG51bGwpIHtcbiAgICAgICAgaW1hZ2UuY2xhc3MgPSBpbWFnZS5zaXplLndpZHRoIDw9IHRoaXMuZWxlbWVudFNpemUud2lkdGggJiYgaW1hZ2Uuc2l6ZS5oZWlnaHQgPD0gdGhpcy5lbGVtZW50U2l6ZS5oZWlnaHQgP1xuICAgICAgICAgICcgZGlzcGxheS1iYWNrZ3JvdW5kLWF1dG8nIDpcbiAgICAgICAgICAnIGRpc3BsYXktYmFja2dyb3VuZC1jb250YWluJztcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGltYWdlLmNsYXNzID0gJyBkaXNwbGF5LWJhY2tncm91bmQtY29udGFpbic7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgZ2V0SW1hZ2VzKCk6IE5neEdhbGxlcnlPcmRlcmVkSW1hZ2VbXSB7XG4gICAgICBpZiAoIXRoaXMuaW1hZ2VzKSB7XG4gICAgICAgICAgcmV0dXJuIFtdO1xuICAgICAgfVxuXG4gICAgICBpZiAodGhpcy5sYXp5TG9hZGluZykge1xuICAgICAgICAgIGxldCBpbmRleGVzID0gW3RoaXMuc2VsZWN0ZWRJbmRleF07XG4gICAgICAgICAgbGV0IHByZXZJbmRleCA9IHRoaXMuc2VsZWN0ZWRJbmRleCAtIDE7XG5cbiAgICAgICAgICBpZiAocHJldkluZGV4ID09PSAtMSAmJiB0aGlzLmluZmluaXR5TW92ZSkge1xuICAgICAgICAgICAgICBpbmRleGVzLnB1c2godGhpcy5pbWFnZXMubGVuZ3RoIC0gMSlcbiAgICAgICAgICB9IGVsc2UgaWYgKHByZXZJbmRleCA+PSAwKSB7XG4gICAgICAgICAgICAgIGluZGV4ZXMucHVzaChwcmV2SW5kZXgpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGxldCBuZXh0SW5kZXggPSB0aGlzLnNlbGVjdGVkSW5kZXggKyAxO1xuXG4gICAgICAgICAgaWYgKG5leHRJbmRleCA9PSB0aGlzLmltYWdlcy5sZW5ndGggJiYgdGhpcy5pbmZpbml0eU1vdmUpIHtcbiAgICAgICAgICAgICAgaW5kZXhlcy5wdXNoKDApO1xuICAgICAgICAgIH0gZWxzZSBpZiAobmV4dEluZGV4IDwgdGhpcy5pbWFnZXMubGVuZ3RoKSB7XG4gICAgICAgICAgICAgIGluZGV4ZXMucHVzaChuZXh0SW5kZXgpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHJldHVybiB0aGlzLmltYWdlcy5maWx0ZXIoKGltZywgaSkgPT4gaW5kZXhlcy5pbmRleE9mKGkpICE9IC0xKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuIHRoaXMuaW1hZ2VzO1xuICAgICAgfVxuICB9XG5cbiAgc3RhcnRBdXRvUGxheSgpOiB2b2lkIHtcbiAgICAgIHRoaXMuc3RvcEF1dG9QbGF5KCk7XG5cbiAgICAgIHRoaXMudGltZXIgPSBzZXRJbnRlcnZhbCgoKSA9PiB7XG4gICAgICAgICAgaWYgKCF0aGlzLnNob3dOZXh0KCkpIHtcbiAgICAgICAgICAgICAgdGhpcy5zZWxlY3RlZEluZGV4ID0gLTE7XG4gICAgICAgICAgICAgIHRoaXMuc2hvd05leHQoKTtcbiAgICAgICAgICB9XG4gICAgICB9LCB0aGlzLmF1dG9QbGF5SW50ZXJ2YWwpO1xuICB9XG5cbiAgc3RvcEF1dG9QbGF5KCkge1xuICAgICAgaWYgKHRoaXMudGltZXIpIHtcbiAgICAgICAgICBjbGVhckludGVydmFsKHRoaXMudGltZXIpO1xuICAgICAgfVxuICB9XG5cbiAgaGFuZGxlQ2xpY2soZXZlbnQ6IEV2ZW50LCBpbmRleDogbnVtYmVyKTogdm9pZCB7XG4gICAgICBpZiAodGhpcy5jbGlja2FibGUpIHtcbiAgICAgICAgICB0aGlzLm9uQ2xpY2suZW1pdChpbmRleCk7XG5cbiAgICAgICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgfVxuICB9XG5cbiAgc2hvdyhpbmRleDogbnVtYmVyKSB7XG4gICAgICB0aGlzLnNlbGVjdGVkSW5kZXggPSBpbmRleDtcbiAgICAgIHRoaXMub25BY3RpdmVDaGFuZ2UuZW1pdCh0aGlzLnNlbGVjdGVkSW5kZXgpO1xuICAgICAgdGhpcy5zZXRDaGFuZ2VUaW1lb3V0KCk7XG4gIH1cblxuICBzaG93TmV4dCgpOiBib29sZWFuIHtcbiAgICAgIGlmICh0aGlzLmNhblNob3dOZXh0KCkgJiYgdGhpcy5jYW5DaGFuZ2VJbWFnZSkge1xuICAgICAgICAgIHRoaXMuc2VsZWN0ZWRJbmRleCsrO1xuXG4gICAgICAgICAgaWYgKHRoaXMuc2VsZWN0ZWRJbmRleCA9PT0gdGhpcy5pbWFnZXMubGVuZ3RoKSB7XG4gICAgICAgICAgICAgIHRoaXMuc2VsZWN0ZWRJbmRleCA9IDA7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgdGhpcy5vbkFjdGl2ZUNoYW5nZS5lbWl0KHRoaXMuc2VsZWN0ZWRJbmRleCk7XG4gICAgICAgICAgdGhpcy5zZXRDaGFuZ2VUaW1lb3V0KCk7XG5cbiAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICB9XG5cbiAgc2hvd1ByZXYoKTogdm9pZCB7XG4gICAgICBpZiAodGhpcy5jYW5TaG93UHJldigpICYmIHRoaXMuY2FuQ2hhbmdlSW1hZ2UpIHtcbiAgICAgICAgICB0aGlzLnNlbGVjdGVkSW5kZXgtLTtcblxuICAgICAgICAgIGlmICh0aGlzLnNlbGVjdGVkSW5kZXggPCAwKSB7XG4gICAgICAgICAgICAgIHRoaXMuc2VsZWN0ZWRJbmRleCA9IHRoaXMuaW1hZ2VzLmxlbmd0aCAtIDE7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgdGhpcy5vbkFjdGl2ZUNoYW5nZS5lbWl0KHRoaXMuc2VsZWN0ZWRJbmRleCk7XG4gICAgICAgICAgdGhpcy5zZXRDaGFuZ2VUaW1lb3V0KCk7XG4gICAgICB9XG4gIH1cblxuICBzZXRDaGFuZ2VUaW1lb3V0KCkge1xuICAgICAgdGhpcy5jYW5DaGFuZ2VJbWFnZSA9IGZhbHNlO1xuICAgICAgbGV0IHRpbWVvdXQgPSAxMDAwO1xuXG4gICAgICBpZiAodGhpcy5hbmltYXRpb24gPT09IE5neEdhbGxlcnlBbmltYXRpb24uU2xpZGVcbiAgICAgICAgICB8fCB0aGlzLmFuaW1hdGlvbiA9PT0gTmd4R2FsbGVyeUFuaW1hdGlvbi5GYWRlKSB7XG4gICAgICAgICAgICAgIHRpbWVvdXQgPSA1MDA7XG4gICAgICB9XG5cbiAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgIHRoaXMuY2FuQ2hhbmdlSW1hZ2UgPSB0cnVlO1xuICAgICAgfSwgdGltZW91dCk7XG4gIH1cblxuICBjYW5TaG93TmV4dCgpOiBib29sZWFuIHtcbiAgICAgIGlmICh0aGlzLmltYWdlcykge1xuICAgICAgICAgIHJldHVybiB0aGlzLmluZmluaXR5TW92ZSB8fCB0aGlzLnNlbGVjdGVkSW5kZXggPCB0aGlzLmltYWdlcy5sZW5ndGggLSAxXG4gICAgICAgICAgICAgID8gdHJ1ZSA6IGZhbHNlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gIH1cblxuICBjYW5TaG93UHJldigpOiBib29sZWFuIHtcbiAgICAgIGlmICh0aGlzLmltYWdlcykge1xuICAgICAgICAgIHJldHVybiB0aGlzLmluZmluaXR5TW92ZSB8fCB0aGlzLnNlbGVjdGVkSW5kZXggPiAwID8gdHJ1ZSA6IGZhbHNlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gIH1cblxuICBnZXRTYWZlVXJsKGltYWdlOiBzdHJpbmcpOiBTYWZlU3R5bGUge1xuICAgICAgcmV0dXJuIHRoaXMuc2FuaXRpemF0aW9uLmJ5cGFzc1NlY3VyaXR5VHJ1c3RTdHlsZSh0aGlzLmhlbHBlclNlcnZpY2UuZ2V0QmFja2dyb3VuZFVybChpbWFnZSkpO1xuICB9XG5cbiAgcHJpdmF0ZSBzZXRTaXplc0FuZENsYXNzZXMoKTogdm9pZCB7XG4gICAgdGhpcy5lbGVtZW50U2l6ZSA9IG5ldyBOZ3hHYWxsZXJ5TWVkaXVtSW1hZ2VTaXplKFxuICAgICAge1xuICAgICAgICB3aWR0aDogdGhpcy5lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQub2Zmc2V0V2lkdGgsXG4gICAgICAgIGhlaWdodDogdGhpcy5lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQub2Zmc2V0SGVpZ2h0XG4gICAgICB9XG4gICAgKTtcbiAgICB0aGlzLnNldEltYWdlQ2xhc3NlcygpO1xuICB9XG59XG4iXX0=