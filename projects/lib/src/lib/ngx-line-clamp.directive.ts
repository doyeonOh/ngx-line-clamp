import {
  AfterViewInit,
  Directive,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges
} from '@angular/core';
import { BehaviorSubject, forkJoin, Observable, Subject } from 'rxjs';
import { debounceTime, filter, takeUntil, tap } from 'rxjs/operators';

const TRAILING_WHITESPACE_AND_PUNCTUATION_REGEX = /[ .,;!?'‘’“”\-–—]+$/;
const STYLE = 'overflow:hidden;overflow-wrap:break-word;word-wrap:break-word';
const WHITE_SPACE = ' ';

@Directive({
  // tslint:disable-next-line:directive-selector
  selector: '[ngxLineClamp]'
})
export class NgxLineClampDirective implements OnInit, OnChanges, OnDestroy, AfterViewInit {
  @Input()
  public lineCount: number;
  @Input()
  public text: string;
  @Input()
  public ellipsis = '\u2026';
  @Input()
  public set parentElement(parentElement: HTMLElement) {
    this._parentElement = parentElement;
  }
  @Output() textTruncated: EventEmitter = new EventEmitter<void>();

  public get parentElement(): HTMLElement {
    return this._parentElement;
  }

  private _parentElement: HTMLElement;
  private rootElement: HTMLElement;

  private lineClamp$ = new BehaviorSubject<any>(null);
  private destroyed$ = new Subject<void>();

  private get lineClampAction$(): Observable<any> {
    return this.lineClamp$.pipe(
      filter(v => !!v),
      debounceTime(0),
      tap(() => {
        this.setElementVariables();
        this.setStyle(this.rootElement, STYLE);

        const limitedMaxHeight = this.getLimitedMaxHeight(this.rootElement, this.parentElement);
        const textNode = document.createTextNode('');

        this.removeChildNodes(this.rootElement);
        this.rootElement.appendChild(textNode);

        const isTruncateText = this.truncateTextNode(this.text, textNode, limitedMaxHeight);

        if (isTruncateText) {
          this.textTruncated.emit();
          this.makeEllipsisInTrailing(textNode, limitedMaxHeight);
        }
      })
    );
  }

  constructor(private el: ElementRef) {
  }

  public ngOnInit() {
    forkJoin([
      this.lineClampAction$
    ]).pipe(takeUntil(this.destroyed$)).subscribe();
  }

  public ngOnChanges(changes: SimpleChanges): void {
    this.runLineClamp();
  }

  public ngAfterViewInit(): void {
    this.runLineClamp();
  }

  public ngOnDestroy() {
    this.destroyed$.next();
  }

  @HostListener('window:resize')
  public scrollHandler() {
    this.runLineClamp();
  }

  public runLineClamp() {
    this.lineClamp$.next(true);
  }

  private setElementVariables() {
    this.rootElement = this.el.nativeElement;

    if (!this.parentElement) {
      this.parentElement = this.rootElement.parentNode as HTMLElement;
    }
  }

  private setStyle(element: HTMLElement, style: string) {
    element.style.cssText += style;
  }

  private getComputedStyle(element: HTMLElement, property: string): string {
    return window.getComputedStyle(element)[property];
  }

  private getComputedStyleToPx(element: HTMLElement, property: string): number {
    const propertyStyle = this.getComputedStyle(element, property);
    return parseInt(propertyStyle.split('px')[0], 10);
  }

  private extractPureElementHeight(element: HTMLElement) {
    const boxSizing = this.getComputedStyle(element, 'boxSizing');
    let height = this.getComputedStyleToPx(element, 'height');

    if (boxSizing === 'padding-box') {
      const paddingTop = this.getComputedStyleToPx(element, 'paddingTop');
      const paddingBottom = this.getComputedStyleToPx(element, 'paddingBottom');

      height = height - paddingTop - paddingBottom;

    } else if (boxSizing === 'border-box') {
      const paddingTop = this.getComputedStyleToPx(element, 'paddingTop');
      const paddingBottom = this.getComputedStyleToPx(element, 'paddingBottom');
      const borderTop = this.getComputedStyleToPx(element, 'borderTop');
      const borderBottom = this.getComputedStyleToPx(element, 'borderBottom');

      height = height - paddingTop - paddingBottom - borderTop - borderBottom;
    }

    return height;
  }

  private calculateElementMaxHeight(element: HTMLElement, parentElementHeight: number) {
    let lineHeight = this.getComputedStyle(element, 'lineHeight');

    if (lineHeight === 'normal') {
      const normal = 1.51;
      lineHeight = (this.getComputedStyleToPx(element, 'fontSize') *  normal) + '';
    } else {
      lineHeight = this.getComputedStyleToPx(element, 'lineHeight') + '';
    }

    const maxLine = Math.floor(parentElementHeight / parseInt(lineHeight, 10));
    const adder = 1; // 높이 오차 보정
    return (this.lineCount || maxLine) * parseInt(lineHeight, 10) + adder;
  }

  private hasScrollInElement(parentElement: HTMLElement) {
    return parentElement.scrollHeight > parentElement.offsetHeight;
  }

  private truncateTextNode(text: string, textNode: Text, limitedMaxHeight: number): boolean {
    const words = text.split(WHITE_SPACE);

    let newTextContent = '';
    let prevTextContent = '';
    let wordIndex = 0;
    let isContentFull = false;

    while (words.length !== 0) {
      if (wordIndex + 1 > words.length) {
        break;
      }

      wordIndex = wordIndex + 1;
      newTextContent = words.slice(0, wordIndex).join(WHITE_SPACE);

      textNode.textContent = newTextContent;


      const rootHeight = this.getComputedStyleToPx(this.rootElement, 'height');
      const isRootElementOverMaxHeight = rootHeight >= limitedMaxHeight;

      if (isRootElementOverMaxHeight || this.hasScrollInElement(this.parentElement)) {
        textNode.textContent = prevTextContent;
        isContentFull = true;
        break;
      }

      prevTextContent = newTextContent;
    }

    return isContentFull;

  }

  private removeChildNodes(element: HTMLElement) {
    const childNodes = element.childNodes;
    for (let i = 0; i < childNodes.length; i++) {
      const node = childNodes[i];
      element.removeChild(node);
    }
  }

  private makeEllipsisInTrailing(textNode: Text, limitedMaxHeight: number) {
    let textContent = textNode.textContent;
    let length = textContent.length;

    let limitCount = 30;

    while (length > 1 && limitCount > 0) {

      // Trim off one trailing character and any trailing punctuation and whitespace.
      textContent = textContent
        .substring(0, length - 1)
        .replace(TRAILING_WHITESPACE_AND_PUNCTUATION_REGEX, '');
      length = textContent.length;
      textNode.textContent = textContent + this.ellipsis;

      const rootHeight = this.getComputedStyleToPx(this.rootElement, 'height');
      const isRootElementInMaxHeight = rootHeight <= limitedMaxHeight;

      if (isRootElementInMaxHeight && !this.hasScrollInElement(this.parentElement)) {
        break;
      }

      limitCount--;
    }
  }

  private getLimitedMaxHeight(rootElement: HTMLElement, parentElement: HTMLElement) {
    const parentElHeight = this.extractPureElementHeight(parentElement);
    return this.calculateElementMaxHeight(rootElement, parentElHeight);
  }
}

