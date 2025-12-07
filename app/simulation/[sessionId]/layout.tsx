// Workspace layout - hides parent's sidebar using CSS
// The workspace page has its own agent roles panel on the right, so we don't need the nav sidebar
export default function SimulationWorkspaceLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Use negative margin to hide parent layout's sidebar
  // Parent has: <main className="flex-1 md:ml-64">, we override with -ml-64
  return (
    <div className="w-full -ml-64 md:ml-0 min-h-screen">
      {children}
    </div>
  )
}

