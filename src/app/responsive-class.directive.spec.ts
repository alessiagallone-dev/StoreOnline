import { Directive, ElementRef, Renderer2 } from '@angular/core';
import { ScreenSizeService } from './screen-size.service';
import { ResponsiveClassDirective } from './responsive-class.directive';
import { of } from 'rxjs';

describe('ResponsiveClassDirective', () => {
  let directive: ResponsiveClassDirective;
  let el: ElementRef;
  let renderer: Renderer2;
  let screenSizeService: ScreenSizeService;

  beforeEach(() => {
    el = { nativeElement: {} } as ElementRef;
    renderer = jasmine.createSpyObj('Renderer2', ['addClass', 'removeClass']);
    screenSizeService = jasmine.createSpyObj('ScreenSizeService', ['isMobile', 'screenWidth$']);

    screenSizeService.screenWidth$ = of(1024);  

    directive = new ResponsiveClassDirective(el, renderer, screenSizeService);
  });
});
