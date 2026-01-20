import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Header, Footer } from '../../components';

interface HairStyle {
  name: string;
  description: string;
  duration: string;
  price: string;
  icon: string;
}

interface StyleSection {
  title: string;
  styles: HairStyle[];
}

@Component({
  selector: 'hp-hair-styles-page',
  standalone: true,
  imports: [Header, Footer],
  templateUrl: './hair-styles-page.html',
  styleUrl: './hair-styles-page.scss'
})
export class HairStylesPage {
  categories = ['All Styles', 'Box Braids', 'Cornrows', 'Twists', 'Locs', 'Knotless', 'Feed-in'];
  selectedCategory = 'All Styles';

  styleSections: StyleSection[] = [
    {
      title: 'Box Braids',
      styles: [
        {
          name: 'Classic Box Braids',
          description: 'Timeless protective style with medium-sized square-shaped sections. Perfect for versatility and low maintenance.',
          duration: '4-6 hours',
          price: '$150-$200',
          icon: '\u{1F487}\u{1F3FE}\u{200D}\u{2640}\u{FE0F}'
        },
        {
          name: 'Jumbo Box Braids',
          description: 'Large, bold braids that make a statement. Quicker to install and perfect for a dramatic look.',
          duration: '2-4 hours',
          price: '$120-$180',
          icon: '\u{2728}'
        },
        {
          name: 'Micro Box Braids',
          description: 'Tiny, intricate braids that offer maximum styling flexibility and can last for months with proper care.',
          duration: '8-12 hours',
          price: '$250-$350',
          icon: '\u{1F4AB}'
        },
        {
          name: 'Ombre Box Braids',
          description: 'Box braids with beautiful color gradients. Add personality with two-tone or multi-colored styles.',
          duration: '5-7 hours',
          price: '$180-$250',
          icon: '\u{1F3A8}'
        }
      ]
    },
    {
      title: 'Knotless Braids',
      styles: [
        {
          name: 'Knotless Box Braids',
          description: 'Lightweight, natural-looking braids that start with your own hair. Less tension and more comfortable.',
          duration: '6-8 hours',
          price: '$200-$280',
          icon: '\u{1F478}\u{1F3FE}'
        },
        {
          name: 'Bohemian Knotless',
          description: 'Knotless braids with curly ends left out for a free-spirited, bohemian look.',
          duration: '6-8 hours',
          price: '$220-$300',
          icon: '\u{1F496}'
        },
        {
          name: 'Goddess Knotless',
          description: 'Knotless braids with wavy or curly hair incorporated for a romantic, goddess-like appearance.',
          duration: '7-9 hours',
          price: '$230-$320',
          icon: '\u{1F31F}'
        },
        {
          name: 'Butterfly Knotless',
          description: 'Small to medium knotless braids with decorative accessories and curled ends.',
          duration: '6-8 hours',
          price: '$240-$310',
          icon: '\u{1F98B}'
        }
      ]
    },
    {
      title: 'Cornrows & Feed-ins',
      styles: [
        {
          name: 'Classic Cornrows',
          description: 'Traditional straight-back cornrows. Clean, elegant, and perfect for any occasion.',
          duration: '2-3 hours',
          price: '$80-$120',
          icon: '\u{26A1}'
        },
        {
          name: 'Feed-in Braids',
          description: 'Natural-looking cornrows with hair gradually added for a seamless, scalp-friendly finish.',
          duration: '3-5 hours',
          price: '$120-$180',
          icon: '\u{1F308}'
        },
        {
          name: 'Lemonade Braids',
          description: 'Side-swept feed-in cornrows made famous by Beyonce. Sleek and stylish.',
          duration: '4-6 hours',
          price: '$150-$220',
          icon: '\u{1F525}'
        },
        {
          name: 'Fulani Braids',
          description: 'Traditional West African style with braids, cornrows, and decorative beads or accessories.',
          duration: '4-6 hours',
          price: '$130-$200',
          icon: '\u{1F451}'
        }
      ]
    },
    {
      title: 'Twists',
      styles: [
        {
          name: 'Senegalese Twists',
          description: 'Sleek, rope-like twists created with synthetic hair. Smooth texture and elegant appearance.',
          duration: '5-7 hours',
          price: '$150-$220',
          icon: '\u{1F33A}'
        },
        {
          name: 'Marley Twists',
          description: 'Natural-looking twists with textured Marley hair for an authentic, kinky appearance.',
          duration: '4-6 hours',
          price: '$130-$200',
          icon: '\u{1F338}'
        },
        {
          name: 'Havana Twists',
          description: 'Chunky, textured twists with volume and body. Perfect for a bold, carefree look.',
          duration: '4-6 hours',
          price: '$140-$210',
          icon: '\u{1F343}'
        },
        {
          name: 'Passion Twists',
          description: 'Curly, bohemian twists with a water-wave texture. Lightweight and gorgeous.',
          duration: '5-7 hours',
          price: '$180-$250',
          icon: '\u{1F490}'
        }
      ]
    }
  ];

  constructor(private router: Router) {}

  selectCategory(category: string): void {
    this.selectedCategory = category;
  }

  findBraider(styleName: string): void {
    this.router.navigate(['/search-results'], {
      queryParams: { q: styleName }
    });
  }

  findBraiders(): void {
    this.router.navigate(['/braiders']);
  }
}
