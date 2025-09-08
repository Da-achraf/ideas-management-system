import { Component, inject, output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { BaButtonComponent } from '@ui/components/button/button.component';
import { EditorComponent } from '@ui/components/editor/editor.component';
import { TranslatePipe } from '@core/data-access';

@Component({
  selector: 'ba-add-comment',
  templateUrl: './add-comment.component.html',
  imports: [
    EditorComponent,
    ReactiveFormsModule,
    BaButtonComponent,
    TranslatePipe,
  ],
})
export class AddCommentComponent {
  body = output<string>();

  protected form = inject(FormBuilder).group({
    comment: ['', [Validators.required]],
  });

  protected onSumit() {
    const value = this.form.getRawValue().comment;
    if (value) {
      this.body.emit(value);
    }
  }
}
