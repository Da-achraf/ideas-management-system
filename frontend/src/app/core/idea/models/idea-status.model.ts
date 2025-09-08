// Updated to match backend enum
export enum IdeaStatus {
  SUBMITTED = 0,
  UNDER_REVIEW = 1,
  APPROVED = 2,
  REJECTED = 3,
  IMPLEMENTED = 4,
}

export type IdeaStatusType = IdeaStatus;

export const IdeaStatusDisplay: Record<IdeaStatus, string> = {
  [IdeaStatus.SUBMITTED]: 'Submitted',
  [IdeaStatus.UNDER_REVIEW]: 'Under Review',
  [IdeaStatus.APPROVED]: 'Approved',
  [IdeaStatus.REJECTED]: 'Rejected',
  [IdeaStatus.IMPLEMENTED]: 'Implemented',
};
