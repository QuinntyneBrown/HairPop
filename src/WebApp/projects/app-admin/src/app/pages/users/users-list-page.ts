import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

interface User {
  id: string;
  email: string;
  displayName: string;
  phone: string;
  location: string;
  updatedAt: string;
}

@Component({
  selector: 'hpa-users-list-page',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './users-list-page.html',
  styleUrl: './users-list-page.scss'
})
export class UsersListPage {
  protected readonly users = signal<User[]>([
    { id: '1', email: 'alex@example.com', displayName: 'Alex', phone: '(555) 010-1234', location: 'Brooklyn, NY', updatedAt: '1h ago' },
    { id: '2', email: 'mia@example.com', displayName: 'Mia', phone: '(555) 010-7788', location: 'Charlotte, NC', updatedAt: '3d ago' },
    { id: '3', email: 'jayla@example.com', displayName: 'Jayla', phone: '(555) 020-4455', location: 'Atlanta, GA', updatedAt: '5d ago' },
    { id: '4', email: 'destiny@example.com', displayName: 'Destiny', phone: '(555) 030-6677', location: 'Houston, TX', updatedAt: '1w ago' }
  ]);
}
