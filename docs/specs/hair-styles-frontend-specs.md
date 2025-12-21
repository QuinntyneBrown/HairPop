# Hair Styles Page - Frontend Specifications

## Overview

The Hair Styles Page displays a gallery of available hair braiding styles, allowing customers to browse different braiding options and discover braiders who specialize in specific styles.

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

### HairStylesPageComponent

| Property | Value |
|----------|-------|
| Selector | `hp-hair-styles-page` |
| Location | `projects/app/src/app/hair-styles-page/` |
| Type | Standalone Component |
| Purpose | Display gallery of hair styles |

### HairStyleComponent

| Property | Value |
|----------|-------|
| Selector | `hp-hair-style` |
| Location | `projects/app/src/app/hair-style/` |
| Type | Standalone Component |
| Purpose | Display individual hair style card |

---

## Feature Specifications

### SPEC-HS-001: Display Hair Styles Gallery

**Description:** Display a responsive gallery of available hair braiding styles.

#### Acceptance Criteria

| ID | Criteria | Status |
|----|----------|--------|
| AC-001 | Page shall display hair styles in a grid layout | Pending |
| AC-002 | Each style shall show a representative image | Pending |
| AC-003 | Each style shall display the style name | Pending |
| AC-004 | Each style shall show approximate duration | Pending |
| AC-005 | Each style shall show price range | Pending |

#### Component Implementation

```typescript
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { HairStyleComponent } from '../hair-style/hair-style.component';

interface HairStyle {
  styleId: string;
  name: string;
  imageUrl: string;
  description: string;
  durationHours: number;
  priceRange: {
    min: number;
    max: number;
  };
  category: string;
}

@Component({
  selector: 'hp-hair-styles-page',
  standalone: true,
  imports: [CommonModule, HairStyleComponent],
  templateUrl: './hair-styles-page.component.html',
  styleUrl: './hair-styles-page.component.scss'
})
export class HairStylesPageComponent implements OnInit {
  private http = inject(HttpClient);

  hairStyles: HairStyle[] = [];
  filteredStyles: HairStyle[] = [];
  categories: string[] = [];
  selectedCategory: string = 'all';
  loading = true;
  error: string | null = null;

  ngOnInit(): void {
    this.loadHairStyles();
  }

  private loadHairStyles(): void {
    this.http.get<{ styles: HairStyle[] }>('/api/hair-styles')
      .subscribe({
        next: (response) => {
          this.hairStyles = response.styles;
          this.filteredStyles = response.styles;
          this.extractCategories();
          this.loading = false;
        },
        error: () => {
          this.error = 'Failed to load hair styles';
          this.loading = false;
        }
      });
  }

  private extractCategories(): void {
    const categorySet = new Set(this.hairStyles.map(s => s.category));
    this.categories = ['all', ...Array.from(categorySet)];
  }

  filterByCategory(category: string): void {
    this.selectedCategory = category;
    if (category === 'all') {
      this.filteredStyles = this.hairStyles;
    } else {
      this.filteredStyles = this.hairStyles.filter(s => s.category === category);
    }
  }
}
```

---

### SPEC-HS-002: Hair Style Card Component

**Description:** Display individual hair style information in a card format.

#### Acceptance Criteria

| ID | Criteria | Status |
|----|----------|--------|
| AC-001 | Card shall display style image | Pending |
| AC-002 | Card shall display style name | Pending |
| AC-003 | Card shall display duration estimate | Pending |
| AC-004 | Card shall display price range | Pending |
| AC-005 | Card shall be clickable for more details | Pending |

#### Component Implementation

```typescript
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'hp-hair-style',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './hair-style.component.html',
  styleUrl: './hair-style.component.scss'
})
export class HairStyleComponent {
  @Input() styleId: string = '';
  @Input() name: string = '';
  @Input() imageUrl: string = '';
  @Input() description: string = '';
  @Input() durationHours: number = 0;
  @Input() priceMin: number = 0;
  @Input() priceMax: number = 0;

  @Output() styleSelected = new EventEmitter<string>();

  onCardClick(): void {
    this.styleSelected.emit(this.styleId);
  }

  formatDuration(): string {
    if (this.durationHours < 1) {
      return `${this.durationHours * 60} mins`;
    }
    return `${this.durationHours} hrs`;
  }

  formatPriceRange(): string {
    return `$${this.priceMin} - $${this.priceMax}`;
  }
}
```

---

### SPEC-HS-003: Category Filtering

**Description:** Filter hair styles by category.

#### Acceptance Criteria

| ID | Criteria | Status |
|----|----------|--------|
| AC-001 | Page shall display category filter buttons | Pending |
| AC-002 | Clicking category shall filter displayed styles | Pending |
| AC-003 | "All" option shall show all styles | Pending |
| AC-004 | Active category shall be visually indicated | Pending |

#### Common Categories

| Category | Description |
|----------|-------------|
| Box Braids | Classic box braid styles |
| Knotless | Knotless braid variations |
| Cornrows | Cornrow patterns and designs |
| Twists | Two-strand and other twist styles |
| Locs | Faux locs and loc styles |
| Protective | Other protective styling |

---

## Template Structure

### Hair Styles Page Template

```html
<div class="hair-styles-page">
  <header class="page-header">
    <h1>Hair Styles</h1>
    <p>Explore our collection of professional braiding styles</p>
  </header>

  @if (loading) {
    <div class="loading-state">
      <p>Loading styles...</p>
    </div>
  }

  @if (error) {
    <div class="error-state">
      <p>{{ error }}</p>
    </div>
  }

  @if (!loading && !error) {
    <nav class="category-filter">
      @for (category of categories; track category) {
        <button
          [class.active]="selectedCategory === category"
          (click)="filterByCategory(category)">
          {{ category | titlecase }}
        </button>
      }
    </nav>

    <div class="styles-grid">
      @for (style of filteredStyles; track style.styleId) {
        <hp-hair-style
          [styleId]="style.styleId"
          [name]="style.name"
          [imageUrl]="style.imageUrl"
          [description]="style.description"
          [durationHours]="style.durationHours"
          [priceMin]="style.priceRange.min"
          [priceMax]="style.priceRange.max"
          (styleSelected)="onStyleSelected($event)">
        </hp-hair-style>
      }
    </div>

    @if (filteredStyles.length === 0) {
      <div class="empty-state">
        <p>No styles found in this category</p>
      </div>
    }
  }
</div>
```

### Hair Style Card Template

```html
<div class="hair-style-card" (click)="onCardClick()">
  <div class="style-image">
    <img [src]="imageUrl" [alt]="name">
  </div>
  <div class="style-info">
    <h3>{{ name }}</h3>
    <p class="description">{{ description }}</p>
    <div class="style-meta">
      <span class="duration">
        <svg class="icon"><!-- clock icon --></svg>
        {{ formatDuration() }}
      </span>
      <span class="price">{{ formatPriceRange() }}</span>
    </div>
  </div>
</div>
```

---

## Styling

### Hair Styles Page SCSS

```scss
.hair-styles-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 60px 20px;
}

.page-header {
  text-align: center;
  margin-bottom: 40px;

  h1 {
    font-size: 36px;
    font-weight: 600;
    margin-bottom: 12px;
  }

  p {
    font-size: 18px;
    color: #666;
  }
}

.category-filter {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 40px;

  button {
    padding: 10px 20px;
    border: 1px solid #ddd;
    border-radius: 25px;
    background: white;
    cursor: pointer;
    transition: all 0.2s;

    &:hover {
      border-color: #333;
    }

    &.active {
      background: #333;
      color: white;
      border-color: #333;
    }
  }
}

.styles-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 24px;
}
```

### Hair Style Card SCSS

```scss
.hair-style-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  }
}

.style-image {
  aspect-ratio: 4/3;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.style-info {
  padding: 16px;

  h3 {
    font-size: 18px;
    font-weight: 600;
    margin-bottom: 8px;
  }

  .description {
    font-size: 14px;
    color: #666;
    margin-bottom: 12px;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
}

.style-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;

  .duration {
    display: flex;
    align-items: center;
    gap: 4px;
    color: #666;
  }

  .price {
    font-weight: 600;
    color: #333;
  }
}
```

---

## Data Model

### HairStyle Interface

```typescript
interface HairStyle {
  styleId: string;
  name: string;
  imageUrl: string;
  description: string;
  durationHours: number;
  priceRange: {
    min: number;
    max: number;
  };
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  maintenanceTips?: string[];
  relatedStyles?: string[];
}
```

### Sample Data

```typescript
const sampleStyles: HairStyle[] = [
  {
    styleId: '1',
    name: 'Knotless Box Braids',
    imageUrl: '/assets/styles/knotless-box.jpg',
    description: 'Pain-free, lightweight braids that start with your natural hair',
    durationHours: 6,
    priceRange: { min: 200, max: 350 },
    category: 'Knotless',
    difficulty: 'intermediate'
  },
  {
    styleId: '2',
    name: 'Goddess Locs',
    imageUrl: '/assets/styles/goddess-locs.jpg',
    description: 'Bohemian style locs with curly ends for a natural look',
    durationHours: 8,
    priceRange: { min: 250, max: 400 },
    category: 'Locs',
    difficulty: 'advanced'
  },
  {
    styleId: '3',
    name: 'Fulani Braids',
    imageUrl: '/assets/styles/fulani.jpg',
    description: 'Traditional style with center cornrow and side braids',
    durationHours: 4,
    priceRange: { min: 150, max: 250 },
    category: 'Cornrows',
    difficulty: 'intermediate'
  }
];
```

---

## File Structure

```
projects/app/src/app/hair-styles-page/
├── hair-styles-page.component.ts
├── hair-styles-page.component.html
├── hair-styles-page.component.scss
└── hair-styles-page.component.spec.ts

projects/app/src/app/hair-style/
├── hair-style.component.ts
├── hair-style.component.html
├── hair-style.component.scss
└── hair-style.component.spec.ts
```

---

## Testing

### Unit Tests

```typescript
describe('HairStylesPageComponent', () => {
  let component: HairStylesPageComponent;
  let fixture: ComponentFixture<HairStylesPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HairStylesPageComponent, HttpClientTestingModule]
    }).compileComponents();

    fixture = TestBed.createComponent(HairStylesPageComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should filter styles by category', () => {
    component.hairStyles = [
      { styleId: '1', category: 'Locs' } as HairStyle,
      { styleId: '2', category: 'Braids' } as HairStyle
    ];
    component.filteredStyles = component.hairStyles;

    component.filterByCategory('Locs');

    expect(component.filteredStyles.length).toBe(1);
    expect(component.filteredStyles[0].category).toBe('Locs');
  });
});

describe('HairStyleComponent', () => {
  let component: HairStyleComponent;
  let fixture: ComponentFixture<HairStyleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HairStyleComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(HairStyleComponent);
    component = fixture.componentInstance;
  });

  it('should format duration correctly', () => {
    component.durationHours = 2.5;
    expect(component.formatDuration()).toBe('2.5 hrs');

    component.durationHours = 0.5;
    expect(component.formatDuration()).toBe('30 mins');
  });

  it('should format price range correctly', () => {
    component.priceMin = 100;
    component.priceMax = 200;
    expect(component.formatPriceRange()).toBe('$100 - $200');
  });

  it('should emit styleSelected on click', () => {
    const spy = jest.spyOn(component.styleSelected, 'emit');
    component.styleId = 'test-id';

    component.onCardClick();

    expect(spy).toHaveBeenCalledWith('test-id');
  });
});
```

---

## Implementation Status

| Feature | Status |
|---------|--------|
| Component scaffold | Complete |
| Template | Placeholder |
| Styling | Pending |
| API integration | Pending |
| Category filtering | Pending |
| Responsive design | Pending |
| Detail modal/page | Pending |
