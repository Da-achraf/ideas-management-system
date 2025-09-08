type IdeaBase = {
  title: string;
  description: string;
};

type IdeaMixin = {
  createdAt: string;
  updatedAt?: string;
  submissionDate: string;
};

export type IdeaCreate = IdeaBase & {
  category: IdeaCategory;
  submitterId: string;
};

export type IdeaUpdate = IdeaBase & {
  id: string;
  category: IdeaCategory;
  status: IdeaStatus;
  reviewComments?: string;
};

export type Idea = IdeaBase &
  IdeaMixin & {
    id: string;
    category: IdeaCategory;
    status: IdeaStatus;
    submitterId: string;
    submitterName: string;
    reviewComments?: string;
  };

export enum IdeaCategory {
  ProductImprovement = 0,
  ProcessOptimization = 1,
  Innovation = 2,
  CostReduction = 3,
  CustomerExperience = 4,
}

export const Categories = [
  { id: 0, label: 'Product Improvement' },
  { id: 1, label: 'Process Optimization' },
  { id: 2, label: 'Innovation' },
  { id: 3, label: 'Cost Reduction' },
  { id: 4, label: 'Customer Experience' },
];

export enum IdeaStatus {
  Submitted = 0,
  UnderReview = 1,
  Approved = 2,
  Rejected = 3,
  Implemented = 4,
}
