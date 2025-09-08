import { TitleCasePipe } from '@angular/common';
import {
  Component,
  DestroyRef,
  effect,
  inject,
  input,
  signal,
  untracked,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { Router } from '@angular/router';
import { TranslatePipe, TranslationService } from '@core/data-access';
import { Categories, Idea, IdeaUpdate } from '@core/idea/models/idea.model';
import { DeleteDialogComponent } from '@pattern/dialogs/delete-dialog.component';
import { BaButtonComponent } from '@ui/components/button/button.component';
import { EditorComponent } from '@ui/components/editor/editor.component';
import { BaInputComponent } from '@ui/components/form/input.component';
import { LoadingComponent } from '@ui/components/loading/loading.component';
import { EditorModule } from 'primeng/editor';
import { SelectModule } from 'primeng/select';
import { lastValueFrom } from 'rxjs';
import { IdeaService } from '../../services/idea.service';
import { IdeaStore } from '../../services/idea.store';

@Component({
  selector: 'ba-edit-idea',
  templateUrl: './edit-idea.component.html',
  styleUrl: './edit-idea.component.scss',
  imports: [
    BaButtonComponent,
    ReactiveFormsModule,
    BaInputComponent,
    LoadingComponent,
    SelectModule,
    EditorModule,
    MatDividerModule,
    EditorComponent,
    TitleCasePipe,
    TranslatePipe,
  ],
})
export class EditIdeaComponent {
  id = input<string>();

  protected readonly store = inject(IdeaStore);
  private readonly ideaService = inject(IdeaService);

  private readonly dialog = inject(MatDialog);
  private readonly destroyRef = inject(DestroyRef);
  private readonly router = inject(Router);
  protected readonly translationService = inject(TranslationService);

  protected readonly idea = signal<Idea | null>(null);

  private files: File[] = [];

  protected form = inject(FormBuilder).nonNullable.group({
    title: ['', Validators.required],
    description: ['', Validators.required],
    category: [0, [Validators.required]],
  });

  protected categories = signal(Categories);

  private readonly loadIdeaEffect = effect(async () => {
    const id = this.id();
    if (!id) return;

    untracked(async () => {
      try {
        await this.loadIdea();
      } catch {
        this.router.navigate(['/app/ideas/list']);
      }
    });
  });

  private async loadIdea() {
    const id = this.id();
    if (!id) return;

    const response = await lastValueFrom(this.ideaService.loadOne(id));
    if (response) {
      this.idea.set(response as Idea);
    }
  }

  private readonly initializeIdeaFormEffect = effect(() => {
    const idea = this.idea();
    if (idea) {
      this.patchForm(idea);
    }
  });

  private patchForm(idea: Idea) {
    this.form.patchValue({
      ...idea,
    });
  }

  handleFiles(files: File[]) {
    this.files = files;
    this.form.markAsDirty();
  }

  async onSaveChanges() {
    const ideaUpdate: Partial<IdeaUpdate> = {
      ...this.form.getRawValue(),
      id: this.idea()?.id,
    };
    await this.store.updateIdea(ideaUpdate, this.files);
  }

  delete(id: string) {
    this.dialog
      .open(DeleteDialogComponent, {
        data: { label: 'idea' },
        minWidth: '40vw',
        maxHeight: '95vh',
      })
      .afterClosed()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          if (res && res?.type === 'delete') {
            this.store.deleteOne(id);
            this.router.navigateByUrl('/app/ideas');
          }
        },
      });
  }
}
