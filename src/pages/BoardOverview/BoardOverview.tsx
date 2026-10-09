import { Label } from "@/components/ui/label"
import { Trash2 } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { type UUID, type Board } from "@/components/types/boardTypes"
import { useBoardOverview } from "@/components/contexts/BoardOverviewContext"
import { CreateWithNameDialog } from "@/components/dialogs/CreateWithNameDialog"

export default function BoardOverview() {
  const { boardList, addBoard, deleteBoard } = useBoardOverview()

  const navigate = useNavigate()

  function handleClickOnBoard(board: Board) {
    console.log(board)
    navigate(`/detail/${board.id}`)
    // onSelectBoard(board)
  }

  return (
    <div className="flex min-h-screen flex-col p-4">
      {/* Headline */}
      <div className="flex flex-row justify-between">
        <h1 className="text-2xl font-bold">Meine Boards</h1>
        <div>
          <CreateWithNameDialog
            onCreate={addBoard}
            nameOfCreatabelElement="Board"
          />
          {/* <Button
            onClick={handleAddBoard}
            className="cursor-pointer bg-action text-action-foreground hover:bg-action-hover"
          >
            Neues Board
          </Button> */}
        </div>
      </div>
      <div className="grid h-full w-full grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-3">
        {boardList
          .slice()
          .sort((a, b) => a.title.localeCompare(b.title))
          .map((board) => getBoardCard(board, handleClickOnBoard, deleteBoard))}
      </div>
    </div>
  )
}

function getBoardCard(
  board: Board,
  handleClickOnBoard: (board: Board) => void,
  handleDeleteBoard: (boardId: UUID) => void
) {
  return (
    <div
      key={board.id}
      className="hover:bg-card-hover flex max-w-80 cursor-pointer flex-row justify-between gap-3 rounded-r-2xl border border-border bg-card p-5"
      onClick={() => handleClickOnBoard(board)}
    >
      <div className="flex flex-col gap-4">
        <Label className="font-bold">{board.title}</Label>
        <Label className="font-light">
          {board.columns?.length ?? 0} Spalten{" "}
          {board?.columns?.every((c) => c.threads?.length ?? 0 > 0)
            ? board.columns.reduce(
                (acc, curr) => acc + (curr.threads?.length ?? 0),
                0
              )
            : 0}{" "}
          Tasks
        </Label>
      </div>
      <div>
        <Trash2
          className="cursor-pointer text-action-muted hover:text-destructive"
          onClick={() => handleDeleteBoard(board.id)}
        />
      </div>
    </div>
  )
}
