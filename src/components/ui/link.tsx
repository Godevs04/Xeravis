'use client'

import NextLink from 'next/link'

/**
 * Use this instead of `next/link` in the public site. When a server component imports `next/link`
 * directly, Next maps that client reference to the Payload admin layout's chunks, so every public
 * page downloads the admin UI, Lexical and date-fns. A frontend-owned client module avoids that.
 */
const Link = NextLink

export default Link
