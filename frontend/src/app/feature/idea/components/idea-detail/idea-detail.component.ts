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
import { Idea } from '@core/idea/models/idea.model';
import { DeleteDialogComponent } from '@pattern/dialogs/delete-dialog.component';
import { BaButtonComponent } from '@ui/components/button/button.component';
import { ContentDisplayComponent } from '@ui/components/content-display.component';
import { LoadingComponent } from '@ui/components/loading/loading.component';
import { EditorModule } from 'primeng/editor';
import { SelectModule } from 'primeng/select';
import { lastValueFrom } from 'rxjs';
import { IdeaService } from '../../services/idea.service';
import { IdeaStore } from '../../services/idea.store';
import { CategoryNamePipe } from '../../utils/category-name.pipe';

@Component({
  selector: 'ba-idea-detail',
  templateUrl: './idea-detail.component.html',
  styleUrl: './idea-detail.component.scss',
  imports: [
    BaButtonComponent,
    ReactiveFormsModule,
    LoadingComponent,
    SelectModule,
    EditorModule,
    MatDividerModule,
    ContentDisplayComponent,
    TranslatePipe,
    CategoryNamePipe,
  ],
})
export class IdeaDetailComponent {
  id = input<string>();

  protected readonly store = inject(IdeaStore);

  private readonly fb = inject(FormBuilder);
  private readonly ideaService = inject(IdeaService);
  private readonly router = inject(Router);
  private readonly dialog = inject(MatDialog);
  private readonly destroyRef = inject(DestroyRef);
  protected readonly translationService = inject(TranslationService);

  protected readonly idea = signal<Idea | null>(null);

  form = this.fb.nonNullable.group({
    title: ['', Validators.required],
    description: ['', Validators.required],
    category: [0, [Validators.required]],
  });

  private async loadIdea() {
    const id = this.id();
    if (!id) return;

    const response = await lastValueFrom(this.ideaService.loadOne(id));
    if (response) {
      this.idea.set(response as Idea);
    }
  }

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

  private readonly initializeEffect = effect(() => {
    const idea = this.idea();
    if (idea) {
      this.patchForm(idea);
    }
  });

  private patchForm(idea: Idea) {
    this.form.patchValue({
      title: idea.title,
      description: idea.description,
      category: idea.category,
    });
  }

  edit(id: string) {
    this.router.navigateByUrl(`/app/ideas/${id}/edit`);
  }

  review(id: number | undefined) {
    if (!id) return;
    this.router.navigateByUrl(`/app/ideas/${id}/review`);
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
