# Search Feature - Frontend Specifications

## Overview

The Search feature enables customers to find braiders and hair styles based on various criteria including name, location, specialty, and style type. The feature includes a search page for input and a results page for displaying matches.

## Technology Stack

| Component | Technology | Version |
|-----------|------------|---------|
| Framework | Angular | 18.2.0 |
| State Management | NGRX Component Store | 18.0.2 |
| Reactive Programming | RxJS | 7.8.0 |
| Component Architecture | Standalone Components | - |
| Styling | SCSS | - |

---

## Components

### SearchPageComponent

| Property | Value |
|----------|-------|
| Selector | `hp-search-page` |
| Location | `projects/app/src/app/search-page/` |
| Type | Standalone Component |
| Purpose | Search input and filters interface |

### SearchResultsPageComponent

| Property | Value |
|----------|-------|
| Selector | `hp-search-results-page` |
| Location | `projects/app/src/app/search-results-page/` |
| Type | Standalone Component |
| Purpose | Display search results |

---

## Feature Specifications

### SPEC-SR-001: Search Input

**Description:** Provide a search input for querying braiders and styles.

#### Acceptance Criteria

| ID | Criteria | Status |
|----|----------|--------|
| AC-001 | Page shall display a prominent search input field | Pending |
| AC-002 | Search shall support text-based queries | Pending |
| AC-003 | Search shall execute on Enter key or button click | Pending |
| AC-004 | Input shall have placeholder text for guidance | Pending |
| AC-005 | Input shall support debounced live search | Pending |

#### Component Implementation

```typescript
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';

interface SearchFilters {
  query: string;
  category: string;
  priceRange: { min: number; max: number } | null;
  location: string;
}

@Component({
  selector: 'hp-search-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './search-page.component.html',
  styleUrl: './search-page.component.scss'
})
export class SearchPageComponent {
  private router = inject(Router);
  private searchSubject = new Subject<string>();

  searchQuery: string = '';
  selectedCategory: string = 'all';
  selectedLocation: string = '';

  categories = [
    'all',
    'Box Braids',
    'Knotless',
    'Cornrows',
    'Twists',
    'Locs',
    'Protective'
  ];

  popularSearches = [
    'Knotless braids',
    'Goddess locs',
    'Fulani braids',
    'Box braids',
    'Cornrows'
  ];

  constructor() {
    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(query => {
      this.performSearch(query);
    });
  }

  onSearchInput(event: Event): void {
    const query = (event.target as HTMLInputElement).value;
    this.searchSubject.next(query);
  }

  onSearch(): void {
    if (this.searchQuery.trim()) {
      this.navigateToResults();
    }
  }

  onQuickSearch(term: string): void {
    this.searchQuery = term;
    this.navigateToResults();
  }

  private performSearch(query: string): void {
    // Live search logic for suggestions
  }

  private navigateToResults(): void {
    this.router.navigate(['/search/results'], {
      queryParams: {
        q: this.searchQuery,
        category: this.selectedCategory !== 'all' ? this.selectedCategory : null,
        location: this.selectedLocation || null
      }
    });
  }
}
```

---

### SPEC-SR-002: Search Filters

**Description:** Provide filtering options to refine search results.

#### Acceptance Criteria

| ID | Criteria | Status |
|----|----------|--------|
| AC-001 | Page shall display category filter dropdown | Pending |
| AC-002 | Page shall display location/area filter | Pending |
| AC-003 | Page shall display price range filter | Pending |
| AC-004 | Filters shall update results dynamically | Pending |
| AC-005 | Filters shall be clearable | Pending |

#### Filter Options

| Filter | Type | Options |
|--------|------|---------|
| Category | Dropdown | All, Box Braids, Knotless, Cornrows, Twists, Locs, Protective |
| Location | Text Input | City, State, or ZIP |
| Price Range | Range Slider | $0 - $500+ |
| Rating | Star Selection | 1-5 stars minimum |
| Availability | Toggle | Available This Week |

---

### SPEC-SR-003: Search Results Display

**Description:** Display search results with relevant information.

#### Acceptance Criteria

| ID | Criteria | Status |
|----|----------|--------|
| AC-001 | Results shall display in a list or grid format | Pending |
| AC-002 | Each result shall show braider/style image | Pending |
| AC-003 | Each result shall show name and rating | Pending |
| AC-004 | Results shall be sortable | Pending |
| AC-005 | Page shall show result count | Pending |
| AC-006 | Page shall handle empty results gracefully | Pending |

#### Component Implementation

```typescript
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BraiderComponent } from '../braider/braider.component';

interface SearchResult {
  type: 'braider' | 'style';
  id: string;
  name: string;
  imageUrl: string;
  rating?: number;
  reviewCount?: number;
  specialty?: string;
  priceRange?: { min: number; max: number };
}

type SortOption = 'relevance' | 'rating' | 'price-low' | 'price-high';

@Component({
  selector: 'hp-search-results-page',
  standalone: true,
  imports: [CommonModule, BraiderComponent],
  templateUrl: './search-results-page.component.html',
  styleUrl: './search-results-page.component.scss'
})
export class SearchResultsPageComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private http = inject(HttpClient);

  results: SearchResult[] = [];
  totalResults: number = 0;
  loading = true;
  error: string | null = null;

  searchQuery: string = '';
  selectedCategory: string = 'all';
  sortBy: SortOption = 'relevance';
  viewMode: 'grid' | 'list' = 'grid';

  sortOptions: { value: SortOption; label: string }[] = [
    { value: 'relevance', label: 'Most Relevant' },
    { value: 'rating', label: 'Highest Rated' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' }
  ];

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.searchQuery = params['q'] || '';
      this.selectedCategory = params['category'] || 'all';
      this.performSearch();
    });
  }

  private performSearch(): void {
    this.loading = true;
    this.error = null;

    const params = new URLSearchParams();
    if (this.searchQuery) params.set('q', this.searchQuery);
    if (this.selectedCategory !== 'all') {
      params.set('category', this.selectedCategory);
    }
    params.set('sort', this.sortBy);

    this.http.get<{ results: SearchResult[]; total: number }>(
      `/api/search?${params.toString()}`
    ).subscribe({
      next: (response) => {
        this.results = response.results;
        this.totalResults = response.total;
        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to load search results';
        this.loading = false;
      }
    });
  }

  onSortChange(sort: SortOption): void {
    this.sortBy = sort;
    this.performSearch();
  }

  toggleViewMode(): void {
    this.viewMode = this.viewMode === 'grid' ? 'list' : 'grid';
  }

  onResultClick(result: SearchResult): void {
    if (result.type === 'braider') {
      this.router.navigate(['/braiders', result.id]);
    } else {
      this.router.navigate(['/styles', result.id]);
    }
  }

  clearSearch(): void {
    this.searchQuery = '';
    this.selectedCategory = 'all';
    this.router.navigate(['/search']);
  }
}
```

---

### SPEC-SR-004: Search Suggestions

**Description:** Provide search suggestions as user types.

#### Acceptance Criteria

| ID | Criteria | Status |
|----|----------|--------|
| AC-001 | Suggestions shall appear after 2+ characters | Pending |
| AC-002 | Suggestions shall update with debounce (300ms) | Pending |
| AC-003 | Suggestions shall include braiders and styles | Pending |
| AC-004 | Selecting suggestion shall navigate to result | Pending |
| AC-005 | Suggestions shall be keyboard navigable | Pending |

---

## Template Structure

### Search Page Template

```html
<div class="search-page">
  <div class="search-hero">
    <h1>Find Your Perfect Braider</h1>
    <p>Search by name, style, or location</p>
  </div>

  <div class="search-container">
    <div class="search-input-wrapper">
      <svg class="search-icon"><!-- search icon --></svg>
      <input
        type="text"
        [(ngModel)]="searchQuery"
        (input)="onSearchInput($event)"
        (keyup.enter)="onSearch()"
        placeholder="Search braiders, styles..."
        class="search-input">
      <button (click)="onSearch()" class="search-button">
        Search
      </button>
    </div>

    <div class="filters">
      <select [(ngModel)]="selectedCategory" class="category-filter">
        @for (category of categories; track category) {
          <option [value]="category">{{ category }}</option>
        }
      </select>

      <input
        type="text"
        [(ngModel)]="selectedLocation"
        placeholder="Location (City, State, or ZIP)"
        class="location-filter">
    </div>
  </div>

  <div class="popular-searches">
    <h3>Popular Searches</h3>
    <div class="search-tags">
      @for (term of popularSearches; track term) {
        <button (click)="onQuickSearch(term)" class="search-tag">
          {{ term }}
        </button>
      }
    </div>
  </div>
</div>
```

### Search Results Template

```html
<div class="search-results-page">
  <header class="results-header">
    <div class="search-summary">
      @if (searchQuery) {
        <h1>Results for "{{ searchQuery }}"</h1>
        <p>{{ totalResults }} results found</p>
      } @else {
        <h1>All Braiders and Styles</h1>
      }
    </div>

    <div class="results-controls">
      <select [(ngModel)]="sortBy" (change)="onSortChange(sortBy)">
        @for (option of sortOptions; track option.value) {
          <option [value]="option.value">{{ option.label }}</option>
        }
      </select>

      <button (click)="toggleViewMode()" class="view-toggle">
        @if (viewMode === 'grid') {
          <span>List View</span>
        } @else {
          <span>Grid View</span>
        }
      </button>
    </div>
  </header>

  @if (loading) {
    <div class="loading-state">
      <div class="skeleton-grid">
        @for (i of [1,2,3,4,5,6]; track i) {
          <div class="skeleton-card"></div>
        }
      </div>
    </div>
  }

  @if (error) {
    <div class="error-state">
      <p>{{ error }}</p>
      <button (click)="performSearch()">Retry</button>
    </div>
  }

  @if (!loading && !error) {
    @if (results.length === 0) {
      <div class="empty-state">
        <h2>No results found</h2>
        <p>Try adjusting your search or filters</p>
        <button (click)="clearSearch()">Clear Search</button>
      </div>
    } @else {
      <div class="results-container" [class.list-view]="viewMode === 'list'">
        @for (result of results; track result.id) {
          <div class="result-card" (click)="onResultClick(result)">
            <img [src]="result.imageUrl" [alt]="result.name">
            <div class="result-info">
              <span class="result-type">{{ result.type }}</span>
              <h3>{{ result.name }}</h3>
              @if (result.rating) {
                <div class="rating">
                  <span>{{ result.rating }}</span>
                  <span>({{ result.reviewCount }} reviews)</span>
                </div>
              }
              @if (result.specialty) {
                <p class="specialty">{{ result.specialty }}</p>
              }
              @if (result.priceRange) {
                <p class="price">
                  ${{ result.priceRange.min }} - ${{ result.priceRange.max }}
                </p>
              }
            </div>
          </div>
        }
      </div>
    }
  }
</div>
```

---

## Styling

### Search Page SCSS

```scss
.search-page {
  min-height: 100vh;
  background: linear-gradient(to bottom, #f8f4f5, #fff);
}

.search-hero {
  text-align: center;
  padding: 80px 20px 40px;

  h1 {
    font-size: 42px;
    font-weight: 600;
    margin-bottom: 12px;
  }

  p {
    font-size: 18px;
    color: #666;
  }
}

.search-container {
  max-width: 700px;
  margin: 0 auto;
  padding: 0 20px;
}

.search-input-wrapper {
  display: flex;
  align-items: center;
  background: white;
  border-radius: 50px;
  padding: 8px 8px 8px 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.search-input {
  flex: 1;
  border: none;
  outline: none;
  font-size: 18px;
  padding: 12px;

  &::placeholder {
    color: #999;
  }
}

.search-button {
  background: #333;
  color: white;
  border: none;
  padding: 14px 28px;
  border-radius: 50px;
  font-size: 16px;
  cursor: pointer;

  &:hover {
    background: #555;
  }
}

.filters {
  display: flex;
  gap: 16px;
  margin-top: 20px;
  justify-content: center;

  select, input {
    padding: 12px 16px;
    border: 1px solid #ddd;
    border-radius: 8px;
    font-size: 14px;
    min-width: 180px;
  }
}

.popular-searches {
  max-width: 700px;
  margin: 60px auto;
  padding: 0 20px;

  h3 {
    font-size: 18px;
    margin-bottom: 16px;
    text-align: center;
  }
}

.search-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  justify-content: center;
}

.search-tag {
  background: white;
  border: 1px solid #ddd;
  padding: 10px 20px;
  border-radius: 25px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #f4eef0;
    border-color: #333;
  }
}
```

### Search Results SCSS

```scss
.search-results-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
}

.results-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  flex-wrap: wrap;
  gap: 20px;

  h1 {
    font-size: 28px;
    margin-bottom: 4px;
  }

  p {
    color: #666;
  }
}

.results-controls {
  display: flex;
  gap: 12px;

  select {
    padding: 10px 16px;
    border: 1px solid #ddd;
    border-radius: 8px;
  }
}

.results-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 24px;

  &.list-view {
    grid-template-columns: 1fr;

    .result-card {
      flex-direction: row;
      max-width: 100%;

      img {
        width: 200px;
        height: 150px;
      }
    }
  }
}

.result-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  cursor: pointer;
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-4px);
  }

  img {
    width: 100%;
    height: 200px;
    object-fit: cover;
  }

  .result-info {
    padding: 16px;
  }

  .result-type {
    font-size: 12px;
    text-transform: uppercase;
    color: #999;
    letter-spacing: 1px;
  }

  h3 {
    font-size: 18px;
    margin: 8px 0;
  }

  .rating {
    color: #f5a623;
    margin-bottom: 8px;
  }

  .specialty, .price {
    font-size: 14px;
    color: #666;
  }
}

.empty-state {
  text-align: center;
  padding: 80px 20px;

  h2 {
    margin-bottom: 12px;
  }

  button {
    margin-top: 20px;
    padding: 12px 24px;
    background: #333;
    color: white;
    border: none;
    border-radius: 8px;
    cursor: pointer;
  }
}
```

---

## Route Configuration

```typescript
// app.routes.ts
export const routes: Routes = [
  {
    path: 'search',
    component: SearchPageComponent
  },
  {
    path: 'search/results',
    component: SearchResultsPageComponent
  }
];
```

---

## File Structure

```
projects/app/src/app/search-page/
├── search-page.component.ts
├── search-page.component.html
├── search-page.component.scss
└── search-page.component.spec.ts

projects/app/src/app/search-results-page/
├── search-results-page.component.ts
├── search-results-page.component.html
├── search-results-page.component.scss
└── search-results-page.component.spec.ts
```

---

## Implementation Status

| Feature | Status |
|---------|--------|
| Search page scaffold | Complete |
| Search results scaffold | Complete |
| Search input | Pending |
| Filters | Pending |
| API integration | Pending |
| Suggestions/autocomplete | Pending |
| Sorting | Pending |
| View toggle | Pending |
| Empty state | Pending |
| Loading skeleton | Pending |
