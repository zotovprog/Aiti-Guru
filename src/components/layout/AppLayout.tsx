import type { ReactNode } from 'react'

interface AppLayoutProps {
  children: ReactNode
  headerContent?: ReactNode
}

export function AppLayout({ children, headerContent }: AppLayoutProps) {
  return (
    <div className="app-shell">
      <header className="app-shell__header">
        <div className="app-shell__header-inner">{headerContent}</div>
      </header>
      <main className="app-shell__content">{children}</main>
    </div>
  )
}
