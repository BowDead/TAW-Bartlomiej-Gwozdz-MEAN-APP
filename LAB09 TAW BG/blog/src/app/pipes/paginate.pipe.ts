import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'paginate',
  standalone: true,
  pure: true
})
export class PaginatePipe implements PipeTransform {
  transform(items: any[], page: number, perPage: number): any[] {
    if (!items || !items.length) return [];

    const start = (page - 1) * perPage;
    const end = start + perPage;
    console.log(`Paginate: page=${page}, perPage=${perPage}, start=${start}, end=${end}, total=${items.length}`);
    const result = items.slice(start, end);
    console.log(`Paginate result:`, result.length, 'items');
    return result;
  }
}
