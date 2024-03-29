import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  public ipsumText = `Lorem Ipsum is simply dummy text of the printing and typesetting industry.
    Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,
    when an unknown printer took a galley of type and scrambled it to make a type specimen book.
    It has survived not only five centuries,
    but also the leap into electronic typesetting,
    remaining essentially unchanged.
    It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages,
    and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.`;

  public ex1 = `
    \`\`\`html
    <div style="width: 300px;height: 250px;border: 1px solid black;">
      <div ngxLineClamp style="background: #ccc;" [text]="ipsumText"></div>
    </div>
    \`\`\``;

  public ex2 = `
    \`\`\`html
    <div style="width: 300px;height: 250px;border: 1px solid black;">
      <div ngxLineClamp style="background: #ccc;" [text]="ipsumText" [lineCount]="3"></div>
    </div>
    \`\`\``;
}
