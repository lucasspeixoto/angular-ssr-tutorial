import { afterNextRender, Component, inject, OnInit, PLATFORM_ID, signal } from '@angular/core';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user.model';
import { isPlatformBrowser, isPlatformServer } from '@angular/common';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [],
  template: `
    @for(user of users(); track user.id) {
      <div>Name: {{ user.name }}</div>
      <div>Age: {{ user.age }}</div>
    }
  `,
  styles: ``,
  providers: [UserService]
})
export class UserComponent implements OnInit {

  public users = signal<User[]>([]);

  public userService = inject(UserService);

  public accessToken!: string;

  public platformId = inject(PLATFORM_ID);

  constructor() { 
    afterNextRender(() => {
      const stringifyedToken = JSON.stringify(localStorage.getItem('access_token'))

      this.accessToken = JSON.parse(stringifyedToken);

      console.log(this.accessToken);
    })
  }

  public ngOnInit(): void {
    this.userService.getUsers().subscribe((users) => {
      this.users.set(users);
    });
  }
}
