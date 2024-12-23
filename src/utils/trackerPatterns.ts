// Known tracker patterns with detailed categorization
export const trackerPatterns = {
  analytics: [
    { pattern: 'google-analytics.com', name: 'Google Analytics', company: 'Google' },
    { pattern: 'analytics.google.com', name: 'Google Analytics', company: 'Google' },
    { pattern: 'segment.io', name: 'Segment', company: 'Twilio' },
    { pattern: 'mixpanel.com', name: 'Mixpanel', company: 'Mixpanel' }
  ],
  advertising: [
    { pattern: 'doubleclick.net', name: 'DoubleClick', company: 'Google' },
    { pattern: 'facebook.com/tr/', name: 'Facebook Pixel', company: 'Meta' },
    { pattern: 'adnxs.com', name: 'AppNexus', company: 'Microsoft' },
    { pattern: 'criteo.com', name: 'Criteo', company: 'Criteo' }
  ],
  social: [
    { pattern: 'connect.facebook.net', name: 'Facebook Connect', company: 'Meta' },
    { pattern: 'platform.twitter.com', name: 'Twitter Button', company: 'Twitter' },
    { pattern: 'linkedin.com/pixel', name: 'LinkedIn Insight', company: 'LinkedIn' },
    { pattern: 'pinterest.com/ct.js', name: 'Pinterest Tag', company: 'Pinterest' }
  ]
};