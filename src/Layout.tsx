import { Outlet } from "react-router"

export default function Layout() {
  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex h-8 w-full items-center justify-center border-b border-border bg-app-header text-app-header-foreground">
        Header
      </div>
      <div className="flex flex-1 flex-col">
        <Outlet />
      </div>
    </div>
  )
}
