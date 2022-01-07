import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { NgxLineClampDirective } from './ngx-line-clamp.directive';

@NgModule({
  imports: [CommonModule],
  exports: [NgxLineClampDirective],
  declarations: [NgxLineClampDirective]
})
export class NgxLineClampModule { }

