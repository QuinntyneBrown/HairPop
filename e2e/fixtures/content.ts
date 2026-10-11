import type { PublishedContent } from '../../frontend/projects/api/src/public-api';

import type { ApiRule } from './api';

/** Help content as published: the four topics (docs/mocks/pages/help). */
export const helpContent: PublishedContent = {
  slug: 'help',
  title: 'How can we help?',
  effectiveDate: null,
  sections: [
    {
      id: 'requests',
      heading: 'How requests work',
      paragraphs: ['A request becomes an appointment only when the braider accepts it.'],
    },
    {
      id: 'estimates',
      heading: 'Prices and estimates',
      paragraphs: ['Typical ranges guide you; your braider confirms the final price.'],
    },
    {
      id: 'changes',
      heading: 'Changing an appointment',
      paragraphs: ['Request a new offered time; your current time stays until accepted.'],
    },
    {
      id: 'reviews',
      heading: 'Reviews',
      paragraphs: ['Review a completed visit once. Report a review that breaks the rules.'],
    },
  ],
  supportEmail: 'support@hairpop.example',
};

/** Terms as approved on 1 Oct 2026 (docs/mocks/pages/terms). */
export const termsContent: PublishedContent = {
  slug: 'terms',
  title: 'Terms of use',
  effectiveDate: '2026-10-01',
  sections: [
    {
      id: 'using',
      heading: 'Using HairPop',
      paragraphs: [
        'HairPop helps customers discover independent braiders and send appointment requests. A request is pending until the braider accepts it.',
      ],
    },
    {
      id: 'prices',
      heading: 'Prices and appointments',
      paragraphs: [
        'Prices shown before acceptance are estimates. The braider confirms the time, place and final price when they accept.',
      ],
    },
    {
      id: 'reviews',
      heading: 'Reviews',
      paragraphs: [
        'Reviews describe real, completed visits. We may remove reviews that break these terms after moderation.',
      ],
    },
  ],
  supportEmail: null,
};

/** Privacy information as approved on 1 Oct 2026 (docs/mocks/pages/privacy). */
export const privacyContent: PublishedContent = {
  slug: 'privacy',
  title: 'Privacy at HairPop',
  effectiveDate: '2026-10-01',
  sections: [
    {
      id: 'information',
      heading: 'Your information',
      paragraphs: [
        'We use your name, email and phone to manage requests and let your braider reach you. Hair details are shared only with the braider you request.',
      ],
    },
    {
      id: 'cookies',
      heading: 'Cookies and storage',
      paragraphs: [
        'Essential storage keeps you signed in. Optional usage data is stored only if you allow it, and you can change that choice in Cookie preferences.',
      ],
    },
    {
      id: 'choices',
      heading: 'Your choices',
      paragraphs: [
        'Update your contact details in Account settings. Contact support@hairpop.example for help with your information.',
      ],
    },
  ],
  supportEmail: 'support@hairpop.example',
};

/** GET /api/content/{slug}. */
export function getContent(content: PublishedContent, extra: Partial<ApiRule> = {}): ApiRule {
  return { method: 'GET', path: `/api/content/${content.slug}`, body: content, ...extra };
}
