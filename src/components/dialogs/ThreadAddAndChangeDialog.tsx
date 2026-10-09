import {
  useState,
  useId,
  type ChangeEvent,
  type ReactNode,
  type SyntheticEvent,
} from "react"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  type BoardThread,
  type ThreadFormData,
} from "@/components/types/boardTypes"
import { Plus } from "lucide-react"
import { Label } from "../ui/label"

interface CreateDialogProps {
  thread?: BoardThread
  className?: string
  onSubmit: (threadFormData: ThreadFormData) => void
  triggerIcon?: ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export function ThreadAddAndChangeDialog({
  onSubmit: onSubmit,
  className: className,
  thread: thread,
  triggerIcon = <Plus aria-hidden="true" className="size-5" />,
  open: controlledOpen,
  onOpenChange: onControlledOpenChange,
}: CreateDialogProps) {
  const titleInputId = useId()
  const [internalOpen, setInternalOpen] = useState(false)
  const isOpen = controlledOpen ?? internalOpen
  const isEditMode = thread !== undefined && thread.id?.length > 0
  const [isSubmitting, setIsSubmitting] = useState(false) // 👈 Guard State

  function handleOpenChange(nextIsOpen: boolean) {
    if (controlledOpen === undefined) {
      setInternalOpen(nextIsOpen)
    }
    onControlledOpenChange?.(nextIsOpen)
  }

  const originalFormData = thread
    ? omit(thread, "id", "columnId")
    : {
        title: "",
        description: "",
        assignedTo: "",
        deadline: new Date(),
      }

  const [formData, setFormData] = useState<ThreadFormData>(originalFormData)

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    console.log("ThreadDialog.handleChange", e.target.name)
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault()
    if (isSubmitting || !formData.title.trim()) return

    setIsSubmitting(true)

    onSubmit(formData)

    handleOpenChange(false)
    setIsSubmitting(false)

    if (!isEditMode) {
      setFormData({
        title: "",
        description: "",
        assignedTo: "",
        deadline: new Date(),
      })
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      {/* Der Button, der das Overlay öffnet */}
      <DialogTrigger
        render={
          <Button
            type="button"
            size="icon-lg"
            className={
              className ??
              "m-0 cursor-pointer bg-transparent p-0 text-muted-foreground hover:bg-transparent hover:text-success"
            }
            aria-label="Thread erstellen"
          >
            {triggerIcon}
          </Button>
        }
      />

      <DialogContent className="flex h-screen w-screen max-w-none flex-col justify-between rounded-none border-none p-6">
        {" "}
        <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col">
          {/* <DialogHeader>
            <DialogTitle>
              {isEditMode ? "Bearbeiten" : "Erstellen"} Thread
            </DialogTitle>
          </DialogHeader> */}

          <div className="flex min-h-0 flex-1 flex-col py-4">
            <Label htmlFor={titleInputId} className="text-sm">
              Titel
              <span aria-hidden="true" className="text-destructive">
                *
              </span>
              <span className="sr-only">Pflichtfeld</span>
            </Label>
            <Input
              id={titleInputId}
              placeholder="Thread-Name eingeben..."
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              {...(!isEditMode ? { autoFocus: true } : {})}
            />
            <Label className="text-sm">Beschreibung</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Beschreibung eingeben..."
              {...(isEditMode
                ? {
                    autoFocus: true,
                  }
                : {})}
              className="h-full min-h-0 flex-1 resize-none"
            />
            <Label className="text-sm">Zugewiesene Person</Label>
            {/* Todo Select */}
            <Input
              placeholder="Zugewiesene Person eingeben..."
              name="assignedTo"
              value={formData.assignedTo}
              onChange={handleChange}
            />
            <Label className="text-sm">Deadline</Label>
            <Input
              type="date"
              className="h-max"
              placeholder="Deadline eingeben..."
              name="deadline"
              value={
                formData.deadline
                  ? new Date(formData.deadline).toISOString().split("T")[0]
                  : ""
              }
              onChange={handleChange}
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
            >
              Abbrechen
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || !formData.title.trim()}
            >
              {isSubmitting
                ? isEditMode
                  ? "Wird gespeichert..."
                  : "Wird erstellt..."
                : isEditMode
                  ? "Speichern"
                  : "Erstellen"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

function omit<T extends object, K extends keyof T>(
  obj: T,
  ...keys: K[]
): Omit<T, K> {
  const result = { ...obj }
  for (const key of keys) {
    delete result[key]
  }
  return result
}
