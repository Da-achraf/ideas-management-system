import { TitleCasePipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDividerModule } from '@angular/material/divider';
import { TranslatePipe, TranslationService } from '@core/data-access';
import { Categories, IdeaCreate } from '@core/idea/models/idea.model';
import { AttachmentUploadComponent } from '@pattern/attachment-upload/components/attachment-upload.component';
import { BaButtonComponent } from '@ui/components/button/button.component';
import { EditorComponent } from '@ui/components/editor/editor.component';
import { BaInputComponent } from '@ui/components/form/input.component';
import { LoadingComponent } from '@ui/components/loading/loading.component';
import { EditorModule } from 'primeng/editor';
import { SelectModule } from 'primeng/select';
import { IdeaStore } from '../../services/idea.store';
import { nonZeroValidator } from '../../utils/form.util';

@Component({
  selector: 'ba-add-idea',
  templateUrl: './add-idea.component.html',
  styleUrl: './add-idea.component.scss',
  imports: [
    BaButtonComponent,
    ReactiveFormsModule,
    BaInputComponent,
    LoadingComponent,
    SelectModule,
    EditorModule,
    MatDividerModule,
    AttachmentUploadComponent,
    EditorComponent,
    TitleCasePipe,
    TranslatePipe,
  ],
})
export class AddIdeaComponent {
  protected readonly store = inject(IdeaStore);
  protected readonly translationService = inject(TranslationService);

  files: File[] = [];

  form = inject(FormBuilder).nonNullable.group({
    title: ['', Validators.required],
    description: ['', Validators.required],
    category: [0, [Validators.required]],
  });

  protected categories = signal(Categories);

  resetForm() {
    this.form.reset();
    this.files = [];
  }

  handleFiles(files: File[]) {
    this.files = files;
  }

  async onSubmit() {
    const ideaCreate: Omit<IdeaCreate, 'submitterId'> = {
      ...this.form.getRawValue(),
    };

    try {
      await this.store.createIdea(ideaCreate);
      this.resetForm();
    } catch {}
  }
}
