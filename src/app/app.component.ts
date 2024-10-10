import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { UserComponent } from './components/user/user.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, UserComponent],
  template: `
    <section>
      <h1>Angular SSR</h1>
      <app-user></app-user>
    </section>
  `,
  styles: ``
})
export class AppComponent {
  
}
