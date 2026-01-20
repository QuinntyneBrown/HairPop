import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Header, Footer } from '../../components';

@Component({
  selector: 'hp-search-page',
  standalone: true,
  imports: [Header, Footer, FormsModule],
  templateUrl: './search-page.html',
  styleUrl: './search-page.scss'
})
export class SearchPage {
  searchQuery = '';

  constructor(private router: Router) {}

  onSearch(): void {
    if (this.searchQuery.trim()) {
      this.router.navigate(['/search-results'], {
        queryParams: { q: this.searchQuery }
      });
    }
  }

  browseBraiders(): void {
    this.router.navigate(['/braiders']);
  }
}
