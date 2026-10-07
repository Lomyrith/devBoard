// import { Button } from "@/components/ui/button"

import { createBrowserRouter, RouterProvider } from "react-router"
import Layout from "./Layout"
import Profile from "./pages/Profile/Profile"
import BoardOverview from "./pages/BoardOverview/BoardOverview"
import BoardDetail from "./pages/BoardDetail/BoardDetail"
import { useState } from "react"
import { type UUID, type Board } from "./components/types/boardTypes"

export function App() {
  // const [userId, setUserId] = useState<string | null>(null)
  //const [boardId, setBoardId] = useState<UUID>(crypto.randomUUID() as UUID)
  function loadBoardList() {
    setBoardList(getTestData())
  }
  const [boardList, setBoardList] = useState<Board[]>(getTestData())
  const [board, setBoard] = useState<Board | null>(null)

  function onSelectBoard(selectedBoard: Board) {
    setBoard(selectedBoard)
    console.log(board)
  }

  function onDeleteBoard(deletedBoardId: UUID) {
    console.log(deletedBoardId)
  }

  function handleRenameBoard(boardId: UUID, newTitle: string) {
    console.log(boardId)
    console.log(newTitle)

    setBoard((prevBoard) => {
      // Falls kein Board vorhanden ist, tu nichts
      if (!prevBoard) return null

      return {
        ...prevBoard,
        title: newTitle,
      }
    })

    setBoardList((prev) =>
      prev.map((b) => (b.id === boardId ? { ...b, title: newTitle } : b))
    )
  }

  const router = createBrowserRouter(
    [
      {
        path: "/",
        element: <Layout />,
        children: [
          {
            index: true,
            element: (
              <BoardOverview
                boardList={boardList}
                onSelectBoard={onSelectBoard}
                onDeleteBoard={onDeleteBoard}
              />
            ),
          },
          {
            path: "profile",
            element: <Profile />,
          },
          {
            path: "detail/:boardDetailId",
            element: (
              <BoardDetail board={board} onRenameBoard={handleRenameBoard} />
            ),
          },
        ],
      },
    ],
    { basename: import.meta.env.BASE_URL }
  )

  return (
    <>
      {loadBoardList}
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

function getTestData(): Board[] {
  return [
    {
      id: crypto.randomUUID() as UUID,
      title: "Gültiges Board: E-Commerce Relaunch",
      columns: [
        {
          id: crypto.randomUUID() as UUID,
          title: "Backlog",
          threads: [
            {
              id: crypto.randomUUID() as UUID,
              title: "Checkout-Flow redesignen",
              description:
                "Warenkorb-Layout responsive gestalten und Fehler-Handling optimieren.",
              assigendTo: "David",
              deadline: new Date("2026-10-15T10:00:00"),
            },
            {
              id: crypto.randomUUID() as UUID,
              title: "Stripe API Schnittstelle",
              description: "Apple Pay & Google Pay Integration abschließen.",
              assigendTo: "Sarah",
              deadline: new Date("2026-10-20T14:30:00"),
            },
          ],
        },
        {
          id: crypto.randomUUID() as UUID,
          title: "In Progress",
          threads: [
            {
              id: crypto.randomUUID() as UUID,
              title: "MUI Theme Customizing",
              description:
                "Farbpalette und Dark-Mode für Buttons und Cards anpassen.",
              assigendTo: "Alex",
              deadline: new Date("2026-10-12T09:00:00"),
            },
          ],
        },
        {
          id: crypto.randomUUID() as UUID,
          title: "Done",
          threads: [
            {
              id: crypto.randomUUID() as UUID,
              title: "Login via OAuth2",
              description: "Google & GitHub Auth erfolgreich hinterlegt.",
              assigendTo: "Elena",
              deadline: new Date("2026-10-01T16:00:00"),
            },
            {
              id: crypto.randomUUID() as UUID,
              title: "Vite Asset Path Setup",
              description: "Base-URL /user-app/ in vite.config hinterlegt.",
              assigendTo: "David",
              deadline: new Date("2026-10-02T11:00:00"),
            },
          ],
        },
      ],
    },
    {
      id: crypto.randomUUID() as UUID,
      title: "Mobile App Android & iOS",
      columns: [
        {
          id: crypto.randomUUID() as UUID,
          title: "To Do",
          threads: [
            {
              id: crypto.randomUUID() as UUID,
              title: "Push Notifications",
              description: "Firebase Cloud Messaging einrichten.",
              assigendTo: "Michael",
              deadline: new Date("2026-10-18T12:00:00"),
            },
          ],
        },
        {
          id: crypto.randomUUID() as UUID,
          title: "In Review",
          threads: [
            {
              id: crypto.randomUUID() as UUID,
              title: "Biometric Auth",
              description: "FaceID & TouchID Login getestet.",
              assigendTo: "Lisa",
              deadline: new Date("2026-10-10T15:00:00"),
            },
            {
              id: crypto.randomUUID() as UUID,
              title: "Offline Storage Sync",
              description: "Lokale SQLite DB Sync-Mechanismus fertig.",
              assigendTo: "Tom",
              deadline: new Date("2026-10-11T10:00:00"),
            },
          ],
        },
      ],
    },
    {
      id: crypto.randomUUID() as UUID,
      title: "Leeres Board (Neu angelegt)",
      columns: [],
    },
    {
      id: crypto.randomUUID() as UUID,
      title: "Board ohne Spalten (Null Test)",
      columns: null,
    },
    {
      id: crypto.randomUUID() as UUID,
      title: "Cloud Migration & Infrastructure",
      columns: [
        {
          id: crypto.randomUUID() as UUID,
          title: "Planning",
          threads: [
            {
              id: crypto.randomUUID() as UUID,
              title: "Kubernetes Cluster Sizing",
              description: "Ressourcen-Planung für Produktion.",
              assigendTo: "Sarah",
              deadline: new Date("2026-10-25T08:00:00"),
            },
          ],
        },
        {
          id: crypto.randomUUID() as UUID,
          title: "Execution",
          threads: [
            {
              id: crypto.randomUUID() as UUID,
              title: "PostgreSQL Migration",
              description: "Dumps auf RDS Cluster einspielen.",
              assigendTo: "David",
              deadline: new Date("2026-10-14T11:30:00"),
            },
            {
              id: crypto.randomUUID() as UUID,
              title: "S3 Bucket Policies",
              description: "CORS & IAM Rollen konfigurieren.",
              assigendTo: "Alex",
              deadline: new Date("2026-10-13T16:00:00"),
            },
          ],
        },
        {
          id: crypto.randomUUID() as UUID,
          title: "Spalte ohne Threads (Null Test)",
          threads: null,
        },
      ],
    },
    {
      id: crypto.randomUUID() as UUID,
      title: "Design System & UI Component Library",
      columns: [
        {
          id: crypto.randomUUID() as UUID,
          title: "In Progress",
          threads: [
            {
              id: crypto.randomUUID() as UUID,
              title: "Typography Scale",
              description: "MUI Typography Typesystem anpassen.",
              assigendTo: "Elena",
              deadline: new Date("2026-10-16T13:00:00"),
            },
          ],
        },
        {
          id: crypto.randomUUID() as UUID,
          title: "Done",
          threads: [
            {
              id: crypto.randomUUID() as UUID,
              title: "Icon Set (Lucide)",
              description: "Einbindung aller benötigten Icons.",
              assigendTo: "Lisa",
              deadline: new Date("2026-10-05T09:00:00"),
            },
          ],
        },
      ],
    },
    ...Array.from({ length: 44 }, (_, i) => {
      const idx = i + 7
      const categories = [
        "Security Audit",
        "API Redesign",
        "Analytics Dashboard",
        "AI Chatbot Integration",
        "Performance Tuning",
        "CRM Integration",
        "User Onboarding",
        "Inventory Management",
      ]
      const category = categories[i % categories.length]

      return {
        id: crypto.randomUUID() as UUID,
        title: `${category} #${idx}`,
        columns: [
          {
            id: crypto.randomUUID() as UUID,
            title: "Backlog",
            threads: [
              {
                id: crypto.randomUUID() as UUID,
                title: `Task A für ${category}`,
                description: `Automatisch generierter Test-Task für Board ${idx}.`,
                assigendTo: [
                  "David",
                  "Sarah",
                  "Alex",
                  "Elena",
                  "Michael",
                  "Lisa",
                ][i % 6],
                deadline: new Date(`2026-10-${(i % 20) + 10}T10:00:00`),
              },
            ],
          },
          {
            id: crypto.randomUUID() as UUID,
            title: "Done",
            threads: [
              {
                id: crypto.randomUUID() as UUID,
                title: `Task B für ${category}`,
                description: `Bereits abgeschlossene Aufgabe für Board ${idx}.`,
                assigendTo: [
                  "David",
                  "Sarah",
                  "Alex",
                  "Elena",
                  "Michael",
                  "Lisa",
                ][(i + 1) % 6],
                deadline: new Date("2026-10-01T12:00:00"),
              },
            ],
          },
        ],
      }
    }),
  ]
}
