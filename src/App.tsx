// import { Button } from "@/components/ui/button"

import { createBrowserRouter, RouterProvider } from "react-router"
import Layout from "./Layout"
import Profile from "./pages/Profile/Profile"
import BoardOverview from "./pages/BoardOverview/BoardOverview"
import BoardDetail from "./pages/BoardDetail/BoardDetail"
import { useState } from "react"

export function App() {
  // const [userId, setUserId] = useState<string | null>(null)
  const [boardId] = useState<string>("Xyz")

  const router = createBrowserRouter(
    [
      {
        path: "/",
        element: <Layout />,
        children: [
          {
            index: true,
            element: <BoardOverview />,
          },
          {
            path: "profile",
            element: <Profile />,
          },
          {
            path: ":boardDeilId",
            element: <BoardDetail boardId={boardId} />,
          },
        ],
      },
    ],
    { basename: import.meta.env.BASE_URL }
  )

  return (
    <>
      <RouterProvider router={router} />
    </>
    // <div className="flex min-h-svh p-6">
    //   <div className="flex max-w-md min-w-0 flex-col gap-4 text-sm leading-loose">
    //     <div>
    //       <h1 className="font-medium">Project ready!</h1>
    //       <p>You may now add components and start building.</p>
    //       <p>We&apos;ve already added the button component for you.</p>
    //       <Button className="mt-2">Button</Button>
    //     </div>
    //     <div className="font-mono text-xs text-muted-foreground">
    //       (Press <kbd>d</kbd> to toggle dark mode)
    //     </div>
    //   </div>
    // </div>
  )
}

export default App
