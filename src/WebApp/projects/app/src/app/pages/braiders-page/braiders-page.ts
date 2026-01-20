import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Header, Footer } from '../../components';

interface Braider {
  id: number;
  name: string;
  location: string;
  rating: number;
  reviewCount: number;
  bio: string;
  specialties: string[];
  imageUrl: string;
}

@Component({
  selector: 'hp-braiders-page',
  standalone: true,
  imports: [Header, Footer, FormsModule],
  templateUrl: './braiders-page.html',
  styleUrl: './braiders-page.scss'
})
export class BraidersPage {
  sortBy = 'rating';
  totalBraiders = 248;

  braiders: Braider[] = [
    {
      id: 1,
      name: 'Jasmine Williams',
      location: 'Toronto, ON',
      rating: 5,
      reviewCount: 128,
      bio: 'Specializing in protective styles with 10+ years of experience. Passionate about hair health and beautiful braids.',
      specialties: ['Box Braids', 'Cornrows', 'Twists'],
      imageUrl: 'braiders/braider-1.jpg'
    },
    {
      id: 2,
      name: 'Amara Johnson',
      location: 'Toronto, ON',
      rating: 5,
      reviewCount: 95,
      bio: 'Expert in knotless braids and natural hair care. Making your hair dreams come true, one braid at a time!',
      specialties: ['Box Braids', 'Knotless Braids'],
      imageUrl: 'braiders/braider-2.jpg'
    },
    {
      id: 3,
      name: 'Keisha Brown',
      location: 'Toronto, ON',
      rating: 5,
      reviewCount: 142,
      bio: 'Licensed cosmetologist specializing in braiding techniques. Your satisfaction is my priority!',
      specialties: ['Box Braids', 'Senegalese Twists', 'Crochet'],
      imageUrl: 'braiders/braider-3.jpg'
    },
    {
      id: 4,
      name: 'Nia Davis',
      location: 'Vancouver, BC',
      rating: 5,
      reviewCount: 87,
      bio: 'Creating stunning protective styles with attention to detail. Book your appointment today!',
      specialties: ['Box Braids', 'Goddess Braids'],
      imageUrl: 'braiders/braider-4.jpg'
    },
    {
      id: 5,
      name: 'Zara Thompson',
      location: 'Montreal, QC',
      rating: 5,
      reviewCount: 156,
      bio: '15 years of experience in all braiding styles. Your hair is in good hands with me!',
      specialties: ['Box Braids', 'Cornrows', 'Feed-in Braids'],
      imageUrl: 'braiders/braider-5.jpg'
    },
    {
      id: 6,
      name: 'Maya Anderson',
      location: 'Calgary, AB',
      rating: 5,
      reviewCount: 103,
      bio: 'Passionate about creating beautiful, healthy braided styles. Let\'s make your vision a reality!',
      specialties: ['Box Braids', 'Marley Twists'],
      imageUrl: 'braiders/braider-6.jpg'
    },
    {
      id: 7,
      name: 'Aaliyah Wilson',
      location: 'Ottawa, ON',
      rating: 5,
      reviewCount: 112,
      bio: 'Certified braiding specialist with a passion for natural hair. Quality and precision guaranteed!',
      specialties: ['Knotless Braids', 'Lemonade Braids'],
      imageUrl: 'braiders/braider-8.jpg'
    },
    {
      id: 8,
      name: 'Imani Martinez',
      location: 'Edmonton, AB',
      rating: 5,
      reviewCount: 94,
      bio: 'Expert in intricate braiding patterns and protective styling. Your hair, my masterpiece!',
      specialties: ['Fulani Braids', 'Cornrows'],
      imageUrl: 'braiders/braider-1.jpg'
    },
    {
      id: 9,
      name: 'Destiny Taylor',
      location: 'Winnipeg, MB',
      rating: 5,
      reviewCount: 78,
      bio: 'Creating beautiful braids with love and care. Book now for a style you\'ll love!',
      specialties: ['Box Braids', 'Passion Twists'],
      imageUrl: 'braiders/braider-2.jpg'
    },
    {
      id: 10,
      name: 'Serena Harris',
      location: 'Quebec City, QC',
      rating: 5,
      reviewCount: 121,
      bio: '12+ years of braiding experience. Specializing in neat, long-lasting protective styles!',
      specialties: ['Box Braids', 'Havana Twists'],
      imageUrl: 'braiders/braider-3.jpg'
    },
    {
      id: 11,
      name: 'Layla Robinson',
      location: 'Hamilton, ON',
      rating: 5,
      reviewCount: 89,
      bio: 'Bringing style and elegance to every braid. Your satisfaction is my guarantee!',
      specialties: ['Jumbo Braids', 'Box Braids'],
      imageUrl: 'braiders/braider-4.jpg'
    },
    {
      id: 12,
      name: 'Ebony Clark',
      location: 'Mississauga, ON',
      rating: 5,
      reviewCount: 107,
      bio: 'Professional braider committed to excellence. Let me help you achieve your hair goals!',
      specialties: ['Knotless Braids', 'Bohemian Braids'],
      imageUrl: 'braiders/braider-5.jpg'
    }
  ];

  constructor(private router: Router) {}

  viewProfile(id: number): void {
    this.router.navigate(['/braider', id]);
  }

  loadMore(): void {
    // Would load more braiders from API
  }
}
