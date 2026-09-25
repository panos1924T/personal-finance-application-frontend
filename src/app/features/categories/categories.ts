import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import {
  Category,
  CategoryUpdate
} from '../../models/category';

import { CategoryService } from '../../core/services/category';
import { CategoryForm } from './category-form/category-form';

@Component({
  selector: 'app-categories',
  imports: [CategoryForm, FormsModule],
  templateUrl: './categories.html',
  styleUrl: './categories.css'
})
export class Categories implements OnInit {

  categories = signal<Category[]>([]);

  editingCategoryUuid: string | null = null;
  editName = '';

  readonly categoryTypes: Category['type'][] = [
    'EXPENSE',
    'INCOME',
    'TRANSFER'
  ];

  constructor(
    private categoryService: CategoryService
  ) {}

  ngOnInit(): void {
    this.categoryService.getCategories().subscribe({
      next: response => {
        this.categories.set(response.content);
      },
      error: error => {
        console.error('Failed to load categories', error);
      }
    });
  }

  onCategoryCreated(category: Category): void {
    this.categories.update(categories => [
      ...categories,
      category
    ]);
  }

  startEdit(category: Category): void {
    this.editingCategoryUuid = category.uuid;
    this.editName = category.name;
  }

  cancelEdit(): void {
    this.editingCategoryUuid = null;
    this.editName = '';
  }

  saveEdit(category: Category): void {
    const updatedCategory: CategoryUpdate = {
      name: this.editName
    };

    this.categoryService
      .updateCategory(category.uuid, updatedCategory)
      .subscribe({
        next: updated => {
          this.categories.update(categories =>
            categories.map(existing =>
              existing.uuid === updated.uuid
                ? updated
                : existing
            )
          );

          this.editingCategoryUuid = null;
          this.editName = '';
        },
        error: error => {
          console.error('Failed to update category', error);
        }
      });
  }

  onDeleteCategory(uuid: string): void {
    this.categoryService.deleteCategory(uuid).subscribe({
      next: () => {
        this.categories.update(categories =>
          categories.filter(
            category => category.uuid !== uuid
          )
        );
      },
      error: error => {
        console.error('Failed to delete category', error);
      }
    });
  }

  getRootCategoriesByType(
      type: Category['type']
    ): Category[] {
      return this.categories().filter(
        category =>
          category.parentUuid === null &&
          category.type === type
      );
    }

  getChildren(parentUuid: string): Category[] {
    return this.categories().filter(
      category => category.parentUuid === parentUuid
    );
  }
}