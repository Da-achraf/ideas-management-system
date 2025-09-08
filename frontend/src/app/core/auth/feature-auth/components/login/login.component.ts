import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { TranslatePipe, TranslationService } from '@core/data-access';
import { ListErrorsComponent } from '@core/forms';
import { BaButtonComponent } from '@ui/components/button/button.component';
import { BaInputComponent } from '@ui/components/form/input.component';
import { PasswordFieldComponent } from '@ui/components/form/password-field.component';
import { LogoComponent } from '@ui/components/logo.component';
import { LanguageSwitcherComponent } from '../../../../home/language-switcher.component';
import { AuthStore } from '../../../data-access/auth.store';

@Component({
  selector: 'ba-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterLink,
    ReactiveFormsModule,
    ListErrorsComponent,
    BaButtonComponent,
    BaInputComponent,
    PasswordFieldComponent,
    TranslatePipe,
    LogoComponent,
    LanguageSwitcherComponent,
  ],
})
export class LoginComponent {
  protected readonly store = inject(AuthStore);
  protected translationService = inject(TranslationService);

  form = inject(FormBuilder).nonNullable.group({
    email: ['', [Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
  });

  ngOnInit() {}

  onSubmit() {
    if (!this.form.valid) return;

    this.store.login(this.form.getRawValue());
  }
}
