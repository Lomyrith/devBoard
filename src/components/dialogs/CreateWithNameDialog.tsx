import { useState, type SyntheticEvent } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface CreateDialogProps {
  onCreate: (title: string) => void
  nameOfCreatabelElement?: string
  className?: string
}

export function CreateWithNameDialog({
  onCreate: onCreate,
  nameOfCreatabelElement: nameOfCreatabelElement,
  className: className,
}: CreateDialogProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [title, setTitle] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false) // 👈 Guard State

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault()
    if (isSubmitting || !title.trim()) return

    setIsSubmitting(true)

    onCreate(title.trim())

    setTitle("")
    setIsOpen(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      {/* Der Button, der das Overlay öffnet */}
      <DialogTrigger
        render={
          <Button className={className}>
            Erstelle {nameOfCreatabelElement}
          </Button>
        }
      />

      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{nameOfCreatabelElement} erstellen</DialogTitle>
          </DialogHeader>

          <div className="py-4">
            <Input
              placeholder={`${nameOfCreatabelElement}-Name eingeben...`}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              autoFocus
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
            >
              Abbrechen
            </Button>
            <Button type="submit" disabled={isSubmitting || !title.trim()}>
              {isSubmitting ? "Wird erstellt..." : "Erstellen"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
