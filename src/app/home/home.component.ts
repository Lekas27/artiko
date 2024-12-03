import { Component } from '@angular/core';
import { StrapiServiceService } from '../services/strapi-service.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  posts: any[] = []; // Originalni postovi
  filteredPosts: any[] = []; // Filtrirani postovi
  searchQuery: string = ''; // Tekst za pretragu

  constructor(private strapiService: StrapiServiceService) {}

  ngOnInit(): void {
    this.loadPosts(); // Učitaj postove kada se komponenta inicijalizuje
  }

  loadPosts() {
    this.strapiService.getAllPosts().subscribe((data: any) => {
      console.log(data); // Proveri da li ispravno dolaze podaci
      this.posts = data.data;
      this.filteredPosts = this.posts; // Inicijalno filtrirani postovi su svi postovi
    });
  }

  filterPosts(): void {
    const query = this.searchQuery.toLowerCase();
    this.filteredPosts = this.posts.filter(
      (post) =>
        post.user.username.toLowerCase().includes(query) ||
        post.description.toLowerCase().includes(query)
    );
  }
}
