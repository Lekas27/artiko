import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth-service.service';
import { StrapiServiceService } from '../services/strapi-service.service';

@Component({
  selector: 'app-order',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css'],
})
export class OrderComponent {
  description: string = '';
  userQuery: string = ''; // Used for searching users
  selectedUser: any = null; // Stores selected user
  selectedPost: string | null = null; // Stores selected post (optional)
  posts: any[] = []; // List of posts for dropdown
  filteredUsers: any[] = []; // Filtered users based on search query
  successMessage: string = '';
  errorMessage: string = '';

  constructor(
    private strapiService: StrapiServiceService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Fetch posts (optional selection)
    this.strapiService.getPosts().subscribe(posts => {
      this.posts = posts;
    });
  }

  // Search users as the user types in the search field
  searchUsers(query: string): void {
    if (query.length > 2) {
      this.strapiService.searchUsers(query).subscribe(users => {
        this.filteredUsers = users;
      });
    } else {
      this.filteredUsers = [];
    }
  }

  // Handle user selection when a user clicks on a username from the list
  selectUser(user: any): void {
    this.selectedUser = user;
    this.userQuery = user.username; // Display the selected username in the input
    this.filteredUsers = []; // Clear the filtered list
  }

  // Create an order
  createOrder(): void {
    if (!this.description.trim()) {
      this.errorMessage = 'Please fill in the description field.';
      return;
    }
  
    // Get the current logged-in user ID
    const userId = this.authService.getCurrentUserId();
    if (!userId) {
      this.errorMessage = 'You must be logged in to create an order.';
      return;
    }
  
    // Prepare order data
    const orderData = {
      description: this.description,
      userId: this.selectedUser?.id || userId, // Use selected user or logged-in user
      postId: this.selectedPost || null, // Optional post relation
    };
  
    // Log the data being sent to the server
    console.log('Order Data:', orderData);
  
    // Create the order
    this.strapiService.createOrder(orderData).subscribe({
      next: (response) => {
        this.successMessage = 'Order created successfully!';
        this.router.navigate(['/orders']); // Redirect to orders page or home
      },
      error: (error) => {
        this.errorMessage = 'Failed to create order. Please try again.';
        console.error('Error creating order:', error);
      }
    });
  }
  
}
