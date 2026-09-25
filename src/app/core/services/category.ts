import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  Category,
  CategoryCreate,
  CategoryUpdate
} from '../../models/category';

interface CategoryPage {
  content: Category[];
}

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private readonly apiUrl =
    'http://localhost:8080/api/v1/categories';

  constructor(private http: HttpClient) {}

  getCategories(): Observable<CategoryPage> {
    return this.http.get<CategoryPage>(this.apiUrl);
  }

  createCategory(category: CategoryCreate): Observable<Category> {
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

  deleteCategory(uuid: string): Observable<void> {
    return this.http.delete<void>(
      `${this.apiUrl}/${uuid}`
    );
  }
}