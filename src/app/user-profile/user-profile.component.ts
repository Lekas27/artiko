import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { StrapiServiceService } from '../services/strapi-service.service';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.css'
})
export class UserProfileComponent {
  user: any;

  constructor(
    private route: ActivatedRoute,
    private strapiService: StrapiServiceService
  ) {}

  ngOnInit(): void {
    // Slušamo promene parametara rute
    this.route.params.subscribe((params) => {
      const userId = params['id'];
      if (userId) {
        this.loadUser(userId);
      }
    });
  }

  loadUser(userId: string): void {
    this.strapiService.getUserById(userId).subscribe(
      (user: any) => {
        this.user = user;
      },
      (error) => {
        console.error('Error fetching user:', error);
      }
    );
  }
}
