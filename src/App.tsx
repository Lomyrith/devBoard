import { createBrowserRouter, RouterProvider } from "react-router"
import Layout from "./Layout"
import Profile from "./pages/Profile/Profile"
import BoardOverview from "./pages/BoardOverview/BoardOverview"
import BoardDetail from "./pages/BoardDetail/BoardDetail"
import { BoardOverviewProvider } from "./components/contexts/BoardOverviewContext"
import { BoardDetailsProvider } from "./components/contexts/BoardDetailsContext"
import { ThemeProvider } from "./components/theme-provider"
import { Tooltip } from "@base-ui/react/tooltip"

export function App() {
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
            path: "detail/:boardId",
            element: (
              <BoardDetailsProvider>
                <BoardDetail />
              </BoardDetailsProvider>
            ),
          },
        ],
      },
    ],
    { basename: import.meta.env.BASE_URL }
  )

  return (
    <ThemeProvider>
      <Tooltip.Provider delay={0}>
        <BoardOverviewProvider>
          <RouterProvider router={router} />
        </BoardOverviewProvider>
      </Tooltip.Provider>
    </ThemeProvider>
  )
}

export default App
