import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Header, Footer } from '../../components';

interface PriceRange {
  service: string;
  range: string;
}

interface Braider {
  id: number;
  name: string;
  location: string;
  fullLocation: string;
  distance: number;
  rating: number;
  reviewCount: number;
  specialties: string[];
  imageUrl: string;
  aboutParagraphs: string[];
  experience: string;
  mobile: string;
  availability: string;
  clients: string;
  yearsExperience: string;
  priceRange: PriceRange[];
}

interface Review {
  id: number;
  name: string;
  date: string;
  rating: number;
  text: string;
}

@Component({
  selector: 'hp-braider-page',
  standalone: true,
  imports: [Header, Footer],
  templateUrl: './braider-page.html',
  styleUrl: './braider-page.scss'
})
export class BraiderPage implements OnInit {
  braider: Braider = {
    id: 1,
    name: 'Jasmine Williams',
    location: 'Toronto, ON',
    fullLocation: 'Toronto, ON M5H 2N2',
    distance: 2.3,
    rating: 5.0,
    reviewCount: 128,
    specialties: ['Box Braids', 'Cornrows', 'Twists', 'Knotless Braids', 'Feed-in Braids'],
    imageUrl: 'braiders/braider-1.jpg',
    aboutParagraphs: [
      "Hello! I'm Jasmine, a passionate hair braiding specialist with over 10 years of experience creating beautiful, protective styles. I believe that braids are not just a hairstyle - they're an art form and a celebration of our culture and heritage.",
      "My mission is to provide high-quality braiding services while maintaining the health and integrity of your natural hair. I take pride in my attention to detail, neat partings, and ensuring that every client leaves my chair feeling confident and beautiful. Whether you're looking for classic box braids, trendy knotless braids, or intricate cornrow designs, I've got you covered!",
      "I use only premium braiding hair and products, and I'm committed to creating a comfortable, welcoming environment for all my clients. Book your appointment today and let's create something beautiful together!"
    ],
    experience: '10+ years',
    mobile: 'Available',
    availability: 'Mon-Sat, 9am-7pm',
    clients: '500+',
    yearsExperience: '10+',
    priceRange: [
      { service: 'Box Braids', range: '$150 - $250' },
      { service: 'Knotless', range: '$200 - $300' },
      { service: 'Cornrows', range: '$80 - $150' },
      { service: 'Twists', range: '$120 - $200' }
    ]
  };

  portfolioItems = ['&#x1F487;&#x1F3FE;&#x200D;&#x2640;&#xFE0F;', '&#x2728;', '&#x1F4AB;', '&#x1F3A8;', '&#x1F478;&#x1F3FE;', '&#x1F496;'];

  reviews: Review[] = [
    {
      id: 1,
      name: 'Sarah Thompson',
      date: '2 weeks ago',
      rating: 5,
      text: "Jasmine is absolutely amazing! Her box braids are the neatest I've ever had. She's professional, punctual, and her space is clean and comfortable. The braids lasted 8 weeks and still looked great. I'll definitely be back!"
    },
    {
      id: 2,
      name: 'Maria Rodriguez',
      date: '1 month ago',
      rating: 5,
      text: "I've been going to Jasmine for over a year now and she never disappoints. Her knotless braids are perfect - lightweight and they don't hurt at all. She's also very personable and makes the hours fly by. Highly recommend!"
    },
    {
      id: 3,
      name: 'Destiny Walker',
      date: '2 months ago',
      rating: 5,
      text: "Best braider in Toronto! Jasmine's attention to detail is unmatched. She takes her time to make sure everything is perfect. My braids came out exactly how I wanted them. Worth every penny!"
    },
    {
      id: 4,
      name: 'Imani Johnson',
      date: '3 months ago',
      rating: 5,
      text: 'Jasmine is a true professional. She gave me great advice on how to care for my braids and maintain my natural hair health. The results were stunning and I received so many compliments. Thank you, Jasmine!'
    }
  ];

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const braiderId = params['id'];
      // Would load braider data from API based on ID
    });
  }
}
