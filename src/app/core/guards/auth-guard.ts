import { inject } from '@angular/core';
import {
  CanActivateFn,
  Router
} from '@angular/router';

function isTokenExpired(
  token: string
): boolean {

  try {

    const payloadPart =
      token.split('.')[1];

    if (!payloadPart) {
      return true;
    }

    const base64 =
      payloadPart
        .replace(/-/g, '+')
        .replace(/_/g, '/');

    const padded =
      base64.padEnd(
        Math.ceil(base64.length / 4) * 4,
        '='
      );

    const payload =
      JSON.parse(
        atob(padded)
      );

    if (
      typeof payload.exp !== 'number'
    ) {
      return true;
    }

    return (
      payload.exp * 1000 <=
      Date.now()
    );

  } catch {

    return true;
  }
}


export const authGuard:
  CanActivateFn = () => {

  const router =
    inject(Router);

  const token =
    localStorage.getItem('token');

  if (
    !token ||
    isTokenExpired(token)
  ) {

    localStorage.removeItem('token');

    return router.createUrlTree(
      ['/login']
    );
  }

  return true;
};