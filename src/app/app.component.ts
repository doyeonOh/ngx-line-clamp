import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'app';

  ipsumText = `Lorem Ipsum is simply dummy text of the printing and typesetting industry.
    Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,
    when an unknown printer took a galley of type and scrambled it to make a type specimen book.
    It has survived not only five centuries,
    but also the leap into electronic typesetting,
    remaining essentially unchanged.
    It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages,
    and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.`;


  ex1 = `<div class="line-clamp">
  <div ngxLineClamp class="text-area" [text]="ipsumText"></div>
</div>`;

  ex2 = `<div ngxLineClamp class="text-area" [text]="ipsumText" [lineCount]="3"></div>`;

  ex3 = `<div class="line-clamp-border-box">
  <div ngxLineClamp class="text-area" [text]="ipsumText" >
  </div>
</div>`;

  ex4 = `<div class="line-clamp-content-box">
  <div ngxLineClamp class="text-area"  [text]="ipsumText" >
  </div>
</div>`;

  ex5 = `<div class="line-clamp-padding-box">
  <div ngxLineClamp class="text-area"  [text]="ipsumText" >
  </div>
</div>`;

  ex6 = `<div #custom class="custom">
  <div class="custom-box">
    custom-box area
  </div>
  <div class="text-box">
    <div>
      text-box-top-area
    </div>
    <div class="line-clamp-custom-parent" >
      <div ngxLineClamp class="text-area" [text]="ipsumText" [parentElement]="custom">
      </div>
    </div>
  </div>
</div>`;

  ngOnInit() {
  }

  public onTextTruncated(e: any) {
    console.log('trunated');
  }
}
