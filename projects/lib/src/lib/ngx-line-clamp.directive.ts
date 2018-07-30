import { Directive, Input, AfterViewInit, ElementRef, OnInit, HostListener, OnChanges, AfterViewChecked } from '@angular/core';

@Directive({
  // tslint:disable-next-line:directive-selector
  selector: '[ngxLineClamp]'
})
export class NgxLineClampDirective implements  AfterViewInit {
  @Input() lineCount: number;
  @Input() text: string;
  @Input() ellipsis = '\u2026';
  @Input() parentElement: HTMLElement;

  rootElement: any;

  TRAILING_WHITESPACE_AND_PUNCTUATION_REGEX = /[ .,;!?'‘’“”\-–—]+$/;

  STYLE = 'overflow:hidden;overflow-wrap:break-word;word-wrap:break-word';

  constructor(private el: ElementRef) {
  }

  ngAfterViewInit(): void {
    this.setElementVariables();
    this.setStyle(this.rootElement, this.STYLE);

    setTimeout(() => {
      this.runLineClamp(this.rootElement, this.parentElement, this.text, this.ellipsis);
    });
  }

  @HostListener('window:resize', ['$event'])
  scrollHandler(e: any) {
    this.runLineClamp(this.rootElement, this.parentElement, this.text, this.ellipsis);
  }

  setElementVariables() {
    this.rootElement = this.el.nativeElement;

    if (!this.parentElement) {
      this.parentElement = this.rootElement.parentNode;
    }
  }

  runLineClamp(rootElement: HTMLElement, parentElement: HTMLElement, text: string, ellipsis: string) {
    const parentElementHeight = this.extractPureHeight(parentElement);
    const maximumHeight = this.calculationMaximumHeight(rootElement, parentElementHeight);

    this.truncateElementNode(rootElement, parentElement, maximumHeight, text, ellipsis);
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

  extractPureHeight(element: HTMLElement) {
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

  calculationMaximumHeight(element: HTMLElement, parentElementHeight: number) {
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

  truncateTextNode(textNode: Text, rootElement: HTMLElement, parentElement: HTMLElement,
    maximumHeight: number, text: string, ellipsis: string) {

    let splitCharacter = ' ';
    let textSplitArray = text.split(splitCharacter);

    if (textSplitArray.length === 1) {
      splitCharacter = '';
      textSplitArray = text.split(splitCharacter);
    }

    let remainTextContent = '';
    let indexOfWhitespace = 0;
    let hasFullyContent = false;

    while (textSplitArray.length !== 0) {
      if (indexOfWhitespace + 1 > textSplitArray.length) {
        break;
      }

      indexOfWhitespace = indexOfWhitespace + 1;
      remainTextContent = textSplitArray.slice(0, indexOfWhitespace).join(splitCharacter);

      textNode.textContent = remainTextContent;

      const rootHeight = this.getComputedStyleToPx(rootElement, 'height');

      if (rootHeight >= maximumHeight) {
        hasFullyContent = true;
        break;
      }

      if (this.isOutOfParentArea(parentElement)) {
        textNode.textContent = textSplitArray.slice(0, indexOfWhitespace - 1).join(splitCharacter);
        hasFullyContent = true;
        break;
      }
    }

    return this.truncateTextNodeByCharacter(
      textNode,
      rootElement,
      parentElement,
      maximumHeight,
      ellipsis,
      hasFullyContent
    );
  }

  truncateTextNodeByCharacter (textNode: Text, rootElement: HTMLElement, parentElement: HTMLElement,
    maximumHeight: number, ellipsisCharacter: string, hasFullyContent: boolean) {

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

  truncateElementNode(rootElement: HTMLElement, parentElement: HTMLElement, maximumHeight: number, text: string, ellipsis: string) {
    this.removeChildNodes(rootElement);

    const textNode = this.appendTextNode(rootElement);

    if (this.truncateTextNode(textNode, rootElement, parentElement, maximumHeight, text, ellipsis)) {
      return true;
    } else {
      return false;
    }
  }

  private removeChildNodes(element: HTMLElement) {
    const childNodes = element.childNodes;
    for (let i = 0; i < childNodes.length; i++) {
      const node = childNodes[i];
      element.removeChild(node);
    }
  }

  private appendTextNode(element: HTMLElement) {
    const textNode = document.createTextNode('');
    element.appendChild(textNode);
    return textNode;
  }
}

