import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { NgxLineClampDirective } from 'ngx-line-clamp';

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
