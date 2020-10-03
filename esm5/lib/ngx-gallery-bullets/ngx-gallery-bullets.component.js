import { __decorate } from "tslib";
import { Component, Input, EventEmitter, Output } from '@angular/core';
var NgxGalleryBulletsComponent = /** @class */ (function () {
    function NgxGalleryBulletsComponent() {
        this.active = 0;
        this.onChange = new EventEmitter();
    }
    NgxGalleryBulletsComponent.prototype.getBullets = function () {
        return Array(this.count);
    };
    NgxGalleryBulletsComponent.prototype.handleChange = function (event, index) {
        this.onChange.emit(index);
    };
    __decorate([
        Input()
    ], NgxGalleryBulletsComponent.prototype, "count", void 0);
    __decorate([
        Input()
    ], NgxGalleryBulletsComponent.prototype, "active", void 0);
    __decorate([
        Output()
    ], NgxGalleryBulletsComponent.prototype, "onChange", void 0);
    NgxGalleryBulletsComponent = __decorate([
        Component({
            selector: 'ngx-gallery-bullets',
            template: "<div class=\"ngx-gallery-bullet\" *ngFor=\"let bullet of getBullets(); let i = index;\" (click)=\"handleChange($event, i)\" [ngClass]=\"{ 'ngx-gallery-active': i == active }\"></div>",
            styles: [":host{position:absolute;z-index:2000;display:-webkit-inline-box;display:inline-flex;left:50%;-webkit-transform:translateX(-50%);transform:translateX(-50%);bottom:0;padding:10px}.ngx-gallery-bullet{width:10px;height:10px;border-radius:50%;cursor:pointer;background:#fff}.ngx-gallery-bullet:not(:first-child){margin-left:5px}.ngx-gallery-bullet.ngx-gallery-active,.ngx-gallery-bullet:hover{background:#000}"]
        })
    ], NgxGalleryBulletsComponent);
    return NgxGalleryBulletsComponent;
}());
export { NgxGalleryBulletsComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmd4LWdhbGxlcnktYnVsbGV0cy5jb21wb25lbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9uZ3gtZ2FsbGVyeS05LyIsInNvdXJjZXMiOlsibGliL25neC1nYWxsZXJ5LWJ1bGxldHMvbmd4LWdhbGxlcnktYnVsbGV0cy5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQUUsS0FBSyxFQUFFLFlBQVksRUFBRSxNQUFNLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFPdkU7SUFBQTtRQUVXLFdBQU0sR0FBVyxDQUFDLENBQUM7UUFFbEIsYUFBUSxHQUFHLElBQUksWUFBWSxFQUFFLENBQUM7SUFTMUMsQ0FBQztJQVBDLCtDQUFVLEdBQVY7UUFDSSxPQUFPLEtBQUssQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDN0IsQ0FBQztJQUVELGlEQUFZLEdBQVosVUFBYSxLQUFZLEVBQUUsS0FBYTtRQUNwQyxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUM5QixDQUFDO0lBWFE7UUFBUixLQUFLLEVBQUU7NkRBQWU7SUFDZDtRQUFSLEtBQUssRUFBRTs4REFBb0I7SUFFbEI7UUFBVCxNQUFNLEVBQUU7Z0VBQStCO0lBSjdCLDBCQUEwQjtRQUx0QyxTQUFTLENBQUM7WUFDVCxRQUFRLEVBQUUscUJBQXFCO1lBQy9CLGtNQUFtRDs7U0FFcEQsQ0FBQztPQUNXLDBCQUEwQixDQWF0QztJQUFELGlDQUFDO0NBQUEsQUFiRCxJQWFDO1NBYlksMEJBQTBCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50LCBJbnB1dCwgRXZlbnRFbWl0dGVyLCBPdXRwdXQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnbmd4LWdhbGxlcnktYnVsbGV0cycsXG4gIHRlbXBsYXRlVXJsOiAnLi9uZ3gtZ2FsbGVyeS1idWxsZXRzLmNvbXBvbmVudC5odG1sJyxcbiAgc3R5bGVVcmxzOiBbJy4vbmd4LWdhbGxlcnktYnVsbGV0cy5jb21wb25lbnQuc2NzcyddXG59KVxuZXhwb3J0IGNsYXNzIE5neEdhbGxlcnlCdWxsZXRzQ29tcG9uZW50IHtcbiAgQElucHV0KCkgY291bnQ6IG51bWJlcjtcbiAgQElucHV0KCkgYWN0aXZlOiBudW1iZXIgPSAwO1xuXG4gIEBPdXRwdXQoKSBvbkNoYW5nZSA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcblxuICBnZXRCdWxsZXRzKCk6IG51bWJlcltdIHtcbiAgICAgIHJldHVybiBBcnJheSh0aGlzLmNvdW50KTtcbiAgfVxuXG4gIGhhbmRsZUNoYW5nZShldmVudDogRXZlbnQsIGluZGV4OiBudW1iZXIpOiB2b2lkIHtcbiAgICAgIHRoaXMub25DaGFuZ2UuZW1pdChpbmRleCk7XG4gIH1cbn1cbiJdfQ==