import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService } from '../../core/auth/auth.service';

@Component({
  selector: 'hpa-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  email = '';
  password = '';
  mfaCode = '';
  hidePassword = signal(true);
  rememberMe = signal(false);

  // Stars array for background effect
  stars = Array(15).fill(0);

  readonly isLoading = this.authService.isLoading;
  readonly error = this.authService.error;
  readonly requiresMfa = this.authService.requiresMfa;

  onSubmit(): void {
    if (this.requiresMfa()) {
      this.verifyMfa();
    } else {
      this.login();
    }
  }

  private login(): void {
    if (!this.email || !this.password) {
      return;
    }

    this.authService.login({ email: this.email, password: this.password }).subscribe({
      next: (response) => {
        if (!response.requiresMfa && response.accessToken) {
          const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
          this.router.navigateByUrl(returnUrl);
        }
      },
      error: () => {}
    });
  }

  private verifyMfa(): void {
    if (!this.mfaCode) {
      return;
    }

    const userId = this.authService.user()?.userId;
    if (!userId) {
      return;
    }

    this.authService.verifyMfa({ userId, code: this.mfaCode }).subscribe({
      next: () => {
        const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
        this.router.navigateByUrl(returnUrl);
      },
      error: () => {}
    });
  }

  togglePasswordVisibility(): void {
    this.hidePassword.update(v => !v);
  }

  toggleRememberMe(): void {
    this.rememberMe.update(v => !v);
  }

  clearError(): void {
    this.authService.clearError();
  }
}
