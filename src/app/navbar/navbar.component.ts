import { Component } from '@angular/core';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { StrapiServiceService } from '../services/strapi-service.service';
import { AuthService } from '../services/auth-service.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule,CommonModule,FormsModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent {
  isLoggedIn = false;
  searchQuery: string = '';
  searchResults: any[] = []; // Rezultati pretrage
  currentUserId: string | null = null;

  constructor(private authService: AuthService, private strapiService: StrapiServiceService,private router: Router) {}

  checkLoginStatus(): void {
    this.isLoggedIn = this.authService.isLoggedIn();
    if (this.isLoggedIn) {
      this.currentUserId = this.authService.getCurrentUserId();
      console.log('Current User ID:', this.currentUserId); // Debug log
      console.log('User saved in localStorage:', JSON.parse(localStorage.getItem('user')!)); // Debug lo
    }
  }
  
  

  logout(): void {
    this.authService.logout();
    this.checkLoginStatus();
    this.router.navigate(['/login']);
  }

  ngOnInit(): void {
    this.checkLoginStatus();
  }

  // Pretraga korisnika
  searchUsers(): void {
    if (this.searchQuery.trim() === '') {
      this.searchResults = [];
      return;
    }

    this.strapiService.searchUsers(this.searchQuery).subscribe(
      (users: any) => {
        this.searchResults = users;
      },
      (error) => {
        console.error('Error fetching users:', error);
      }
    );
  }
  clearSearch(userId: string): void {
    this.searchQuery = '';
    this.searchResults = [];
    this.router.navigate(['/user', userId]);
  }
}
