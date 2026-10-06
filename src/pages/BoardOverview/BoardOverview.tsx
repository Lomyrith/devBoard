import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Trash2 } from "lucide-react"

type UUID = `${string}-${string}-${string}-${string}-${string}`

type Board = {
  id: UUID
  title: string
  columns: number
  threads: number
}

export default function BoardOverview() {
  //const id = crypto.randomUUID();

  const boardList = getTestData()

  return (
    <div className="flex min-h-screen flex-col p-4">
      {/* Headline */}
      <div className="flex flex-row justify-between">
        <h1 className="text-2xl font-bold">Meine Boards</h1>
        <div>
          <Button className="cursor-pointer bg-blue-950">Erstelle Board</Button>
        </div>
      </div>
      <div className="grid h-full w-full grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-3">
        {boardList.map((board) => getBoardCard(board))}
      </div>
    </div>
  )
}

function getBoardCard(board: Board) {
  return (
    <div className="border-black-1 flex max-w-80 cursor-pointer flex-row justify-between gap-3 rounded-r-2xl border border-black p-5 hover:bg-blue-50">
      <div className="flex flex-col gap-4">
        <Label className="font-bold">{board.title}</Label>
        <Label className="font-light">
          {board.columns} Spalten {board.threads} Tasks
        </Label>
      </div>
      <div>
        <Trash2 className="cursor-pointer text-slate-300 hover:text-red-700" />
      </div>
    </div>
  )
}

function getTestData() {
  const boardList: Board[] = [
    {
      id: crypto.randomUUID() as UUID,
      title: "Gültiges Board",
      columns: 3,
      threads: 2,
    },
    {
      id: crypto.randomUUID() as UUID,
      title: "Alpakas",
      columns: 3,
      threads: 3,
    },
    {
      id: crypto.randomUUID() as UUID,
      title: "Huskys",
      columns: 3,
      threads: 5,
    },
    {
      id: crypto.randomUUID() as UUID,
      title: "Projekt Apollo",
      columns: 4,
      threads: 12,
    },
    {
      id: crypto.randomUUID() as UUID,
      title: "Sprint Backlog Q4",
      columns: 5,
      threads: 18,
    },
    {
      id: crypto.randomUUID() as UUID,
      title: "Marketing Kampagne 2026",
      columns: 3,
      threads: 8,
    },
    {
      id: crypto.randomUUID() as UUID,
      title: "UI Redesign V2",
      columns: 4,
      threads: 14,
    },
    {
      id: crypto.randomUUID() as UUID,
      title: "Bugs & Issues",
      columns: 3,
      threads: 25,
    },
    {
      id: crypto.randomUUID() as UUID,
      title: "Kundenfeedback",
      columns: 2,
      threads: 9,
    },
    {
      id: crypto.randomUUID() as UUID,
      title: "Einkaufsliste",
      columns: 2,
      threads: 4,
    },
    {
      id: crypto.randomUUID() as UUID,
      title: "Urlaubsplanung Japan",
      columns: 4,
      threads: 6,
    },
    {
      id: crypto.randomUUID() as UUID,
      title: "Content Kalender Blog",
      columns: 5,
      threads: 11,
    },
    {
      id: crypto.randomUUID() as UUID,
      title: "Onboarding Neue Mitarbeiter",
      columns: 3,
      threads: 7,
    },
    {
      id: crypto.randomUUID() as UUID,
      title: "Rezeptsammlung",
      columns: 4,
      threads: 15,
    },
    {
      id: crypto.randomUUID() as UUID,
      title: "Fitness & Trainingsplan",
      columns: 3,
      threads: 5,
    },
    {
      id: crypto.randomUUID() as UUID,
      title: "Finanzen & Budgeting",
      columns: 2,
      threads: 3,
    },
    {
      id: crypto.randomUUID() as UUID,
      title: "Buchclub Lesenotes",
      columns: 3,
      threads: 8,
    },
    {
      id: crypto.randomUUID() as UUID,
      title: "Smart Home Automation",
      columns: 4,
      threads: 10,
    },
    {
      id: crypto.randomUUID() as UUID,
      title: "Garten & Bepflanzung",
      columns: 3,
      threads: 4,
    },
    {
      id: crypto.randomUUID() as UUID,
      title: "Podcast Ideen",
      columns: 2,
      threads: 13,
    },
    {
      id: crypto.randomUUID() as UUID,
      title: "SEO Optimierung",
      columns: 4,
      threads: 9,
    },
    {
      id: crypto.randomUUID() as UUID,
      title: "App Release Checklist",
      columns: 3,
      threads: 16,
    },
    {
      id: crypto.randomUUID() as UUID,
      title: "Feature Requests",
      columns: 3,
      threads: 22,
    },
    {
      id: crypto.randomUUID() as UUID,
      title: "Hausbau & Renovierung",
      columns: 5,
      threads: 19,
    },
    {
      id: crypto.randomUUID() as UUID,
      title: "Hochzeit Setup",
      columns: 4,
      threads: 17,
    },
    {
      id: crypto.randomUUID() as UUID,
      title: "Fotografie Portfolio",
      columns: 3,
      threads: 6,
    },
    {
      id: crypto.randomUUID() as UUID,
      title: "Game Development Devlog",
      columns: 5,
      threads: 21,
    },
    {
      id: crypto.randomUUID() as UUID,
      title: "Server Migration Checklist",
      columns: 3,
      threads: 8,
    },
    {
      id: crypto.randomUUID() as UUID,
      title: "Weihnachtsgeschenke",
      columns: 2,
      threads: 5,
    },
    {
      id: crypto.randomUUID() as UUID,
      title: "YouTube Video Skripte",
      columns: 4,
      threads: 12,
    },
    {
      id: crypto.randomUUID() as UUID,
      title: "Cybersecurity Audits",
      columns: 3,
      threads: 7,
    },
    {
      id: crypto.randomUUID() as UUID,
      title: "Fußball Vereinsverwaltung",
      columns: 3,
      threads: 4,
    },
    {
      id: crypto.randomUUID() as UUID,
      title: "Kaffeeröstungen Testing",
      columns: 2,
      threads: 6,
    },
    {
      id: crypto.randomUUID() as UUID,
      title: "Social Media Strategie",
      columns: 4,
      threads: 15,
    },
    {
      id: crypto.randomUUID() as UUID,
      title: "Dungeons & Dragons Campaign",
      columns: 5,
      threads: 30,
    },
    {
      id: crypto.randomUUID() as UUID,
      title: "Wohnzimmer Umgestaltung",
      columns: 3,
      threads: 5,
    },
    {
      id: crypto.randomUUID() as UUID,
      title: "Masterarbeit Research",
      columns: 4,
      threads: 11,
    },
    {
      id: crypto.randomUUID() as UUID,
      title: "Roadtrip Route Route 66",
      columns: 3,
      threads: 8,
    },
    {
      id: crypto.randomUUID() as UUID,
      title: "Event Organisation Sommerfest",
      columns: 4,
      threads: 14,
    },
    {
      id: crypto.randomUUID() as UUID,
      title: "Kundensupport Escalations",
      columns: 3,
      threads: 9,
    },
    {
      id: crypto.randomUUID() as UUID,
      title: "3D-Druck Projekte",
      columns: 3,
      threads: 13,
    },
    {
      id: crypto.randomUUID() as UUID,
      title: "Mietwagen & Hotels Vergleich",
      columns: 2,
      threads: 4,
    },
    {
      id: crypto.randomUUID() as UUID,
      title: "Backend API Restructuring",
      columns: 4,
      threads: 16,
    },
    {
      id: crypto.randomUUID() as UUID,
      title: "UX A/B Tests",
      columns: 3,
      threads: 7,
    },
    {
      id: crypto.randomUUID() as UUID,
      title: "Startup Pitch Deck",
      columns: 3,
      threads: 10,
    },
    {
      id: crypto.randomUUID() as UUID,
      title: "SaaS Pricing Tiers",
      columns: 2,
      threads: 6,
    },
  ]
  return boardList
}
