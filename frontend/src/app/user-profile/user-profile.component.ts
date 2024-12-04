import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { StrapiServiceService } from '../services/strapi-service.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.css'
})
export class UserProfileComponent {
  user: any;
  posts: any[] = []; // Originalni postovi
  filteredPosts: any[] = []; // Filtrirani postovi
  errorMessage: string = '';

  constructor(
    private route: ActivatedRoute,
    private strapiService: StrapiServiceService
  ) {}

  ngOnInit(): void {
    // Subscribe to route parameters to get the userId
    this.route.params.subscribe((params) => {
      const userId = params['id'];
      if (userId) {
        this.loadUser(userId);
        this.loadPosts(); // Učitaj postove kada se komponenta inicijalizuje
      }
    });
  }

  // Load user data by userId
  loadUser(userId: string): void {
    this.strapiService.getUserById(userId).subscribe(
      (user: any) => {
        this.user = user;
        this.filterPosts(); // Filter posts once the user data is loaded
      },
      (error) => {
        this.errorMessage = 'Error fetching user information.';
        console.error('Error fetching user:', error);
      }
    );
  }

  // Load all posts
  loadPosts(): void {
    this.strapiService.getAllPosts().subscribe(
      (data: any) => {
        console.log(data); // Proveri da li ispravno dolaze podaci
        this.posts = data.data;
        this.filterPosts(); // Filter posts after fetching all posts
      },
      (error) => {
        this.errorMessage = 'Error fetching posts.';
        console.error('Error fetching posts:', error);
      }
    );
  }

  // Filter posts based on the current user's username
  filterPosts(): void {
    if (this.user && this.user.username) {
      const username = this.user.username.toLowerCase();
      this.filteredPosts = this.posts.filter(
        (post) => post.user.username.toLowerCase() === username
      );
    }
  }
}

