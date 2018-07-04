import { Directive, Input, AfterViewInit, ElementRef, OnInit, HostListener } from '@angular/core';

@Directive({
  // tslint:disable-next-line:directive-selector
  selector: '[ngxLineClamp]'
})
export class NgxLineClampDirective implements OnInit, AfterViewInit {
  @Input() lineCount: number;
  @Input() text: string;
  @Input() options: any;
  originText = this.text;

  rootElement: any;
  parentElement: any;

  height: number;

  ELLIPSIS_CHARACTER = '\u2026';
  TRAILING_WHITESPACE_AND_PUNCTUATION_REGEX = /[ .,;!?'‘’“”\-–—]+$/;

  constructor(private el: ElementRef) {
  }

  @HostListener('window:resize', ['$event'])
  scrollHandler(e: any) {
    this.runLineClamp(this.rootElement, this.parentElement, this.text);
  }

  ngOnInit(): void { }


  ngAfterViewInit(): void {
    this.rootElement = this.el.nativeElement;
    this.parentElement = this.rootElement.parentNode;

    this.setCss(this.rootElement);
    this.runLineClamp(this.rootElement, this.parentElement, this.text);
  }

  runLineClamp(rootElement: HTMLElement, parentElement: HTMLElement, text: string) {

    const rootHeight = parseInt(window.getComputedStyle(rootElement).height.split('px')[0], 10);
    const rootParentHeight = parseInt(window.getComputedStyle(parentElement).height.split('px')[0], 10);

    this.height = this.calculationHeight(parentElement);

    const { maxLine, maximumHeight } = this.calculationMaximumHeight(rootElement);

    if (this.height <= maximumHeight) {
      return ;
    }

    this.truncateElementNode(rootElement, rootElement, maximumHeight,
      (this.options && this.options.ellipsis) || this.ELLIPSIS_CHARACTER, text);
  }

  setCss(element) {
    element.style.cssText += 'overflow:hidden;overflow-wrap:break-word;word-wrap:break-word';
  }

  calculationHeight(element: HTMLElement) {
    let height = parseInt(window.getComputedStyle(element).height.split('px')[0], 10);

    const boxSizing = window.getComputedStyle(element).boxSizing;

    if (boxSizing === 'padding-box') {
      const paddingTop = parseInt(window.getComputedStyle(element).paddingTop.split('px')[0], 10);
      const paddingBottom = parseInt(window.getComputedStyle(element).paddingBottom.split('px')[0], 10);

      height = height - paddingTop - paddingBottom;

    } else if (boxSizing === 'border-box') {
      const paddingTop = parseInt(window.getComputedStyle(element).paddingTop.split('px')[0], 10);
      const paddingBottom = parseInt(window.getComputedStyle(element).paddingBottom.split('px')[0], 10);
      const borderTop = parseInt(window.getComputedStyle(element).borderTop.split('px')[0], 10);
      const borderBottom = parseInt(window.getComputedStyle(element).borderBottom.split('px')[0], 10);

      height = height - paddingTop - paddingBottom - borderTop - borderBottom;
    }


    return height;
  }

  calculationMaximumHeight(element) {
    let lineHeight = window.getComputedStyle(element).lineHeight;

    if (lineHeight === 'normal') {
      const normal = 1.51;
      lineHeight = (parseInt(window.getComputedStyle(element).fontSize.split('px')[0], 10) *  normal) + '';
    }

    const maxLine = Math.floor(this.height / parseInt(lineHeight, 10));
    const maximumHeight = (this.lineCount || maxLine) * parseInt(lineHeight, 10);

    return { maxLine, maximumHeight };
  }

  truncateTextNode(textNode, rootElement, maximumHeight, ellipsisCharacter, text) {
    let indexOfWhitespace = 0;
    let hasFullyContent = false;
    const textSplit = text.split(' ');
    let remainTextContent = '';

    while (textSplit.length !== 0) {

      if (indexOfWhitespace + 1 > textSplit.length) {
        break;
      }

      indexOfWhitespace = indexOfWhitespace + 1;
      remainTextContent = textSplit.slice(0, indexOfWhitespace).join(' ');

      textNode.textContent = remainTextContent;

      const rootHeight = parseInt(window.getComputedStyle(rootElement).height.split('px')[0], 10);

      if (rootHeight >= maximumHeight) {
        textNode.textContent = textSplit.slice(0, indexOfWhitespace - 1).join(' ');
        hasFullyContent = true;
        break;
      }
    }

    return this.truncateTextNodeByCharacter(
      textNode,
      rootElement,
      maximumHeight,
      ellipsisCharacter,
      hasFullyContent
    );
  }

  truncateTextNodeByCharacter (textNode, rootElement, maximumHeight, ellipsisCharacter, isFullyContent) {
    let textContent = textNode.textContent;
    let length = textContent.length;

    while (length > 1) {
      // Trim off one trailing character and any trailing punctuation and whitespace.
      if (isFullyContent) {
        textContent = textContent
          .substring(0, length - 1)
          .replace(this.TRAILING_WHITESPACE_AND_PUNCTUATION_REGEX, '');
        length = textContent.length;
        textNode.textContent = textContent + ellipsisCharacter;
      }


      const rootHeight = parseInt(window.getComputedStyle(rootElement).height.split('px')[0], 10);

      if (rootHeight <= maximumHeight) {
        return true;
      }
    }
    return false;
  }

  truncateElementNode(element: HTMLElement, rootElement, maximumHeight, ellipsisCharacter, text) {
    const childNodes = element.childNodes;

    for (let i = 0; i < childNodes.length; i++) {
      const node = childNodes[i];
      element.removeChild(node);
    }

    const textNode = document.createTextNode('');
    element.appendChild(textNode);

    if (this.truncateTextNode(textNode, rootElement, maximumHeight, ellipsisCharacter, text)) {
      return true;
    } else {
      return false;
    }
  }
}

