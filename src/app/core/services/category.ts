import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, switchMap, map, forkJoin, of } from 'rxjs';

import {
  Category,
  CategoryCreate,
  CategoryUpdate
} from '../../models/category';

interface CategoryPage {
  content: Category[];
  totalPages: number;
  size: number;
}

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private readonly apiUrl =
    '/api/v1/categories';
  private readonly pageSize = 100;

  constructor(
    private http: HttpClient
  ) {}

  getCategories(
    page = 0,
    size = this.pageSize
  ): Observable<CategoryPage> {
    const params = new HttpParams()
      .set('page', page)
      .set('size', size);

    return this.http.get<CategoryPage>(
      this.apiUrl,
      { params }
    );
  }

  getAllCategories(): Observable<Category[]> {
    return this.getCategories().pipe(
      switchMap(firstPage => {
        const remainingPages = Array.from(
          { length: Math.max(0, firstPage.totalPages - 1) },
          (_, index) =>
            this.getCategories(index + 1, firstPage.size)
        );

        if (remainingPages.length === 0) {
          return of(firstPage.content);
        }

        return forkJoin(remainingPages).pipe(
          map(pages => [
            ...firstPage.content,
            ...pages.flatMap(page => page.content)
          ])
        );
      })
    );
  }

  createCategory(
    category: CategoryCreate
  ): Observable<Category> {

    return this.http.post<Category>(
      this.apiUrl,
      category
    );
  }

  updateCategory(
    uuid: string,
    category: CategoryUpdate
  ): Observable<Category> {

    return this.http.put<Category>(
      `${this.apiUrl}/${uuid}`,
      category
    );
  }

  deleteCategory(
    uuid: string
  ): Observable<void> {

    return this.http.delete<void>(
      `${this.apiUrl}/${uuid}`
    );
  }
}