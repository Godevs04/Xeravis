import type { CollectionConfig } from 'payload'

import { isAdmin, isAdminOrEditor, staffRead } from '@/payload/access'
import { trackActivity } from '@/payload/hooks/activity'

export const ContactMessages: CollectionConfig = {
  slug: 'contact-messages',
  labels: {
    singular: 'Lead',
    plural: 'Leads',
  },
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['name', 'email', 'subject', 'status', 'assignee', 'createdAt'],
    group: 'Marketing',
  },
  access: {
    read: staffRead,
    create: () => false,
    update: isAdminOrEditor,
    delete: isAdmin,
  },
  hooks: {
    afterChange: [trackActivity('contact-messages')],
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'company', type: 'text' },
    { name: 'email', type: 'email', required: true },
    { name: 'phone', type: 'text' },
    { name: 'subject', type: 'text' },
    { name: 'message', type: 'textarea', required: true },
    {
      name: 'intent',
      type: 'select',
      options: [
        { label: 'AI & Machine Learning', value: 'business' },
        { label: 'Data Science & Analytics', value: 'data-science' },
        { label: 'IT Consulting', value: 'it-consulting' },
        { label: 'Digital Transformation', value: 'digital-transformation' },
        { label: 'Data Engineering', value: 'data-engineering' },
        { label: 'Healthcare / Clinical Data Science', value: 'healthcare' },
        { label: 'Research Collaboration', value: 'research' },
        { label: 'Partnership', value: 'partnership' },
        { label: 'Careers', value: 'career' },
        { label: 'General Contact', value: 'general' },
        { label: 'Project (legacy)', value: 'project' },
      ],
    },
    { name: 'jobTitle', type: 'text', label: 'Job title' },
    { name: 'country', type: 'text' },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'new',
      options: [
        { label: 'New', value: 'new' },
        { label: 'Assigned', value: 'assigned' },
        { label: 'Meeting', value: 'meeting' },
        { label: 'Proposal', value: 'proposal' },
        { label: 'Won', value: 'won' },
        { label: 'Lost', value: 'lost' },
        { label: 'In progress (legacy)', value: 'in-progress' },
        { label: 'Closed (legacy)', value: 'closed' },
      ],
    },
    {
      name: 'assignee',
      type: 'relationship',
      relationTo: 'users',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'meetingAt',
      type: 'date',
      admin: {
        date: { pickerAppearance: 'dayAndTime' },
        position: 'sidebar',
      },
    },
    {
      name: 'nextFollowUp',
      type: 'date',
      admin: {
        date: { pickerAppearance: 'dayAndTime' },
        position: 'sidebar',
      },
    },
    {
      name: 'dealValue',
      type: 'number',
      admin: {
        position: 'sidebar',
        description: 'Optional estimated deal value',
      },
    },
    {
      name: 'activityNotes',
      type: 'array',
      labels: { singular: 'Note', plural: 'Activity notes' },
      fields: [
        { name: 'note', type: 'textarea', required: true },
        {
          name: 'at',
          type: 'date',
          admin: { date: { pickerAppearance: 'dayAndTime' } },
        },
      ],
    },
    { name: 'notes', type: 'textarea', admin: { description: 'Internal summary notes' } },
  ],
}
