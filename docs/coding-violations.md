# Coding Guidelines Violations Report

**Audit Date:** 2026-01-20
**Audited Directory:** `src/WebApp/projects/app/src`
**Reference:** `docs/coding-guidelines.md`

---

## Summary

| Category | Violations Found | Severity |
|----------|-----------------|----------|
| Reactive Data Loading Pattern (7.7) | 2 files | High |
| Custom Colors (7.2, 7.8) | 13 files | Medium |
| BEM Class Naming (7.8) | 11 files | Medium |
| Angular Material Not Used (7.2) | All components | High |

---

## 1. Reactive Data Loading Pattern Violations (Section 7.7)

**Guideline:** Components SHALL use the async pipe pattern with observables. DO NOT manually call `.subscribe()` for data loading.

### 1.1 `pages/braider-page/braider-page.ts`

**Location:** Lines 44, 108-113

**Violation:** Uses `OnInit` with manual `.subscribe()` and maintains local state properties.

```typescript
// NON-COMPLIANT
export class BraiderPage implements OnInit {
  braider: Braider = { ... };  // Local state property
  reviews: Review[] = [ ... ]; // Local state property

  ngOnInit(): void {
    this.route.params.subscribe(params => {  // Manual subscribe
      const braiderId = params['id'];
    });
  }
}
```

**Compliant Pattern:**

```typescript
// COMPLIANT
export class BraiderPage {
  private _route = inject(ActivatedRoute);
  private _braiderService = inject(BraiderService);

  viewModel$ = this._route.params.pipe(
    switchMap(params => this._braiderService.getBraider(params['id'])),
    map(braider => ({ braider, reviews: braider.reviews }))
  );
}
```

```html
<!-- Template -->
<ng-container *ngIf="viewModel$ | async as vm">
  <h1>{{ vm.braider.name }}</h1>
</ng-container>
```

---

### 1.2 `pages/search-results-page/search-results-page.ts`

**Location:** Lines 24, 98-103

**Violation:** Uses `OnInit` with manual `.subscribe()` and maintains local state properties.

```typescript
// NON-COMPLIANT
export class SearchResultsPage implements OnInit {
  searchQuery = '';
  filteredBraiders: Braider[] = [];  // Local state duplicating observable data

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {  // Manual subscribe
      this.searchQuery = params['q'] || '';
      this.filterBraiders();
    });
  }
}
```

**Compliant Pattern:**

```typescript
// COMPLIANT
export class SearchResultsPage {
  private _route = inject(ActivatedRoute);
  private _braiderService = inject(BraiderService);

  viewModel$ = this._route.queryParams.pipe(
    map(params => params['q'] || ''),
    switchMap(query => this._braiderService.search(query)),
    map(braiders => ({ braiders, count: braiders.length }))
  );
}
```

---

## 2. Custom Colors Violations (Sections 7.2, 7.8)

**Guideline:** Only default Angular Material colors and theme SHALL be used. Colors not defined in Angular Material theme are prohibited.

### Custom Colors Found

| Color | Hex Code | Usage |
|-------|----------|-------|
| Primary Orange | `#FF6B35` | Buttons, accents, gradients |
| Primary Orange Hover | `#e55a2a` | Button hover states |
| Orange Gradient | `#ff8555` | Gradient backgrounds |
| Star Yellow | `#FFB800` | Rating stars |
| Text Dark | `#333` | Headings, primary text |
| Text Medium | `#555` | Secondary text |
| Text Light | `#666` | Tertiary text, descriptions |
| Text Muted | `#999` | Timestamps, metadata |
| Background Light | `#f8f9fa` | Card backgrounds, sections |
| Border | `#e0e0e0` | Card borders |
| Border Light | `#ddd` | Input borders |
| White | `#ffffff` / `white` | Backgrounds, text on dark |

### Files with Violations

| File | Line Numbers |
|------|--------------|
| `styles.scss` | 11, 12 |
| `app.scss` | - |
| `components/header/header.scss` | 6, 37, 44 |
| `components/footer/footer.scss` | 5, 8 |
| `pages/search-page/search-page.scss` | 13, 17, 24, 34, 49, 59, 66, 72, 87, 104, 108, 116, 132 |
| `pages/search-results-page/search-results-page.scss` | 35, 47, 64, 71, 80, 106, 107, 123, 144, 148, 163, 167, 179, 183 |
| `pages/braiders-page/braiders-page.scss` | 17, 23, 37, 48, 65, 66, 81, 102, 106, 121, 125, 130, 144, 148, 156, 166, 177, 178, 186 |
| `pages/braider-page/braider-page.scss` | 27, 32, 46, 51, 67, 88, 92, 103, 113, 120, 121, 129, 155, 173, 190, 205, 209, 214, 229, 237, 250, 255, 267, 274, 278 |
| `pages/hair-styles-page/hair-styles-page.scss` | 11, 17, 23, 39, 40, 46, 50, 51, 52, 64, 80, 81, 96, 111, 115, 129, 134, 144, 154, 161, 177, 178 |

**Remediation:** Replace all hardcoded colors with Angular Material theme variables:

```scss
// NON-COMPLIANT
.button {
  background-color: #FF6B35;
  color: white;
}

// COMPLIANT (after Angular Material integration)
@use '@angular/material' as mat;

.button {
  background-color: mat.get-theme-color($theme, primary);
  color: mat.get-theme-color($theme, on-primary);
}
```

---

## 3. BEM Class Naming Violations (Section 7.8)

**Guideline:** BEM HTML class naming strategy SHALL be used (Block__Element--Modifier).

### Files with Non-BEM Class Names

#### `components/header/header.html`

| Current Class | BEM Equivalent |
|---------------|----------------|
| `header` | `header` (block - OK) |
| `container` | `header__container` |
| `logo-nav` | `header__nav-wrapper` |
| `logo` | `header__logo` |
| `nav` | `header__nav` |
| `menu-icon` | `header__menu-icon` |

#### `components/footer/footer.html`

| Current Class | BEM Equivalent |
|---------------|----------------|
| `footer` | `footer` (block - OK) |
| `container` | `footer__container` |

#### `pages/search-page/search-page.html`

| Current Class | BEM Equivalent |
|---------------|----------------|
| `hero` | `search-page__hero` |
| `container` | `search-page__container` |
| `search-box` | `search-page__search-box` |
| `features` | `search-page__features` |
| `feature-grid` | `search-page__feature-grid` |
| `feature-card` | `search-page__feature-card` |
| `feature-icon` | `search-page__feature-icon` |
| `cta` | `search-page__cta` |

#### `pages/braiders-page/braiders-page.html`

| Current Class | BEM Equivalent |
|---------------|----------------|
| `page-header` | `braiders-page__header` |
| `controls` | `braiders-page__controls` |
| `results-count` | `braiders-page__results-count` |
| `sort-by` | `braiders-page__sort` |
| `braiders-grid` | `braiders-page__grid` |
| `braider-card` | `braider-card` (block) |
| `braider-image` | `braider-card__image` |
| `braider-info` | `braider-card__info` |
| `braider-name` | `braider-card__name` |
| `braider-location` | `braider-card__location` |
| `braider-rating` | `braider-card__rating` |
| `braider-bio` | `braider-card__bio` |
| `braider-specialties` | `braider-card__specialties` |
| `specialty-tag` | `braider-card__specialty-tag` |
| `view-profile-btn` | `braider-card__button` |
| `load-more` | `braiders-page__load-more` |

#### `pages/braider-page/braider-page.html`

| Current Class | BEM Equivalent |
|---------------|----------------|
| `profile-hero` | `braider-page__hero` |
| `profile-header` | `braider-page__header` |
| `profile-image` | `braider-page__image` |
| `profile-details` | `braider-page__details` |
| `rating-section` | `braider-page__rating` |
| `specialty-badge` | `braider-page__specialty` |
| `action-buttons` | `braider-page__actions` |
| `btn-primary` | `braider-page__button--primary` |
| `btn-secondary` | `braider-page__button--secondary` |
| `content-section` | `braider-page__content` |
| `content-grid` | `braider-page__content-grid` |
| `review-card` | `review-card` (block) |
| `review-header` | `review-card__header` |
| `reviewer-name` | `review-card__name` |
| `review-date` | `review-card__date` |
| `review-rating` | `review-card__rating` |
| `review-text` | `review-card__text` |
| `info-card` | `info-card` (block) |
| `info-item` | `info-card__item` |
| `info-label` | `info-card__label` |
| `info-value` | `info-card__value` |
| `stat-item` | `stats__item` |
| `stat-number` | `stats__number` |
| `stat-label` | `stats__label` |

#### `pages/search-results-page/search-results-page.html`

| Current Class | BEM Equivalent |
|---------------|----------------|
| `search-header` | `search-results__header` |
| `search-box` | `search-results__search-box` |
| `results-info` | `search-results__info` |
| `main-content` | `search-results__main` |
| `filters-results` | `search-results__layout` |
| `filters` | `search-results__filters` |
| `filter-group` | `filter__group` |
| `filter-option` | `filter__option` |
| `results-grid` | `search-results__grid` |

#### `pages/hair-styles-page/hair-styles-page.html`

| Current Class | BEM Equivalent |
|---------------|----------------|
| `page-header` | `hair-styles__header` |
| `categories` | `hair-styles__categories` |
| `category-btn` | `hair-styles__category-btn` |
| `gallery-section` | `hair-styles__gallery` |
| `category-title` | `hair-styles__title` |
| `styles-grid` | `hair-styles__grid` |
| `style-card` | `style-card` (block) |
| `style-image` | `style-card__image` |
| `style-info` | `style-card__info` |
| `style-name` | `style-card__name` |
| `style-description` | `style-card__description` |
| `style-meta` | `style-card__meta` |
| `find-braider-btn` | `style-card__button` |

---

## 4. Angular Material Not Used (Section 7.2)

**Guideline:** UI Library SHALL be latest stable Angular Material.

**Finding:** The project does not import or use Angular Material. All UI components are custom-built with plain HTML elements and custom SCSS styling.

**Required Actions:**

1. Install Angular Material:
   ```bash
   ng add @angular/material
   ```

2. Replace custom components with Material equivalents:
   - Buttons: `<button mat-button>`, `<button mat-raised-button>`
   - Cards: `<mat-card>`
   - Inputs: `<mat-form-field>`, `<input matInput>`
   - Select: `<mat-select>`
   - Icons: `<mat-icon>`

3. Configure theme in `styles.scss`:
   ```scss
   @use '@angular/material' as mat;

   $hairpop-theme: mat.define-theme((
     color: (
       theme-type: light,
       primary: mat.$orange-palette,
     )
   ));

   html {
     @include mat.all-component-themes($hairpop-theme);
   }
   ```

---

## Compliant Areas

The following areas are compliant with the coding guidelines:

| Guideline | Status |
|-----------|--------|
| Component file structure (7.3) | Compliant - Files named `header.html`, `header.scss`, `header.ts` |
| Component class naming (7.4) | Compliant - Classes named `Header`, `Footer`, `BraiderPage` |
| Barrel exports (7.5) | Compliant - `index.ts` files exist in `components/` and `pages/` |
| No NgRx (7.2) | Compliant - No NgRx imports found |
| No Angular signals (7.2) | Compliant - No signal/computed/effect usage found |

---

## Remediation Priority

| Priority | Issue | Effort |
|----------|-------|--------|
| 1 | Integrate Angular Material | High |
| 2 | Replace custom colors with Material theme | Medium |
| 3 | Refactor to async pipe pattern | Medium |
| 4 | Rename classes to BEM convention | Low |

---

**End of Report**
