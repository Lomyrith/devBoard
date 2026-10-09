import { useBoardOverview } from "@/components/contexts/BoardOverviewContext"
import {
  type BoardColumn,
  type ThreadFormData,
  type UUID,
} from "@/components/types/boardTypes"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Edit, Check, X } from "lucide-react"
import { ThreadAddAndChangeDialog } from "@/components/dialogs/ThreadAddAndChangeDialog"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useBoardDetails } from "@/components/contexts/BoardDetailsContext"
import { CreateWithNameDialog } from "@/components/dialogs/CreateWithNameDialog"
import ColumnDeleteDialog from "@/components/dialogs/ColumnDeleteDialog"
import { Tooltip } from "@/components/ui/tooltip"

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
    deleteColumn,
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

  return (
    <div className="flex h-[calc(100dvh-2rem)] flex-col overflow-hidden p-4">
      {/*HeadeLine */}
      <div className="justify-left flex shrink-0 flex-row items-center gap-4">
        <ArrowLeft
          className="cursor-pointer text-action-muted hover:text-action"
          onClick={() => navigate("/")}
        />
        {!isEditMode && (
          <div className="flex flex-row gap-4">
            <Label className="w-64 min-w-80 shrink-0 truncate text-2xl font-bold">
              {board?.title ?? ""}
            </Label>
            <Tooltip content="Editierungsmodus aktivieren: Title bearbeiten & Columns löschen">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={handleEditMode}
                aria-label="Board bearbeiten"
                className="text-action-muted hover:text-action"
              >
                <Edit aria-hidden="true" className="size-5" />
              </Button>
            </Tooltip>
          </div>
        )}
        {isEditMode && (
          <div className="flex flex-row gap-4">
            <Input
              className="w-64 shrink-0 rounded-md border-2 border-border text-2xl font-bold"
              placeholder="Board Titel"
              value={draftTitle ?? ""}
              onChange={(e) => setDraftTitle(e.target.value)}
              autoFocus
            />
            <Check
              className="cursor-pointer text-action-muted hover:text-success"
              onClick={handleAcceptEdit}
            />
            <X
              className="cursor-pointer text-action-muted hover:text-action"
              onClick={handleAbortEdit}
            />
          </div>
        )}
        <CreateWithNameDialog
          className="ml-auto cursor-pointer bg-action text-action-foreground hover:bg-action-hover"
          onCreate={addNewColumn}
          nameOfCreatabelElement="Liste"
        />
      </div>
      {/* Conetent */}
      <div className="flex min-h-0 flex-1 flex-row items-stretch gap-4 overflow-x-auto overflow-y-hidden">
        {board?.columns?.map((column) => (
          <ColumnCard
            key={column.id}
            isEditMode={isEditMode}
            column={column}
            onDeleteColumn={deleteColumn}
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
  const [openThreadId, setOpenThreadId] = useState<UUID | null>(null)

  function handleChangeThread(threadId: UUID, thread: ThreadFormData) {
    console.log(threadId, thread)
    onChangeThread(threadId, thread)
  }

  return (
    <div
      key={column.id}
      className="flex h-full min-h-0 min-w-80 flex-col gap-3 rounded-2xl border border-border bg-column p-5"
    >
      <div className="flex shrink-0 flex-row justify-between gap-4">
        <Label className="font-bold">{column.title}</Label>

        {isDragging ? (
          <div
            className={`flex min-h-6 w-full min-w-12 items-center justify-center rounded-md border-2 border-dashed text-sm transition-colors ${
              isDragOver
                ? "border-success bg-drop-zone-active text-success"
                : "border-drop-zone text-drop-zone"
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
          <ColumnDeleteDialog
            column={column}
            taskCount={column.threads?.length ?? 0}
            onConfirmDelete={() => onDeleteColumn(column.id)}
          />
        ) : (
          <ThreadAddAndChangeDialog
            onSubmit={(changes) => onAddThread(column.id, changes)}
          />
        )}
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
        <div className="flex flex-col gap-4">
          {/* Cards */}
          {column.threads?.map((thread) => {
            const addOrEditBtn = (
              <ThreadAddAndChangeDialog
                key={`${thread.id}-${openThreadId === thread.id}`}
                onSubmit={(changes) => handleChangeThread(thread.id, changes)}
                thread={thread}
                triggerIcon={<Edit aria-hidden="true" className="size-5" />}
                open={openThreadId === thread.id}
                onOpenChange={(isOpen) =>
                  setOpenThreadId(isOpen ? thread.id : null)
                }
              />
            )

            return (
              <Tooltip
                content={
                  thread.description
                    ? thread.description.slice(0, 600) +
                      (thread.description.length > 600 ? "..." : "")
                    : "Beschreibung fehlt noch!"
                }
              >
                <div
                  key={thread.id}
                  className="flex w-80 flex-col justify-between gap-4 rounded-md border-2 border-thread-border bg-thread p-3 hover:bg-card-hover"
                  draggable
                  onDragStart={(e) => {
                    e.dataTransfer.setData("text/plain", thread.id)
                    setIsDragging(true)
                  }}
                  onDragEnd={() => {
                    setIsDragging(false)
                  }}
                  onDoubleClick={() => setOpenThreadId(thread.id)}
                >
                  <div className="flex flex-row items-center justify-between gap-4">
                    {thread.title}
                    {addOrEditBtn}
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
              </Tooltip>
            )
          })}
        </div>
      </div>
    </div>
  )
}
