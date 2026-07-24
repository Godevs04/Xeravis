import type { GlobalConfig } from 'payload'

export { SiteSettings } from './SiteSettings'
export { Navigation } from './Navigation'
export { Footer } from './Footer'
export { ContactDetails } from './ContactDetails'
export { OfficeLocations } from './OfficeLocations'
export { SeoDefaults } from './SeoDefaults'
export { Analytics, AnnouncementBar, CookieBanner, SocialMedia } from './MarketingGlobals'

import { ContactDetails } from './ContactDetails'
import { Footer } from './Footer'
import { Analytics, AnnouncementBar, CookieBanner, SocialMedia } from './MarketingGlobals'
import { Navigation } from './Navigation'
import { OfficeLocations } from './OfficeLocations'
import { SeoDefaults } from './SeoDefaults'
import { SiteSettings } from './SiteSettings'

export const globals: GlobalConfig[] = [
  SiteSettings,
  Navigation,
  Footer,
  ContactDetails,
  OfficeLocations,
  SeoDefaults,
  SocialMedia,
  Analytics,
  AnnouncementBar,
  CookieBanner,
]
