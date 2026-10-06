import { Outlet } from "react-router"

export default function Layout() {
  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex h-8 w-full items-center justify-center border-b border-slate-200 bg-slate-900 from-slate-50 to-slate-100 text-white">
        Header
      </div>
      <div className="flex flex-1 flex-col">
        <Outlet />
      </div>
    </div>
  )
}
