import { startTransition, type FormEvent } from 'react'

/**
 * React 19 resets uncontrolled fields after every `<form action>` run, wiping user input when the
 * server rejects it. Submitting through onSubmit skips that reset; callers clear the form on success.
 * Keep `action={action}` on the form as the no-JS fallback.
 */
export function submitKeepingValues(action: (formData: FormData) => void) {
  return (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    startTransition(() => action(formData))
  }
}
