import React, { createContext, useContext, useReducer, useEffect } from "react"
import { useParams } from "react-router-dom" // Oder dein genutzter Router
import {
  type Board,
  type UUID,
  type BoardThread,
  type ThreadFormData,
} from "../types/boardTypes"
import { useBoardOverview } from "./BoardOverviewContext"

type DetailsAction =
  | { type: "ADD_COLUMN"; payload: { title: string } }
  | { type: "SET_BOARD"; payload: Board | null }
  | { type: "DELETE_COLUMN"; payload: { columnId: UUID } }
  | {
      type: "ADD_THREAD"
      payload: { columnId: UUID; newThread: ThreadFormData }
    }
  | {
      type: "CHANGE_THREAD_DETAILS"
      payload: { threadId: UUID; changes: ThreadFormData }
    }
  | { type: "MOVE_THREAD"; payload: { threadId: UUID; targetColumnId: UUID } }

function detailsReducer(
  state: Board | null,
  action: DetailsAction
): Board | null {
  if (!state && action.type !== "SET_BOARD") return null

  switch (action.type) {
    case "SET_BOARD":
      return action.payload

    case "ADD_COLUMN":
      return {
        ...state!,
        columns: [
          ...(state!.columns ?? []),
          {
            id: crypto.randomUUID() as UUID,
            title: action.payload.title,
            threads: [],
          },
        ],
      }
    case "DELETE_COLUMN":
      return {
        ...state!,
        columns:
          state!.columns?.filter((col) => col.id !== action.payload.columnId) ??
          null,
      }

    case "ADD_THREAD": {
      const newBoardThread: BoardThread = {
        ...action.payload.newThread,
        id: crypto.randomUUID() as UUID,
        columnId: action.payload.columnId,
      }

      return {
        ...state!,
        columns:
          state!.columns?.map((col) => {
            if (col.id === action.payload.columnId) {
              return {
                ...col,
                threads: [...(col.threads ?? []), newBoardThread],
              }
            }
            return col
          }) ?? null,
      }
    }

    case "CHANGE_THREAD_DETAILS": {
      const { threadId, changes } = action.payload
      let changedThread: BoardThread | undefined

      for (const col of state!.columns ?? []) {
        const found = col.threads?.find((t) => t.id === threadId)
        if (found) {
          changedThread = found
          break
        }
      }

      if (!changedThread) return state

      return {
        ...state!,
        columns:
          state!.columns?.map((col) => {
            if (col.id === changedThread!.columnId) {
              return {
                ...col,
                threads:
                  col.threads?.map((t) =>
                    t.id === changedThread!.id ? { ...t, ...changes } : t
                  ) ?? null,
              }
            }
            return col
          }) ?? null,
      }
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
      if (!state!.columns?.some((col) => col.id === targetColumnId))
        return state

      const threadToMove = { ...movedThread, columnId: targetColumnId }

      const updatedColumns =
        state!.columns?.map((col) => {
          const cleanedThreads = (col.threads ?? []).filter(
            (t) => t.id !== threadId
          )
          if (col.id === targetColumnId) {
            return {
              ...col,
              threads: [...cleanedThreads, threadToMove],
            }
          }
          return { ...col, threads: cleanedThreads }
        }) ?? null

      return {
        ...state!,
        columns: updatedColumns,
      }
    }

    default:
      return state
  }
}

interface BoardDetailsContextType {
  activeBoard: Board | null
  addNewColumn: (title: string) => void
  deleteColumn: (columnId: UUID) => void
  addThread: (columnId: UUID, newThread: ThreadFormData) => void
  changeThreadDetails: (threadId: UUID, changes: ThreadFormData) => void
  moveThread: (threadId: UUID, targetColumnId: UUID) => void
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

  const addNewColumn = (title: string) =>
    dispatch({ type: "ADD_COLUMN", payload: { title } })

  const deleteColumn = (columnId: UUID) =>
    dispatch({ type: "DELETE_COLUMN", payload: { columnId } })

  const addThread = (columnId: UUID, newThread: ThreadFormData) =>
    dispatch({ type: "ADD_THREAD", payload: { columnId, newThread } })

  const changeThreadDetails = (threadId: UUID, changes: ThreadFormData) =>
    dispatch({
      type: "CHANGE_THREAD_DETAILS",
      payload: { threadId, changes },
    })

  const moveThread = (threadId: UUID, targetColumnId: UUID) =>
    dispatch({ type: "MOVE_THREAD", payload: { threadId, targetColumnId } })

  return (
    <BoardDetailsContext.Provider
      value={{
        activeBoard,
        addNewColumn,
        deleteColumn,
        addThread,
        changeThreadDetails,
        moveThread,
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
