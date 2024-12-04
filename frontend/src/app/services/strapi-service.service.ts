import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class StrapiServiceService {
  private apiUrl = 'http://localhost:1337/api'; // Base URL for Strapi API

  constructor(private http: HttpClient) {}

  // Fetch all posts, including images and users
  getAllPosts(): Observable<any> {
    return this.http.get(`${this.apiUrl}/posts?populate=*`); // Includes all relations
  }

  // Fetch posts by a specific user
  getUserPosts(userId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/posts?filters[user]=${userId}&populate=*`);
  }

  // Search for users based on query
  searchUsers(query: string): Observable<any[]> {
    const url = `${this.apiUrl}/users?filters[username][$containsi]=${query}`;
    return this.http.get<any[]>(url); // Case-insensitive search
  }

  // Get a user by ID
  getUserById(id: string): Observable<any> {
    const url = `${this.apiUrl}/users/${id}`;
    return this.http.get<any>(url);
  }

  // Create a post with optional image upload
  createPost(
    description: string,
    userId: string,
    image?: File,
    price?: number
  ): Observable<any> {
    const token = localStorage.getItem('jwt'); // Get the JWT token
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    if (image) {
      // If an image is provided, upload it first
      const formData = new FormData();
      formData.append('files', image);

      return new Observable((observer) => {
        this.http.post(`${this.apiUrl}/upload`, formData, { headers }).subscribe({
          next: (uploadResponse: any) => {
            const uploadedFile = uploadResponse[0];
            const data = {
              data: {
                description,
                user: userId,
                image: [uploadedFile.id], // Use the uploaded image ID
                ...(price !== undefined && { price }),
              },
            };

            this.http.post(`${this.apiUrl}/posts`, data, { headers }).subscribe({
              next: (response) => {
                observer.next(response);
                observer.complete();
              },
              error: (error) => observer.error(error),
            });
          },
          error: (error) => observer.error(error),
        });
      });
    } else {
      // No image provided
      const data = {
        data: {
          description,
          user: userId,
          ...(price !== undefined && { price }),
        },
      };

      return this.http.post(`${this.apiUrl}/posts`, data, { headers });
    }
  }

  // Create an order
  createOrder(orderData: any): Observable<any> {
    const token = localStorage.getItem('jwt'); // Ensure the user is authenticated
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  
    // Prepare order payload
    const orderPayload = {
      data: {
        description: orderData.description, // Order description
        user: orderData.userId,             // User relation (userId)
        post: orderData.postId || null,      // Post relation (optional)
      },
    };
  
    // Log the payload to see the format
    console.log("Order Payload: ", orderPayload);
  
    return this.http.post(`${this.apiUrl}/orders`, orderPayload, { headers });
  }
  

  // Fetch posts to populate the dropdown (if needed for non-custom orders)
  getPosts(): Observable<any> {
    return this.http.get(`${this.apiUrl}/posts?populate=*`);
  }
}
