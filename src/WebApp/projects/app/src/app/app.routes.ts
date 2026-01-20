import { Routes } from '@angular/router';
import { SearchPage } from './pages/search-page/search-page';
import { SearchResultsPage } from './pages/search-results-page/search-results-page';
import { BraidersPage } from './pages/braiders-page/braiders-page';
import { BraiderPage } from './pages/braider-page/braider-page';
import { HairStylesPage } from './pages/hair-styles-page/hair-styles-page';

export const routes: Routes = [
  { path: '', component: SearchPage },
  { path: 'search-results', component: SearchResultsPage },
  { path: 'braiders', component: BraidersPage },
  { path: 'braider/:id', component: BraiderPage },
  { path: 'hair-styles', component: HairStylesPage },
  { path: '**', redirectTo: '' }
];
