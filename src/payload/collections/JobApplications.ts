import type { CollectionConfig } from 'payload'

import { canManageCareers, isAdmin } from '@/payload/access'

export const JobApplications: CollectionConfig = {
  slug: 'job-applications',
  admin: {
    useAsTitle: 'name',
    defaultColumns: [
      'applicationId',
      'name',
      'email',
      'career',
      'status',
      'totalExperience',
      'createdAt',
    ],
    group: 'Inbox',
    listSearchableFields: ['name', 'email', 'applicationId', 'firstName', 'lastName'],
  },
  access: {
    read: canManageCareers,
    create: () => false,
    update: canManageCareers,
    delete: isAdmin,
  },
  hooks: {
    beforeValidate: [
      ({ data }) => {
        if (!data) return data
        const first = typeof data.firstName === 'string' ? data.firstName.trim() : ''
        const last = typeof data.lastName === 'string' ? data.lastName.trim() : ''
        if (first || last) {
          data.name = [first, last].filter(Boolean).join(' ')
        }
        return data
      },
    ],
  },
  fields: [
    {
      name: 'applicationId',
      type: 'text',
      unique: true,
      index: true,
      admin: {
        readOnly: true,
        position: 'sidebar',
      },
    },
    {
      name: 'career',
      type: 'relationship',
      relationTo: 'careers',
      required: true,
    },
    {
      name: 'name',
      type: 'text',
      required: true,
      admin: { description: 'Display name (auto from first/last).' },
    },
    {
      name: 'firstName',
      type: 'text',
    },
    {
      name: 'lastName',
      type: 'text',
    },
    {
      name: 'email',
      type: 'email',
      required: true,
    },
    {
      name: 'phone',
      type: 'text',
    },
    {
      name: 'country',
      type: 'text',
    },
    {
      name: 'city',
      type: 'text',
    },
    {
      name: 'linkedin',
      type: 'text',
    },
    {
      name: 'portfolio',
      type: 'text',
      label: 'Portfolio / GitHub',
    },
    {
      name: 'currentCompany',
      type: 'text',
    },
    {
      name: 'currentDesignation',
      type: 'text',
    },
    {
      name: 'totalExperience',
      type: 'text',
    },
    {
      name: 'relevantExperience',
      type: 'text',
    },
    {
      name: 'currentSalary',
      type: 'text',
    },
    {
      name: 'expectedSalary',
      type: 'text',
    },
    {
      name: 'noticePeriod',
      type: 'text',
    },
    {
      name: 'workAuthorization',
      type: 'text',
      label: 'Work authorization / visa status',
    },
    {
      name: 'education',
      type: 'group',
      fields: [
        { name: 'highestQualification', type: 'text' },
        { name: 'university', type: 'text' },
        { name: 'graduationYear', type: 'text' },
      ],
    },
    {
      name: 'skills',
      type: 'array',
      fields: [{ name: 'item', type: 'text', required: true }],
    },
    {
      name: 'resume',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'coverLetter',
      type: 'textarea',
    },
    {
      name: 'whyJoin',
      type: 'textarea',
      label: 'Why join XELARVIS?',
    },
    {
      name: 'willingToRelocate',
      type: 'select',
      options: [
        { label: 'Yes', value: 'yes' },
        { label: 'No', value: 'no' },
        { label: 'Maybe', value: 'maybe' },
      ],
    },
    {
      name: 'earliestJoinDate',
      type: 'text',
    },
    {
      name: 'healthcareExperience',
      type: 'select',
      label: 'Healthcare / clinical research experience',
      options: [
        { label: 'Yes', value: 'yes' },
        { label: 'No', value: 'no' },
      ],
    },
    {
      name: 'consent',
      type: 'checkbox',
      required: true,
      defaultValue: false,
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'new',
      options: [
        { label: 'New', value: 'new' },
        { label: 'Under Review', value: 'under-review' },
        { label: 'Shortlisted', value: 'shortlisted' },
        { label: 'Interview Scheduled', value: 'interview-scheduled' },
        { label: 'Technical Assessment', value: 'technical-assessment' },
        { label: 'Final Interview', value: 'final-interview' },
        { label: 'Offered', value: 'offered' },
        { label: 'Hired', value: 'hired' },
        { label: 'Rejected', value: 'rejected' },
        { label: 'Withdrawn', value: 'withdrawn' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'recruiterNotes',
      type: 'textarea',
      admin: { position: 'sidebar' },
    },
  ],
}
