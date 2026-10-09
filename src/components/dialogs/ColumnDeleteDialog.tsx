import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import type { BoardColumn } from "../types/boardTypes"
import { useState } from "react"

type ColumnDeleteDialogProps = {
  column: BoardColumn
  taskCount: number
  onConfirmDelete: () => void
}

export default function ColumnDeleteDialog({
  column,
  taskCount,
  onConfirmDelete,
}: ColumnDeleteDialogProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  const deleteButton = (
    <Button
      type="button"
      variant="ghost"
      size="icon-lg"
      className="text-action-muted hover:text-destructive"
      aria-label={`Spalte ${column.title} löschen`}
      onClick={taskCount === 0 ? onConfirmDelete : undefined}
    >
      <Trash2 aria-hidden="true" className="size-5" />
    </Button>
  )

  function handleConfirmDelete() {
    setIsDeleteDialogOpen(false)
    onConfirmDelete()
  }

  if (taskCount === 0) {
    return deleteButton
  }
  return (
    <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
      <DialogTrigger render={deleteButton} />

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Spalte wirklich löschen?</DialogTitle>
          <DialogDescription>
            Soll die Spalte „{column.title}“ mit {taskCount}{" "}
            {taskCount === 1 ? "Task" : "Tasks"} wirklich gelöscht werden? Alle
            Threads in dieser Spalte werden ebenfalls gelöscht (oder bleiben als
            Geister in der DB wenn hier falsch programmiert wird).
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => setIsDeleteDialogOpen(false)}
          >
            Abbrechen
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleConfirmDelete}
          >
            Spalte löschen
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
