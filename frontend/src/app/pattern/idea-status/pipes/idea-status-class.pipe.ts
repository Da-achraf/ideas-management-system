import { Pipe, PipeTransform } from '@angular/core';
import {
  IdeaStatus,
  IdeaStatusType,
} from '@core/idea/models/idea-status.model';

@Pipe({
  name: 'ideaStatusClasses',
})
export class IdeaStatusClassPipe implements PipeTransform {
  transform(value: IdeaStatusType | undefined): string {
    switch (value) {
      case IdeaStatus.SUBMITTED:
        return 'bg-blue-100 text-blue-800 shadow-blue-600';
      case IdeaStatus.UNDER_REVIEW:
        return 'bg-orange-100 text-orange-800 shadow-orange-600';
      case IdeaStatus.APPROVED:
        return 'bg-green-100 text-green-800 shadow-green-600';
      case IdeaStatus.REJECTED:
        return 'bg-red-100 text-red-800 shadow-red-600';
      case IdeaStatus.IMPLEMENTED:
        return 'bg-lime-100 text-lime-800 shadow-lime-600';
      default:
        return 'bg-gray-100 text-gray-800 shadow-gray-600'; // Fallback class for unknown statuses
    }
  }
}
