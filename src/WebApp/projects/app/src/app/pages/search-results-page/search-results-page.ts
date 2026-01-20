import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Header, Footer } from '../../components';

interface Braider {
  id: number;
  name: string;
  location: string;
  distance: number;
  rating: number;
  reviewCount: number;
  specialties: string[];
  imageUrl: string;
}

@Component({
  selector: 'hp-search-results-page',
  standalone: true,
  imports: [Header, Footer, FormsModule],
  templateUrl: './search-results-page.html',
  styleUrl: './search-results-page.scss'
})
export class SearchResultsPage implements OnInit {
  searchQuery = '';
  selectedDistance = '5';

  braiders: Braider[] = [
    {
      id: 1,
      name: 'Jasmine Williams',
      location: 'Toronto, ON',
      distance: 2.3,
      rating: 5,
      reviewCount: 128,
      specialties: ['Box Braids', 'Cornrows', 'Twists'],
      imageUrl: 'braiders/braider-1.jpg'
    },
    {
      id: 2,
      name: 'Amara Johnson',
      location: 'Toronto, ON',
      distance: 3.1,
      rating: 5,
      reviewCount: 95,
      specialties: ['Box Braids', 'Knotless Braids'],
      imageUrl: 'braiders/braider-2.jpg'
    },
    {
      id: 3,
      name: 'Keisha Brown',
      location: 'Toronto, ON',
      distance: 4.5,
      rating: 5,
      reviewCount: 142,
      specialties: ['Box Braids', 'Senegalese Twists', 'Crochet'],
      imageUrl: 'braiders/braider-3.jpg'
    },
    {
      id: 4,
      name: 'Nia Davis',
      location: 'Toronto, ON',
      distance: 4.8,
      rating: 5,
      reviewCount: 87,
      specialties: ['Box Braids', 'Goddess Braids'],
      imageUrl: 'braiders/braider-4.jpg'
    },
    {
      id: 5,
      name: 'Zara Thompson',
      location: 'Toronto, ON',
      distance: 5.2,
      rating: 5,
      reviewCount: 156,
      specialties: ['Box Braids', 'Cornrows', 'Feed-in Braids'],
      imageUrl: 'braiders/braider-5.jpg'
    },
    {
      id: 6,
      name: 'Maya Anderson',
      location: 'Toronto, ON',
      distance: 5.9,
      rating: 5,
      reviewCount: 103,
      specialties: ['Box Braids', 'Marley Twists'],
      imageUrl: 'braiders/braider-6.jpg'
    }
  ];

  filteredBraiders: Braider[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.searchQuery = params['q'] || '';
      this.filterBraiders();
    });
  }

  onSearch(): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { q: this.searchQuery },
      queryParamsHandling: 'merge'
    });
    this.filterBraiders();
  }

  filterBraiders(): void {
    this.filteredBraiders = this.braiders;
  }

  viewBraider(id: number): void {
    this.router.navigate(['/braider', id]);
  }
}
