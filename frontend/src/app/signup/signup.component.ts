import { Component } from '@angular/core';
import { AuthService } from '../services/auth-service.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent {
  username = '';
  email = '';
  password = '';

  constructor(private authService: AuthService,private router: Router) {}

  onSubmit() {
    this.authService.register({ username: this.username, email: this.email, password: this.password })
      .subscribe(response => {
        console.log('User registered:', response);
        this.router.navigate(['/']);
      });
  }
}
