import { __decorate } from "tslib";
import { Component, Input, Output, EventEmitter } from '@angular/core';
var NgxGalleryArrowsComponent = /** @class */ (function () {
    function NgxGalleryArrowsComponent() {
        this.onPrevClick = new EventEmitter();
        this.onNextClick = new EventEmitter();
    }
    NgxGalleryArrowsComponent.prototype.handlePrevClick = function () {
        this.onPrevClick.emit();
    };
    NgxGalleryArrowsComponent.prototype.handleNextClick = function () {
        this.onNextClick.emit();
    };
    __decorate([
        Input()
    ], NgxGalleryArrowsComponent.prototype, "prevDisabled", void 0);
    __decorate([
        Input()
    ], NgxGalleryArrowsComponent.prototype, "nextDisabled", void 0);
    __decorate([
        Input()
    ], NgxGalleryArrowsComponent.prototype, "arrowPrevIcon", void 0);
    __decorate([
        Input()
    ], NgxGalleryArrowsComponent.prototype, "arrowNextIcon", void 0);
    __decorate([
        Output()
    ], NgxGalleryArrowsComponent.prototype, "onPrevClick", void 0);
    __decorate([
        Output()
    ], NgxGalleryArrowsComponent.prototype, "onNextClick", void 0);
    NgxGalleryArrowsComponent = __decorate([
        Component({
            selector: 'ngx-gallery-arrows',
            template: "<div class=\"ngx-gallery-arrow-wrapper ngx-gallery-arrow-left\">\n    <div class=\"ngx-gallery-icon ngx-gallery-arrow\" aria-hidden=\"true\" (click)=\"handlePrevClick()\" [class.ngx-gallery-disabled]=\"prevDisabled\">\n        <i class=\"ngx-gallery-icon-content {{arrowPrevIcon}}\"></i>\n    </div>\n</div>\n<div class=\"ngx-gallery-arrow-wrapper ngx-gallery-arrow-right\">\n    <div class=\"ngx-gallery-icon ngx-gallery-arrow\" aria-hidden=\"true\" (click)=\"handleNextClick()\" [class.ngx-gallery-disabled]=\"nextDisabled\">\n        <i class=\"ngx-gallery-icon-content {{arrowNextIcon}}\"></i>\n    </div>\n</div>",
            styles: [".ngx-gallery-arrow-wrapper{position:absolute;height:100%;width:1px;display:table;z-index:2000;table-layout:fixed}.ngx-gallery-arrow-left{left:0}.ngx-gallery-arrow-right{right:0}.ngx-gallery-arrow{top:50%;-webkit-transform:translateY(-50%);transform:translateY(-50%);cursor:pointer}.ngx-gallery-arrow.ngx-gallery-disabled{opacity:.6;cursor:default}.ngx-gallery-arrow-left .ngx-gallery-arrow{left:10px}.ngx-gallery-arrow-right .ngx-gallery-arrow{right:10px}"]
        })
    ], NgxGalleryArrowsComponent);
    return NgxGalleryArrowsComponent;
}());
export { NgxGalleryArrowsComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmd4LWdhbGxlcnktYXJyb3dzLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL25neC1nYWxsZXJ5LTkvIiwic291cmNlcyI6WyJsaWIvbmd4LWdhbGxlcnktYXJyb3dzL25neC1nYWxsZXJ5LWFycm93cy5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRSxZQUFZLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFPdkU7SUFBQTtRQU1ZLGdCQUFXLEdBQUcsSUFBSSxZQUFZLEVBQUUsQ0FBQztRQUNqQyxnQkFBVyxHQUFHLElBQUksWUFBWSxFQUFFLENBQUM7SUFTN0MsQ0FBQztJQVBDLG1EQUFlLEdBQWY7UUFDSSxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksRUFBRSxDQUFDO0lBQzVCLENBQUM7SUFFRCxtREFBZSxHQUFmO1FBQ0ksSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLEVBQUUsQ0FBQztJQUM1QixDQUFDO0lBZFE7UUFBUixLQUFLLEVBQUU7bUVBQXVCO0lBQ3RCO1FBQVIsS0FBSyxFQUFFO21FQUF1QjtJQUN0QjtRQUFSLEtBQUssRUFBRTtvRUFBdUI7SUFDdEI7UUFBUixLQUFLLEVBQUU7b0VBQXVCO0lBRXJCO1FBQVQsTUFBTSxFQUFFO2tFQUFrQztJQUNqQztRQUFULE1BQU0sRUFBRTtrRUFBa0M7SUFQaEMseUJBQXlCO1FBTHJDLFNBQVMsQ0FBQztZQUNULFFBQVEsRUFBRSxvQkFBb0I7WUFDOUIscW5CQUFrRDs7U0FFbkQsQ0FBQztPQUNXLHlCQUF5QixDQWdCckM7SUFBRCxnQ0FBQztDQUFBLEFBaEJELElBZ0JDO1NBaEJZLHlCQUF5QiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbXBvbmVudCwgSW5wdXQsIE91dHB1dCwgRXZlbnRFbWl0dGVyIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ25neC1nYWxsZXJ5LWFycm93cycsXG4gIHRlbXBsYXRlVXJsOiAnLi9uZ3gtZ2FsbGVyeS1hcnJvd3MuY29tcG9uZW50Lmh0bWwnLFxuICBzdHlsZVVybHM6IFsnLi9uZ3gtZ2FsbGVyeS1hcnJvd3MuY29tcG9uZW50LnNjc3MnXVxufSlcbmV4cG9ydCBjbGFzcyBOZ3hHYWxsZXJ5QXJyb3dzQ29tcG9uZW50e1xuICBASW5wdXQoKSBwcmV2RGlzYWJsZWQ6IGJvb2xlYW47XG4gIEBJbnB1dCgpIG5leHREaXNhYmxlZDogYm9vbGVhbjtcbiAgQElucHV0KCkgYXJyb3dQcmV2SWNvbjogc3RyaW5nO1xuICBASW5wdXQoKSBhcnJvd05leHRJY29uOiBzdHJpbmc7XG5cbiAgQE91dHB1dCgpIG9uUHJldkNsaWNrID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuICBAT3V0cHV0KCkgb25OZXh0Q2xpY2sgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG5cbiAgaGFuZGxlUHJldkNsaWNrKCk6IHZvaWQge1xuICAgICAgdGhpcy5vblByZXZDbGljay5lbWl0KCk7XG4gIH1cblxuICBoYW5kbGVOZXh0Q2xpY2soKTogdm9pZCB7XG4gICAgICB0aGlzLm9uTmV4dENsaWNrLmVtaXQoKTtcbiAgfVxufVxuIl19