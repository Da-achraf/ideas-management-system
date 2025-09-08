import { computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { API_REQUEST_DELAY, withLoading } from '@core/data-access';

import { withToasterFeature } from '@core/data-access/toaster';
import { FormErrorsStore } from '@core/forms';
import { tapResponse } from '@ngrx/operators';
import {
  patchState,
  signalStore,
  signalStoreFeature,
  withComputed,
  withHooks,
  withMethods,
  withProps,
  withState,
} from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { delay, exhaustMap, pipe, switchMap, tap } from 'rxjs';
import {
  AuthState,
  LoginUser,
  RegisterUser,
  authInitialState,
  initialUserValue,
} from './auth.model';
import { AuthService } from './services/auth.service';
import { TokenService } from './services/token.service';

// 1. Singleton AuthStore
export const AuthStore = signalStore(
  { providedIn: 'root' }, // Global singleton
  withState<AuthState>(authInitialState),
  withLoading(),
  withToasterFeature(),

  withProps(() => ({
    formErrorsStore: inject(FormErrorsStore),
    authService: inject(AuthService),
    router: inject(Router),
    tokenService: inject(TokenService),
    requestDelay: inject(API_REQUEST_DELAY),
  })),

  // User data
  withComputed(({ user }) => ({
    userFullName: computed(() => `${user.firstName()} ${user.lastName()}`),
    connectedUserId: computed(() => user.id()),
  })),

  // Loading states
  withComputed(({ loadingStates }) => ({
    isLoginIn: computed(() => loadingStates()['login'] || false),
    isRegistering: computed(() => loadingStates()['register'] || false),
  })),

  withMethods((store) => {
    const {
      formErrorsStore,
      authService,
      startLoading,
      stopLoading,
      router,
      tokenService,
      requestDelay,
      _showError,
      _showSuccess,
      ...state
    } = store;

    return {
      login: rxMethod<LoginUser>(
        pipe(
          tap(() => startLoading('login')),
          delay(requestDelay),
          exhaustMap((credentials) =>
            authService.login(credentials).pipe(
              tapResponse({
                next: (user) => {
                  console.log('rsp: ', user);
                  patchState(state, { user, loggedIn: true });
                  tokenService.setToken(user.token);
                  _showSuccess('Logged in successfully.');
                  router.navigateByUrl('/app');
                },
                error: ({ error }) => {
                  formErrorsStore.setErrors({
                    '': error?.message || 'Something went wrong',
                  });
                },
                finalize: () => stopLoading('login'),
              }),
            ),
          ),
        ),
      ),

      register: rxMethod<RegisterUser>(
        pipe(
          tap(() => startLoading('register')),
          delay(requestDelay),
          exhaustMap((newUserData) =>
            authService.register(newUserData).pipe(
              tapResponse({
                next: (user) => {
                  _showSuccess('Registered successfully.');
                  router.navigateByUrl('/login');
                },
                error: ({ error }) => {
                  formErrorsStore.setErrors({ '': error?.message });
                },
                finalize: () => stopLoading('register'),
              }),
            ),
          ),
        ),
      ),

      logout: rxMethod<void>(
        pipe(
          exhaustMap(() =>
            authService.logout().pipe(
              tapResponse({
                next: () => {
                  patchState(state, {
                    user: initialUserValue,
                    loggedIn: false,
                  });
                  tokenService.removeToken();
                  router.navigateByUrl('/login');
                },
                error: ({ error }) => formErrorsStore.setErrors(error.errors),
              }),
            ),
          ),
        ),
      ),

      getUser: rxMethod<string>(
        pipe(
          switchMap((id) =>
            authService.getUser(id).pipe(
              tapResponse({
                next: (user) => {
                  console.log('getUser: ', user);
                  patchState(state, { user, loggedIn: true });
                  tokenService.setToken(user.token);
                },
                error: () => console.error,
                finalize: () => patchState(state, { initialized: true }),
              }),
            ),
          ),
        ),
      ),
    };
  }),

  withHooks({
    onInit({ getUser, tokenService, ...store }) {
      const paylod = tokenService.getDecodedToken();
      const userId = paylod?.nameid;
      if (!userId) {
        patchState(store, { initialized: true });
        return;
      }

      getUser(userId);
    },
  }),
);

// Feature Store Bridge
export function withAuth() {
  return signalStoreFeature(
    // Inject singleton instance
    withProps(() => {
      const authStore = inject(AuthStore);
      return { authStore };
    }),

    withToasterFeature(),

    withProps(({ authStore }) => ({
      router: authStore.router,
    })),

    // Expose state
    withComputed(({ authStore }) => ({
      loggedIn: authStore.loggedIn,
      user: authStore.user,
      initialized: authStore.initialized,
    })),

    // Expose computed properties
    withComputed(({ authStore }) => ({
      userFullName: authStore.userFullName,
      connectedUserId: authStore.connectedUserId,
      loadingStates: authStore.loadingStates,
    })),

    // Expose methods
    withMethods(({ authStore }) => ({
      login: authStore.login,
      logout: authStore.logout,
      register: authStore.register,
      getUser: authStore.getUser,
      startLoading: authStore.startLoading,
      stopLoading: authStore.stopLoading,
    })),
  );
}

export type AuthStoreType = InstanceType<typeof AuthStore>;
