import { computed, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { LocalStorageService, withPagedEntities } from '@core/data-access';
import {
  patchState,
  signalStore,
  withComputed,
  withHooks,
  withMethods,
  withProps,
  withState,
} from '@ngrx/signals';
import { setEntity } from '@ngrx/signals/entities';
import { withAuth } from '../../../core/auth/data-access/auth.store';
import {
  Idea,
  IdeaCreate,
  IdeaUpdate,
} from '../../../core/idea/models/idea.model';
import { AttachementService } from '../../../pattern/attachment-upload/services/attachment.service';
import { DeleteDialogComponent } from '../../../pattern/dialogs/delete-dialog.component';
import { IdeaService } from './idea.service';

const IDEAS_FILTER_TOKEN = 'e-sugeestion-ideas-filter';

export const IdeaStore = signalStore(
  /**
   * This will add the basic CRUD opeartions out of
   * the box to our store with pagination already
   * implemented for read operation!
   */
  withPagedEntities<Idea, IdeaCreate, IdeaUpdate>(IdeaService),

  withState<{ ideasFilter: string | undefined }>({ ideasFilter: undefined }),

  withAuth(),

  withProps(() => ({
    ideaService: inject(IdeaService),
    attachmentService: inject(AttachementService),
    router: inject(Router),
    dialog: inject(MatDialog),
    destroyRef: inject(DestroyRef),
    localStorage: inject(LocalStorageService),
  })),

  withComputed(({ entities, user, loadingStates }) => ({
    ideasCount: computed(() => entities().length),
    _userId: computed(() => user.id()),

    isUpdating: computed(() => loadingStates()['update'] || false),
  })),

  /**
   * Users permissions on ideas.
   *
   */
  withComputed(({}) => ({
    withIdeaCreate: computed(() => true),
    withIdeaViewDetail: computed(() => true),
    withIdeaEdit: computed(() => true),
    withIdeaDelete: computed(() => true),
    withIdeaExport: computed(() => false),
  })),

  withMethods(({ localStorage }) => ({
    _saveFilterToLocalStorage: (filter: string) => {
      localStorage.saveItem(IDEAS_FILTER_TOKEN, filter);
    },
  })),

  withMethods(
    ({
      ideaService,
      attachmentService,
      setQueryParams,
      router,
      dialog,
      startLoading,
      deleteOne,
      destroyRef,
      stopLoading,
      _showSuccess,
      _showError,
      _saveFilterToLocalStorage,
      _userId,
      ...store
    }) => ({
      createIdea: async (ideaBody: Omit<IdeaCreate, 'submitterId'>) => {
        startLoading('save');
        try {
          const createIdeaResponse = await ideaService.createIdea({
            ...ideaBody,
            submitterId: _userId(),
          });

          let createdIdea = createIdeaResponse as Idea;
          if (!createdIdea.id) throw new Error('Idea ID is invalid.');

          patchState(store, setEntity(createdIdea));
          _showSuccess('Idea created successfully.');
        } catch (err: any) {
          _showError('Failed to create idea');
          throw Error(err);
        } finally {
          stopLoading('save');
        }
      },

      updateIdea: async (ideaBody: Partial<IdeaUpdate>, files: File[]) => {
        startLoading('update');
        try {
          const updatedIdeaResponse = await ideaService.updateIdea({
            ...ideaBody,
          });
          let updatedIdea = updatedIdeaResponse.data as Idea;

          patchState(store, setEntity(updatedIdea as Idea));
          _showSuccess('Updated successfully.');
        } catch (err) {
          _showError();
        } finally {
          stopLoading('update');
        }
      },

      showDeleteIdeaDialog: (id: string) => {
        dialog
          .open(DeleteDialogComponent, {
            data: { label: 'idea' },
            minWidth: '40vw',
            maxHeight: '95vh',
          })
          .afterClosed()
          .pipe(takeUntilDestroyed(destroyRef))
          .subscribe({
            next: (res) => {
              if (res && res?.type === 'delete') deleteOne(id);
            },
          });
      },

      setIdeasFilter: (f: string) => {
        if (f === 'all') {
          setQueryParams({
            submitter__id__eq: undefined,
            submitter__id__ne: undefined,
          });
        } else if (f === 'only_yours') {
          setQueryParams({
            submitter__id__eq: _userId(),
            submitter__id__ne: undefined,
          });
        } else if (f === 'only_others') {
          setQueryParams({
            submitter__id__ne: _userId(),
            submitter__id__eq: undefined,
          });
        }

        _saveFilterToLocalStorage(f);
        patchState(store, { ideasFilter: f });
      },
    })
  ),

  withHooks(({ localStorage, setIdeasFilter }) => ({
    onInit: () => {
      const savedFilter = localStorage.getItem(IDEAS_FILTER_TOKEN);
      if (savedFilter) setIdeasFilter(savedFilter);
    },
  }))
);

export type IdeaStoreType = InstanceType<typeof IdeaStore>;
