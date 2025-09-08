import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@core/data-access';
import { ListErrorsComponent } from '@core/forms';
import { BaButtonComponent } from '@ui/components/button/button.component';
import { LogoComponent } from '@ui/components/logo.component';
import { SelectModule } from 'primeng/select';
import { BaInputComponent } from '../../../../../ui/components/form/input.component';
import { LanguageSwitcherComponent } from '../../../../home/language-switcher.component';
import { AuthStore } from '../../../data-access/auth.store';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterLink,
    ReactiveFormsModule,
    ListErrorsComponent,
    BaInputComponent,
    BaButtonComponent,
    SelectModule,
    TranslatePipe,
    LogoComponent,
    LanguageSwitcherComponent,
  ],
})
export class RegisterComponent {
  protected readonly store = inject(AuthStore);

  readonly form = inject(FormBuilder).nonNullable.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    email: ['', [Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
  });

  onSubmit() {
    this.store.register(this.form.getRawValue());
  }
}
