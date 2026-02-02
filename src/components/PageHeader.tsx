import * as React from 'react'
import type { LucideIcon } from 'lucide-react'

interface PageHeaderContextValue {
  icon?: LucideIcon
  title?: string
  description?: string
  setHeader: (header: { icon?: LucideIcon; title?: string; description?: string }) => void
}

const PageHeaderContext = React.createContext<PageHeaderContextValue | null>(null)

export function PageHeaderProvider({ children }: { children: React.ReactNode }) {
  const [header, setHeader] = React.useState<{
    icon?: LucideIcon
    title?: string
    description?: string
  }>({})

  return (
    <PageHeaderContext.Provider value={{ ...header, setHeader }}>
      {children}
    </PageHeaderContext.Provider>
  )
}

export function usePageHeader() {
  const context = React.useContext(PageHeaderContext)
  if (!context) {
    throw new Error('usePageHeader must be used within PageHeaderProvider')
  }
  return context
}

export function PageHeader() {
  const { icon: Icon, title, description } = usePageHeader()

  if (!title) {
    return null
  }

  return (
    <header
      className="sticky top-0 z-10 px-8 pt-8 pb-6 backdrop-blur-sm"
      style={{ 
        background: 'var(--color-linear-bg-secondary)',
        borderBottom: '1px solid var(--color-linear-border-primary)',
      }}
    >
      <div className="flex items-center gap-3 mb-2">
        {Icon && (
          <Icon
            className="h-6 w-6"
            style={{ color: 'var(--color-linear-accent-primary)' }}
          />
        )}
        <h1
          className="text-3xl font-light tracking-tight"
          style={{ color: 'var(--color-linear-text-primary)' }}
        >
          {title}
        </h1>
      </div>
      {description && (
        <p
          className="text-sm font-light"
          style={{ color: 'var(--color-linear-text-secondary)' }}
        >
          {description}
        </p>
      )}
    </header>
  )
}
