import { Pipe } from '@angular/core';

// tslint:disable-next-line:use-pipe-transform-interface
@Pipe({
  standalone: false,
    name: 'limitTo'
})
export class TruncatePipe {
    transform(value: string, args: string | number): string {
        if (!value)
            return '';
        const limit = args ? parseInt(args as string, 10) : 100;
        const trail = '...';
        return value.length > limit ? value.substring(0, limit) + trail : value;
    }
}
