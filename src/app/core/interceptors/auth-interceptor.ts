import {
  HttpErrorResponse,
  HttpInterceptorFn
} from '@angular/common/http';

import { inject } from '@angular/core';
import { Router } from '@angular/router';

import {
  catchError,
  throwError
} from 'rxjs';


export const authInterceptor:
  HttpInterceptorFn =
  (req, next) => {

    const router =
      inject(Router);

    const token =
      localStorage.getItem('token');

    const request =
      token
        ? req.clone({
            setHeaders: {
              Authorization:
                `Bearer ${token}`
            }
          })
        : req;


    return next(request).pipe(

      catchError(error => {

        if (
          error instanceof
            HttpErrorResponse &&
          error.status === 401 &&
          !req.url.includes(
            '/auth/authenticate'
          )
        ) {

          localStorage.removeItem(
            'token'
          );

          void router.navigate(
            ['/login']
          );
        }

        return throwError(
          () => error
        );
      })
    );
  };