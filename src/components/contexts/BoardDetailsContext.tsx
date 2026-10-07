import React, { createContext, useContext, useReducer, useEffect } from "react"
import { useParams } from "react-router-dom" // Oder dein genutzter Router
import { type Board, type UUID, type BoardThread } from "../types/boardTypes"
import { useBoardOverview } from "./BoardOverviewContext"

type DetailsAction =
  | { type: "SET_BOARD"; payload: Board | null }
  | { type: "DELETE_COLUMN"; payload: { columnId: UUID } }
  | { type: "ADD_THREAD"; payload: { columnId: UUID; newThread: BoardThread } }
  | { type: "MOVE_THREAD"; payload: { threadId: UUID; targetColumnId: UUID } }
  | { type: "RENAME_ACTIVE_BOARD"; payload: { newTitle: string } }

function detailsReducer(
  state: Board | null,
  action: DetailsAction
): Board | null {
  if (!state && action.type !== "SET_BOARD") return null

  switch (action.type) {
    case "SET_BOARD":
      return action.payload

    case "DELETE_COLUMN":
      return {
        ...state!,
        columns:
          state!.columns?.filter((col) => col.id !== action.payload.columnId) ??
          null,
      }

    case "ADD_THREAD":
      return {
        ...state!,
        columns:
          state!.columns?.map((col) => {
            if (col.id === action.payload.columnId) {
              return {
                ...col,
                threads: [...(col.threads ?? []), action.payload.newThread],
              }
            }
            return col
          }) ?? null,
      }

    case "MOVE_THREAD": {
      const { threadId, targetColumnId } = action.payload
      let movedThread: BoardThread | undefined

      for (const col of state!.columns ?? []) {
        const found = col.threads?.find((t) => t.id === threadId)
        if (found) {
          movedThread = found
          break
        }
      }

      if (!movedThread) return state

      const updatedColumns =
        state!.columns?.map((col) => {
          const cleanedThreads = (col.threads ?? []).filter(
            (t) => t.id !== threadId
          )
          if (col.id === targetColumnId) {
            return {
              ...col,
              threads: [...cleanedThreads, movedThread!],
            }
          }
          return { ...col, threads: cleanedThreads }
        }) ?? null

      return {
        ...state!,
        columns: updatedColumns,
      }
    }

    case "RENAME_ACTIVE_BOARD":
      return {
        ...state!,
        title: action.payload.newTitle,
      }

    default:
      return state
  }
}

interface BoardDetailsContextType {
  activeBoard: Board | null
  deleteColumn: (columnId: UUID) => void
  addThread: (columnId: UUID, newThread: BoardThread) => void
  moveThread: (threadId: UUID, targetColumnId: UUID) => void
  renameActiveBoard: (newTitle: string) => void
}

const BoardDetailsContext = createContext<BoardDetailsContextType | undefined>(
  undefined
)

export function BoardDetailsProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const { boardId } = useParams<{ boardId: string }>()
  const { boardList } = useBoardOverview() // Greift auf Übersicht zu, um das Initial-Board zu finden
  const [activeBoard, dispatch] = useReducer(detailsReducer, null)

  // Synchronisiert das aktive Board, wenn sich die URL (:boardId) ändert
  useEffect(() => {
    if (boardId) {
      const found = boardList.find((b) => b.id === boardId) ?? null
      dispatch({ type: "SET_BOARD", payload: found })
    }
  }, [boardId, boardList])

  const deleteColumn = (columnId: UUID) =>
    dispatch({ type: "DELETE_COLUMN", payload: { columnId } })

  const addThread = (columnId: UUID, newThread: BoardThread) =>
    dispatch({ type: "ADD_THREAD", payload: { columnId, newThread } })

  const moveThread = (threadId: UUID, targetColumnId: UUID) =>
    dispatch({ type: "MOVE_THREAD", payload: { threadId, targetColumnId } })

  const renameActiveBoard = (newTitle: string) =>
    dispatch({ type: "RENAME_ACTIVE_BOARD", payload: { newTitle } })

  return (
    <BoardDetailsContext.Provider
      value={{
        activeBoard,
        deleteColumn,
        addThread,
        moveThread,
        renameActiveBoard,
      }}
    >
      {children}
    </BoardDetailsContext.Provider>
  )
}

export function useBoardDetails() {
  const context = useContext(BoardDetailsContext)
  if (!context) {
    throw new Error(
      "useBoardDetails muss im BoardDetailsProvider genutzt werden"
    )
  }
  return context
}
