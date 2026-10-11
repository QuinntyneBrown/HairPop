import { Routes } from '@angular/router';
import { COMPONENT_EXAMPLES } from '@hairpop/components-examples';

export const routes: Routes = [
  ...COMPONENT_EXAMPLES.map((entry) => ({
    path: entry.id,
    title: `${entry.title} · HairPop Storybook`,
    data: { heading: entry.title },
    loadComponent: entry.load,
  })),
  { path: '**', redirectTo: COMPONENT_EXAMPLES[0].id },
];
