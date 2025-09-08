import { NgClass } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslatePipe } from '@core/data-access';
import { PopoverModule } from 'primeng/popover';
import { LogoComponent } from '../../../ui/components/logo.component';
import { AuthStore } from '../../auth/data-access/auth.store';
import { LanguageSwitcherComponent } from '../../home/language-switcher.component';
import { SidebarService } from '../data-access/sidebar.service';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  imports: [
    LogoComponent,
    NgClass,
    PopoverModule,
    FormsModule,
    TranslatePipe,
    LanguageSwitcherComponent,
  ],
})
export class HeaderComponent {
  private readonly store = inject(AuthStore);
  private readonly sidebarService = inject(SidebarService);

  protected readonly sidebarOpened = this.sidebarService.sideNavOpened;

  logout() {
    this.store.logout();
  }

  toggleSidebar() {
    this.sidebarService.toggleSideNav();
  }
}
