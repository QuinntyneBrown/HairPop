# Header and Navigation - Frontend Specifications

## Overview

The Header component provides the primary navigation interface for the HairPop application, including the logo, main navigation links, and search functionality access.

## Technology Stack

| Component | Technology | Version |
|-----------|------------|---------|
| Framework | Angular | 18.2.0 |
| Component Architecture | Standalone Components | - |
| Styling | SCSS | - |

---

## Components

### HeaderComponent

| Property | Value |
|----------|-------|
| Selector | `hp-header` |
| Location | `projects/app/src/app/header/` |
| Type | Standalone Component |
| Purpose | Main navigation header |

### FooterComponent

| Property | Value |
|----------|-------|
| Selector | `hp-footer` |
| Location | `projects/app/src/app/footer/` |
| Type | Standalone Component |
| Purpose | Footer content and links |

### FABComponent

| Property | Value |
|----------|-------|
| Selector | `hp-fab` |
| Location | `projects/app/src/app/fab/` |
| Type | Standalone Component |
| Purpose | Floating Action Button |

---

## Feature Specifications

### SPEC-HD-001: Header Layout

**Description:** Display a fixed header with logo, navigation, and search.

#### Acceptance Criteria

| ID | Criteria | Status |
|----|----------|--------|
| AC-001 | Header shall display the HairPop logo | Implemented |
| AC-002 | Header shall contain main navigation links | Implemented |
| AC-003 | Header shall include a search button/icon | Implemented |
| AC-004 | Header shall remain fixed at top on scroll | Pending |
| AC-005 | Header shall be responsive | Pending |

#### Component Implementation

```typescript
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

interface NavItem {
  label: string;
  route: string;
  icon?: string;
}

@Component({
  selector: 'hp-header',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  private router = inject(Router);

  navItems: NavItem[] = [
    { label: 'Braiders', route: '/braiders' },
    { label: 'Hair Styles', route: '/styles' }
  ];

  isMenuOpen = false;

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeMenu(): void {
    this.isMenuOpen = false;
  }

  navigateToSearch(): void {
    this.router.navigate(['/search']);
  }
}
```

---

### SPEC-HD-002: Navigation Links

**Description:** Provide navigation to main sections of the application.

#### Acceptance Criteria

| ID | Criteria | Status |
|----|----------|--------|
| AC-001 | Navigation shall include "Braiders" link | Implemented |
| AC-002 | Navigation shall include "Hair Styles" link | Implemented |
| AC-003 | Active link shall be visually indicated | Pending |
| AC-004 | Links shall navigate to correct routes | Pending |

#### Navigation Items

| Label | Route | Description |
|-------|-------|-------------|
| Braiders | /braiders | List of all braiders |
| Hair Styles | /styles | Gallery of hair styles |

---

### SPEC-HD-003: Search Button

**Description:** Provide quick access to search functionality.

#### Acceptance Criteria

| ID | Criteria | Status |
|----|----------|--------|
| AC-001 | Search button shall display search icon | Implemented |
| AC-002 | Clicking shall navigate to search page | Pending |
| AC-003 | Button shall have hover state | Pending |

---

### SPEC-HD-004: Responsive Navigation

**Description:** Adapt navigation for mobile devices.

#### Acceptance Criteria

| ID | Criteria | Status |
|----|----------|--------|
| AC-001 | Mobile view shall show hamburger menu | Pending |
| AC-002 | Menu shall expand/collapse on toggle | Pending |
| AC-003 | Menu shall close on navigation | Pending |
| AC-004 | Menu shall close on outside click | Pending |

---

## Template Structure

### Header Template

```html
<header class="header">
  <div class="header-content">
    <a routerLink="/" class="logo">
      <img src="assets/logo.svg" alt="HairPop">
    </a>

    <nav class="main-nav" [class.open]="isMenuOpen">
      @for (item of navItems; track item.route) {
        <a
          [routerLink]="item.route"
          routerLinkActive="active"
          (click)="closeMenu()">
          {{ item.label }}
        </a>
      }
    </nav>

    <div class="header-actions">
      <button
        class="search-button"
        (click)="navigateToSearch()"
        aria-label="Search">
        <svg xmlns="http://www.w3.org/2000/svg"
             width="24" height="24"
             viewBox="0 0 24 24"
             fill="none"
             stroke="currentColor"
             stroke-width="2">
          <circle cx="11" cy="11" r="8"></circle>
          <path d="m21 21-4.35-4.35"></path>
        </svg>
      </button>

      <button
        class="menu-toggle"
        (click)="toggleMenu()"
        aria-label="Toggle menu">
        @if (isMenuOpen) {
          <svg><!-- close icon --></svg>
        } @else {
          <svg><!-- hamburger icon --></svg>
        }
      </button>
    </div>
  </div>
</header>
```

### Footer Template

```html
<footer class="footer">
  <div class="footer-content">
    <div class="footer-section">
      <h4>HairPop</h4>
      <p>Find your perfect braider</p>
    </div>

    <div class="footer-section">
      <h4>Explore</h4>
      <nav>
        <a routerLink="/braiders">Braiders</a>
        <a routerLink="/styles">Hair Styles</a>
        <a routerLink="/search">Search</a>
      </nav>
    </div>

    <div class="footer-section">
      <h4>Company</h4>
      <nav>
        <a routerLink="/about">About Us</a>
        <a routerLink="/contact">Contact</a>
        <a routerLink="/privacy">Privacy Policy</a>
        <a routerLink="/terms">Terms of Service</a>
      </nav>
    </div>

    <div class="footer-section">
      <h4>Connect</h4>
      <div class="social-links">
        <a href="#" aria-label="Instagram">
          <svg><!-- instagram icon --></svg>
        </a>
        <a href="#" aria-label="Twitter">
          <svg><!-- twitter icon --></svg>
        </a>
        <a href="#" aria-label="Facebook">
          <svg><!-- facebook icon --></svg>
        </a>
      </div>
    </div>
  </div>

  <div class="footer-bottom">
    <p>&copy; 2024 HairPop. All rights reserved.</p>
  </div>
</footer>
```

---

## Styling

### Header SCSS

```scss
.header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 16px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.logo {
  display: flex;
  align-items: center;

  img {
    height: 40px;
  }
}

.main-nav {
  display: flex;
  gap: 32px;

  a {
    color: #333;
    text-decoration: none;
    font-size: 16px;
    font-weight: 500;
    padding: 8px 0;
    position: relative;

    &::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      width: 0;
      height: 2px;
      background: #333;
      transition: width 0.2s;
    }

    &:hover::after,
    &.active::after {
      width: 100%;
    }
  }
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 16px;
}

.search-button {
  background: none;
  border: none;
  padding: 8px;
  cursor: pointer;
  color: #333;
  border-radius: 50%;
  transition: background 0.2s;

  &:hover {
    background: #f4eef0;
  }
}

.menu-toggle {
  display: none;
  background: none;
  border: none;
  padding: 8px;
  cursor: pointer;
}

// Mobile styles
@media (max-width: 768px) {
  .main-nav {
    position: fixed;
    top: 72px;
    left: 0;
    right: 0;
    background: white;
    flex-direction: column;
    padding: 20px;
    gap: 16px;
    transform: translateY(-100%);
    opacity: 0;
    transition: transform 0.3s, opacity 0.3s;

    &.open {
      transform: translateY(0);
      opacity: 1;
    }
  }

  .menu-toggle {
    display: block;
  }
}
```

### Footer SCSS

```scss
.footer {
  background: #333;
  color: white;
  padding: 60px 20px 20px;
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 40px;
}

.footer-section {
  h4 {
    font-size: 18px;
    font-weight: 600;
    margin-bottom: 20px;
  }

  p {
    color: #999;
    font-size: 14px;
  }

  nav {
    display: flex;
    flex-direction: column;
    gap: 12px;

    a {
      color: #999;
      text-decoration: none;
      font-size: 14px;
      transition: color 0.2s;

      &:hover {
        color: white;
      }
    }
  }
}

.social-links {
  display: flex;
  gap: 16px;

  a {
    color: #999;
    transition: color 0.2s;

    &:hover {
      color: white;
    }
  }
}

.footer-bottom {
  max-width: 1200px;
  margin: 40px auto 0;
  padding-top: 20px;
  border-top: 1px solid #444;
  text-align: center;

  p {
    color: #666;
    font-size: 14px;
  }
}
```

---

## FAB Component

### SPEC-HD-005: Floating Action Button

**Description:** Provide quick action access via floating button.

#### Acceptance Criteria

| ID | Criteria | Status |
|----|----------|--------|
| AC-001 | FAB shall be positioned at bottom right | Pending |
| AC-002 | FAB shall provide booking/contact action | Pending |
| AC-003 | FAB shall have hover/active states | Pending |
| AC-004 | FAB shall hide on scroll down, show on scroll up | Pending |

#### Component Implementation

```typescript
import { Component, HostListener, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'hp-fab',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './fab.component.html',
  styleUrl: './fab.component.scss'
})
export class FabComponent {
  private router = inject(Router);

  isVisible = true;
  lastScrollTop = 0;

  @HostListener('window:scroll', [])
  onScroll(): void {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    if (scrollTop > this.lastScrollTop && scrollTop > 100) {
      this.isVisible = false;
    } else {
      this.isVisible = true;
    }

    this.lastScrollTop = scrollTop;
  }

  onFabClick(): void {
    this.router.navigate(['/search']);
  }
}
```

### FAB Template

```html
<button
  class="fab"
  [class.hidden]="!isVisible"
  (click)="onFabClick()"
  aria-label="Search for braiders">
  <svg xmlns="http://www.w3.org/2000/svg"
       width="24" height="24"
       viewBox="0 0 24 24"
       fill="none"
       stroke="currentColor"
       stroke-width="2">
    <circle cx="11" cy="11" r="8"></circle>
    <path d="m21 21-4.35-4.35"></path>
  </svg>
</button>
```

### FAB SCSS

```scss
.fab {
  position: fixed;
  bottom: 24px;
  right: 24px;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: #333;
  color: white;
  border: none;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.3s, opacity 0.3s, background 0.2s;
  z-index: 900;

  &:hover {
    background: #555;
    transform: scale(1.05);
  }

  &.hidden {
    transform: translateY(100px);
    opacity: 0;
  }
}
```

---

## File Structure

```
projects/app/src/app/header/
├── header.component.ts
├── header.component.html
├── header.component.scss
└── header.component.spec.ts

projects/app/src/app/footer/
├── footer.component.ts
├── footer.component.html
├── footer.component.scss
└── footer.component.spec.ts

projects/app/src/app/fab/
├── fab.component.ts
├── fab.component.html
├── fab.component.scss
└── fab.component.spec.ts
```

---

## App Layout

### Root Component Structure

```html
<!-- app.component.html -->
<hp-header></hp-header>
<main class="main-content">
  <router-outlet></router-outlet>
</main>
<hp-footer></hp-footer>
<hp-fab></hp-fab>
```

### Root Component SCSS

```scss
:host {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.main-content {
  flex: 1;
  padding-top: 72px; // Header height
}
```

---

## Testing

### Unit Tests

```typescript
describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeaderComponent, RouterTestingModule]
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have navigation items', () => {
    expect(component.navItems.length).toBeGreaterThan(0);
  });

  it('should toggle menu', () => {
    expect(component.isMenuOpen).toBeFalsy();
    component.toggleMenu();
    expect(component.isMenuOpen).toBeTruthy();
  });

  it('should close menu', () => {
    component.isMenuOpen = true;
    component.closeMenu();
    expect(component.isMenuOpen).toBeFalsy();
  });

  it('should navigate to search', () => {
    const navigateSpy = jest.spyOn(router, 'navigate');
    component.navigateToSearch();
    expect(navigateSpy).toHaveBeenCalledWith(['/search']);
  });
});
```

---

## Implementation Status

| Component | Feature | Status |
|-----------|---------|--------|
| Header | Component scaffold | Complete |
| Header | Logo display | Complete |
| Header | Navigation links | Complete |
| Header | Search button | Complete |
| Header | Fixed positioning | Pending |
| Header | Mobile menu | Pending |
| Footer | Component scaffold | Complete |
| Footer | Template content | Placeholder |
| FAB | Component scaffold | Complete |
| FAB | Template content | Placeholder |
