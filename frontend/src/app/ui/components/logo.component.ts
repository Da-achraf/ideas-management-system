import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'ba-logo',
  template: `
    <a routerLink="/" class="flex items-center font-bold select-none text-md">
      <span [class]="type() === 'dark' ? 'text-gray-900' : 'text-white'" >
        <span class="text-primary">Idea</span>Management
      </span>
    </a>
  `,
  imports: [RouterLink],
  styles: [
    `
      :host {
        display: block;
        width: fit-content;
      }
      a {
        text-decoration: none;
      }
    `,
  ],
})
export class LogoComponent {
  height = input(50);
  width = input(180);
  type = input<'dark' | 'light'>('dark');
}
