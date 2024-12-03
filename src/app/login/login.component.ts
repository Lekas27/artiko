import { Component } from '@angular/core';
import { AuthService } from '../services/auth-service.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  credentials = { identifier: '', password: '' };
  errorMessage = '';

  constructor(private authService: AuthService, private router: Router) {}

  login(): void {
    this.authService.login(this.credentials).subscribe(
      (response: any) => {
        if (response.jwt && response.user) {
          localStorage.setItem('jwt', response.jwt);
          localStorage.setItem('user', JSON.stringify(response.user));
          console.log('User saved in localStorage:', response.user);
          console.log('Login successful!');
          this.router.navigate(['/']).then(() => {
            window.location.reload(); // Refresh the page
          });
        } else {
          console.error('Invalid response structure:', response);
        }
      },
      (error: any) => {
        this.errorMessage = 'Invalid credentials. Please try again.';
        console.error('Login error:', error);
      }
    );
  }
}
