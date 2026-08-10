'use client'

import React, { useCallback, useEffect, useRef } from 'react'

/**
 * Non-invasive API tab enhancer for Payload's .query-inspector.
 * Injects Copy / Download / Expand / Collapse / Search without replacing fetch logic.
 */
export function ApiViewPolish() {
  const mountedFor = useRef<HTMLElement | null>(null)

  const tearDown = useCallback(() => {
    const existing = document.querySelector('.xe-api-toolbar')
    existing?.remove()
    mountedFor.current = null
  }, [])

  const setup = useCallback(() => {
    const root = document.querySelector<HTMLElement>('.query-inspector')
    const resultsWrap = document.querySelector<HTMLElement>('.query-inspector__results-wrapper')
    const results = document.querySelector<HTMLElement>('.query-inspector__results')
    if (!root || !resultsWrap || !results) {
      tearDown()
      return
    }
    if (mountedFor.current === resultsWrap && resultsWrap.querySelector('.xe-api-toolbar')) return

    tearDown()
    mountedFor.current = resultsWrap

    const toolbar = document.createElement('div')
    toolbar.className = 'xe-api-toolbar'
    toolbar.setAttribute('data-xe-api-toolbar', '1')

    const search = document.createElement('input')
    search.type = 'search'
    search.className = 'xe-api-toolbar__search'
    search.placeholder = 'Search JSON…'
    search.setAttribute('aria-label', 'Search JSON')

    const mkBtn = (label: string, title: string, onClick: () => void) => {
      const btn = document.createElement('button')
      btn.type = 'button'
      btn.className = 'xe-api-toolbar__btn'
      btn.textContent = label
      btn.title = title
      btn.addEventListener('click', onClick)
      return btn
    }

    const getJsonText = () => results.innerText || ''

    const copyBtn = mkBtn('Copy', 'Copy JSON', async () => {
      try {
        await navigator.clipboard.writeText(getJsonText())
        copyBtn.textContent = 'Copied'
        window.setTimeout(() => {
          copyBtn.textContent = 'Copy'
        }, 1200)
      } catch {
        copyBtn.textContent = 'Failed'
        window.setTimeout(() => {
          copyBtn.textContent = 'Copy'
        }, 1200)
      }
    })

    const downloadBtn = mkBtn('Download', 'Download JSON', () => {
      const blob = new Blob([getJsonText()], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `payload-api-${Date.now()}.json`
      a.click()
      URL.revokeObjectURL(url)
    })

    const setAllOpen = (open: boolean) => {
      const toggles = results.querySelectorAll<HTMLButtonElement>('.query-inspector__list-toggle')
      toggles.forEach((toggle) => {
        const icon = toggle.querySelector('.query-inspector__toggle-row-icon')
        const isOpen = icon?.className.includes('--open')
        if (open && !isOpen) toggle.click()
        if (!open && isOpen) toggle.click()
      })
    }

    const expandBtn = mkBtn('Expand', 'Expand all', () => setAllOpen(true))
    const collapseBtn = mkBtn('Collapse', 'Collapse all', () => setAllOpen(false))

    const refreshBtn = mkBtn('Refresh', 'Refresh response', () => {
      // Re-trigger Payload fetch by toggling depth slightly via depth input blur cycle
      const depthInput = root.querySelector<HTMLInputElement>('input[name="depth"], #field-depth')
      if (depthInput) {
        const v = depthInput.value
        depthInput.dispatchEvent(new Event('input', { bubbles: true }))
        depthInput.dispatchEvent(new Event('change', { bubbles: true }))
        depthInput.value = v
        depthInput.dispatchEvent(new Event('change', { bubbles: true }))
      }
      window.location.reload()
    })

    let searchTimer: number | undefined
    search.addEventListener('input', () => {
      window.clearTimeout(searchTimer)
      searchTimer = window.setTimeout(() => {
        const q = search.value.trim().toLowerCase()
        results.querySelectorAll('.xe-api-hit').forEach((el) => el.classList.remove('xe-api-hit'))
        if (!q) return
        const walker = document.createTreeWalker(results, NodeFilter.SHOW_TEXT)
        const hits: Text[] = []
        let node = walker.nextNode()
        while (node) {
          if (node.textContent && node.textContent.toLowerCase().includes(q)) {
            hits.push(node as Text)
          }
          node = walker.nextNode()
        }
        hits.slice(0, 80).forEach((textNode) => {
          const parent = textNode.parentElement
          if (parent) parent.classList.add('xe-api-hit')
        })
      }, 160)
    })

    toolbar.append(search, copyBtn, downloadBtn, expandBtn, collapseBtn, refreshBtn)

    const fullscreen = resultsWrap.querySelector(
      '.query-inspector__toggle-fullscreen-button-container',
    )
    if (fullscreen?.nextSibling) {
      resultsWrap.insertBefore(toolbar, fullscreen.nextSibling)
    } else {
      resultsWrap.insertBefore(toolbar, results)
    }
  }, [tearDown])

  useEffect(() => {
    setup()
    const obs = new MutationObserver(() => {
      window.requestAnimationFrame(setup)
    })
    obs.observe(document.body, { childList: true, subtree: true })
    return () => {
      obs.disconnect()
      tearDown()
    }
  }, [setup, tearDown])

  return null
}

export default ApiViewPolish
