import type { CollectionConfig } from 'payload'

import { canManageCareers, isAdmin, staffRead } from '@/payload/access'
import { trackActivity } from '@/payload/hooks/activity'
import { notifyInterview, prepareInterview, validateInterview } from '@/payload/hooks/recruitment'

export const Interviews: CollectionConfig = {
  slug: 'interviews',
  labels: {
    singular: 'Interview',
    plural: 'Interviews',
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'round', 'scheduledAt', 'mode', 'outcome', 'updatedAt'],
    group: 'Careers',
  },
  access: {
    read: staffRead,
    create: canManageCareers,
    update: canManageCareers,
    delete: isAdmin,
  },
  hooks: {
    beforeChange: [prepareInterview, validateInterview],
    afterChange: [trackActivity('interviews'), notifyInterview],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      admin: {
        description:
          'Leave blank to generate it, e.g. "Technical interview · Jane Doe · AI Engineer".',
      },
    },
    {
      name: 'application',
      type: 'relationship',
      relationTo: 'job-applications',
      required: true,
      admin: { description: 'Candidate being interviewed.' },
    },
    {
      name: 'job',
      type: 'relationship',
      relationTo: 'careers',
      admin: { description: 'Filled from the application when left blank.' },
    },
    {
      name: 'round',
      type: 'select',
      required: true,
      defaultValue: 'screening',
      options: [
        { label: 'Screening call', value: 'screening' },
        { label: 'Technical interview', value: 'technical' },
        { label: 'Final interview', value: 'final' },
        { label: 'HR discussion', value: 'hr' },
      ],
      admin: {
        description:
          'Sets the wording of the invitation and moves the candidate forward (screening/technical → Interview Scheduled, final/HR → Final Interview).',
      },
    },
    {
      name: 'interviewers',
      type: 'relationship',
      relationTo: 'users',
      hasMany: true,
      admin: { description: 'Each interviewer receives the invitation with the meeting link.' },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'scheduledAt',
          type: 'date',
          required: true,
          admin: {
            width: '60%',
            date: {
              pickerAppearance: 'dayAndTime',
            },
          },
        },
        {
          name: 'durationMinutes',
          label: 'Duration (minutes)',
          type: 'number',
          required: true,
          defaultValue: 45,
          min: 15,
          max: 480,
          admin: { width: '40%', step: 15 },
        },
      ],
    },
    {
      name: 'mode',
      type: 'select',
      required: true,
      defaultValue: 'video',
      options: [
        { label: 'Video', value: 'video' },
        { label: 'Onsite', value: 'onsite' },
        { label: 'Phone', value: 'phone' },
      ],
    },
    {
      name: 'meetingLink',
      type: 'text',
      validate: (value: string | null | undefined) => {
        if (!value) return true
        try {
          return new URL(value).protocol === 'https:' || 'Use a full https:// meeting link'
        } catch {
          return 'Use a full https:// meeting link'
        }
      },
      admin: {
        condition: (_, siblingData) => siblingData?.mode === 'video',
        placeholder: 'https://meet.google.com/...',
        description:
          'Paste a Google Meet, Teams or Zoom link. Leave blank to create a secure Jitsi meeting room automatically.',
      },
    },
    {
      name: 'location',
      type: 'text',
      admin: {
        condition: (_, siblingData) => siblingData?.mode === 'onsite',
        description: 'Office address and any arrival instructions for the candidate.',
      },
    },
    {
      name: 'outcome',
      type: 'select',
      defaultValue: 'scheduled',
      options: [
        { label: 'Scheduled', value: 'scheduled' },
        { label: 'Completed', value: 'completed' },
        { label: 'No-show', value: 'no-show' },
        { label: 'Cancelled', value: 'cancelled' },
        { label: 'Advance', value: 'advance' },
        { label: 'Reject', value: 'reject' },
      ],
      admin: {
        description: 'Setting this to Cancelled emails the candidate and panel.',
      },
    },
    {
      name: 'sendInvites',
      label: 'Email candidate & interviewers',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        position: 'sidebar',
        description:
          'Sends the invitation on create, updates when time/link change, and a notice on cancellation.',
      },
    },
    {
      name: 'notes',
      type: 'textarea',
      admin: { description: 'Interview feedback (internal only).' },
    },
  ],
}
