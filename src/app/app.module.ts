import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgxLineClampModule } from '../../projects/lib/src/lib/ngx-line-clamp.module';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    NgxLineClampModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
