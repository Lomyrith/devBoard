export type UUID = `${string}-${string}-${string}-${string}-${string}`

export type Board = {
  id: UUID
  title: string
  columns: BoardColumn[] | null
}

export type BoardColumn = {
  id: UUID
  title: string
  threads: BoardThread[] | null
}

export type BoardThread = {
  id: UUID
  title: string
  description: string
  assigendTo: string
  deadline: Date
}
