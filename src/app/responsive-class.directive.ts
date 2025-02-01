import { Directive, ElementRef, Input, Renderer2, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { ScreenSizeService } from './screen-size.service';

@Directive({
  selector: '[appResponsiveClass]'
})
export class ResponsiveClassDirective implements OnInit, OnDestroy {
  @Input() desktopClass: string = 'w-75';
  @Input() mobileClass: string = 'w-100';
  private screenSizeSubscription: Subscription;
  private isMobile: boolean = false;

  constructor(
    private el: ElementRef, 
    private renderer: Renderer2,
     private screenSizeService: ScreenSizeService) {}

  ngOnInit() {
    this.screenSizeSubscription = this.screenSizeService.screenWidth$.subscribe(width => {
      this.isMobile = this.screenSizeService.isMobile();
      this.updateClass();
    });

    this.updateClass();
  }

  ngOnDestroy() {
    if (this.screenSizeSubscription) {
      this.screenSizeSubscription.unsubscribe();
    }
  }

  private updateClass() {
    if (this.isMobile) {
      this.renderer.removeClass(this.el.nativeElement, this.desktopClass);
      this.renderer.addClass(this.el.nativeElement, this.mobileClass);
    } else {
      this.renderer.removeClass(this.el.nativeElement, this.mobileClass);
      this.renderer.addClass(this.el.nativeElement, this.desktopClass);
    }
  }
}