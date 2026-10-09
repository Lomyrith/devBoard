import { useBoardOverview } from "@/components/contexts/BoardOverviewContext"
import {
  type BoardColumn,
  type ThreadFormData,
  type UUID,
} from "@/components/types/boardTypes"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Edit, Check, X, Trash2 } from "lucide-react"
import { ThreadAddAndChangeDialog } from "@/components/dialogs/ThreadAddAndChangeDialog"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useBoardDetails } from "@/components/contexts/BoardDetailsContext"
import { CreateWithNameDialog } from "@/components/dialogs/CreateWithNameDialog"

export default function BoardDetail() {
  const navigate = useNavigate()
  const [isEditMode, setIsEditMode] = useState(false)
  const [draftTitle, setDraftTitle] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)

  const {
    activeBoard: board,
    addNewColumn,
    addThread,
    changeThreadDetails,
    moveThread,
  } = useBoardDetails()
  const { renameBoard } = useBoardOverview()

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

  return (
    <div className="flex h-[calc(100dvh-2rem)] flex-col overflow-hidden p-4">
      {/* HeadeLine */}
      <div className="justify-left flex shrink-0 flex-row items-center gap-4">
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
            <CreateWithNameDialog
              className="ml-auto cursor-pointer bg-blue-950"
              onCreate={addNewColumn}
              nameOfCreatabelElement="Liste"
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
      <div className="flex min-h-0 flex-1 flex-row items-stretch gap-4 overflow-x-auto overflow-y-hidden">
        {board?.columns?.map((column) => (
          <ColumnCard
            key={column.id}
            isEditMode={isEditMode}
            column={column}
            onDeleteColumn={handleDeleteColumn}
            onAddThread={addThread}
            onChangeThread={changeThreadDetails}
            onMoveThread={moveThread}
            isDragging={isDragging}
            setIsDragging={setIsDragging}
          />
        ))}
      </div>
    </div>
  )
}

function ColumnCard({
  column,
  isEditMode = false,
  onDeleteColumn,
  onAddThread,
  onChangeThread,
  onMoveThread,
  isDragging,
  setIsDragging,
}: {
  column: BoardColumn
  isEditMode?: boolean
  onDeleteColumn: (columnId: UUID) => void
  onAddThread: (columnId: UUID, thread: ThreadFormData) => void
  onChangeThread: (threadId: UUID, thread: ThreadFormData) => void
  onMoveThread: (threadId: UUID, columnId: UUID) => void
  isDragging: boolean
  setIsDragging: (isDragging: boolean) => void
}) {
  const [isDragOver, setIsDragOver] = useState(false)

  function handleChangeThread(threadId: UUID, thread: ThreadFormData) {
    console.log(threadId, thread)
    onChangeThread(threadId, thread)
  }

  return (
    <div
      key={column.id}
      className="border-black-1 flex h-full min-h-0 min-w-80 flex-col gap-3 rounded-2xl border border-black bg-gray-200 p-5 hover:bg-blue-50"
    >
      <div className="flex shrink-0 flex-row justify-between gap-4">
        <Label className="font-bold">{column.title}</Label>

        {isDragging ? (
          <div
            className={`flex min-h-6 w-full min-w-12 items-center justify-center rounded-md border-2 border-dashed text-sm transition-colors ${
              isDragOver
                ? "border-green-600 bg-blue-50 text-green-700"
                : "border-blue-600 text-blue-600"
            }`}
            onDragEnter={() => setIsDragOver(true)}
            onDragLeave={() => setIsDragOver(false)}
            onDragOver={(e) => e.preventDefault()}
            f294e839-3d05-409a-bcd2-f222cf7f45bd
            onDrop={(e) => {
              e.preventDefault()
              setIsDragOver(false)
              const threadId = e.dataTransfer.getData("text/plain") as UUID
              if (threadId) {
                onMoveThread(threadId, column.id)
              }
            }}
          >
            Thread hier ablegen
          </div>
        ) : (
          <Label className="font-light">
            {column.threads?.length ?? 0} Tasks
          </Label>
        )}
        {isEditMode ? (
          <Trash2
            className="cursor-pointer text-slate-300 hover:text-red-700"
            onClick={() => onDeleteColumn(column.id)}
          />
        ) : (
          <ThreadAddAndChangeDialog
            onSubmit={(changes) => onAddThread(column.id, changes)}
          />
        )}
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
        <div className="flex flex-col gap-4">
          {column.threads?.map((thread) => (
            <div
              key={thread.id}
              className="flex w-80 flex-col justify-between gap-4 rounded-md border-2 border-gray-700 bg-white p-3"
              draggable
              onDragStart={(e) => {
                e.dataTransfer.setData("text/plain", thread.id)
                setIsDragging(true)
              }}
              onDragEnd={() => {
                setIsDragging(false)
              }}
            >
              <div className="flex flex-row items-center justify-between gap-4">
                {thread.title}
                <ThreadAddAndChangeDialog
                  onSubmit={(changes) => handleChangeThread(thread.id, changes)}
                  thread={thread}
                  triggerIcon={<Edit aria-hidden="true" className="size-5" />}
                />
              </div>
              <div className="flex flex-col gap-0">
                <div className="flex min-w-0 flex-row items-center justify-between gap-4">
                  <Label className="block min-w-0 truncate text-sm font-light">
                    {thread.description}
                  </Label>
                </div>
                <div className="flex min-w-0 flex-row items-center justify-between gap-4">
                  <Label className="block min-w-0 text-sm font-light">
                    {thread.deadline.toLocaleDateString()}
                  </Label>
                  <Label className="block min-w-0 text-sm font-light">
                    {thread.assignedTo?.trim() || "No Assigned"}
                  </Label>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
