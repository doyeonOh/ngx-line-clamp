# NgxLineClamp

angular 6+ simple line clamp. inspired by [line-clamp](https://github.com/yuanqing/line-clamp).
working fine on responsive UI. [example](https://ngx-line-clamp.firebaseapp.com/)


## Install
```
npm install --save ngx-line-clamp
```

## Import
```typesript
import { NgxLineClampModule } from 'ngx-line-clamp';

@NgModule({
  ...
  imports: [
    ...,
    NgxLineClampModule
  ]
})
```
## Usage
```html
<div ngxLineClamp class="text-area" [text]="text">
</div>
```

## input
| option | description |
| ----------- | ---------- |
| text | (required) Text to use in line clamp div.  |
| lineCount | (option) Maximum number of lines  |
| parentElement | (option) A parent element with a maximum size that can extend the line clamp. (default: ngxLineClamp wrapper) |
| ellipsis| (option) Abbreviation display character. (default: ...) |

## output
| | |
| ----------- | ---------- |
| textTruncated | called when text was truncated | 

## License
MIT
