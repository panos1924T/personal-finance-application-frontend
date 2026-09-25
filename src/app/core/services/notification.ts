import { Injectable, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

export interface NotificationMessage {
  type: 'success' | 'error';
  text: string;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  message = signal<NotificationMessage | null>(null);

  private timeoutId:
    ReturnType<typeof setTimeout> | null = null;

  success(text: string): void {
    this.show('success', text, 3000);
  }

  error(text: string): void {
    this.show('error', text, 5000);
  }

  apiError(
    error: unknown,
    fallbackMessage: string
  ): void {

    if (!(error instanceof HttpErrorResponse)) {
      this.error(fallbackMessage);
      return;
    }

    const body = error.error;

    if (
      body?.error &&
      typeof body.error === 'object'
    ) {

      const validationMessages =
        Object.values(body.error)
          .filter(
            value =>
              typeof value === 'string'
          );

      if (validationMessages.length > 0) {
        this.error(
          validationMessages.join(' · ')
        );

        return;
      }
    }

    if (
      body?.message &&
      typeof body.message === 'string'
    ) {
      this.error(body.message);
      return;
    }

    this.error(fallbackMessage);
  }

  clear(): void {
    this.message.set(null);

    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
  }

  private show(
    type: NotificationMessage['type'],
    text: string,
    duration: number
  ): void {

    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }

    this.message.set({
      type,
      text
    });

    this.timeoutId = setTimeout(() => {
      this.message.set(null);
      this.timeoutId = null;
    }, duration);
  }
}