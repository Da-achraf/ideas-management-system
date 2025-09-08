import { Pipe, PipeTransform } from '@angular/core';
import {
  IdeaStatus,
  IdeaStatusType,
} from '@core/idea/models/idea-status.model';

@Pipe({
  name: 'ideaStatusIcon',
})
export class IdeaStatusIconPipe implements PipeTransform {
  transform(status: IdeaStatusType | undefined): string {
    switch (status) {
      case IdeaStatus.SUBMITTED:
        return 'fa-paper-plane';
      case IdeaStatus.UNDER_REVIEW:
        return 'fa-magnifying-glass';
      case IdeaStatus.APPROVED:
        return 'fa-circle-check';
      case IdeaStatus.REJECTED:
        return 'fa-circle-xmark';
      case IdeaStatus.IMPLEMENTED:
        return 'fa-check-double';
      default:
        return 'fa-question-circle';
    }
  }
}
