import { type PropsWithChildren, Suspense } from 'react'
import { Outlet } from 'react-router'

import { ShellUiFooter } from '../ui/shell-ui-footer'
import { type HeaderLink, ShellUiHeader } from '../ui/shell-ui-header'

export default function ShellFeatureLayout({
  children = <Outlet />,
  links,
}: PropsWithChildren<{ links: HeaderLink[] }>) {
  return (
    <div className="flex min-h-screen w-full flex-col overflow-x-clip">
      <ShellUiHeader links={links} />
      <main className="flex-1">
        <Suspense>{children}</Suspense>
      </main>
      <ShellUiFooter />
    </div>
  )
}
