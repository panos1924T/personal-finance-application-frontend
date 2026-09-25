import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Category, CategoryCreate } from '../../../models/category';
import { CategoryService } from '../../../core/services/category';

@Component({
  selector: 'app-category-form',
  imports: [ReactiveFormsModule],
  templateUrl: './category-form.html',
  styleUrl: './category-form.css'
})
export class CategoryForm {

  @Input() categories: Category[] = [];

  @Output() categoryCreated = new EventEmitter<Category>();

  categoryForm;

  constructor(
    private fb: FormBuilder,
    private categoryService: CategoryService
  ) {
    this.categoryForm = this.fb.nonNullable.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      type: [
        'EXPENSE' as CategoryCreate['type'],
        Validators.required
      ],
      parentUuid: ['']
    });
  }

  onSubmit(): void {
    if (this.categoryForm.invalid) {
      return;
    }

    const formValue = this.categoryForm.getRawValue();

    const category: CategoryCreate = {
      name: formValue.name,
      type: formValue.type,
      parentUuid: formValue.parentUuid || null
    };

    this.categoryService
      .createCategory(category)
      .subscribe({
        next: created => {
          this.categoryCreated.emit(created);

          this.categoryForm.reset({
            name: '',
            type: 'EXPENSE',
            parentUuid: ''
          });
        },
        error: error => {
          console.error('Failed to create category', error);
        }
      });
  }

  getParentCategories(): Category[] {
  const selectedType = this.categoryForm.controls.type.value;

  return this.categories.filter(
    category =>
      category.group &&
      category.type === selectedType
  );
}
}