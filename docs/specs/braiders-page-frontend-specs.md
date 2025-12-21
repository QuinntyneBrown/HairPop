# Braiders Page - Frontend Specifications

## Overview

The Braiders Page displays a grid of professional hair braider profiles, serving as the main discovery interface for customers to browse available braiders on the HairPop platform.

## Technology Stack

| Component | Technology | Version |
|-----------|------------|---------|
| Framework | Angular | 18.2.0 |
| State Management | NGRX Component Store | 18.0.2 |
| Reactive Programming | RxJS | 7.8.0 |
| Component Architecture | Standalone Components | - |
| Styling | SCSS | - |
| Testing | Jest | 28.1.3 |

---

## Component Details

### BraidersPageComponent

| Property | Value |
|----------|-------|
| Selector | `hp-braiders-page` |
| Location | `projects/app/src/app/braiders-page/` |
| Type | Standalone Component |
| Template | braiders-page.component.html |
| Styles | braiders-page.component.scss |

---

## Feature Specifications

### SPEC-BP-001: Display Braider Grid

**Description:** Display a responsive grid of braider profile cards.

#### Acceptance Criteria

| ID | Criteria | Status |
|----|----------|--------|
| AC-001 | Page shall display braiders in a 3-column grid layout | Implemented |
| AC-002 | Grid shall be responsive with appropriate spacing | Implemented |
| AC-003 | Each braider shall be displayed using the BraiderCard component | Implemented |
| AC-004 | Page shall have a gradient background (white to pink) | Implemented |

#### Component Implementation

```typescript
import { Component } from '@angular/core';

@Component({
  selector: 'hp-braiders-page',
  standalone: true,
  imports: [],
  templateUrl: './braiders-page.component.html',
  styleUrl: './braiders-page.component.scss'
})
export class BraidersPageComponent {
}
```

---

### SPEC-BP-002: Page Layout and Styling

**Description:** Apply consistent styling for the braiders listing page.

#### Acceptance Criteria

| ID | Criteria | Status |
|----|----------|--------|
| AC-001 | Page shall have 100px top padding | Implemented |
| AC-002 | Content shall be centered with max-width of 1271px | Implemented |
| AC-003 | Page header shall display "Featured Braiders" title | Implemented |
| AC-004 | Title shall use 40px font with 600 weight | Implemented |

#### Styling Implementation

```scss
:host {
  display: block;
  padding: 100px 0;
  min-height: 100vh;
  background: linear-gradient(to bottom, #ffffff, #f4eef0);
}

.braiders-container {
  max-width: 1271px;
  margin: 0 auto;
  padding: 0 20px;
}

h1 {
  font-size: 40px;
  font-weight: 600;
  letter-spacing: 2.75px;
  margin-bottom: 40px;
  text-align: center;
}

.braiders-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px 10px;
}
```

---

### SPEC-BP-003: Braider Data Display

**Description:** Display braider information including profile image and name.

#### Acceptance Criteria

| ID | Criteria | Status |
|----|----------|--------|
| AC-001 | Each card shall display braider profile image | Implemented |
| AC-002 | Each card shall display braider name | Implemented |
| AC-003 | Cards shall be clickable for navigation | Pending |
| AC-004 | Page shall load braiders from API on init | Pending |

#### Sample Data (Current Implementation)

```typescript
braiders = [
  { name: 'Ursula Stephen', imageUrl: 'assets/ursula.jpg' },
  { name: 'Kim Kimble', imageUrl: 'assets/kim.jpg' },
  { name: 'Felicia Leatherwood', imageUrl: 'assets/felicia.jpg' },
  { name: 'Tippi Shorter', imageUrl: 'assets/tippi.jpg' },
  { name: 'Kiyah Wright', imageUrl: 'assets/kiyah.jpg' },
  { name: 'Lacy Redway', imageUrl: 'assets/lacy.jpg' }
];
```

---

### SPEC-BP-004: API Integration

**Description:** Connect to backend API to fetch braider data.

#### Acceptance Criteria

| ID | Criteria | Status |
|----|----------|--------|
| AC-001 | Component shall call GET /api/braiders on initialization | Pending |
| AC-002 | Component shall handle loading state | Pending |
| AC-003 | Component shall handle error state | Pending |
| AC-004 | Component shall display empty state when no braiders | Pending |

#### Planned Implementation

```typescript
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { BraiderComponent } from '../braider/braider.component';

interface Braider {
  braiderId: string;
  name: string;
  profileImageUrl?: string;
}

@Component({
  selector: 'hp-braiders-page',
  standalone: true,
  imports: [CommonModule, BraiderComponent],
  templateUrl: './braiders-page.component.html',
  styleUrl: './braiders-page.component.scss'
})
export class BraidersPageComponent implements OnInit {
  private http = inject(HttpClient);

  braiders: Braider[] = [];
  loading = true;
  error: string | null = null;

  ngOnInit(): void {
    this.http.get<{ braiders: Braider[] }>('/api/braiders')
      .subscribe({
        next: (response) => {
          this.braiders = response.braiders;
          this.loading = false;
        },
        error: (err) => {
          this.error = 'Failed to load braiders';
          this.loading = false;
        }
      });
  }
}
```

---

## Template Structure

### Current Template

```html
<div class="braiders-container">
  <h1>Featured Braiders</h1>
  <div class="braiders-grid">
    @for (braider of braiders; track braider.name) {
      <hp-braider
        [profileName]="braider.name"
        [profileImageUrl]="braider.imageUrl">
      </hp-braider>
    }
  </div>
</div>
```

### Planned Template with States

```html
<div class="braiders-container">
  <h1>Featured Braiders</h1>

  @if (loading) {
    <div class="loading-state">
      <p>Loading braiders...</p>
    </div>
  }

  @if (error) {
    <div class="error-state">
      <p>{{ error }}</p>
      <button (click)="retry()">Retry</button>
    </div>
  }

  @if (!loading && !error) {
    @if (braiders.length === 0) {
      <div class="empty-state">
        <p>No braiders found</p>
      </div>
    } @else {
      <div class="braiders-grid">
        @for (braider of braiders; track braider.braiderId) {
          <hp-braider
            [profileName]="braider.name"
            [profileImageUrl]="braider.profileImageUrl">
          </hp-braider>
        }
      </div>
    }
  }
</div>
```

---

## State Management

### Planned NGRX Component Store

```typescript
import { Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { HttpClient } from '@angular/common/http';
import { Observable, switchMap, tap, catchError } from 'rxjs';

interface BraidersState {
  braiders: Braider[];
  loading: boolean;
  error: string | null;
}

@Injectable()
export class BraidersStore extends ComponentStore<BraidersState> {
  constructor(private http: HttpClient) {
    super({
      braiders: [],
      loading: false,
      error: null
    });
  }

  readonly braiders$ = this.select(state => state.braiders);
  readonly loading$ = this.select(state => state.loading);
  readonly error$ = this.select(state => state.error);

  readonly loadBraiders = this.effect((trigger$: Observable<void>) => {
    return trigger$.pipe(
      tap(() => this.patchState({ loading: true, error: null })),
      switchMap(() =>
        this.http.get<{ braiders: Braider[] }>('/api/braiders').pipe(
          tap({
            next: (response) => this.patchState({
              braiders: response.braiders,
              loading: false
            }),
            error: (error) => this.patchState({
              error: 'Failed to load braiders',
              loading: false
            })
          }),
          catchError(() => [])
        )
      )
    );
  });
}
```

---

## Responsive Design

### Breakpoints

| Breakpoint | Columns | Gap |
|------------|---------|-----|
| Desktop (1024px+) | 3 columns | 10px x 20px |
| Tablet (768px - 1023px) | 2 columns | 10px x 20px |
| Mobile (< 768px) | 1 column | 15px |

### Responsive SCSS

```scss
.braiders-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px 10px;

  @media (max-width: 1023px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 767px) {
    grid-template-columns: 1fr;
    gap: 15px;
  }
}
```

---

## Testing

### Unit Test Structure

```typescript
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BraidersPageComponent } from './braiders-page.component';

describe('BraidersPageComponent', () => {
  let component: BraidersPageComponent;
  let fixture: ComponentFixture<BraidersPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BraidersPageComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(BraidersPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display braiders grid', () => {
    const grid = fixture.nativeElement.querySelector('.braiders-grid');
    expect(grid).toBeTruthy();
  });

  it('should display page title', () => {
    const title = fixture.nativeElement.querySelector('h1');
    expect(title.textContent).toContain('Featured Braiders');
  });
});
```

---

## File Structure

```
projects/app/src/app/braiders-page/
├── braiders-page.component.ts      # Component logic
├── braiders-page.component.html    # Template
├── braiders-page.component.scss    # Styles
└── braiders-page.component.spec.ts # Tests
```

---

## Dependencies

| Dependency | Purpose |
|------------|---------|
| BraiderComponent | Display individual braider cards |
| HttpClient | API communication |
| Router | Navigation to braider details |
| CommonModule | Common Angular directives |

---

## Implementation Status

| Feature | Status |
|---------|--------|
| Component scaffold | Complete |
| Grid layout | Complete |
| Styling | Complete |
| Static data display | Complete |
| API integration | Pending |
| State management | Pending |
| Error handling | Pending |
| Loading states | Pending |
| Responsive design | Pending |
| Navigation | Pending |
