# Braider Detail Page - Frontend Specifications

## Overview

The Braider Detail pages provide detailed views of individual professional braiders, including their profile information, specialties, and portfolio. The system includes two components: BraiderPage for a compact view and BraiderFull for an extended profile view.

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

### BraiderPageComponent

| Property | Value |
|----------|-------|
| Selector | `hp-braider-page` |
| Location | `projects/app/src/app/braider-page/` |
| Type | Standalone Component |
| Purpose | Compact braider detail view |

### BraiderFullComponent

| Property | Value |
|----------|-------|
| Selector | `hp-braider-full` |
| Location | `projects/app/src/app/braider-full/` |
| Type | Standalone Component |
| Purpose | Extended braider profile view |

---

## Feature Specifications

### SPEC-BD-001: Display Braider Profile

**Description:** Display detailed information about a specific braider.

#### Acceptance Criteria

| ID | Criteria | Status |
|----|----------|--------|
| AC-001 | Page shall display braider name prominently | Pending |
| AC-002 | Page shall display braider profile image | Pending |
| AC-003 | Page shall display braider specialties | Pending |
| AC-004 | Page shall display braider bio/description | Pending |
| AC-005 | Page shall load braider data by ID from route parameter | Pending |

#### Component Implementation

```typescript
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';

interface BraiderDetail {
  braiderId: string;
  name: string;
  profileImageUrl?: string;
  bio?: string;
  specialties?: string[];
}

@Component({
  selector: 'hp-braider-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './braider-page.component.html',
  styleUrl: './braider-page.component.scss'
})
export class BraiderPageComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private http = inject(HttpClient);

  braider: BraiderDetail | null = null;
  loading = true;
  error: string | null = null;

  ngOnInit(): void {
    const braiderId = this.route.snapshot.paramMap.get('braiderId');
    if (braiderId) {
      this.loadBraider(braiderId);
    }
  }

  private loadBraider(braiderId: string): void {
    this.http.get<{ braider: BraiderDetail }>(`/api/braiders/${braiderId}`)
      .subscribe({
        next: (response) => {
          this.braider = response.braider;
          this.loading = false;
        },
        error: () => {
          this.error = 'Failed to load braider';
          this.loading = false;
        }
      });
  }
}
```

---

### SPEC-BD-002: Extended Profile View

**Description:** Display comprehensive braider profile with portfolio and reviews.

#### Acceptance Criteria

| ID | Criteria | Status |
|----|----------|--------|
| AC-001 | Full view shall display all basic profile info | Pending |
| AC-002 | Full view shall display portfolio gallery | Pending |
| AC-003 | Full view shall display customer reviews | Pending |
| AC-004 | Full view shall display contact information | Pending |
| AC-005 | Full view shall display booking availability | Pending |

#### Component Implementation

```typescript
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';

interface BraiderFullProfile {
  braiderId: string;
  name: string;
  profileImageUrl?: string;
  bio?: string;
  specialties?: string[];
  portfolio?: string[];
  reviews?: Review[];
  contact?: ContactInfo;
  availability?: Availability[];
}

interface Review {
  reviewId: string;
  rating: number;
  content: string;
  userName: string;
  createdAt: string;
}

interface ContactInfo {
  email?: string;
  phone?: string;
  instagram?: string;
}

interface Availability {
  day: string;
  hours: string;
}

@Component({
  selector: 'hp-braider-full',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './braider-full.component.html',
  styleUrl: './braider-full.component.scss'
})
export class BraiderFullComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private http = inject(HttpClient);

  braider: BraiderFullProfile | null = null;
  loading = true;
  error: string | null = null;
  activeTab: 'portfolio' | 'reviews' | 'about' = 'about';

  ngOnInit(): void {
    const braiderId = this.route.snapshot.paramMap.get('braiderId');
    if (braiderId) {
      this.loadBraider(braiderId);
    }
  }

  private loadBraider(braiderId: string): void {
    this.http.get<{ braider: BraiderFullProfile }>(`/api/braiders/${braiderId}`)
      .subscribe({
        next: (response) => {
          this.braider = response.braider;
          this.loading = false;
        },
        error: () => {
          this.error = 'Failed to load braider profile';
          this.loading = false;
        }
      });
  }

  setActiveTab(tab: 'portfolio' | 'reviews' | 'about'): void {
    this.activeTab = tab;
  }
}
```

---

### SPEC-BD-003: Route Configuration

**Description:** Configure routing for braider detail pages.

#### Acceptance Criteria

| ID | Criteria | Status |
|----|----------|--------|
| AC-001 | Route /braiders/:braiderId shall display BraiderPage | Pending |
| AC-002 | Route /braiders/:braiderId/full shall display BraiderFull | Pending |
| AC-003 | Invalid braider ID shall show 404 page | Pending |

#### Route Configuration

```typescript
// app.routes.ts
import { Routes } from '@angular/router';
import { BraiderPageComponent } from './braider-page/braider-page.component';
import { BraiderFullComponent } from './braider-full/braider-full.component';

export const routes: Routes = [
  {
    path: 'braiders/:braiderId',
    component: BraiderPageComponent
  },
  {
    path: 'braiders/:braiderId/full',
    component: BraiderFullComponent
  }
];
```

---

## Template Structure

### Braider Page Template

```html
<div class="braider-page">
  @if (loading) {
    <div class="loading">Loading...</div>
  }

  @if (error) {
    <div class="error">{{ error }}</div>
  }

  @if (braider) {
    <div class="braider-header">
      <img
        [src]="braider.profileImageUrl"
        [alt]="braider.name"
        class="profile-image">
      <div class="braider-info">
        <h1>{{ braider.name }}</h1>
        <p class="bio">{{ braider.bio }}</p>
        @if (braider.specialties) {
          <div class="specialties">
            @for (specialty of braider.specialties; track specialty) {
              <span class="specialty-tag">{{ specialty }}</span>
            }
          </div>
        }
      </div>
    </div>
    <a [routerLink]="['/braiders', braider.braiderId, 'full']"
       class="view-full-profile">
      View Full Profile
    </a>
  }
</div>
```

### Braider Full Template

```html
<div class="braider-full">
  @if (loading) {
    <div class="loading">Loading...</div>
  }

  @if (error) {
    <div class="error">{{ error }}</div>
  }

  @if (braider) {
    <header class="profile-header">
      <img
        [src]="braider.profileImageUrl"
        [alt]="braider.name"
        class="profile-image-large">
      <div class="profile-info">
        <h1>{{ braider.name }}</h1>
        @if (braider.specialties) {
          <div class="specialties">
            @for (specialty of braider.specialties; track specialty) {
              <span class="specialty-tag">{{ specialty }}</span>
            }
          </div>
        }
      </div>
    </header>

    <nav class="profile-tabs">
      <button
        [class.active]="activeTab === 'about'"
        (click)="setActiveTab('about')">About</button>
      <button
        [class.active]="activeTab === 'portfolio'"
        (click)="setActiveTab('portfolio')">Portfolio</button>
      <button
        [class.active]="activeTab === 'reviews'"
        (click)="setActiveTab('reviews')">Reviews</button>
    </nav>

    <section class="tab-content">
      @if (activeTab === 'about') {
        <div class="about-section">
          <p>{{ braider.bio }}</p>
          @if (braider.contact) {
            <div class="contact-info">
              <h3>Contact</h3>
              @if (braider.contact.email) {
                <p>Email: {{ braider.contact.email }}</p>
              }
              @if (braider.contact.phone) {
                <p>Phone: {{ braider.contact.phone }}</p>
              }
              @if (braider.contact.instagram) {
                <p>Instagram: {{ braider.contact.instagram }}</p>
              }
            </div>
          }
        </div>
      }

      @if (activeTab === 'portfolio') {
        <div class="portfolio-gallery">
          @if (braider.portfolio) {
            @for (image of braider.portfolio; track image) {
              <img [src]="image" alt="Portfolio work" class="portfolio-image">
            }
          } @else {
            <p>No portfolio images yet</p>
          }
        </div>
      }

      @if (activeTab === 'reviews') {
        <div class="reviews-section">
          @if (braider.reviews && braider.reviews.length > 0) {
            @for (review of braider.reviews; track review.reviewId) {
              <div class="review-card">
                <div class="review-header">
                  <span class="reviewer">{{ review.userName }}</span>
                  <span class="rating">{{ review.rating }} stars</span>
                </div>
                <p class="review-content">{{ review.content }}</p>
                <span class="review-date">{{ review.createdAt }}</span>
              </div>
            }
          } @else {
            <p>No reviews yet</p>
          }
        </div>
      }
    </section>
  }
</div>
```

---

## Styling

### Braider Page SCSS

```scss
.braider-page {
  max-width: 800px;
  margin: 0 auto;
  padding: 40px 20px;
}

.braider-header {
  display: flex;
  gap: 30px;
  align-items: flex-start;
}

.profile-image {
  width: 200px;
  height: 200px;
  border-radius: 50%;
  object-fit: cover;
}

.braider-info {
  flex: 1;

  h1 {
    font-size: 32px;
    font-weight: 600;
    margin-bottom: 16px;
  }

  .bio {
    font-size: 16px;
    line-height: 1.6;
    color: #666;
    margin-bottom: 20px;
  }
}

.specialties {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.specialty-tag {
  background: #f4eef0;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 14px;
}

.view-full-profile {
  display: inline-block;
  margin-top: 30px;
  padding: 12px 24px;
  background: #333;
  color: white;
  text-decoration: none;
  border-radius: 8px;

  &:hover {
    background: #555;
  }
}
```

---

## State Management

### BraiderDetailStore

```typescript
import { Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { HttpClient } from '@angular/common/http';
import { Observable, switchMap, tap, catchError } from 'rxjs';

interface BraiderDetailState {
  braider: BraiderFullProfile | null;
  loading: boolean;
  error: string | null;
}

@Injectable()
export class BraiderDetailStore extends ComponentStore<BraiderDetailState> {
  constructor(private http: HttpClient) {
    super({
      braider: null,
      loading: false,
      error: null
    });
  }

  readonly braider$ = this.select(state => state.braider);
  readonly loading$ = this.select(state => state.loading);
  readonly error$ = this.select(state => state.error);

  readonly loadBraider = this.effect((braiderId$: Observable<string>) => {
    return braiderId$.pipe(
      tap(() => this.patchState({ loading: true, error: null })),
      switchMap((braiderId) =>
        this.http.get<{ braider: BraiderFullProfile }>(`/api/braiders/${braiderId}`).pipe(
          tap({
            next: (response) => this.patchState({
              braider: response.braider,
              loading: false
            }),
            error: () => this.patchState({
              error: 'Failed to load braider',
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

## File Structure

```
projects/app/src/app/braider-page/
├── braider-page.component.ts
├── braider-page.component.html
├── braider-page.component.scss
└── braider-page.component.spec.ts

projects/app/src/app/braider-full/
├── braider-full.component.ts
├── braider-full.component.html
├── braider-full.component.scss
└── braider-full.component.spec.ts
```

---

## Testing

### Unit Tests

```typescript
describe('BraiderPageComponent', () => {
  let component: BraiderPageComponent;
  let fixture: ComponentFixture<BraiderPageComponent>;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        BraiderPageComponent,
        HttpClientTestingModule,
        RouterTestingModule
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(BraiderPageComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load braider on init', () => {
    const mockBraider = {
      braiderId: '123',
      name: 'Test Braider'
    };

    fixture.detectChanges();

    const req = httpMock.expectOne('/api/braiders/123');
    req.flush({ braider: mockBraider });

    expect(component.braider).toEqual(mockBraider);
  });
});
```

---

## Implementation Status

| Feature | BraiderPage | BraiderFull |
|---------|-------------|-------------|
| Component scaffold | Complete | Complete |
| Template | Placeholder | Placeholder |
| Styling | Pending | Pending |
| API integration | Pending | Pending |
| Route parameter handling | Pending | Pending |
| Tab navigation | N/A | Pending |
| Portfolio gallery | N/A | Pending |
| Reviews display | N/A | Pending |
| Contact info | N/A | Pending |
