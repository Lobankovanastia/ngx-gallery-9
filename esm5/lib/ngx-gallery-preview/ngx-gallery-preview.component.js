import { __decorate } from "tslib";
import { Component, OnInit, Input, OnChanges, Output, EventEmitter, ViewChild, ElementRef, ChangeDetectorRef, SimpleChanges, HostListener, Renderer2 } from '@angular/core';
import { SafeResourceUrl, SafeUrl, DomSanitizer, SafeStyle } from '@angular/platform-browser';
import { NgxGalleryHelperService } from '../ngx-gallery-helper.service';
var NgxGalleryPreviewComponent = /** @class */ (function () {
    function NgxGalleryPreviewComponent(sanitization, elementRef, helperService, renderer, changeDetectorRef) {
        this.sanitization = sanitization;
        this.elementRef = elementRef;
        this.helperService = helperService;
        this.renderer = renderer;
        this.changeDetectorRef = changeDetectorRef;
        this.showSpinner = false;
        this.positionLeft = 0;
        this.positionTop = 0;
        this.zoomValue = 1;
        this.loading = false;
        this.rotateValue = 0;
        this.index = 0;
        this.onOpen = new EventEmitter();
        this.onClose = new EventEmitter();
        this.onActiveChange = new EventEmitter();
        this.isOpen = false;
        this.initialX = 0;
        this.initialY = 0;
        this.initialLeft = 0;
        this.initialTop = 0;
        this.isMove = false;
    }
    NgxGalleryPreviewComponent.prototype.ngOnInit = function () {
        if (this.arrows && this.arrowsAutoHide) {
            this.arrows = false;
        }
    };
    NgxGalleryPreviewComponent.prototype.ngOnChanges = function (changes) {
        var _this = this;
        if (changes['swipe']) {
            this.helperService.manageSwipe(this.swipe, this.elementRef, 'preview', function () { return _this.showNext(); }, function () { return _this.showPrev(); });
        }
    };
    NgxGalleryPreviewComponent.prototype.ngOnDestroy = function () {
        if (this.keyDownListener) {
            this.keyDownListener();
        }
    };
    NgxGalleryPreviewComponent.prototype.onMouseEnter = function () {
        if (this.arrowsAutoHide && !this.arrows) {
            this.arrows = true;
        }
    };
    NgxGalleryPreviewComponent.prototype.onMouseLeave = function () {
        if (this.arrowsAutoHide && this.arrows) {
            this.arrows = false;
        }
    };
    NgxGalleryPreviewComponent.prototype.onKeyDown = function (e) {
        if (this.isOpen) {
            if (this.keyboardNavigation) {
                if (this.isKeyboardPrev(e)) {
                    this.showPrev();
                }
                else if (this.isKeyboardNext(e)) {
                    this.showNext();
                }
            }
            if (this.closeOnEsc && this.isKeyboardEsc(e)) {
                this.close();
            }
        }
    };
    NgxGalleryPreviewComponent.prototype.open = function (index) {
        var _this = this;
        this.onOpen.emit();
        this.index = index;
        this.isOpen = true;
        this.show(true);
        if (this.forceFullscreen) {
            this.manageFullscreen();
        }
        this.keyDownListener = this.renderer.listen("window", "keydown", function (e) { return _this.onKeyDown(e); });
    };
    NgxGalleryPreviewComponent.prototype.close = function () {
        this.isOpen = false;
        this.closeFullscreen();
        this.onClose.emit();
        this.stopAutoPlay();
        if (this.keyDownListener) {
            this.keyDownListener();
        }
    };
    NgxGalleryPreviewComponent.prototype.imageMouseEnter = function () {
        if (this.autoPlay && this.autoPlayPauseOnHover) {
            this.stopAutoPlay();
        }
    };
    NgxGalleryPreviewComponent.prototype.imageMouseLeave = function () {
        if (this.autoPlay && this.autoPlayPauseOnHover) {
            this.startAutoPlay();
        }
    };
    NgxGalleryPreviewComponent.prototype.startAutoPlay = function () {
        var _this = this;
        if (this.autoPlay) {
            this.stopAutoPlay();
            this.timer = setTimeout(function () {
                if (!_this.showNext()) {
                    _this.index = -1;
                    _this.showNext();
                }
            }, this.autoPlayInterval);
        }
    };
    NgxGalleryPreviewComponent.prototype.stopAutoPlay = function () {
        if (this.timer) {
            clearTimeout(this.timer);
        }
    };
    NgxGalleryPreviewComponent.prototype.showAtIndex = function (index) {
        this.index = index;
        this.show();
    };
    NgxGalleryPreviewComponent.prototype.showNext = function () {
        if (this.canShowNext()) {
            this.index++;
            if (this.index === this.images.length) {
                this.index = 0;
            }
            this.show();
            return true;
        }
        else {
            return false;
        }
    };
    NgxGalleryPreviewComponent.prototype.showPrev = function () {
        if (this.canShowPrev()) {
            this.index--;
            if (this.index < 0) {
                this.index = this.images.length - 1;
            }
            this.show();
        }
    };
    NgxGalleryPreviewComponent.prototype.canShowNext = function () {
        if (this.loading) {
            return false;
        }
        else if (this.images) {
            return this.infinityMove || this.index < this.images.length - 1 ? true : false;
        }
        else {
            return false;
        }
    };
    NgxGalleryPreviewComponent.prototype.canShowPrev = function () {
        if (this.loading) {
            return false;
        }
        else if (this.images) {
            return this.infinityMove || this.index > 0 ? true : false;
        }
        else {
            return false;
        }
    };
    NgxGalleryPreviewComponent.prototype.manageFullscreen = function () {
        if (this.fullscreen || this.forceFullscreen) {
            var doc = document;
            if (!doc.fullscreenElement && !doc.mozFullScreenElement
                && !doc.webkitFullscreenElement && !doc.msFullscreenElement) {
                this.openFullscreen();
            }
            else {
                this.closeFullscreen();
            }
        }
    };
    NgxGalleryPreviewComponent.prototype.getSafeUrl = function (image) {
        return image.substr(0, 10) === 'data:image' ?
            image : this.sanitization.bypassSecurityTrustUrl(image);
    };
    NgxGalleryPreviewComponent.prototype.zoomIn = function () {
        if (this.canZoomIn()) {
            this.zoomValue += this.zoomStep;
            if (this.zoomValue > this.zoomMax) {
                this.zoomValue = this.zoomMax;
            }
        }
    };
    NgxGalleryPreviewComponent.prototype.zoomOut = function () {
        if (this.canZoomOut()) {
            this.zoomValue -= this.zoomStep;
            if (this.zoomValue < this.zoomMin) {
                this.zoomValue = this.zoomMin;
            }
            if (this.zoomValue <= 1) {
                this.resetPosition();
            }
        }
    };
    NgxGalleryPreviewComponent.prototype.rotateLeft = function () {
        this.rotateValue -= 90;
    };
    NgxGalleryPreviewComponent.prototype.rotateRight = function () {
        this.rotateValue += 90;
    };
    NgxGalleryPreviewComponent.prototype.getTransform = function () {
        return this.sanitization.bypassSecurityTrustStyle('scale(' + this.zoomValue + ') rotate(' + this.rotateValue + 'deg)');
    };
    NgxGalleryPreviewComponent.prototype.canZoomIn = function () {
        return this.zoomValue < this.zoomMax ? true : false;
    };
    NgxGalleryPreviewComponent.prototype.canZoomOut = function () {
        return this.zoomValue > this.zoomMin ? true : false;
    };
    NgxGalleryPreviewComponent.prototype.canDragOnZoom = function () {
        return this.zoom && this.zoomValue > 1;
    };
    NgxGalleryPreviewComponent.prototype.mouseDownHandler = function (e) {
        if (this.canDragOnZoom()) {
            this.initialX = this.getClientX(e);
            this.initialY = this.getClientY(e);
            this.initialLeft = this.positionLeft;
            this.initialTop = this.positionTop;
            this.isMove = true;
            e.preventDefault();
        }
    };
    NgxGalleryPreviewComponent.prototype.mouseUpHandler = function (e) {
        this.isMove = false;
    };
    NgxGalleryPreviewComponent.prototype.mouseMoveHandler = function (e) {
        if (this.isMove) {
            this.positionLeft = this.initialLeft + (this.getClientX(e) - this.initialX);
            this.positionTop = this.initialTop + (this.getClientY(e) - this.initialY);
        }
    };
    NgxGalleryPreviewComponent.prototype.getClientX = function (e) {
        return e.touches && e.touches.length ? e.touches[0].clientX : e.clientX;
    };
    NgxGalleryPreviewComponent.prototype.getClientY = function (e) {
        return e.touches && e.touches.length ? e.touches[0].clientY : e.clientY;
    };
    NgxGalleryPreviewComponent.prototype.resetPosition = function () {
        if (this.zoom) {
            this.positionLeft = 0;
            this.positionTop = 0;
        }
    };
    NgxGalleryPreviewComponent.prototype.isKeyboardNext = function (e) {
        return e.keyCode === 39 ? true : false;
    };
    NgxGalleryPreviewComponent.prototype.isKeyboardPrev = function (e) {
        return e.keyCode === 37 ? true : false;
    };
    NgxGalleryPreviewComponent.prototype.isKeyboardEsc = function (e) {
        return e.keyCode === 27 ? true : false;
    };
    NgxGalleryPreviewComponent.prototype.openFullscreen = function () {
        var element = document.documentElement;
        if (element.requestFullscreen) {
            element.requestFullscreen();
        }
        else if (element.msRequestFullscreen) {
            element.msRequestFullscreen();
        }
        else if (element.mozRequestFullScreen) {
            element.mozRequestFullScreen();
        }
        else if (element.webkitRequestFullscreen) {
            element.webkitRequestFullscreen();
        }
    };
    NgxGalleryPreviewComponent.prototype.closeFullscreen = function () {
        if (this.isFullscreen()) {
            var doc = document;
            if (doc.exitFullscreen) {
                doc.exitFullscreen();
            }
            else if (doc.msExitFullscreen) {
                doc.msExitFullscreen();
            }
            else if (doc.mozCancelFullScreen) {
                doc.mozCancelFullScreen();
            }
            else if (doc.webkitExitFullscreen) {
                doc.webkitExitFullscreen();
            }
        }
    };
    NgxGalleryPreviewComponent.prototype.isFullscreen = function () {
        var doc = document;
        return doc.fullscreenElement || doc.webkitFullscreenElement
            || doc.mozFullScreenElement || doc.msFullscreenElement;
    };
    NgxGalleryPreviewComponent.prototype.show = function (first) {
        var _this = this;
        if (first === void 0) { first = false; }
        this.loading = true;
        this.stopAutoPlay();
        this.onActiveChange.emit(this.index);
        if (first || !this.animation) {
            this._show();
        }
        else {
            setTimeout(function () { return _this._show(); }, 600);
        }
    };
    NgxGalleryPreviewComponent.prototype._show = function () {
        var _this = this;
        this.zoomValue = 1;
        this.rotateValue = 0;
        this.resetPosition();
        this.src = this.getSafeUrl(this.images[this.index]);
        this.srcIndex = this.index;
        this.description = this.descriptions[this.index];
        this.changeDetectorRef.markForCheck();
        setTimeout(function () {
            if (_this.isLoaded(_this.previewImage.nativeElement)) {
                _this.loading = false;
                _this.startAutoPlay();
                _this.changeDetectorRef.markForCheck();
            }
            else {
                setTimeout(function () {
                    if (_this.loading) {
                        _this.showSpinner = true;
                        _this.changeDetectorRef.markForCheck();
                    }
                });
                _this.previewImage.nativeElement.onload = function () {
                    _this.loading = false;
                    _this.showSpinner = false;
                    _this.previewImage.nativeElement.onload = null;
                    _this.startAutoPlay();
                    _this.changeDetectorRef.markForCheck();
                };
            }
        });
    };
    NgxGalleryPreviewComponent.prototype.isLoaded = function (img) {
        if (!img.complete) {
            return false;
        }
        if (typeof img.naturalWidth !== 'undefined' && img.naturalWidth === 0) {
            return false;
        }
        return true;
    };
    NgxGalleryPreviewComponent.ctorParameters = function () { return [
        { type: DomSanitizer },
        { type: ElementRef },
        { type: NgxGalleryHelperService },
        { type: Renderer2 },
        { type: ChangeDetectorRef }
    ]; };
    __decorate([
        Input()
    ], NgxGalleryPreviewComponent.prototype, "images", void 0);
    __decorate([
        Input()
    ], NgxGalleryPreviewComponent.prototype, "descriptions", void 0);
    __decorate([
        Input()
    ], NgxGalleryPreviewComponent.prototype, "showDescription", void 0);
    __decorate([
        Input()
    ], NgxGalleryPreviewComponent.prototype, "arrows", void 0);
    __decorate([
        Input()
    ], NgxGalleryPreviewComponent.prototype, "arrowsAutoHide", void 0);
    __decorate([
        Input()
    ], NgxGalleryPreviewComponent.prototype, "swipe", void 0);
    __decorate([
        Input()
    ], NgxGalleryPreviewComponent.prototype, "fullscreen", void 0);
    __decorate([
        Input()
    ], NgxGalleryPreviewComponent.prototype, "forceFullscreen", void 0);
    __decorate([
        Input()
    ], NgxGalleryPreviewComponent.prototype, "closeOnClick", void 0);
    __decorate([
        Input()
    ], NgxGalleryPreviewComponent.prototype, "closeOnEsc", void 0);
    __decorate([
        Input()
    ], NgxGalleryPreviewComponent.prototype, "keyboardNavigation", void 0);
    __decorate([
        Input()
    ], NgxGalleryPreviewComponent.prototype, "arrowPrevIcon", void 0);
    __decorate([
        Input()
    ], NgxGalleryPreviewComponent.prototype, "arrowNextIcon", void 0);
    __decorate([
        Input()
    ], NgxGalleryPreviewComponent.prototype, "closeIcon", void 0);
    __decorate([
        Input()
    ], NgxGalleryPreviewComponent.prototype, "fullscreenIcon", void 0);
    __decorate([
        Input()
    ], NgxGalleryPreviewComponent.prototype, "spinnerIcon", void 0);
    __decorate([
        Input()
    ], NgxGalleryPreviewComponent.prototype, "autoPlay", void 0);
    __decorate([
        Input()
    ], NgxGalleryPreviewComponent.prototype, "autoPlayInterval", void 0);
    __decorate([
        Input()
    ], NgxGalleryPreviewComponent.prototype, "autoPlayPauseOnHover", void 0);
    __decorate([
        Input()
    ], NgxGalleryPreviewComponent.prototype, "infinityMove", void 0);
    __decorate([
        Input()
    ], NgxGalleryPreviewComponent.prototype, "zoom", void 0);
    __decorate([
        Input()
    ], NgxGalleryPreviewComponent.prototype, "zoomStep", void 0);
    __decorate([
        Input()
    ], NgxGalleryPreviewComponent.prototype, "zoomMax", void 0);
    __decorate([
        Input()
    ], NgxGalleryPreviewComponent.prototype, "zoomMin", void 0);
    __decorate([
        Input()
    ], NgxGalleryPreviewComponent.prototype, "zoomInIcon", void 0);
    __decorate([
        Input()
    ], NgxGalleryPreviewComponent.prototype, "zoomOutIcon", void 0);
    __decorate([
        Input()
    ], NgxGalleryPreviewComponent.prototype, "animation", void 0);
    __decorate([
        Input()
    ], NgxGalleryPreviewComponent.prototype, "actions", void 0);
    __decorate([
        Input()
    ], NgxGalleryPreviewComponent.prototype, "rotate", void 0);
    __decorate([
        Input()
    ], NgxGalleryPreviewComponent.prototype, "rotateLeftIcon", void 0);
    __decorate([
        Input()
    ], NgxGalleryPreviewComponent.prototype, "rotateRightIcon", void 0);
    __decorate([
        Input()
    ], NgxGalleryPreviewComponent.prototype, "download", void 0);
    __decorate([
        Input()
    ], NgxGalleryPreviewComponent.prototype, "downloadIcon", void 0);
    __decorate([
        Input()
    ], NgxGalleryPreviewComponent.prototype, "bullets", void 0);
    __decorate([
        Output()
    ], NgxGalleryPreviewComponent.prototype, "onOpen", void 0);
    __decorate([
        Output()
    ], NgxGalleryPreviewComponent.prototype, "onClose", void 0);
    __decorate([
        Output()
    ], NgxGalleryPreviewComponent.prototype, "onActiveChange", void 0);
    __decorate([
        ViewChild('previewImage')
    ], NgxGalleryPreviewComponent.prototype, "previewImage", void 0);
    __decorate([
        HostListener('mouseenter')
    ], NgxGalleryPreviewComponent.prototype, "onMouseEnter", null);
    __decorate([
        HostListener('mouseleave')
    ], NgxGalleryPreviewComponent.prototype, "onMouseLeave", null);
    NgxGalleryPreviewComponent = __decorate([
        Component({
            selector: 'ngx-gallery-preview',
            template: "<ngx-gallery-arrows *ngIf=\"arrows\" (onPrevClick)=\"showPrev()\" (onNextClick)=\"showNext()\" [prevDisabled]=\"!canShowPrev()\" [nextDisabled]=\"!canShowNext()\" [arrowPrevIcon]=\"arrowPrevIcon\" [arrowNextIcon]=\"arrowNextIcon\"></ngx-gallery-arrows>\n<div class=\"ngx-gallery-preview-top\">\n    <div class=\"ngx-gallery-preview-icons\">\n        <ngx-gallery-action *ngFor=\"let action of actions\" [icon]=\"action.icon\" [disabled]=\"action.disabled\" [titleText]=\"action.titleText\" (onClick)=\"action.onClick($event, index)\"></ngx-gallery-action>\n        <a *ngIf=\"download && src\" [href]=\"src\" class=\"ngx-gallery-icon\" aria-hidden=\"true\" download>\n            <i class=\"ngx-gallery-icon-content {{ downloadIcon }}\"></i>\n        </a>\n        <ngx-gallery-action *ngIf=\"zoom\" [icon]=\"zoomOutIcon\" [disabled]=\"!canZoomOut()\" (onClick)=\"zoomOut()\"></ngx-gallery-action>\n        <ngx-gallery-action *ngIf=\"zoom\" [icon]=\"zoomInIcon\" [disabled]=\"!canZoomIn()\" (onClick)=\"zoomIn()\"></ngx-gallery-action>\n        <ngx-gallery-action *ngIf=\"rotate\" [icon]=\"rotateLeftIcon\" (onClick)=\"rotateLeft()\"></ngx-gallery-action>\n        <ngx-gallery-action *ngIf=\"rotate\" [icon]=\"rotateRightIcon\" (onClick)=\"rotateRight()\"></ngx-gallery-action>\n        <ngx-gallery-action *ngIf=\"fullscreen\" [icon]=\"'ngx-gallery-fullscreen ' + fullscreenIcon\" (onClick)=\"manageFullscreen()\"></ngx-gallery-action>\n        <ngx-gallery-action [icon]=\"'ngx-gallery-close ' + closeIcon\" (onClick)=\"close()\"></ngx-gallery-action>\n    </div>\n</div>\n<div class=\"ngx-spinner-wrapper ngx-gallery-center\" [class.ngx-gallery-active]=\"showSpinner\">\n    <i class=\"ngx-gallery-icon ngx-gallery-spinner {{spinnerIcon}}\" aria-hidden=\"true\"></i>\n</div>\n<div class=\"ngx-gallery-preview-wrapper\" (click)=\"closeOnClick && close()\" (mouseup)=\"mouseUpHandler($event)\" (mousemove)=\"mouseMoveHandler($event)\" (touchend)=\"mouseUpHandler($event)\" (touchmove)=\"mouseMoveHandler($event)\">\n    <div class=\"ngx-gallery-preview-img-wrapper\">\n        <img *ngIf=\"src\" #previewImage class=\"ngx-gallery-preview-img ngx-gallery-center\" [src]=\"src\" (click)=\"$event.stopPropagation()\" (mouseenter)=\"imageMouseEnter()\" (mouseleave)=\"imageMouseLeave()\" (mousedown)=\"mouseDownHandler($event)\" (touchstart)=\"mouseDownHandler($event)\" [class.ngx-gallery-active]=\"!loading\" [class.animation]=\"animation\" [class.ngx-gallery-grab]=\"canDragOnZoom()\" [style.transform]=\"getTransform()\" [style.left]=\"positionLeft + 'px'\" [style.top]=\"positionTop + 'px'\"/>\n        <ngx-gallery-bullets *ngIf=\"bullets\" [count]=\"images.length\" [active]=\"index\" (onChange)=\"showAtIndex($event)\"></ngx-gallery-bullets>\n    </div>\n    <div class=\"ngx-gallery-preview-text\" *ngIf=\"showDescription && description\" [innerHTML]=\"description\" (click)=\"$event.stopPropagation()\"></div>\n</div>",
            styles: [":host(.ngx-gallery-active){width:100%;height:100%;position:fixed;left:0;top:0;background:rgba(0,0,0,.7);z-index:10000;display:inline-block}:host{display:none}:host>>>.ngx-gallery-arrow{font-size:50px}:host>>>ngx-gallery-bullets{height:5%;-webkit-box-align:center;align-items:center;padding:0}.ngx-gallery-preview-img{opacity:0;max-width:90%;max-height:90%;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;-webkit-transition:-webkit-transform .5s;transition:transform .5s;transition:transform .5s,-webkit-transform .5s}.ngx-gallery-preview-img.animation{-webkit-transition:opacity .5s linear,-webkit-transform .5s;transition:opacity .5s linear,transform .5s,-webkit-transform .5s}.ngx-gallery-preview-img.ngx-gallery-active{opacity:1}.ngx-gallery-preview-img.ngx-gallery-grab{cursor:grab;cursor:-webkit-grab}.ngx-gallery-icon.ngx-gallery-spinner{font-size:50px;left:0;display:inline-block}:host>>>.ngx-gallery-preview-top{position:absolute;width:100%;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}:host>>>.ngx-gallery-preview-icons{float:right}:host>>>.ngx-gallery-preview-icons .ngx-gallery-icon{position:relative;margin-right:10px;margin-top:10px;font-size:25px;cursor:pointer;text-decoration:none}:host>>>.ngx-gallery-preview-icons .ngx-gallery-icon.ngx-gallery-icon-disabled{cursor:default;opacity:.4}.ngx-spinner-wrapper{width:50px;height:50px;display:none}.ngx-spinner-wrapper.ngx-gallery-active{display:inline-block}.ngx-gallery-center{position:absolute;left:0;right:0;bottom:0;margin:auto;top:0}.ngx-gallery-preview-text{width:100%;background:rgba(0,0,0,.7);padding:10px;text-align:center;color:#fff;font-size:16px;-webkit-box-flex:0;flex:0 1 auto;z-index:10}.ngx-gallery-preview-wrapper{width:100%;height:100%;display:-webkit-box;display:flex;-webkit-box-orient:vertical;-webkit-box-direction:normal;flex-flow:column}.ngx-gallery-preview-img-wrapper{-webkit-box-flex:1;flex:1 1 auto;position:relative}"]
        })
    ], NgxGalleryPreviewComponent);
    return NgxGalleryPreviewComponent;
}());
export { NgxGalleryPreviewComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmd4LWdhbGxlcnktcHJldmlldy5jb21wb25lbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9uZ3gtZ2FsbGVyeS05LyIsInNvdXJjZXMiOlsibGliL25neC1nYWxsZXJ5LXByZXZpZXcvbmd4LWdhbGxlcnktcHJldmlldy5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBRSxTQUFTLEVBQUUsTUFBTSxFQUFFLFlBQVksRUFBRSxTQUFTLEVBQUUsVUFBVSxFQUFFLGlCQUFpQixFQUFFLGFBQWEsRUFBRSxZQUFZLEVBQUUsU0FBUyxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQzVLLE9BQU8sRUFBRSxlQUFlLEVBQUUsT0FBTyxFQUFFLFlBQVksRUFBRSxTQUFTLEVBQUUsTUFBTSwyQkFBMkIsQ0FBQztBQUU5RixPQUFPLEVBQUUsdUJBQXVCLEVBQUUsTUFBTSwrQkFBK0IsQ0FBQztBQU94RTtJQWdFRSxvQ0FBb0IsWUFBMEIsRUFBVSxVQUFzQixFQUNsRSxhQUFzQyxFQUFVLFFBQW1CLEVBQ25FLGlCQUFvQztRQUY1QixpQkFBWSxHQUFaLFlBQVksQ0FBYztRQUFVLGVBQVUsR0FBVixVQUFVLENBQVk7UUFDbEUsa0JBQWEsR0FBYixhQUFhLENBQXlCO1FBQVUsYUFBUSxHQUFSLFFBQVEsQ0FBVztRQUNuRSxzQkFBaUIsR0FBakIsaUJBQWlCLENBQW1CO1FBN0RoRCxnQkFBVyxHQUFHLEtBQUssQ0FBQztRQUNwQixpQkFBWSxHQUFHLENBQUMsQ0FBQztRQUNqQixnQkFBVyxHQUFHLENBQUMsQ0FBQztRQUNoQixjQUFTLEdBQUcsQ0FBQyxDQUFDO1FBQ2QsWUFBTyxHQUFHLEtBQUssQ0FBQztRQUNoQixnQkFBVyxHQUFHLENBQUMsQ0FBQztRQUNoQixVQUFLLEdBQUcsQ0FBQyxDQUFDO1FBcUNBLFdBQU0sR0FBRyxJQUFJLFlBQVksRUFBRSxDQUFDO1FBQzVCLFlBQU8sR0FB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Q1csMEJBQTBCLENBcWJ0QztJQUFELGlDQUFDO0NBQUEsQUFyYkQsSUFxYkM7U0FyYlksMEJBQTBCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50LCBPbkluaXQsIElucHV0LCBPbkNoYW5nZXMsIE91dHB1dCwgRXZlbnRFbWl0dGVyLCBWaWV3Q2hpbGQsIEVsZW1lbnRSZWYsIENoYW5nZURldGVjdG9yUmVmLCBTaW1wbGVDaGFuZ2VzLCBIb3N0TGlzdGVuZXIsIFJlbmRlcmVyMiB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgU2FmZVJlc291cmNlVXJsLCBTYWZlVXJsLCBEb21TYW5pdGl6ZXIsIFNhZmVTdHlsZSB9IGZyb20gJ0Bhbmd1bGFyL3BsYXRmb3JtLWJyb3dzZXInO1xuaW1wb3J0IHsgTmd4R2FsbGVyeUFjdGlvbiB9IGZyb20gJy4uL25neC1nYWxsZXJ5LWFjdGlvbi5tb2RlbCc7XG5pbXBvcnQgeyBOZ3hHYWxsZXJ5SGVscGVyU2VydmljZSB9IGZyb20gJy4uL25neC1nYWxsZXJ5LWhlbHBlci5zZXJ2aWNlJztcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnbmd4LWdhbGxlcnktcHJldmlldycsXG4gIHRlbXBsYXRlVXJsOiAnLi9uZ3gtZ2FsbGVyeS1wcmV2aWV3LmNvbXBvbmVudC5odG1sJyxcbiAgc3R5bGVVcmxzOiBbJy4vbmd4LWdhbGxlcnktcHJldmlldy5jb21wb25lbnQuc2NzcyddXG59KVxuZXhwb3J0IGNsYXNzIE5neEdhbGxlcnlQcmV2aWV3Q29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0LCBPbkNoYW5nZXMge1xuXG4gIHNyYzogU2FmZVVybDtcbiAgc3JjSW5kZXg6IG51bWJlcjtcbiAgZGVzY3JpcHRpb246IHN0cmluZztcbiAgc2hvd1NwaW5uZXIgPSBmYWxzZTtcbiAgcG9zaXRpb25MZWZ0ID0gMDtcbiAgcG9zaXRpb25Ub3AgPSAwO1xuICB6b29tVmFsdWUgPSAxO1xuICBsb2FkaW5nID0gZmFsc2U7XG4gIHJvdGF0ZVZhbHVlID0gMDtcbiAgaW5kZXggPSAwO1xuXG4gIEBJbnB1dCgpIGltYWdlczogc3RyaW5nW10gfCBTYWZlUmVzb3VyY2VVcmxbXTtcbiAgQElucHV0KCkgZGVzY3JpcHRpb25zOiBzdHJpbmdbXTtcbiAgQElucHV0KCkgc2hvd0Rlc2NyaXB0aW9uOiBib29sZWFuO1xuICBASW5wdXQoKSBhcnJvd3M6IGJvb2xlYW47XG4gIEBJbnB1dCgpIGFycm93c0F1dG9IaWRlOiBib29sZWFuO1xuICBASW5wdXQoKSBzd2lwZTogYm9vbGVhbjtcbiAgQElucHV0KCkgZnVsbHNjcmVlbjogYm9vbGVhbjtcbiAgQElucHV0KCkgZm9yY2VGdWxsc2NyZWVuOiBib29sZWFuO1xuICBASW5wdXQoKSBjbG9zZU9uQ2xpY2s6IGJvb2xlYW47XG4gIEBJbnB1dCgpIGNsb3NlT25Fc2M6IGJvb2xlYW47XG4gIEBJbnB1dCgpIGtleWJvYXJkTmF2aWdhdGlvbjogYm9vbGVhbjtcbiAgQElucHV0KCkgYXJyb3dQcmV2SWNvbjogc3RyaW5nO1xuICBASW5wdXQoKSBhcnJvd05leHRJY29uOiBzdHJpbmc7XG4gIEBJbnB1dCgpIGNsb3NlSWNvbjogc3RyaW5nO1xuICBASW5wdXQoKSBmdWxsc2NyZWVuSWNvbjogc3RyaW5nO1xuICBASW5wdXQoKSBzcGlubmVySWNvbjogc3RyaW5nO1xuICBASW5wdXQoKSBhdXRvUGxheTogYm9vbGVhbjtcbiAgQElucHV0KCkgYXV0b1BsYXlJbnRlcnZhbDogbnVtYmVyO1xuICBASW5wdXQoKSBhdXRvUGxheVBhdXNlT25Ib3ZlcjogYm9vbGVhbjtcbiAgQElucHV0KCkgaW5maW5pdHlNb3ZlOiBib29sZWFuO1xuICBASW5wdXQoKSB6b29tOiBib29sZWFuO1xuICBASW5wdXQoKSB6b29tU3RlcDogbnVtYmVyO1xuICBASW5wdXQoKSB6b29tTWF4OiBudW1iZXI7XG4gIEBJbnB1dCgpIHpvb21NaW46IG51bWJlcjtcbiAgQElucHV0KCkgem9vbUluSWNvbjogc3RyaW5nO1xuICBASW5wdXQoKSB6b29tT3V0SWNvbjogc3RyaW5nO1xuICBASW5wdXQoKSBhbmltYXRpb246IGJvb2xlYW47XG4gIEBJbnB1dCgpIGFjdGlvbnM6IE5neEdhbGxlcnlBY3Rpb25bXTtcbiAgQElucHV0KCkgcm90YXRlOiBib29sZWFuO1xuICBASW5wdXQoKSByb3RhdGVMZWZ0SWNvbjogc3RyaW5nO1xuICBASW5wdXQoKSByb3RhdGVSaWdodEljb246IHN0cmluZztcbiAgQElucHV0KCkgZG93bmxvYWQ6IGJvb2xlYW47XG4gIEBJbnB1dCgpIGRvd25sb2FkSWNvbjogc3RyaW5nO1xuICBASW5wdXQoKSBidWxsZXRzOiBzdHJpbmc7XG5cbiAgQE91dHB1dCgpIG9uT3BlbiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcbiAgQE91dHB1dCgpIG9uQ2xvc2UgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG4gIEBPdXRwdXQoKSBvbkFjdGl2ZUNoYW5nZSA9IG5ldyBFdmVudEVtaXR0ZXI8bnVtYmVyPigpO1xuXG4gIEBWaWV3Q2hpbGQoJ3ByZXZpZXdJbWFnZScpIHByZXZpZXdJbWFnZTogRWxlbWVudFJlZjtcblxuICBwcml2YXRlIGlzT3BlbiA9IGZhbHNlO1xuICBwcml2YXRlIHRpbWVyO1xuICBwcml2YXRlIGluaXRpYWxYID0gMDtcbiAgcHJpdmF0ZSBpbml0aWFsWSA9IDA7XG4gIHByaXZhdGUgaW5pdGlhbExlZnQgPSAwO1xuICBwcml2YXRlIGluaXRpYWxUb3AgPSAwO1xuICBwcml2YXRlIGlzTW92ZSA9IGZhbHNlO1xuXG4gIHByaXZhdGUga2V5RG93bkxpc3RlbmVyOiBGdW5jdGlvbjtcblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIHNhbml0aXphdGlvbjogRG9tU2FuaXRpemVyLCBwcml2YXRlIGVsZW1lbnRSZWY6IEVsZW1lbnRSZWYsXG4gICAgICBwcml2YXRlIGhlbHBlclNlcnZpY2U6IE5neEdhbGxlcnlIZWxwZXJTZXJ2aWNlLCBwcml2YXRlIHJlbmRlcmVyOiBSZW5kZXJlcjIsXG4gICAgICBwcml2YXRlIGNoYW5nZURldGVjdG9yUmVmOiBDaGFuZ2VEZXRlY3RvclJlZikge31cblxuICBuZ09uSW5pdCgpOiB2b2lkIHtcbiAgICAgIGlmICh0aGlzLmFycm93cyAmJiB0aGlzLmFycm93c0F1dG9IaWRlKSB7XG4gICAgICAgICAgdGhpcy5hcnJvd3MgPSBmYWxzZTtcbiAgICAgIH1cbiAgfVxuXG4gIG5nT25DaGFuZ2VzKGNoYW5nZXM6IFNpbXBsZUNoYW5nZXMpOiB2b2lkIHtcbiAgICAgIGlmIChjaGFuZ2VzWydzd2lwZSddKSB7XG4gICAgICAgICAgdGhpcy5oZWxwZXJTZXJ2aWNlLm1hbmFnZVN3aXBlKHRoaXMuc3dpcGUsIHRoaXMuZWxlbWVudFJlZixcbiAgICAgICAgICAncHJldmlldycsICgpID0+IHRoaXMuc2hvd05leHQoKSwgKCkgPT4gdGhpcy5zaG93UHJldigpKTtcbiAgICAgIH1cbiAgfVxuXG4gIG5nT25EZXN0cm95KCkge1xuICAgICAgaWYgKHRoaXMua2V5RG93bkxpc3RlbmVyKSB7XG4gICAgICAgICAgdGhpcy5rZXlEb3duTGlzdGVuZXIoKTtcbiAgICAgIH1cbiAgfVxuXG4gIEBIb3N0TGlzdGVuZXIoJ21vdXNlZW50ZXInKSBvbk1vdXNlRW50ZXIoKSB7XG4gICAgICBpZiAodGhpcy5hcnJvd3NBdXRvSGlkZSAmJiAhdGhpcy5hcnJvd3MpIHtcbiAgICAgICAgICB0aGlzLmFycm93cyA9IHRydWU7XG4gICAgICB9XG4gIH1cblxuICBASG9zdExpc3RlbmVyKCdtb3VzZWxlYXZlJykgb25Nb3VzZUxlYXZlKCkge1xuICAgICAgaWYgKHRoaXMuYXJyb3dzQXV0b0hpZGUgJiYgdGhpcy5hcnJvd3MpIHtcbiAgICAgICAgICB0aGlzLmFycm93cyA9IGZhbHNlO1xuICAgICAgfVxuICB9XG5cbiAgb25LZXlEb3duKGUpIHtcbiAgICAgIGlmICh0aGlzLmlzT3Blbikge1xuICAgICAgICAgIGlmICh0aGlzLmtleWJvYXJkTmF2aWdhdGlvbikge1xuICAgICAgICAgICAgICBpZiAodGhpcy5pc0tleWJvYXJkUHJldihlKSkge1xuICAgICAgICAgICAgICAgICAgdGhpcy5zaG93UHJldigpO1xuICAgICAgICAgICAgICB9IGVsc2UgaWYgKHRoaXMuaXNLZXlib2FyZE5leHQoZSkpIHtcbiAgICAgICAgICAgICAgICAgIHRoaXMuc2hvd05leHQoKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAodGhpcy5jbG9zZU9uRXNjICYmIHRoaXMuaXNLZXlib2FyZEVzYyhlKSkge1xuICAgICAgICAgICAgICB0aGlzLmNsb3NlKCk7XG4gICAgICAgICAgfVxuICAgICAgfVxuICB9XG5cbiAgb3BlbihpbmRleDogbnVtYmVyKTogdm9pZCB7XG4gICAgICB0aGlzLm9uT3Blbi5lbWl0KCk7XG5cbiAgICAgIHRoaXMuaW5kZXggPSBpbmRleDtcbiAgICAgIHRoaXMuaXNPcGVuID0gdHJ1ZTtcbiAgICAgIHRoaXMuc2hvdyh0cnVlKTtcblxuICAgICAgaWYgKHRoaXMuZm9yY2VGdWxsc2NyZWVuKSB7XG4gICAgICAgICAgdGhpcy5tYW5hZ2VGdWxsc2NyZWVuKCk7XG4gICAgICB9XG5cbiAgICAgIHRoaXMua2V5RG93bkxpc3RlbmVyID0gdGhpcy5yZW5kZXJlci5saXN0ZW4oXCJ3aW5kb3dcIiwgXCJrZXlkb3duXCIsIChlKSA9PiB0aGlzLm9uS2V5RG93bihlKSk7XG4gIH1cblxuICBjbG9zZSgpOiB2b2lkIHtcbiAgICAgIHRoaXMuaXNPcGVuID0gZmFsc2U7XG4gICAgICB0aGlzLmNsb3NlRnVsbHNjcmVlbigpO1xuICAgICAgdGhpcy5vbkNsb3NlLmVtaXQoKTtcblxuICAgICAgdGhpcy5zdG9wQXV0b1BsYXkoKTtcblxuICAgICAgaWYgKHRoaXMua2V5RG93bkxpc3RlbmVyKSB7XG4gICAgICAgICAgdGhpcy5rZXlEb3duTGlzdGVuZXIoKTtcbiAgICAgIH1cbiAgfVxuXG4gIGltYWdlTW91c2VFbnRlcigpOiB2b2lkIHtcbiAgICAgIGlmICh0aGlzLmF1dG9QbGF5ICYmIHRoaXMuYXV0b1BsYXlQYXVzZU9uSG92ZXIpIHtcbiAgICAgICAgICB0aGlzLnN0b3BBdXRvUGxheSgpO1xuICAgICAgfVxuICB9XG5cbiAgaW1hZ2VNb3VzZUxlYXZlKCk6IHZvaWQge1xuICAgICAgaWYgKHRoaXMuYXV0b1BsYXkgJiYgdGhpcy5hdXRvUGxheVBhdXNlT25Ib3Zlcikge1xuICAgICAgICAgIHRoaXMuc3RhcnRBdXRvUGxheSgpO1xuICAgICAgfVxuICB9XG5cbiAgc3RhcnRBdXRvUGxheSgpOiB2b2lkIHtcbiAgICAgIGlmICh0aGlzLmF1dG9QbGF5KSB7XG4gICAgICAgICAgdGhpcy5zdG9wQXV0b1BsYXkoKTtcblxuICAgICAgICAgIHRoaXMudGltZXIgPSBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgICAgaWYgKCF0aGlzLnNob3dOZXh0KCkpIHtcbiAgICAgICAgICAgICAgICAgIHRoaXMuaW5kZXggPSAtMTtcbiAgICAgICAgICAgICAgICAgIHRoaXMuc2hvd05leHQoKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgIH0sIHRoaXMuYXV0b1BsYXlJbnRlcnZhbCk7XG4gICAgICB9XG4gIH1cblxuICBzdG9wQXV0b1BsYXkoKTogdm9pZCB7XG4gICAgICBpZiAodGhpcy50aW1lcikge1xuICAgICAgICAgIGNsZWFyVGltZW91dCh0aGlzLnRpbWVyKTtcbiAgICAgIH1cbiAgfVxuXG4gIHNob3dBdEluZGV4KGluZGV4OiBudW1iZXIpOiB2b2lkIHtcbiAgICAgIHRoaXMuaW5kZXggPSBpbmRleDtcbiAgICAgIHRoaXMuc2hvdygpO1xuICB9XG5cbiAgc2hvd05leHQoKTogYm9vbGVhbiB7XG4gICAgICBpZiAodGhpcy5jYW5TaG93TmV4dCgpKSB7XG4gICAgICAgICAgdGhpcy5pbmRleCsrO1xuXG4gICAgICAgICAgaWYgKHRoaXMuaW5kZXggPT09IHRoaXMuaW1hZ2VzLmxlbmd0aCkge1xuICAgICAgICAgICAgICB0aGlzLmluZGV4ID0gMDtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICB0aGlzLnNob3coKTtcbiAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICB9XG5cbiAgc2hvd1ByZXYoKTogdm9pZCB7XG4gICAgICBpZiAodGhpcy5jYW5TaG93UHJldigpKSB7XG4gICAgICAgICAgdGhpcy5pbmRleC0tO1xuXG4gICAgICAgICAgaWYgKHRoaXMuaW5kZXggPCAwKSB7XG4gICAgICAgICAgICAgIHRoaXMuaW5kZXggPSB0aGlzLmltYWdlcy5sZW5ndGggLSAxO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHRoaXMuc2hvdygpO1xuICAgICAgfVxuICB9XG5cbiAgY2FuU2hvd05leHQoKTogYm9vbGVhbiB7XG4gICAgICBpZiAodGhpcy5sb2FkaW5nKSB7XG4gICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfSBlbHNlIGlmICh0aGlzLmltYWdlcykge1xuICAgICAgICAgIHJldHVybiB0aGlzLmluZmluaXR5TW92ZSB8fCB0aGlzLmluZGV4IDwgdGhpcy5pbWFnZXMubGVuZ3RoIC0gMSA/IHRydWUgOiBmYWxzZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICB9XG5cbiAgY2FuU2hvd1ByZXYoKTogYm9vbGVhbiB7XG4gICAgICBpZiAodGhpcy5sb2FkaW5nKSB7XG4gICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfSBlbHNlIGlmICh0aGlzLmltYWdlcykge1xuICAgICAgICAgIHJldHVybiB0aGlzLmluZmluaXR5TW92ZSB8fCB0aGlzLmluZGV4ID4gMCA/IHRydWUgOiBmYWxzZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICB9XG5cbiAgbWFuYWdlRnVsbHNjcmVlbigpOiB2b2lkIHtcbiAgICAgIGlmICh0aGlzLmZ1bGxzY3JlZW4gfHwgdGhpcy5mb3JjZUZ1bGxzY3JlZW4pIHtcbiAgICAgICAgICBjb25zdCBkb2MgPSA8YW55PmRvY3VtZW50O1xuXG4gICAgICAgICAgaWYgKCFkb2MuZnVsbHNjcmVlbkVsZW1lbnQgJiYgIWRvYy5tb3pGdWxsU2NyZWVuRWxlbWVudFxuICAgICAgICAgICAgICAmJiAhZG9jLndlYmtpdEZ1bGxzY3JlZW5FbGVtZW50ICYmICFkb2MubXNGdWxsc2NyZWVuRWxlbWVudCkge1xuICAgICAgICAgICAgICB0aGlzLm9wZW5GdWxsc2NyZWVuKCk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgdGhpcy5jbG9zZUZ1bGxzY3JlZW4oKTtcbiAgICAgICAgICB9XG4gICAgICB9XG4gIH1cblxuICBnZXRTYWZlVXJsKGltYWdlOiBzdHJpbmcpOiBTYWZlVXJsIHtcbiAgICAgIHJldHVybiBpbWFnZS5zdWJzdHIoMCwgMTApID09PSAnZGF0YTppbWFnZScgP1xuICAgICAgICAgIGltYWdlIDogdGhpcy5zYW5pdGl6YXRpb24uYnlwYXNzU2VjdXJpdHlUcnVzdFVybChpbWFnZSk7XG4gIH1cblxuICB6b29tSW4oKTogdm9pZCB7XG4gICAgICBpZiAodGhpcy5jYW5ab29tSW4oKSkge1xuICAgICAgICAgIHRoaXMuem9vbVZhbHVlICs9IHRoaXMuem9vbVN0ZXA7XG5cbiAgICAgICAgICBpZiAodGhpcy56b29tVmFsdWUgPiB0aGlzLnpvb21NYXgpIHtcbiAgICAgICAgICAgICAgdGhpcy56b29tVmFsdWUgPSB0aGlzLnpvb21NYXg7XG4gICAgICAgICAgfVxuICAgICAgfVxuICB9XG5cbiAgem9vbU91dCgpOiB2b2lkIHtcbiAgICAgIGlmICh0aGlzLmNhblpvb21PdXQoKSkge1xuICAgICAgICAgIHRoaXMuem9vbVZhbHVlIC09IHRoaXMuem9vbVN0ZXA7XG5cbiAgICAgICAgICBpZiAodGhpcy56b29tVmFsdWUgPCB0aGlzLnpvb21NaW4pIHtcbiAgICAgICAgICAgICAgdGhpcy56b29tVmFsdWUgPSB0aGlzLnpvb21NaW47XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKHRoaXMuem9vbVZhbHVlIDw9IDEpIHtcbiAgICAgICAgICAgICAgdGhpcy5yZXNldFBvc2l0aW9uKClcbiAgICAgICAgICB9XG4gICAgICB9XG4gIH1cblxuICByb3RhdGVMZWZ0KCk6IHZvaWQge1xuICAgICAgdGhpcy5yb3RhdGVWYWx1ZSAtPSA5MDtcbiAgfVxuXG4gIHJvdGF0ZVJpZ2h0KCk6IHZvaWQge1xuICAgICAgdGhpcy5yb3RhdGVWYWx1ZSArPSA5MDtcbiAgfVxuXG4gIGdldFRyYW5zZm9ybSgpOiBTYWZlU3R5bGUge1xuICAgICAgcmV0dXJuIHRoaXMuc2FuaXRpemF0aW9uLmJ5cGFzc1NlY3VyaXR5VHJ1c3RTdHlsZSgnc2NhbGUoJyArIHRoaXMuem9vbVZhbHVlICsgJykgcm90YXRlKCcgKyB0aGlzLnJvdGF0ZVZhbHVlICsgJ2RlZyknKTtcbiAgfVxuXG4gIGNhblpvb21JbigpOiBib29sZWFuIHtcbiAgICAgIHJldHVybiB0aGlzLnpvb21WYWx1ZSA8IHRoaXMuem9vbU1heCA/IHRydWUgOiBmYWxzZTtcbiAgfVxuXG4gIGNhblpvb21PdXQoKTogYm9vbGVhbiB7XG4gICAgICByZXR1cm4gdGhpcy56b29tVmFsdWUgPiB0aGlzLnpvb21NaW4gPyB0cnVlIDogZmFsc2U7XG4gIH1cblxuICBjYW5EcmFnT25ab29tKCkge1xuICAgICAgcmV0dXJuIHRoaXMuem9vbSAmJiB0aGlzLnpvb21WYWx1ZSA+IDE7XG4gIH1cblxuICBtb3VzZURvd25IYW5kbGVyKGUpOiB2b2lkIHtcbiAgICAgIGlmICh0aGlzLmNhbkRyYWdPblpvb20oKSkge1xuICAgICAgICAgIHRoaXMuaW5pdGlhbFggPSB0aGlzLmdldENsaWVudFgoZSk7XG4gICAgICAgICAgdGhpcy5pbml0aWFsWSA9IHRoaXMuZ2V0Q2xpZW50WShlKTtcbiAgICAgICAgICB0aGlzLmluaXRpYWxMZWZ0ID0gdGhpcy5wb3NpdGlvbkxlZnQ7XG4gICAgICAgICAgdGhpcy5pbml0aWFsVG9wID0gdGhpcy5wb3NpdGlvblRvcDtcbiAgICAgICAgICB0aGlzLmlzTW92ZSA9IHRydWU7XG5cbiAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICB9XG4gIH1cblxuICBtb3VzZVVwSGFuZGxlcihlKTogdm9pZCB7XG4gICAgICB0aGlzLmlzTW92ZSA9IGZhbHNlO1xuICB9XG5cbiAgbW91c2VNb3ZlSGFuZGxlcihlKSB7XG4gICAgICBpZiAodGhpcy5pc01vdmUpIHtcbiAgICAgICAgICB0aGlzLnBvc2l0aW9uTGVmdCA9IHRoaXMuaW5pdGlhbExlZnQgKyAodGhpcy5nZXRDbGllbnRYKGUpIC0gdGhpcy5pbml0aWFsWCk7XG4gICAgICAgICAgdGhpcy5wb3NpdGlvblRvcCA9IHRoaXMuaW5pdGlhbFRvcCArICh0aGlzLmdldENsaWVudFkoZSkgLSB0aGlzLmluaXRpYWxZKTtcbiAgICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgZ2V0Q2xpZW50WChlKTogbnVtYmVyIHtcbiAgICAgIHJldHVybiBlLnRvdWNoZXMgJiYgZS50b3VjaGVzLmxlbmd0aCA/IGUudG91Y2hlc1swXS5jbGllbnRYIDogZS5jbGllbnRYO1xuICB9XG5cbiAgcHJpdmF0ZSBnZXRDbGllbnRZKGUpOiBudW1iZXIge1xuICAgICAgcmV0dXJuIGUudG91Y2hlcyAmJiBlLnRvdWNoZXMubGVuZ3RoID8gZS50b3VjaGVzWzBdLmNsaWVudFkgOiBlLmNsaWVudFk7XG4gIH1cblxuICBwcml2YXRlIHJlc2V0UG9zaXRpb24oKSB7XG4gICAgICBpZiAodGhpcy56b29tKSB7XG4gICAgICAgICAgdGhpcy5wb3NpdGlvbkxlZnQgPSAwO1xuICAgICAgICAgIHRoaXMucG9zaXRpb25Ub3AgPSAwO1xuICAgICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBpc0tleWJvYXJkTmV4dChlKTogYm9vbGVhbiB7XG4gICAgICByZXR1cm4gZS5rZXlDb2RlID09PSAzOSA/IHRydWUgOiBmYWxzZTtcbiAgfVxuXG4gIHByaXZhdGUgaXNLZXlib2FyZFByZXYoZSk6IGJvb2xlYW4ge1xuICAgICAgcmV0dXJuIGUua2V5Q29kZSA9PT0gMzcgPyB0cnVlIDogZmFsc2U7XG4gIH1cblxuICBwcml2YXRlIGlzS2V5Ym9hcmRFc2MoZSk6IGJvb2xlYW4ge1xuICAgICAgcmV0dXJuIGUua2V5Q29kZSA9PT0gMjcgPyB0cnVlIDogZmFsc2U7XG4gIH1cblxuICBwcml2YXRlIG9wZW5GdWxsc2NyZWVuKCk6IHZvaWQge1xuICAgICAgY29uc3QgZWxlbWVudCA9IDxhbnk+ZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50O1xuXG4gICAgICBpZiAoZWxlbWVudC5yZXF1ZXN0RnVsbHNjcmVlbikge1xuICAgICAgICAgIGVsZW1lbnQucmVxdWVzdEZ1bGxzY3JlZW4oKTtcbiAgICAgIH0gZWxzZSBpZiAoZWxlbWVudC5tc1JlcXVlc3RGdWxsc2NyZWVuKSB7XG4gICAgICAgICAgZWxlbWVudC5tc1JlcXVlc3RGdWxsc2NyZWVuKCk7XG4gICAgICB9IGVsc2UgaWYgKGVsZW1lbnQubW96UmVxdWVzdEZ1bGxTY3JlZW4pIHtcbiAgICAgICAgICBlbGVtZW50Lm1velJlcXVlc3RGdWxsU2NyZWVuKCk7XG4gICAgICB9IGVsc2UgaWYgKGVsZW1lbnQud2Via2l0UmVxdWVzdEZ1bGxzY3JlZW4pIHtcbiAgICAgICAgICBlbGVtZW50LndlYmtpdFJlcXVlc3RGdWxsc2NyZWVuKCk7XG4gICAgICB9XG4gIH1cblxuICBwcml2YXRlIGNsb3NlRnVsbHNjcmVlbigpOiB2b2lkIHtcbiAgICAgIGlmICh0aGlzLmlzRnVsbHNjcmVlbigpKSB7XG4gICAgICAgICAgY29uc3QgZG9jID0gPGFueT5kb2N1bWVudDtcblxuICAgICAgICAgIGlmIChkb2MuZXhpdEZ1bGxzY3JlZW4pIHtcbiAgICAgICAgICAgICAgZG9jLmV4aXRGdWxsc2NyZWVuKCk7XG4gICAgICAgICAgfSBlbHNlIGlmIChkb2MubXNFeGl0RnVsbHNjcmVlbikge1xuICAgICAgICAgICAgICBkb2MubXNFeGl0RnVsbHNjcmVlbigpO1xuICAgICAgICAgIH0gZWxzZSBpZiAoZG9jLm1vekNhbmNlbEZ1bGxTY3JlZW4pIHtcbiAgICAgICAgICAgICAgZG9jLm1vekNhbmNlbEZ1bGxTY3JlZW4oKTtcbiAgICAgICAgICB9IGVsc2UgaWYgKGRvYy53ZWJraXRFeGl0RnVsbHNjcmVlbikge1xuICAgICAgICAgICAgICBkb2Mud2Via2l0RXhpdEZ1bGxzY3JlZW4oKTtcbiAgICAgICAgICB9XG4gICAgICB9XG4gIH1cblxuICBwcml2YXRlIGlzRnVsbHNjcmVlbigpIHtcbiAgICAgIGNvbnN0IGRvYyA9IDxhbnk+ZG9jdW1lbnQ7XG5cbiAgICAgIHJldHVybiBkb2MuZnVsbHNjcmVlbkVsZW1lbnQgfHwgZG9jLndlYmtpdEZ1bGxzY3JlZW5FbGVtZW50XG4gICAgICAgICAgfHwgZG9jLm1vekZ1bGxTY3JlZW5FbGVtZW50IHx8IGRvYy5tc0Z1bGxzY3JlZW5FbGVtZW50O1xuICB9XG5cblxuXG4gIHByaXZhdGUgc2hvdyhmaXJzdCA9IGZhbHNlKSB7XG4gICAgICB0aGlzLmxvYWRpbmcgPSB0cnVlO1xuICAgICAgdGhpcy5zdG9wQXV0b1BsYXkoKTtcblxuICAgICAgdGhpcy5vbkFjdGl2ZUNoYW5nZS5lbWl0KHRoaXMuaW5kZXgpO1xuXG4gICAgICBpZiAoZmlyc3QgfHwgIXRoaXMuYW5pbWF0aW9uKSB7XG4gICAgICAgICAgdGhpcy5fc2hvdygpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHRoaXMuX3Nob3coKSwgNjAwKTtcbiAgICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgX3Nob3coKSB7XG4gICAgICB0aGlzLnpvb21WYWx1ZSA9IDE7XG4gICAgICB0aGlzLnJvdGF0ZVZhbHVlID0gMDtcbiAgICAgIHRoaXMucmVzZXRQb3NpdGlvbigpO1xuXG4gICAgICB0aGlzLnNyYyA9IHRoaXMuZ2V0U2FmZVVybCg8c3RyaW5nPnRoaXMuaW1hZ2VzW3RoaXMuaW5kZXhdKTtcbiAgICAgIHRoaXMuc3JjSW5kZXggPSB0aGlzLmluZGV4O1xuICAgICAgdGhpcy5kZXNjcmlwdGlvbiA9IHRoaXMuZGVzY3JpcHRpb25zW3RoaXMuaW5kZXhdO1xuICAgICAgdGhpcy5jaGFuZ2VEZXRlY3RvclJlZi5tYXJrRm9yQ2hlY2soKTtcblxuICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgaWYgKHRoaXMuaXNMb2FkZWQodGhpcy5wcmV2aWV3SW1hZ2UubmF0aXZlRWxlbWVudCkpIHtcbiAgICAgICAgICAgICAgdGhpcy5sb2FkaW5nID0gZmFsc2U7XG4gICAgICAgICAgICAgIHRoaXMuc3RhcnRBdXRvUGxheSgpO1xuICAgICAgICAgICAgICB0aGlzLmNoYW5nZURldGVjdG9yUmVmLm1hcmtGb3JDaGVjaygpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgaWYgKHRoaXMubG9hZGluZykge1xuICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc2hvd1NwaW5uZXIgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY2hhbmdlRGV0ZWN0b3JSZWYubWFya0ZvckNoZWNrKCk7XG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH0pXG5cbiAgICAgICAgICAgICAgdGhpcy5wcmV2aWV3SW1hZ2UubmF0aXZlRWxlbWVudC5vbmxvYWQgPSAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICB0aGlzLmxvYWRpbmcgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgIHRoaXMuc2hvd1NwaW5uZXIgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgIHRoaXMucHJldmlld0ltYWdlLm5hdGl2ZUVsZW1lbnQub25sb2FkID0gbnVsbDtcbiAgICAgICAgICAgICAgICAgIHRoaXMuc3RhcnRBdXRvUGxheSgpO1xuICAgICAgICAgICAgICAgICAgdGhpcy5jaGFuZ2VEZXRlY3RvclJlZi5tYXJrRm9yQ2hlY2soKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgIH0pXG4gIH1cblxuICBwcml2YXRlIGlzTG9hZGVkKGltZyk6IGJvb2xlYW4ge1xuICAgICAgaWYgKCFpbWcuY29tcGxldGUpIHtcbiAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG5cbiAgICAgIGlmICh0eXBlb2YgaW1nLm5hdHVyYWxXaWR0aCAhPT0gJ3VuZGVmaW5lZCcgJiYgaW1nLm5hdHVyYWxXaWR0aCA9PT0gMCkge1xuICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRydWU7XG4gIH1cblxufSJdfQ==