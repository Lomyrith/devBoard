import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Trash2 } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { type UUID, type Board } from "@/components/types/boardTypes"

type BoardOverviewProps = {
  boardList: Board[]
  onSelectBoard: (boardId: Board) => void
  onDeleteBoard: (boardId: UUID) => void
}

export default function BoardOverview({
  boardList,
  onSelectBoard,
  onDeleteBoard,
}: BoardOverviewProps) {
  const navigate = useNavigate()

  function handleClickOnBoard(board: Board) {
    console.log(board)
    navigate(`/detail/${board.id}`)
    onSelectBoard(board)
  }

  function handleDeleteBoard(boardId: UUID) {
    console.log(boardId)
    onDeleteBoard(boardId)
  }

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
        {boardList.map((board) =>
          getBoardCard(board, handleClickOnBoard, handleDeleteBoard)
        )}
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
      className="border-black-1 flex max-w-80 cursor-pointer flex-row justify-between gap-3 rounded-r-2xl border border-black p-5 hover:bg-blue-50"
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
          className="cursor-pointer text-slate-300 hover:text-red-700"
          onClick={() => handleDeleteBoard(board.id)}
        />
      </div>
    </div>
  )
}
