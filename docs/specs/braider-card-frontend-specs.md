# Braider Card Component - Frontend Specifications

## Overview

The Braider Card component is a reusable UI component that displays a braider's profile information in a card format. It is used throughout the application to present braider profiles in lists, grids, and search results.

## Technology Stack

| Component | Technology | Version |
|-----------|------------|---------|
| Framework | Angular | 18.2.0 |
| Component Architecture | Standalone Components | - |
| Styling | SCSS | - |

---

## Component Details

### BraiderComponent

| Property | Value |
|----------|-------|
| Selector | `hp-braider` |
| Location | `projects/app/src/app/braider/` |
| Type | Standalone Component |
| Purpose | Display braider profile card |

---

## Feature Specifications

### SPEC-BC-001: Profile Image Display

**Description:** Display the braider's profile image.

#### Acceptance Criteria

| ID | Criteria | Status |
|----|----------|--------|
| AC-001 | Card shall display braider profile image | Implemented |
| AC-002 | Image shall have consistent aspect ratio | Implemented |
| AC-003 | Image shall have rounded corners | Pending |
| AC-004 | Fallback image for missing profile photos | Pending |
| AC-005 | Image shall lazy load for performance | Pending |

---

### SPEC-BC-002: Profile Name Display

**Description:** Display the braider's name.

#### Acceptance Criteria

| ID | Criteria | Status |
|----|----------|--------|
| AC-001 | Card shall display braider name | Implemented |
| AC-002 | Name shall be prominently displayed | Implemented |
| AC-003 | Long names shall truncate with ellipsis | Pending |

---

### SPEC-BC-003: Profile Description

**Description:** Display a brief description of the braider's specialty.

#### Acceptance Criteria

| ID | Criteria | Status |
|----|----------|--------|
| AC-001 | Card shall display specialty description | Implemented |
| AC-002 | Description shall be limited to 2-3 lines | Implemented |
| AC-003 | Text shall truncate with ellipsis if too long | Pending |

---

### SPEC-BC-004: Card Interactivity

**Description:** Enable card interaction for navigation.

#### Acceptance Criteria

| ID | Criteria | Status |
|----|----------|--------|
| AC-001 | Card shall be clickable | Pending |
| AC-002 | Clicking shall navigate to braider detail page | Pending |
| AC-003 | Card shall have hover state | Pending |
| AC-004 | Card shall emit selection event | Pending |

---

## Component Implementation

```typescript
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'hp-braider',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './braider.component.html',
  styleUrl: './braider.component.scss'
})
export class BraiderComponent {
  @Input() braiderId: string = '';
  @Input() profileImageUrl: string = '';
  @Input() profileName: string = '';
  @Input() specialty: string = 'Natural hair specialist and specializes in knot less braids';
  @Input() rating?: number;
  @Input() reviewCount?: number;
  @Input() priceRange?: { min: number; max: number };

  @Output() braiderSelected = new EventEmitter<string>();

  defaultImage = 'assets/default-profile.jpg';

  onCardClick(): void {
    if (this.braiderId) {
      this.braiderSelected.emit(this.braiderId);
    }
  }

  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.src = this.defaultImage;
  }

  formatPriceRange(): string {
    if (this.priceRange) {
      return `$${this.priceRange.min} - $${this.priceRange.max}`;
    }
    return '';
  }
}
```

---

## Template Structure

### Current Template

```html
<div class="braider-card" (click)="onCardClick()">
  <div class="profile-image-container">
    <img
      [src]="profileImageUrl"
      [alt]="profileName"
      (error)="onImageError($event)"
      loading="lazy">
  </div>
  <div class="profile-info">
    <h3 class="profile-name">{{ profileName }}</h3>
    <p class="profile-description">{{ specialty }}</p>
  </div>
</div>
```

### Enhanced Template

```html
<div
  class="braider-card"
  (click)="onCardClick()"
  [attr.tabindex]="braiderId ? 0 : null"
  (keydown.enter)="onCardClick()">

  <div class="profile-image-container">
    <img
      [src]="profileImageUrl || defaultImage"
      [alt]="profileName"
      (error)="onImageError($event)"
      loading="lazy"
      class="profile-image">
  </div>

  <div class="profile-info">
    <h3 class="profile-name">{{ profileName }}</h3>

    <p class="profile-specialty">{{ specialty }}</p>

    @if (rating) {
      <div class="rating">
        <span class="stars">
          @for (star of [1,2,3,4,5]; track star) {
            <svg
              [class.filled]="star <= rating"
              class="star-icon">
              <!-- star icon -->
            </svg>
          }
        </span>
        @if (reviewCount) {
          <span class="review-count">({{ reviewCount }})</span>
        }
      </div>
    }

    @if (priceRange) {
      <p class="price-range">{{ formatPriceRange() }}</p>
    }
  </div>
</div>
```

---

## Styling

### Component SCSS

```scss
.braider-card {
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

  &:focus {
    outline: 2px solid #333;
    outline-offset: 2px;
  }
}

.profile-image-container {
  aspect-ratio: 1 / 1;
  overflow: hidden;
  background: #f0f0f0;
}

.profile-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s;

  .braider-card:hover & {
    transform: scale(1.05);
  }
}

.profile-info {
  padding: 16px;
}

.profile-name {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.profile-specialty {
  font-size: 14px;
  color: #666;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  margin-bottom: 12px;
}

.rating {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-bottom: 8px;
}

.stars {
  display: flex;
  gap: 2px;
}

.star-icon {
  width: 16px;
  height: 16px;
  color: #ddd;

  &.filled {
    color: #f5a623;
  }
}

.review-count {
  font-size: 12px;
  color: #999;
}

.price-range {
  font-size: 14px;
  font-weight: 600;
  color: #333;
}
```

### Responsive Variations

```scss
// Grid item sizing
.braider-card {
  // In 3-column grid
  @media (min-width: 1024px) {
    .profile-image-container {
      aspect-ratio: 4 / 5;
    }
  }

  // In 2-column grid
  @media (max-width: 1023px) and (min-width: 768px) {
    .profile-image-container {
      aspect-ratio: 1 / 1;
    }
  }

  // Single column (mobile)
  @media (max-width: 767px) {
    .profile-image-container {
      aspect-ratio: 16 / 9;
    }

    .profile-info {
      padding: 12px;
    }
  }
}
```

---

## Input Properties

| Property | Type | Required | Default | Description |
|----------|------|----------|---------|-------------|
| `braiderId` | string | No | '' | Unique identifier for navigation |
| `profileImageUrl` | string | No | '' | URL of profile image |
| `profileName` | string | No | '' | Braider's display name |
| `specialty` | string | No | Default text | Braider's specialty description |
| `rating` | number | No | undefined | Star rating (1-5) |
| `reviewCount` | number | No | undefined | Number of reviews |
| `priceRange` | object | No | undefined | Price range object |

---

## Output Events

| Event | Payload | Description |
|-------|---------|-------------|
| `braiderSelected` | string (braiderId) | Emitted when card is clicked |

---

## Usage Examples

### Basic Usage

```html
<hp-braider
  [profileName]="'Ursula Stephen'"
  [profileImageUrl]="'assets/ursula.jpg'">
</hp-braider>
```

### Full Usage

```html
<hp-braider
  [braiderId]="braider.id"
  [profileName]="braider.name"
  [profileImageUrl]="braider.imageUrl"
  [specialty]="braider.specialty"
  [rating]="braider.rating"
  [reviewCount]="braider.reviewCount"
  [priceRange]="braider.priceRange"
  (braiderSelected)="onBraiderClick($event)">
</hp-braider>
```

### In a Grid

```html
<div class="braiders-grid">
  @for (braider of braiders; track braider.braiderId) {
    <hp-braider
      [braiderId]="braider.braiderId"
      [profileName]="braider.name"
      [profileImageUrl]="braider.imageUrl"
      [specialty]="braider.specialty"
      (braiderSelected)="navigateToBraider($event)">
    </hp-braider>
  }
</div>
```

---

## Accessibility

### Keyboard Navigation

| Key | Action |
|-----|--------|
| Tab | Focus card |
| Enter | Activate card (trigger click) |
| Space | Activate card (trigger click) |

### ARIA Attributes

```html
<div
  class="braider-card"
  role="button"
  [attr.aria-label]="'View ' + profileName + ' profile'"
  tabindex="0">
  ...
</div>
```

---

## Testing

### Unit Tests

```typescript
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BraiderComponent } from './braider.component';

describe('BraiderComponent', () => {
  let component: BraiderComponent;
  let fixture: ComponentFixture<BraiderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BraiderComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(BraiderComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display profile name', () => {
    component.profileName = 'Test Braider';
    fixture.detectChanges();

    const nameEl = fixture.nativeElement.querySelector('.profile-name');
    expect(nameEl.textContent).toContain('Test Braider');
  });

  it('should display profile image', () => {
    component.profileImageUrl = 'test-image.jpg';
    fixture.detectChanges();

    const imgEl = fixture.nativeElement.querySelector('.profile-image');
    expect(imgEl.src).toContain('test-image.jpg');
  });

  it('should emit braiderSelected on click', () => {
    const spy = jest.spyOn(component.braiderSelected, 'emit');
    component.braiderId = 'test-id';

    component.onCardClick();

    expect(spy).toHaveBeenCalledWith('test-id');
  });

  it('should handle image error', () => {
    component.defaultImage = 'default.jpg';
    const mockEvent = {
      target: { src: '' }
    } as unknown as Event;

    component.onImageError(mockEvent);

    expect((mockEvent.target as HTMLImageElement).src).toBe('default.jpg');
  });

  it('should format price range correctly', () => {
    component.priceRange = { min: 100, max: 200 };
    expect(component.formatPriceRange()).toBe('$100 - $200');
  });

  it('should return empty string for no price range', () => {
    component.priceRange = undefined;
    expect(component.formatPriceRange()).toBe('');
  });
});
```

---

## File Structure

```
projects/app/src/app/braider/
├── braider.component.ts      # Component logic
├── braider.component.html    # Template
├── braider.component.scss    # Styles
└── braider.component.spec.ts # Tests
```

---

## Implementation Status

| Feature | Status |
|---------|--------|
| Component scaffold | Complete |
| Profile image display | Complete |
| Profile name display | Complete |
| Specialty description | Complete |
| Card click handling | Pending |
| Output event emission | Pending |
| Rating display | Pending |
| Price range display | Pending |
| Image fallback | Pending |
| Lazy loading | Pending |
| Hover effects | Pending |
| Accessibility | Pending |
