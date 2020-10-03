import { __decorate } from "tslib";
import { Injectable, Renderer2, ElementRef } from '@angular/core';
var NgxGalleryHelperService = /** @class */ (function () {
    function NgxGalleryHelperService(renderer) {
        this.renderer = renderer;
        this.swipeHandlers = new Map();
    }
    NgxGalleryHelperService.prototype.manageSwipe = function (status, element, id, nextHandler, prevHandler) {
        var handlers = this.getSwipeHandlers(id);
        // swipeleft and swiperight are available only if hammerjs is included
        try {
            if (status && !handlers) {
                this.swipeHandlers.set(id, [
                    this.renderer.listen(element.nativeElement, 'swipeleft', function () { return nextHandler(); }),
                    this.renderer.listen(element.nativeElement, 'swiperight', function () { return prevHandler(); })
                ]);
            }
            else if (!status && handlers) {
                handlers.map(function (handler) { return handler(); });
                this.removeSwipeHandlers(id);
            }
        }
        catch (e) { }
    };
    NgxGalleryHelperService.prototype.validateUrl = function (url) {
        if (url.replace) {
            return url.replace(new RegExp(' ', 'g'), '%20')
                .replace(new RegExp('\'', 'g'), '%27');
        }
        else {
            return url;
        }
    };
    NgxGalleryHelperService.prototype.getBackgroundUrl = function (image) {
        return 'url(\'' + this.validateUrl(image) + '\')';
    };
    NgxGalleryHelperService.prototype.getSwipeHandlers = function (id) {
        return this.swipeHandlers.get(id);
    };
    NgxGalleryHelperService.prototype.removeSwipeHandlers = function (id) {
        this.swipeHandlers.delete(id);
    };
    NgxGalleryHelperService.ctorParameters = function () { return [
        { type: Renderer2 }
    ]; };
    NgxGalleryHelperService = __decorate([
        Injectable()
    ], NgxGalleryHelperService);
    return NgxGalleryHelperService;
}());
export { NgxGalleryHelperService };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmd4LWdhbGxlcnktaGVscGVyLnNlcnZpY2UuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9uZ3gtZ2FsbGVyeS05LyIsInNvdXJjZXMiOlsibGliL25neC1nYWxsZXJ5LWhlbHBlci5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxPQUFPLEVBQUUsVUFBVSxFQUFFLFNBQVMsRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFHbEU7SUFHRSxpQ0FBb0IsUUFBbUI7UUFBbkIsYUFBUSxHQUFSLFFBQVEsQ0FBVztRQUYvQixrQkFBYSxHQUE0QixJQUFJLEdBQUcsRUFBc0IsQ0FBQztJQUVyQyxDQUFDO0lBRTNDLDZDQUFXLEdBQVgsVUFBWSxNQUFlLEVBQUUsT0FBbUIsRUFBRSxFQUFVLEVBQUUsV0FBcUIsRUFBRSxXQUFxQjtRQUV0RyxJQUFNLFFBQVEsR0FBRyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsRUFBRSxDQUFDLENBQUM7UUFFM0Msc0VBQXNFO1FBQ3RFLElBQUk7WUFDQSxJQUFJLE1BQU0sSUFBSSxDQUFDLFFBQVEsRUFBRTtnQkFDckIsSUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsRUFBRSxFQUFFO29CQUN2QixJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsYUFBYSxFQUFFLFdBQVcsRUFBRSxjQUFNLE9BQUEsV0FBVyxFQUFFLEVBQWIsQ0FBYSxDQUFDO29CQUM3RSxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsYUFBYSxFQUFFLFlBQVksRUFBRSxjQUFNLE9BQUEsV0FBVyxFQUFFLEVBQWIsQ0FBYSxDQUFDO2lCQUNqRixDQUFDLENBQUM7YUFDTjtpQkFBTSxJQUFJLENBQUMsTUFBTSxJQUFJLFFBQVEsRUFBRTtnQkFDNUIsUUFBUSxDQUFDLEdBQUcsQ0FBQyxVQUFDLE9BQU8sSUFBSyxPQUFBLE9BQU8sRUFBRSxFQUFULENBQVMsQ0FBQyxDQUFDO2dCQUNyQyxJQUFJLENBQUMsbUJBQW1CLENBQUMsRUFBRSxDQUFDLENBQUM7YUFDaEM7U0FDSjtRQUFDLE9BQU8sQ0FBQyxFQUFFLEdBQUU7SUFDbEIsQ0FBQztJQUVELDZDQUFXLEdBQVgsVUFBWSxHQUFXO1FBQ25CLElBQUksR0FBRyxDQUFDLE9BQU8sRUFBRTtZQUNiLE9BQU8sR0FBRyxDQUFDLE9BQU8sQ0FBQyxJQUFJLE1BQU0sQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLEVBQUUsS0FBSyxDQUFDO2lCQUMxQyxPQUFPLENBQUMsSUFBSSxNQUFNLENBQUMsSUFBSSxFQUFFLEdBQUcsQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFDO1NBQzlDO2FBQU07WUFDSCxPQUFPLEdBQUcsQ0FBQztTQUNkO0lBQ0wsQ0FBQztJQUVELGtEQUFnQixHQUFoQixVQUFpQixLQUFhO1FBQzFCLE9BQU8sUUFBUSxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLEdBQUcsS0FBSyxDQUFDO0lBQ3RELENBQUM7SUFFTyxrREFBZ0IsR0FBeEIsVUFBeUIsRUFBVTtRQUMvQixPQUFPLElBQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDO0lBQ3RDLENBQUM7SUFFTyxxREFBbUIsR0FBM0IsVUFBNEIsRUFBVTtRQUNsQyxJQUFJLENBQUMsYUFBYSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsQ0FBQztJQUNsQyxDQUFDOztnQkF2QzZCLFNBQVM7O0lBSDVCLHVCQUF1QjtRQURuQyxVQUFVLEVBQUU7T0FDQSx1QkFBdUIsQ0EyQ25DO0lBQUQsOEJBQUM7Q0FBQSxBQTNDRCxJQTJDQztTQTNDWSx1QkFBdUIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3RhYmxlLCBSZW5kZXJlcjIsIEVsZW1lbnRSZWYgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIE5neEdhbGxlcnlIZWxwZXJTZXJ2aWNlIHtcbiAgcHJpdmF0ZSBzd2lwZUhhbmRsZXJzOiBNYXA8c3RyaW5nLCBGdW5jdGlvbltdPiA9IG5ldyBNYXA8c3RyaW5nLCBGdW5jdGlvbltdPigpO1xuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgcmVuZGVyZXI6IFJlbmRlcmVyMikge31cblxuICBtYW5hZ2VTd2lwZShzdGF0dXM6IGJvb2xlYW4sIGVsZW1lbnQ6IEVsZW1lbnRSZWYsIGlkOiBzdHJpbmcsIG5leHRIYW5kbGVyOiBGdW5jdGlvbiwgcHJldkhhbmRsZXI6IEZ1bmN0aW9uKTogdm9pZCB7XG5cbiAgICAgIGNvbnN0IGhhbmRsZXJzID0gdGhpcy5nZXRTd2lwZUhhbmRsZXJzKGlkKTtcblxuICAgICAgLy8gc3dpcGVsZWZ0IGFuZCBzd2lwZXJpZ2h0IGFyZSBhdmFpbGFibGUgb25seSBpZiBoYW1tZXJqcyBpcyBpbmNsdWRlZFxuICAgICAgdHJ5IHtcbiAgICAgICAgICBpZiAoc3RhdHVzICYmICFoYW5kbGVycykge1xuICAgICAgICAgICAgICB0aGlzLnN3aXBlSGFuZGxlcnMuc2V0KGlkLCBbXG4gICAgICAgICAgICAgICAgICB0aGlzLnJlbmRlcmVyLmxpc3RlbihlbGVtZW50Lm5hdGl2ZUVsZW1lbnQsICdzd2lwZWxlZnQnLCAoKSA9PiBuZXh0SGFuZGxlcigpKSxcbiAgICAgICAgICAgICAgICAgIHRoaXMucmVuZGVyZXIubGlzdGVuKGVsZW1lbnQubmF0aXZlRWxlbWVudCwgJ3N3aXBlcmlnaHQnLCAoKSA9PiBwcmV2SGFuZGxlcigpKVxuICAgICAgICAgICAgICBdKTtcbiAgICAgICAgICB9IGVsc2UgaWYgKCFzdGF0dXMgJiYgaGFuZGxlcnMpIHtcbiAgICAgICAgICAgICAgaGFuZGxlcnMubWFwKChoYW5kbGVyKSA9PiBoYW5kbGVyKCkpO1xuICAgICAgICAgICAgICB0aGlzLnJlbW92ZVN3aXBlSGFuZGxlcnMoaWQpO1xuICAgICAgICAgIH1cbiAgICAgIH0gY2F0Y2ggKGUpIHt9XG4gIH1cblxuICB2YWxpZGF0ZVVybCh1cmw6IHN0cmluZyk6IHN0cmluZyB7XG4gICAgICBpZiAodXJsLnJlcGxhY2UpIHtcbiAgICAgICAgICByZXR1cm4gdXJsLnJlcGxhY2UobmV3IFJlZ0V4cCgnICcsICdnJyksICclMjAnKVxuICAgICAgICAgICAgICAucmVwbGFjZShuZXcgUmVnRXhwKCdcXCcnLCAnZycpLCAnJTI3Jyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiB1cmw7XG4gICAgICB9XG4gIH1cblxuICBnZXRCYWNrZ3JvdW5kVXJsKGltYWdlOiBzdHJpbmcpIHtcbiAgICAgIHJldHVybiAndXJsKFxcJycgKyB0aGlzLnZhbGlkYXRlVXJsKGltYWdlKSArICdcXCcpJztcbiAgfVxuXG4gIHByaXZhdGUgZ2V0U3dpcGVIYW5kbGVycyhpZDogc3RyaW5nKTogRnVuY3Rpb25bXSB8IHVuZGVmaW5lZCB7XG4gICAgICByZXR1cm4gdGhpcy5zd2lwZUhhbmRsZXJzLmdldChpZCk7XG4gIH1cblxuICBwcml2YXRlIHJlbW92ZVN3aXBlSGFuZGxlcnMoaWQ6IHN0cmluZyk6IHZvaWQge1xuICAgICAgdGhpcy5zd2lwZUhhbmRsZXJzLmRlbGV0ZShpZCk7XG4gIH1cbn1cbiJdfQ==