import Link from 'next/link'
import React from 'react'

import { cn } from '@/lib/utils'

type LexicalNode = {
  type?: string
  tag?: string
  text?: string
  url?: string
  newTab?: boolean
  children?: LexicalNode[]
  format?: number
}

type LexicalRoot = {
  root?: {
    children?: LexicalNode[]
  }
}

function renderNodes(nodes: LexicalNode[] | undefined, keyPrefix = 'node'): React.ReactNode {
  if (!nodes?.length) return null

  return nodes.map((node, index) => {
    const key = `${keyPrefix}-${index}`

    if (node.type === 'text') {
      let content: React.ReactNode = node.text || ''
      if (node.format === 1) content = <strong>{content}</strong>
      if (node.format === 2) content = <em>{content}</em>
      return <span key={key}>{content}</span>
    }

    if (node.type === 'link' || node.type === 'autolink') {
      const href = node.url || '#'
      return (
        <Link
          key={key}
          href={href}
          target={node.newTab ? '_blank' : undefined}
          rel={node.newTab ? 'noopener noreferrer' : undefined}
          className="text-accent underline-offset-4 hover:underline"
        >
          {renderNodes(node.children, key)}
        </Link>
      )
    }

    if (node.type === 'paragraph') {
      return (
        <p key={key} className="mb-4 leading-relaxed text-secondary last:mb-0">
          {renderNodes(node.children, key)}
        </p>
      )
    }

    if (node.type === 'heading') {
      const Tag = (node.tag || 'h3') as keyof React.JSX.IntrinsicElements
      return (
        <Tag key={key} className="mb-4 mt-8 text-primary first:mt-0">
          {renderNodes(node.children, key)}
        </Tag>
      )
    }

    if (node.type === 'list') {
      const ListTag = node.tag === 'ol' ? 'ol' : 'ul'
      return (
        <ListTag key={key} className="mb-4 ml-6 list-disc space-y-2 text-secondary">
          {renderNodes(node.children, key)}
        </ListTag>
      )
    }

    if (node.type === 'listitem') {
      return <li key={key}>{renderNodes(node.children, key)}</li>
    }

    if (node.type === 'linebreak') {
      return <br key={key} />
    }

    if (node.children?.length) {
      return <React.Fragment key={key}>{renderNodes(node.children, key)}</React.Fragment>
    }

    return null
  })
}

type RichTextProps = {
  content?: LexicalRoot | string | null
  className?: string
}

export function RichText({ content, className }: RichTextProps) {
  if (!content) return null

  if (typeof content === 'string') {
    return <div className={cn('prose-spacing text-secondary', className)}>{content}</div>
  }

  const children = content.root?.children
  if (!children?.length) return null

  return <div className={cn('prose-spacing', className)}>{renderNodes(children)}</div>
}
