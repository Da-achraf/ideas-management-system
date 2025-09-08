import { Routes } from '@angular/router';
import { AttachementService } from '@pattern/attachment-upload/services/attachment.service';
import {
  CreatePageGuard,
  EditPageGuard,
  ViewDetailPageGuard,
} from './guards/pages.guard';
import { ContentProcessingService } from './services/content-processing.service';
import { IdeaService } from './services/idea.service';
import { IdeaStore } from './services/idea.store';

export default <Routes>[
  {
    path: '',

    providers: [
      IdeaStore,
      IdeaService,
      ContentProcessingService,
      AttachementService,
    ],

    data: {
      breadcrumb: {
        label: 'Ideas',
      },
    },

    children: [
      {
        path: '',
        redirectTo: 'list',
        pathMatch: 'full',
      },

      {
        path: 'list',
        loadComponent: () =>
          import('./components/ideas-list/ideas-list.component').then(
            (m) => m.IdeasListComponent
          ),
        data: {
          breadcrumb: {
            label: 'List',
          },
        },
      },

      {
        path: 'create',
        canActivate: [CreatePageGuard],
        loadComponent: () =>
          import('./components/add-idea/add-idea.component').then(
            (m) => m.AddIdeaComponent
          ),
        data: {
          breadcrumb: {
            label: 'Create',
          },
        },
      },

      {
        path: ':id/edit',
        canActivate: [EditPageGuard],
        loadComponent: () =>
          import('./components/edit-idea/edit-idea.component').then(
            (m) => m.EditIdeaComponent
          ),
        data: {
          breadcrumb: {
            label: 'Edit',
          },
        },
      },

      {
        path: ':id/detail',
        canActivate: [ViewDetailPageGuard],
        loadComponent: () =>
          import('./components/idea-detail/idea-detail.component').then(
            (m) => m.IdeaDetailComponent
          ),
        data: {
          breadcrumb: {
            label: 'Details',
          },
        },
      },
    ],
  },
];
