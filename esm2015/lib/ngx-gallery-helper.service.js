import { __decorate } from "tslib";
import { Injectable, Renderer2, ElementRef } from '@angular/core';
let NgxGalleryHelperService = class NgxGalleryHelperService {
    constructor(renderer) {
        this.renderer = renderer;
        this.swipeHandlers = new Map();
    }
    manageSwipe(status, element, id, nextHandler, prevHandler) {
        const handlers = this.getSwipeHandlers(id);
        // swipeleft and swiperight are available only if hammerjs is included
        try {
            if (status && !handlers) {
                this.swipeHandlers.set(id, [
                    this.renderer.listen(element.nativeElement, 'swipeleft', () => nextHandler()),
                    this.renderer.listen(element.nativeElement, 'swiperight', () => prevHandler())
                ]);
            }
            else if (!status && handlers) {
                handlers.map((handler) => handler());
                this.removeSwipeHandlers(id);
            }
        }
        catch (e) { }
    }
    validateUrl(url) {
        if (url.replace) {
            return url.replace(new RegExp(' ', 'g'), '%20')
                .replace(new RegExp('\'', 'g'), '%27');
        }
        else {
            return url;
        }
    }
    getBackgroundUrl(image) {
        return 'url(\'' + this.validateUrl(image) + '\')';
    }
    getSwipeHandlers(id) {
        return this.swipeHandlers.get(id);
    }
    removeSwipeHandlers(id) {
        this.swipeHandlers.delete(id);
    }
};
NgxGalleryHelperService.ctorParameters = () => [
    { type: Renderer2 }
];
NgxGalleryHelperService = __decorate([
    Injectable()
], NgxGalleryHelperService);
export { NgxGalleryHelperService };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmd4LWdhbGxlcnktaGVscGVyLnNlcnZpY2UuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9uZ3gtZ2FsbGVyeS05LyIsInNvdXJjZXMiOlsibGliL25neC1nYWxsZXJ5LWhlbHBlci5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxPQUFPLEVBQUUsVUFBVSxFQUFFLFNBQVMsRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFHbEUsSUFBYSx1QkFBdUIsR0FBcEMsTUFBYSx1QkFBdUI7SUFHbEMsWUFBb0IsUUFBbUI7UUFBbkIsYUFBUSxHQUFSLFFBQVEsQ0FBVztRQUYvQixrQkFBYSxHQUE0QixJQUFJLEdBQUcsRUFBc0IsQ0FBQztJQUVyQyxDQUFDO0lBRTNDLFdBQVcsQ0FBQyxNQUFlLEVBQUUsT0FBbUIsRUFBRSxFQUFVLEVBQUUsV0FBcUIsRUFBRSxXQUFxQjtRQUV0RyxNQUFNLFFBQVEsR0FBRyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsRUFBRSxDQUFDLENBQUM7UUFFM0Msc0VBQXNFO1FBQ3RFLElBQUk7WUFDQSxJQUFJLE1BQU0sSUFBSSxDQUFDLFFBQVEsRUFBRTtnQkFDckIsSUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsRUFBRSxFQUFFO29CQUN2QixJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsYUFBYSxFQUFFLFdBQVcsRUFBRSxHQUFHLEVBQUUsQ0FBQyxXQUFXLEVBQUUsQ0FBQztvQkFDN0UsSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLGFBQWEsRUFBRSxZQUFZLEVBQUUsR0FBRyxFQUFFLENBQUMsV0FBVyxFQUFFLENBQUM7aUJBQ2pGLENBQUMsQ0FBQzthQUNOO2lCQUFNLElBQUksQ0FBQyxNQUFNLElBQUksUUFBUSxFQUFFO2dCQUM1QixRQUFRLENBQUMsR0FBRyxDQUFDLENBQUMsT0FBTyxFQUFFLEVBQUUsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDO2dCQUNyQyxJQUFJLENBQUMsbUJBQW1CLENBQUMsRUFBRSxDQUFDLENBQUM7YUFDaEM7U0FDSjtRQUFDLE9BQU8sQ0FBQyxFQUFFLEdBQUU7SUFDbEIsQ0FBQztJQUVELFdBQVcsQ0FBQyxHQUFXO1FBQ25CLElBQUksR0FBRyxDQUFDLE9BQU8sRUFBRTtZQUNiLE9BQU8sR0FBRyxDQUFDLE9BQU8sQ0FBQyxJQUFJLE1BQU0sQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLEVBQUUsS0FBSyxDQUFDO2lCQUMxQyxPQUFPLENBQUMsSUFBSSxNQUFNLENBQUMsSUFBSSxFQUFFLEdBQUcsQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFDO1NBQzlDO2FBQU07WUFDSCxPQUFPLEdBQUcsQ0FBQztTQUNkO0lBQ0wsQ0FBQztJQUVELGdCQUFnQixDQUFDLEtBQWE7UUFDMUIsT0FBTyxRQUFRLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsR0FBRyxLQUFLLENBQUM7SUFDdEQsQ0FBQztJQUVPLGdCQUFnQixDQUFDLEVBQVU7UUFDL0IsT0FBTyxJQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQztJQUN0QyxDQUFDO0lBRU8sbUJBQW1CLENBQUMsRUFBVTtRQUNsQyxJQUFJLENBQUMsYUFBYSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsQ0FBQztJQUNsQyxDQUFDO0NBQ0YsQ0FBQTs7WUF4QytCLFNBQVM7O0FBSDVCLHVCQUF1QjtJQURuQyxVQUFVLEVBQUU7R0FDQSx1QkFBdUIsQ0EyQ25DO1NBM0NZLHVCQUF1QiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUsIFJlbmRlcmVyMiwgRWxlbWVudFJlZiB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgTmd4R2FsbGVyeUhlbHBlclNlcnZpY2Uge1xuICBwcml2YXRlIHN3aXBlSGFuZGxlcnM6IE1hcDxzdHJpbmcsIEZ1bmN0aW9uW10+ID0gbmV3IE1hcDxzdHJpbmcsIEZ1bmN0aW9uW10+KCk7XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSByZW5kZXJlcjogUmVuZGVyZXIyKSB7fVxuXG4gIG1hbmFnZVN3aXBlKHN0YXR1czogYm9vbGVhbiwgZWxlbWVudDogRWxlbWVudFJlZiwgaWQ6IHN0cmluZywgbmV4dEhhbmRsZXI6IEZ1bmN0aW9uLCBwcmV2SGFuZGxlcjogRnVuY3Rpb24pOiB2b2lkIHtcblxuICAgICAgY29uc3QgaGFuZGxlcnMgPSB0aGlzLmdldFN3aXBlSGFuZGxlcnMoaWQpO1xuXG4gICAgICAvLyBzd2lwZWxlZnQgYW5kIHN3aXBlcmlnaHQgYXJlIGF2YWlsYWJsZSBvbmx5IGlmIGhhbW1lcmpzIGlzIGluY2x1ZGVkXG4gICAgICB0cnkge1xuICAgICAgICAgIGlmIChzdGF0dXMgJiYgIWhhbmRsZXJzKSB7XG4gICAgICAgICAgICAgIHRoaXMuc3dpcGVIYW5kbGVycy5zZXQoaWQsIFtcbiAgICAgICAgICAgICAgICAgIHRoaXMucmVuZGVyZXIubGlzdGVuKGVsZW1lbnQubmF0aXZlRWxlbWVudCwgJ3N3aXBlbGVmdCcsICgpID0+IG5leHRIYW5kbGVyKCkpLFxuICAgICAgICAgICAgICAgICAgdGhpcy5yZW5kZXJlci5saXN0ZW4oZWxlbWVudC5uYXRpdmVFbGVtZW50LCAnc3dpcGVyaWdodCcsICgpID0+IHByZXZIYW5kbGVyKCkpXG4gICAgICAgICAgICAgIF0pO1xuICAgICAgICAgIH0gZWxzZSBpZiAoIXN0YXR1cyAmJiBoYW5kbGVycykge1xuICAgICAgICAgICAgICBoYW5kbGVycy5tYXAoKGhhbmRsZXIpID0+IGhhbmRsZXIoKSk7XG4gICAgICAgICAgICAgIHRoaXMucmVtb3ZlU3dpcGVIYW5kbGVycyhpZCk7XG4gICAgICAgICAgfVxuICAgICAgfSBjYXRjaCAoZSkge31cbiAgfVxuXG4gIHZhbGlkYXRlVXJsKHVybDogc3RyaW5nKTogc3RyaW5nIHtcbiAgICAgIGlmICh1cmwucmVwbGFjZSkge1xuICAgICAgICAgIHJldHVybiB1cmwucmVwbGFjZShuZXcgUmVnRXhwKCcgJywgJ2cnKSwgJyUyMCcpXG4gICAgICAgICAgICAgIC5yZXBsYWNlKG5ldyBSZWdFeHAoJ1xcJycsICdnJyksICclMjcnKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuIHVybDtcbiAgICAgIH1cbiAgfVxuXG4gIGdldEJhY2tncm91bmRVcmwoaW1hZ2U6IHN0cmluZykge1xuICAgICAgcmV0dXJuICd1cmwoXFwnJyArIHRoaXMudmFsaWRhdGVVcmwoaW1hZ2UpICsgJ1xcJyknO1xuICB9XG5cbiAgcHJpdmF0ZSBnZXRTd2lwZUhhbmRsZXJzKGlkOiBzdHJpbmcpOiBGdW5jdGlvbltdIHwgdW5kZWZpbmVkIHtcbiAgICAgIHJldHVybiB0aGlzLnN3aXBlSGFuZGxlcnMuZ2V0KGlkKTtcbiAgfVxuXG4gIHByaXZhdGUgcmVtb3ZlU3dpcGVIYW5kbGVycyhpZDogc3RyaW5nKTogdm9pZCB7XG4gICAgICB0aGlzLnN3aXBlSGFuZGxlcnMuZGVsZXRlKGlkKTtcbiAgfVxufVxuIl19