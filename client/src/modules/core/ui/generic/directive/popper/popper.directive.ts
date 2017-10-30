import {
  Component, ComponentFactory, ComponentFactoryResolver, Directive, ElementRef, HostListener, Injector,
  Input, OnDestroy, OnInit, TemplateRef, ViewContainerRef
} from '@angular/core';

// third parties
import Popper from 'popper.js';
import PopperOptions = Popper.PopperOptions;
import elementResizeDetectorMaker from 'element-resize-detector';
import Erd = elementResizeDetectorMaker.Erd;

interface PopperConfiguration extends PopperOptions {
  closeOnOutsideClick?: true; g;
}

@Component({
  selector: 'px-popper',
  template: `<ng-content></ng-content>`
})
export class PopperComponent {
  isOpen = false;
}

@Directive({
  selector: '[px-popper]'
})
export class PopperDirective implements OnInit, OnDestroy {

  @Input('px-popper')
  body;

  @Input('px-popper-config')
  config: PopperConfiguration;

  erd: Erd;
  isOpen = false;
  popper: Popper = null;
  popperElement: HTMLElement;
  popperFactory: ComponentFactory<PopperComponent>;
  component:PopperComponent;

  private static isSameOrWithinElement(target: HTMLElement, element: HTMLElement) {
    return target === element || element.contains(target);
  }

  constructor(
    private componentFactory: ComponentFactoryResolver,
    private viewContainerRef: ViewContainerRef,
    private injector: Injector,
    private element: ElementRef
  ) {
    this.popperFactory = this.componentFactory.resolveComponentFactory<PopperComponent>(PopperComponent);
  }

  @HostListener('click', ['$event'])
  toggle($event) {
    if (this.isOpen) {
      this.hide();
    } else {
      this.show();
    }
  }

  @HostListener('document:click', ['$event'])
  handleBodyClick($event) {
    if (this.isOpen && this.config.closeOnOutsideClick) {
      if (PopperDirective.isSameOrWithinElement($event.target, this.popperElement)
        || PopperDirective.isSameOrWithinElement($event.target, this.element.nativeElement)) {
        return;
      }
      this.hide();
    }
  }

  ngOnInit() {
    this.configure(this.config);
    this.erd = elementResizeDetectorMaker({
      strategy: 'scroll'
    });

    const viewRef = this.viewContainerRef.createEmbeddedView(<TemplateRef<any>>this.body, null);
    const ref = this.viewContainerRef.createComponent(this.popperFactory, 0, this.injector, [viewRef.rootNodes]);

    this.component = ref.instance;
    this.component.isOpen = false;

    this.popperElement = ref.location.nativeElement;
    this.popperElement = this.popperElement.parentNode.removeChild(this.popperElement);

    this.popper = new Popper(this.element.nativeElement, ref.location.nativeElement, this.config);
    this.erd.listenTo(ref.location.nativeElement, () => {
      this.popper.scheduleUpdate();
    });
  }

  ngOnDestroy() {
    this.hide();
    this.popper.destroy();
    this.erd.uninstall(this.popperElement);
  }

  hide() {
    if (!this.isOpen) {
      return;
    }
    this.isOpen = false;
    this.component.isOpen = this.isOpen;
    this.popperElement = this.popperElement.parentNode.removeChild(this.popperElement);
  }

  show() {
    if (this.isOpen) {
      return;
    }
    this.isOpen = true;
    this.component.isOpen = this.isOpen;
    document.body.appendChild(this.popperElement);
    this.popper.scheduleUpdate();
  }

  private configure(configuration: PopperConfiguration) {
    this.config = { closeOnOutsideClick: true,  ...configuration || { } } as PopperConfiguration ;
  }

}
