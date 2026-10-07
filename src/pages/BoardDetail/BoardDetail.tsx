import { useBoardOverview } from "@/components/contexts/BoardOverviewContext"
import { type BoardColumn, type UUID } from "@/components/types/boardTypes"
import { Label } from "@/components/ui/label"
import { Input } from "@base-ui/react"
import { ArrowLeft, Edit, Check, X, Plus, Trash2 } from "lucide-react"
import { useState } from "react"
import { useNavigate, useParams } from "react-router-dom"

export default function BoardDetail() {
  const navigate = useNavigate()
  const [isEditMode, setIsEditMode] = useState(false)
  const [draftTitle, setDraftTitle] = useState<string | null>(null)

  const { boardDetailId } = useParams<{ boardDetailId: string }>()
  const { boardList, renameBoard } = useBoardOverview()

  const board = boardList.find((item) => item.id === boardDetailId) ?? null

  if (boardDetailId === null || boardDetailId === undefined) {
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
    renameBoard(board.id, draftTitle ?? board.title)
    setIsEditMode(false)
  }

  function handleAbortEdit() {
    setDraftTitle(null)
    setIsEditMode(false)
  }

  function handleDeleteColumn(columnId: UUID) {
    console.log(columnId)
  }

  function handleAddThread(column: BoardColumn) {
    console.log(column)
  }

  function handleDropThread(threadId: UUID, columnId: UUID) {
    console.log(threadId)
    console.log(columnId)

    const targetColumn = board?.columns?.find((c) => c.id === columnId)
    if (!targetColumn) return

    const originalColumn = board?.columns?.find((f) =>
      f.threads?.find((t) => t.id === threadId)
    )
    if (!originalColumn) return

    const changingThread = originalColumn.threads?.find(
      (t) => t.id === threadId
    )
    if (!changingThread) return

    // const newColumns = board?.columns?.map((col) => {
    //   // 1. Thread überall entfernen (auch aus originalColumn)
    //   const cleanedThreads = (col.threads ?? []).filter(
    //     (t) => t.id !== threadId
    //   )

    //   // 2. Nur bei targetColumn den Thread hinten anfügen
    //   if (col.id === columnId) {
    //     return { ...col, threads: [...cleanedThreads, changingThread] }
    //   }

    //   // 3. Für alle anderen Spalten einfach nur die bereinigte Liste zurückgeben
    //   return { ...col, threads: cleanedThreads }
    // })
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
            <Label className="text-2xl font-bold">{board?.title ?? ""}</Label>
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
      <div className="flex h-full flex-row gap-4">
        {board?.columns?.map((column) =>
          getColumnCard(
            column,
            handleDeleteColumn,
            handleAddThread,
            handleDropThread,
            isEditMode
          )
        )}
      </div>
    </div>
  )
}

function getColumnCard(
  column: BoardColumn,
  handleDeleteColumn: (columnID: UUID) => void,
  handleAddThread: (column: BoardColumn) => void,
  onDropThread: (threadId: UUID, columnId: UUID) => void,
  isEditMode: boolean = false
) {
  function handleDropThread(threadId: UUID, columnId: UUID) {
    console.log(threadId)
    console.log(columnId)
  }

  return (
    <div
      key={column.id}
      className="border-black-1 h-full min-w-80 cursor-pointer gap-3 rounded-2xl border border-black bg-gray-200 p-5 hover:bg-blue-50"
      onDragOver={(e) => e.preventDefault()} // Wichtig, sonst erlaubt der Browser kein Drop
      onDrop={(e) => {
        e.preventDefault()
        const threadId = e.dataTransfer.getData("text/plain") as UUID
        if (threadId) {
          handleDropThread(threadId, column.id)
        }
      }}
    >
      <div className="flex flex-row justify-between gap-4">
        <Label className="font-bold">{column.title}</Label>
        <Label className="font-light">
          {column.threads?.length ?? 0} Tasks
        </Label>
        {isEditMode && (
          <Trash2
            className="cursor-pointer text-slate-300 hover:text-red-700"
            onClick={() => handleDeleteColumn(column.id)}
          />
        )}
        <Plus
          className="cursor-pointer text-slate-300 hover:text-blue-700"
          onClick={() => handleAddThread(column)}
        />
      </div>

      <div className="flex flex-col gap-4">
        {column.threads?.map((thread) => (
          <div
            key={thread.id}
            className="flex flex-row justify-between gap-4 rounded-md border-2 border-gray-700 bg-white p-3"
            draggable
            onDragStart={(e) => {
              e.dataTransfer.setData("text/plain", thread.id)
            }}
          >
            {/* key={thread.id} // Wichtig: key nicht vergessen!
            draggable // 2. Thread draggable machen
            onDragStart={(e) => {
              e.dataTransfer.setData("text/plain", thread.id);
            }} */}
            {thread.title}
          </div>
        ))}
      </div>
    </div>
  )
}
