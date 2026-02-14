import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { CreatePostDto } from '@blog/shared';

export interface PostDialogData {
  mode: 'create' | 'edit';
  post?: CreatePostDto;
}

@Component({
  selector: 'app-post-dialog',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
  templateUrl: './post-dialog.component.html',
  styleUrl: './post-dialog.component.scss',
})
export class PostDialogComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly dialogRef = inject(MatDialogRef<PostDialogComponent>);
  readonly data = inject<PostDialogData>(MAT_DIALOG_DATA);

  form!: FormGroup;

  ngOnInit(): void {
    this.form = this.fb.group({
      topic: [this.data.post?.topic || '', [Validators.required, Validators.minLength(3)]],
      message: [this.data.post?.message || '', [Validators.required, Validators.minLength(10)]],
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    if (this.form.valid) {
      const result: CreatePostDto = {
        date: new Date().toISOString(),
        topic: this.form.value.topic,
        message: this.form.value.message,
      };
      this.dialogRef.close(result);
    }
  }
}
