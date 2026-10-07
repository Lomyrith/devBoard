import { type Board, type UUID } from "@/components/types/boardTypes"
import { Label } from "@/components/ui/label"
import { Input } from "@base-ui/react"
import { ArrowLeft, Edit, Check, X } from "lucide-react"
import { useState } from "react"
import { useNavigate } from "react-router-dom"

type BoardDetailProps = {
  board: Board | null
  onRenameBoard: (boardId: UUID, newTitle: string) => void
}

export default function BoardDetail({
  board,
  onRenameBoard,
}: BoardDetailProps) {
  const navigate = useNavigate()
  const [isEditMode, setIsEditMode] = useState(false)
  const [draftTitle, setDraftTitle] = useState<string | null>(null)

  if (board === null || board === undefined) {
    return (
      <div>
        <div>Hallo BoardDetail unicht bekannt</div>{" "}
      </div>
    )
  }

  function handleEditMode() {
    setDraftTitle(!board ? null : board?.title)
    setIsEditMode(true)
  }

  function handleAcceptEdit() {
    if (board === null || board === undefined) return

    onRenameBoard(board.id, draftTitle ?? board.title)
    setIsEditMode(false)
  }

  function handleAbortEdit() {
    setDraftTitle(null)
    setIsEditMode(false)
  }

  return (
    <div className="flex min-h-screen flex-col p-4">
      {/* HeadeLine */}
      <div className="justify-left flex flex-row items-center gap-4">
        <ArrowLeft
          className="cursor-pointer text-slate-300 hover:text-blue-700"
          onClick={() => navigate("/")}
        />
        {!isEditMode && (
          <>
            <Label className="text-2xl font-bold">{board.title}</Label>
            <Edit
              className="cursor-pointer text-slate-300 hover:text-blue-700"
              onClick={handleEditMode}
            />
          </>
        )}
        {isEditMode && (
          <>
            <Input
              className="border-black-1 rounded-md border-2 text-2xl font-bold"
              placeholder="Board Titel"
              value={draftTitle ?? ""}
              onChange={(e) => setDraftTitle(e.target.value)}
            />
            <Check
              className="cursor-pointer text-slate-700 hover:text-green-700"
              onClick={handleAcceptEdit}
            />
            <X
              className="cursor-pointer text-slate-700 hover:text-blue-700"
              onClick={handleAbortEdit}
            />
          </>
        )}
      </div>
      {/* Conetent */}
      <div></div>
    </div>
  )
}
