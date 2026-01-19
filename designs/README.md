# HairPop Page Designs

This directory contains HTML mockups and PNG screenshots of redesigned pages for the HairPop application.

## Design Guidelines

- **Background**: White (#ffffff)
- **Primary Color**: Orange (#FF6B35)
- **Logo**: HairPop logo included in header
- **Typography**: Segoe UI font family
- **Style**: Modern, clean, and professional design

## Pages Included

### 1. Search Page (Landing Page)
- **File**: `search-page.html`
- **Screenshot**: `search-page.png`
- **Description**: Main landing page with hero section, search functionality, and feature highlights
- **Features**:
  - Large hero section with search bar
  - "Why Choose HairPop?" feature cards
  - Call-to-action section
  - Navigation menu with logo

### 2. Search Results Page
- **File**: `search-results-page.html`
- **Screenshot**: `search-results-page.png`
- **Description**: Search results with filters and braider cards
- **Features**:
  - Search bar with current query
  - Sidebar filters (distance, rating, specialties)
  - Grid of braider cards with ratings and specialties
  - Results count display

### 3. Braiders Page (All Braiders Listing)
- **File**: `braiders-page.html`
- **Screenshot**: `braiders-page.png`
- **Description**: Complete directory of all professional braiders
- **Features**:
  - Sort functionality
  - Grid layout with detailed braider cards
  - Bio snippets and specialties
  - "View Profile" buttons
  - Pagination support

### 4. Braider Page (Individual Profile)
- **File**: `braider-page.html`
- **Screenshot**: `braider-page.png`
- **Description**: Detailed profile page for individual braider
- **Features**:
  - Large profile image with key information
  - "Book Appointment" and "Send Message" CTAs
  - About section with detailed bio
  - Portfolio gallery
  - Client reviews with ratings
  - Sidebar with quick info, stats, and pricing

### 5. Hair Styles Page (Gallery)
- **File**: `hair-styles-page.html`
- **Screenshot**: `hair-styles-page.png`
- **Description**: Gallery of hair braiding styles with categories
- **Features**:
  - Category filter buttons
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

### Interactive Elements
- Hover effects on cards and buttons
- Filter options and category selectors
- Search functionality
- Rating displays with stars
- Specialty tags/badges

## Files in This Directory

- `logo.png` - HairPop logo image
- `search-page.html` - Landing/search page mockup
- `search-page.png` - Screenshot of search page
- `search-results-page.html` - Search results page mockup
- `search-results-page.png` - Screenshot of search results
- `braiders-page.html` - All braiders listing mockup
- `braiders-page.png` - Screenshot of braiders listing
- `braider-page.html` - Individual braider profile mockup
- `braider-page.png` - Screenshot of braider profile
- `hair-styles-page.html` - Hair styles gallery mockup
- `hair-styles-page.png` - Screenshot of hair styles gallery
- `README.md` - This documentation file

## Notes

- All HTML files are self-contained with inline CSS
- Emoji icons are used as placeholders for images
- The designs follow modern web design best practices
- All pages feature the HairPop branding and logo
- Color scheme is consistent across all pages
