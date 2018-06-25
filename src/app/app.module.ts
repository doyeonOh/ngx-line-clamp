import { NgxLineClampDirective } from './../../projects/line-clamp/src/lib/ngx-line-clamp.directive';
// import { NgxLineClampDirective } from 'line-clamp';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


import { AppComponent } from './app.component';


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
