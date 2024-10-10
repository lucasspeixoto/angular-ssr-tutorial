import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';

@Injectable()
export class UserService {

  private readonly apiUrl  = 'http://localhost:3000';

  private httpClient = inject(HttpClient);

  public getUsers(): Observable<User[]> {
    return this.httpClient.get<User[]>(`${this.apiUrl}/users`);
  }

}
