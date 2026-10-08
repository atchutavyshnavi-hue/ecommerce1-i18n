import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { TranslatePipe } from '../../pipes/locale.pipes';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    FormsModule,
    RouterLink,
    TranslatePipe
  ],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {

  private authService = inject(AuthService);
  private router = inject(Router);

  email = '';
  password = '';

  errorMessage = '';

  login(): void {

    this.errorMessage = '';

    if (!this.email || !this.password) {

      this.errorMessage =
        'Please enter email and password.';

      return;
    }

    const result = this.authService.login(
      this.email,
      this.password
    );

    if (!result.success) {

      this.errorMessage = result.message;

      return;
    }

    const user = this.authService.currentUser();

    if (user?.role === 'admin') {
      this.router.navigate(['/admin']);
    } else {
      this.router.navigate(['/home']);
    }
  }
}