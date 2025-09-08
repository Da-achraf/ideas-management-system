import { TitleCasePipe } from '@angular/common';
import { computed, inject } from '@angular/core';
import { withPagedEntities, withSimpleEntities } from '@core/data-access';
import {
  signalStore,
  withComputed,
  withMethods,
  withProps,
  withState,
} from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { NEVER, of, pipe, switchMap } from 'rxjs';
import { RegisterUser, UpdateUser, User } from '../auth.model';
import { UsersService } from './users.service';

type UsersState = {};

const intitialUsersState: UsersState = {};

export const UsersStore = signalStore(
  { providedIn: 'root' },
  withState<UsersState>(intitialUsersState),

  withPagedEntities<User, RegisterUser, UpdateUser>(UsersService),

  withSimpleEntities<User>(UsersService),

  withProps(() => ({
    titlePipe: inject(TitleCasePipe),
  })),

  withComputed(({ allEntities, titlePipe }) => ({
    formattedEntities: computed(() =>
      allEntities().map((u) => ({
        ...u,
        fullName: `${titlePipe.transform(u.firstName)} ${titlePipe.transform(
          u.lastName
        )}`,
      }))
    ),
  })),

  withMethods(() => ({
    save: rxMethod<void>(pipe(switchMap(() => of(NEVER)))),
  }))
);
