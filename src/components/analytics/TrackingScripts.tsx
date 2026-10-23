import Script from 'next/script'

import { AnalyticsConsent } from '@/components/analytics/AnalyticsConsent'
import { getGlobal } from '@/lib/cms'
import type { Analytics } from '@/payload/generated-types/payload-types'

/** Tag IDs are interpolated into inline scripts, so only plain ID characters are accepted. */
const safeId = (value?: string | null) => {
  const id = value?.trim()
  return id && /^[A-Za-z0-9_-]{2,40}$/.test(id) ? id : undefined
}

/**
 * Third-party tags. Env vars win (per-deployment overrides); otherwise the CMS Analytics global
 * (Settings → Analytics) supplies the IDs. Nothing loads until the visitor accepts cookies when
 * the cookie banner is enabled.
 */
export async function TrackingScripts({ consentRequired }: { consentRequired: boolean }) {
  const cms = await getGlobal<Analytics>('analytics')
  const ga = safeId(process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID) || safeId(cms?.googleAnalyticsId)
  const gtm = safeId(process.env.NEXT_PUBLIC_GTM_ID) || safeId(cms?.googleTagManagerId)
  const clarity = safeId(process.env.NEXT_PUBLIC_CLARITY_ID) || safeId(cms?.microsoftClarityId)

  return (
    <AnalyticsConsent consentRequired={consentRequired}>
      {gtm ? (
        <Script id="gtm" strategy="afterInteractive">{`
          (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
          new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
          j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
          'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer','${gtm}');
        `}</Script>
      ) : null}

      {ga && !gtm ? (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${ga}`}
            strategy="afterInteractive"
          />
          <Script id="ga4" strategy="afterInteractive">{`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${ga}', { anonymize_ip: true });
          `}</Script>
        </>
      ) : null}

      {clarity ? (
        <Script id="ms-clarity" strategy="afterInteractive">{`
          (function(c,l,a,r,i,t,y){
            c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
            t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
            y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
          })(window, document, "clarity", "script", "${clarity}");
        `}</Script>
      ) : null}
    </AnalyticsConsent>
  )
}
