export default function BoardDetail({ boardId }: { boardId: string }) {
  if (boardId === null) {
    return <>Hallo BoardDetail unicht bekannt</>
  }

  return <>Hallo BoardDetail {boardId}</>
}
