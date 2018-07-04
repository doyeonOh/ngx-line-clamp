import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { NgxLineClampDirective } from './../../projects/line-clamp/src/lib/ngx-line-clamp.directive';

@NgModule({
  declarations: [
    AppComponent,
    NgxLineClampDirective
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
