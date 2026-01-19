# HairPop Page Designs

This directory contains HTML mockups and PNG screenshots of redesigned pages for the HairPop application, including both desktop and mobile versions.

## Design Guidelines

- **Background**: White (#ffffff)
- **Primary Color**: Orange (#FF6B35)
- **Logo**: HairPop logo included in header
- **Typography**: Segoe UI font family
- **Style**: Modern, clean, and professional design
- **Responsive**: Desktop (1200px) and Mobile (375px) versions included

## Pages Included

Each page has both desktop and mobile versions:

### 1. Search Page (Landing Page)
- **Desktop Files**: `search-page.html`, `search-page.png`
- **Mobile Files**: `search-page-mobile.html`, `search-page-mobile.png`
- **Description**: Main landing page with hero section, search functionality, and feature highlights
- **Features**:
  - Large hero section with search bar
  - "Why Choose HairPop?" feature cards
  - Call-to-action section
  - Navigation menu with logo (hamburger menu on mobile)

### 2. Search Results Page
- **Desktop Files**: `search-results-page.html`, `search-results-page.png`
- **Mobile Files**: `search-results-page-mobile.html`, `search-results-page-mobile.png`
- **Description**: Search results with filters and braider cards
- **Features**:
  - Search bar with current query
  - Sidebar filters on desktop / Filter button on mobile
  - Grid of braider cards with ratings and specialties
  - Results count display

### 3. Braiders Page (All Braiders Listing)
- **Desktop Files**: `braiders-page.html`, `braiders-page.png`
- **Mobile Files**: `braiders-page-mobile.html`, `braiders-page-mobile.png`
- **Description**: Complete directory of all professional braiders
- **Features**:
  - Sort functionality
  - Grid layout (3 columns desktop, 1 column mobile)
  - Bio snippets and specialties
  - "View Profile" buttons
  - Pagination support

### 4. Braider Page (Individual Profile)
- **Desktop Files**: `braider-page.html`, `braider-page.png`
- **Mobile Files**: `braider-page-mobile.html`, `braider-page-mobile.png`
- **Description**: Detailed profile page for individual braider
- **Features**:
  - Large profile image with key information
  - "Book Appointment" and "Send Message" CTAs
  - About section with detailed bio
  - Portfolio gallery (6 items desktop, 6 items mobile)
  - Client reviews with ratings
  - Stats, quick info, and pricing information

### 5. Hair Styles Page (Gallery)
- **Desktop Files**: `hair-styles-page.html`, `hair-styles-page.png`
- **Mobile Files**: `hair-styles-page-mobile.html`, `hair-styles-page-mobile.png`
- **Description**: Gallery of hair braiding styles with categories
- **Features**:
  - Category filter buttons (scrollable on mobile)
  - Style cards organized by category
  - Detailed descriptions with pricing and time estimates
  - "Find a Braider" CTA for each style
  - Multiple categories: Box Braids, Knotless, Cornrows & Feed-ins, Twists

## Viewing the Mockups

### Option 1: Open HTML Files Directly
You can open the HTML files in any modern web browser:
```bash
# Navigate to the designs folder
cd designs

# Open in default browser (example)
open search-page.html  # macOS
xdg-open search-page.html  # Linux
start search-page.html  # Windows
```

### Option 2: Use a Local Web Server
For best results, serve the files from a local web server:
```bash
# Using Python 3
cd designs
python3 -m http.server 8080

# Then visit http://localhost:8080/search-page.html
```

### Option 3: View PNG Screenshots
Simply open the PNG files to see full-page screenshots of each design.

## Design Features

### Common Elements
- Consistent header with HairPop logo and navigation
- Orange (#FF6B35) accent color for buttons and highlights
- Clean white background throughout
- Card-based layouts with subtle shadows
- Responsive grid systems
- Professional typography and spacing
- Mobile-optimized with hamburger menu and touch-friendly buttons

### Mobile-Specific Features
- Viewport optimized for 375px width (iPhone size)
- Hamburger menu icon for navigation
- Single-column layouts for easy scrolling
- Larger touch targets for buttons and interactive elements
- Horizontal scrolling for category filters
- Stacked action buttons for better mobile usability
- Optimized font sizes for readability on small screens

### Interactive Elements
- Hover effects on cards and buttons
- Filter options and category selectors
- Search functionality
- Rating displays with stars
- Specialty tags/badges

## Files in This Directory

### Desktop Versions
- `search-page.html` / `search-page.png` - Desktop landing/search page
- `search-results-page.html` / `search-results-page.png` - Desktop search results
- `braiders-page.html` / `braiders-page.png` - Desktop braiders listing
- `braider-page.html` / `braider-page.png` - Desktop braider profile
- `hair-styles-page.html` / `hair-styles-page.png` - Desktop hair styles gallery

### Mobile Versions (375px viewport)
- `search-page-mobile.html` / `search-page-mobile.png` - Mobile landing/search page
- `search-results-page-mobile.html` / `search-results-page-mobile.png` - Mobile search results
- `braiders-page-mobile.html` / `braiders-page-mobile.png` - Mobile braiders listing
- `braider-page-mobile.html` / `braider-page-mobile.png` - Mobile braider profile
- `hair-styles-page-mobile.html` / `hair-styles-page-mobile.png` - Mobile hair styles gallery

### Other Files
- `logo.png` - HairPop logo image
- `README.md` - This documentation file

## Notes

- All HTML files are self-contained with inline CSS
- Emoji icons are used as placeholders for images
- The designs follow modern web design best practices
- All pages feature the HairPop branding and logo
- Color scheme is consistent across all pages
- Desktop versions optimized for 1200px max-width
- Mobile versions optimized for 375px width (iPhone viewport)
- Both versions maintain the same white background and orange accent color
