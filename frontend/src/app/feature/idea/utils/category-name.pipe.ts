import { Pipe, PipeTransform } from '@angular/core';
import { Categories } from '@core/idea/models/idea.model';

@Pipe({
  name: 'categoryname',
  standalone: true,
})
export class CategoryNamePipe implements PipeTransform {
  transform(categoryId: number | null | undefined): string {
    if (categoryId === null || categoryId === undefined) {
      return '';
    }

    const category = Categories.find((c) => c.id === categoryId);
    return category ? category.label : 'Unknown';
  }
}
