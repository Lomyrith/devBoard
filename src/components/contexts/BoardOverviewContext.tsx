import React, { createContext, useContext, useReducer } from "react"
import { type Board, type UUID } from "../types/boardTypes"
import { getTestData } from "./testdata"

type OverviewAction =
  | { type: "ADD_BOARD"; payload: { title: string } }
  | { type: "DELETE_BOARD"; payload: { boardId: UUID } }
  | { type: "RENAME_BOARD"; payload: { boardId: UUID; newTitle: string } }

function overviewReducer(state: Board[], action: OverviewAction): Board[] {
  switch (action.type) {
    case "ADD_BOARD": {
      const newBoard: Board = {
        id: crypto.randomUUID() as UUID,
        title: action.payload.title,
        columns: [],
      }
      return [...state, newBoard]
    }
    case "DELETE_BOARD":
      return state.filter((b) => b.id !== action.payload.boardId)

    case "RENAME_BOARD":
      return state.map((b) =>
        b.id === action.payload.boardId
          ? { ...b, title: action.payload.newTitle }
          : b
      )

    default:
      return state
  }
}

interface BoardOverviewContextType {
  boardList: Board[]
  addBoard: (title: string) => void
  deleteBoard: (boardId: UUID) => void
  renameBoard: (boardId: UUID, newTitle: string) => void
}

const BoardOverviewContext = createContext<
  BoardOverviewContextType | undefined
>(undefined)

export function BoardOverviewProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [boardList, dispatch] = useReducer(overviewReducer, null, () =>
    getTestData()
  )

  const addBoard = (title: string) =>
    dispatch({ type: "ADD_BOARD", payload: { title } })

  const deleteBoard = (boardId: UUID) =>
    dispatch({ type: "DELETE_BOARD", payload: { boardId } })

  const renameBoard = (boardId: UUID, newTitle: string) =>
    dispatch({ type: "RENAME_BOARD", payload: { boardId, newTitle } })

  return (
    <BoardOverviewContext.Provider
      value={{ boardList, addBoard, deleteBoard, renameBoard }}
    >
      {children}
    </BoardOverviewContext.Provider>
  )
}

export function useBoardOverview() {
  const context = useContext(BoardOverviewContext)
  if (!context) {
    throw new Error(
      "useBoardOverview muss im BoardOverviewProvider genutzt werden"
    )
  }
  return context
}
