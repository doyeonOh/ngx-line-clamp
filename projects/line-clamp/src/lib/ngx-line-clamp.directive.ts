import { Directive, Input, AfterViewInit, ElementRef, OnInit, HostListener } from '@angular/core';

@Directive({
  // tslint:disable-next-line:directive-selector
  selector: '[ngxLineClamp]'
})
export class NgxLineClampDirective implements OnInit, AfterViewInit {
  @Input() lineCount: number;
  @Input() options: any;

  ELLIPSIS_CHARACTER = '\u2026';
  TRAILING_WHITESPACE_AND_PUNCTUATION_REGEX = /[ .,;!?'‘’“”\-–—]+$/;

  constructor(private el: ElementRef) {
  }

  @HostListener('window:resize', ['$event'])
  scrollHandler(e: any) {
    console.log('resize', e);
  }

  ngOnInit(): void { }


  ngAfterViewInit(): void {
    const rootElement = this.el.nativeElement;

    rootElement.style.cssText += 'overflow:hidden;overflow-wrap:break-word;word-wrap:break-word';

    let lineHeight = window.getComputedStyle(rootElement).lineHeight;

    if (lineHeight === 'normal') {
      const normal = 1.51;
      lineHeight = (parseInt(window.getComputedStyle(rootElement).fontSize.split('px')[0], 10) *  normal) + '';
    }

    const maximumHeight = (this.lineCount || 1) * parseInt(lineHeight, 10);

    // Exit if text does not overflow `rootElement`.
    if (rootElement.scrollHeight <= maximumHeight) {
      return ;
    }

    this.truncateElementNode(rootElement, rootElement, maximumHeight, (this.options && this.options.ellipsis) || this.ELLIPSIS_CHARACTER);
  }

  truncateTextNode(textNode, rootElement, maximumHeight, ellipsisCharacter) {
    let lastIndexOfWhitespace;
    let remainTextContent = textNode.textContent;

    while (remainTextContent.length > 1) {
      lastIndexOfWhitespace = remainTextContent.lastIndexOf(' ');

      if (lastIndexOfWhitespace === -1) {
        break;
      }
      textNode.textContent = remainTextContent.substring(0, lastIndexOfWhitespace);
      if (rootElement.scrollHeight <= maximumHeight) {
        textNode.textContent = remainTextContent;
        break;
      }
      remainTextContent = textNode.textContent;
    }
    return this.truncateTextNodeByCharacter(
      textNode,
      rootElement,
      maximumHeight,
      ellipsisCharacter
    );
  }

  truncateTextNodeByCharacter (textNode, rootElement, maximumHeight, ellipsisCharacter) {
    let textContent = textNode.textContent;
    let length = textContent.length;

    while (length > 1) {
      // Trim off one trailing character and any trailing punctuation and whitespace.
      textContent = textContent
        .substring(0, length - 1)
        .replace(this.TRAILING_WHITESPACE_AND_PUNCTUATION_REGEX, '');
      length = textContent.length;
      textNode.textContent = textContent + ellipsisCharacter;
      if (rootElement.scrollHeight <= maximumHeight) {
        return true;
      }
    }
    return false;
  }

  truncateElementNode(element, rootElement, maximumHeight, ellipsisCharacter) {
    const childNodes = element.childNodes;
    let i = childNodes.length - 1;
    while (i > -1) {
      const childNode = childNodes[i--];
      const nodeType = childNode.nodeType;
      if (
        (nodeType === 1 && this.truncateElementNode(childNode, rootElement, maximumHeight, ellipsisCharacter)) ||
        (nodeType === 3 && this.truncateTextNode(childNode, rootElement, maximumHeight, ellipsisCharacter))
      ) {
        return true;
      }
      element.removeChild(childNode);
    }
    return false;
  }
}

