import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { AuthStore } from '../auth.store';
import { ToasterService } from '../../../toast/toaster.service';
import { waitForAuthInit } from '../../../guards/guard.util';

/**
 * A guard to protect routes that require authentication.
 * This guard ensures that only authenticated users can access certain routes.
 * If the user is not logged in, they will be redirected to the login page
 * and shown a warning message.
 *
 * @returns {boolean}
 * - `true`: If the user is authenticated, allowing access to the route.
 * - `false`: If the user is not authenticated, blocking access and redirecting to the login page.
 */
export const AuthGuard: CanActivateFn = async (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
) => {
  // Inject all dependencies at the top level, synchronously
  const authStore = inject(AuthStore);
  const router = inject(Router);
  const toaster = inject(ToasterService);

  // Wait for auth initialization
  await waitForAuthInit(authStore.initialized);

  // Check if the user is logged in
  const isLoggedIn = authStore.loggedIn();

  // Allow access to the route if user is authenticated
  if (isLoggedIn) {
    return true;
  }

  // Show warning and redirect if not authenticated
  toaster.showWarning('Please Login First');

  // Redirect to login page with the original visited url as query param
  router.navigate(['/login'], {
    queryParams: { returnUrl: state.url },
  });

  // Block access to the route
  return false;
};
