import { Directive, Input, AfterViewInit, ElementRef, OnInit, HostListener, OnChanges, AfterViewChecked } from '@angular/core';

@Directive({
  // tslint:disable-next-line:directive-selector
  selector: '[ngxLineClamp]'
})
export class NgxLineClampDirective implements  AfterViewInit {
  @Input() lineCount: number;
  @Input() text: string;
  @Input() options: any;
  @Input() parentClass: string;
  @Input() parentElement: any;

  rootElement: any;


  ELLIPSIS_CHARACTER = '\u2026';
  TRAILING_WHITESPACE_AND_PUNCTUATION_REGEX = /[ .,;!?'‘’“”\-–—]+$/;
  STYLE = 'overflow:hidden;overflow-wrap:break-word;word-wrap:break-word';

  constructor(private el: ElementRef) {
  }

  @HostListener('window:resize', ['$event'])
  scrollHandler(e: any) {
    this.runLineClamp(this.rootElement, this.parentElement, this.text);
  }

  ngAfterViewInit(): void {
    this.rootElement = this.el.nativeElement;

    if (this.parentClass) {
      this.parentElement = document.querySelector(`.${this.parentClass}`);

      if (!this.parentElement) {
        console.error('Name of [parentClass] Element is not exist.');
        return ;
      }
    } else if (!this.parentElement) {
      this.parentElement = this.rootElement.parentNode;
    }

    this.setStyle(this.rootElement, this.STYLE);
    setTimeout(() => {
      this.runLineClamp(this.rootElement, this.parentElement, this.text);
    });
  }

  runLineClamp(rootElement: HTMLElement, parentElement: HTMLElement, text: string) {
    const rootHeight = this.getComputedStyleToPx(rootElement, 'height');
    const rootParentHeight = this.getComputedStyleToPx(parentElement, 'height');

    const parentElementHeight = this.calculatePureHeight(parentElement);
    const maximumHeight = this.calculationMaximumHeight(rootElement, parentElementHeight);

    this.truncateElementNode(rootElement, rootElement, parentElement, maximumHeight,
      (this.options && this.options.ellipsis) || this.ELLIPSIS_CHARACTER, text);
  }

  setStyle(element: HTMLElement, style: string) {
    element.style.cssText += style;
  }

  getComputedStyle(element: HTMLElement, property: string): string {
    return window.getComputedStyle(element)[property];
  }

  getComputedStyleToPx(element: HTMLElement, property: string): number {
    const propertyStyle = this.getComputedStyle(element, property);
    return parseInt(propertyStyle.split('px')[0], 10);
  }

  calculatePureHeight(element: HTMLElement) {
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

  calculationMaximumHeight(element, parentElementHeight) {
    let lineHeight = this.getComputedStyle(element, 'lineHeight');

    if (lineHeight === 'normal') {
      const normal = 1.51;
      lineHeight = (this.getComputedStyleToPx(element, 'fontSize') *  normal) + '';
    } else {
      lineHeight = this.getComputedStyleToPx(element, 'lineHeight') + '';
    }

    const maxLine = Math.floor(parentElementHeight / parseInt(lineHeight, 10));
    const maximumHeight = (this.lineCount || maxLine) * parseInt(lineHeight, 10);

    return maximumHeight;
  }

  isOutOfParentArea(parentElement: HTMLElement) {
    return parentElement.scrollHeight > parentElement.offsetHeight;
  }

  truncateTextNode(textNode, rootElement, parentElement, maximumHeight, ellipsisCharacter, text) {
    let textSplitArray = text.split(' ');
    let nospace = false;
    if (textSplitArray.length === 1) {
      textSplitArray = text.split('');
      nospace = true;
    }
    let remainTextContent = '';
    let indexOfWhitespace = 0;
    let hasFullyContent = false;

    while (textSplitArray.length !== 0) {
      // console.log('1 while');
      if (indexOfWhitespace + 1 > textSplitArray.length) {
        break;
      }

      indexOfWhitespace = indexOfWhitespace + 1;
      remainTextContent = textSplitArray.slice(0, indexOfWhitespace).join(nospace ? '' : ' ');

      textNode.textContent = remainTextContent;

      if (this.isOutOfParentArea(parentElement)) {
        textNode.textContent = textSplitArray.slice(0, indexOfWhitespace - 1).join(nospace ? '' : ' ');
        hasFullyContent = true;
        break;
      }
    }

    return this.truncateTextNodeByCharacter(
      textNode,
      rootElement,
      parentElement,
      maximumHeight,
      ellipsisCharacter,
      hasFullyContent
    );
  }

  truncateTextNodeByCharacter (textNode, rootElement, parentElement, maximumHeight, ellipsisCharacter, hasFullyContent) {
    let textContent = textNode.textContent;
    let length = textContent.length;

    let limitCount = 30;


    while (length > 1 && limitCount > 0) {

      // Trim off one trailing character and any trailing punctuation and whitespace.
      if (hasFullyContent) {
        textContent = textContent
          .substring(0, length - 1)
          .replace(this.TRAILING_WHITESPACE_AND_PUNCTUATION_REGEX, '');
        length = textContent.length;
        textNode.textContent = textContent + ellipsisCharacter;
      }

      const rootHeight = this.getComputedStyleToPx(rootElement, 'height');


      if (rootHeight <= maximumHeight && !this.isOutOfParentArea(parentElement)) {
        return true;
      }

      limitCount--;
    }
    return false;
  }

  truncateElementNode(element: HTMLElement, rootElement, parentElement, maximumHeight, ellipsisCharacter, text) {
    const childNodes = element.childNodes;

    for (let i = 0; i < childNodes.length; i++) {
      const node = childNodes[i];
      element.removeChild(node);
    }

    const textNode = document.createTextNode('');
    element.appendChild(textNode);

    if (this.truncateTextNode(textNode, rootElement, parentElement, maximumHeight, ellipsisCharacter, text)) {
      return true;
    } else {
      return false;
    }
  }
}

