import { Input } from '@/core/ui/input'
import { Label } from '@/core/ui/label'
import { Textarea } from '@/core/ui/textarea'

export function PosterProofUiField({
  label,
  onChange,
  textarea,
  value,
}: {
  label: string
  onChange: (value: string) => void
  textarea?: boolean
  value: string
}) {
  return (
    <label className="grid gap-1.5">
      <Label className="text-[0.68rem] tracking-[0.12em] text-muted-foreground uppercase">{label}</Label>
      {textarea ? (
        <Textarea className="min-h-20" onChange={(event) => onChange(event.target.value)} value={value} />
      ) : (
        <Input onChange={(event) => onChange(event.target.value)} value={value} />
      )}
    </label>
  )
}
