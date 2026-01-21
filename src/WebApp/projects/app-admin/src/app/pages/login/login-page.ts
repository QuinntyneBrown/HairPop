import { Component, signal } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'hpa-login-page',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login-page.html',
  styleUrl: './login-page.scss'
})
export class LoginPage {
  protected email = signal('');
  protected password = signal('');
  protected rememberMe = signal(true);
  protected showPassword = signal(false);
  protected isLoading = signal(false);

  constructor(private router: Router) {}

  protected togglePassword(): void {
    this.showPassword.update(v => !v);
  }

  protected toggleRememberMe(): void {
    this.rememberMe.update(v => !v);
  }

  protected onSubmit(event: Event): void {
    event.preventDefault();
    this.isLoading.set(true);

    // Simulate login - in real app, call auth service
    setTimeout(() => {
      this.isLoading.set(false);
      this.router.navigate(['/dashboard']);
    }, 500);
  }

  protected socialLogin(provider: string): void {
    console.log(`Social login with ${provider}`);
    // In real app, initiate OAuth flow
  }
}
