import { Pipe, PipeTransform } from '@angular/core';
import {
  IdeaStatusDisplay,
  IdeaStatusType,
} from '@core/idea/models/idea-status.model';

@Pipe({
  name: 'ideastatus',
})
export class IdeaStatusDisplayPipe implements PipeTransform {
  transform(value: IdeaStatusType | undefined): string {
    if (value == undefined) return 'Not Defined';
    return IdeaStatusDisplay[value] || String(value);
  }
}
