import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'app';
  test = true;
  testContent = `Lorem Ipsum is simply dummy text of the printing and typesetting industry.
    Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,
    when an unknown printer took a galley of type and scrambled it to make a type specimen book.
    It has survived not only five centuries,
    but also the leap into electronic typesetting,
    remaining essentially unchanged.
    It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages,
    and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.`;


  ngOnInit() {
    setTimeout(() => {
      this.testContent = `ised in the 1960s with the relised in the 1960s with the relised in the 1960s with the rel
      ised in the 1960s with the relised in the 1960s with the relised in the 1960s with the relised in the 1960s with the rel
      ised in the 1960s with the relised in the 1960s with the relised in the 1960s with the relised in the 1960s with the rel
      ised in the 1960s with the relised in the 1960s with the relised in the 1960s with the relised in the 1960s with the rel
      ised in the 1960s with the relised in the 1960s with the relised in the 1960s with the relised in the 1960s with the rel
      `;
      this.test = false;
    }, 1000);

    setTimeout(() => {
      this.test = true;
      this.testContent = 'asda';
    }, 2000);
  }
}
