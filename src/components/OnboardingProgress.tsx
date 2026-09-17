export function OnboardingProgress({ step, total }: { step: number; total: number }) {
  return (
    <div className="flex gap-1.5 mb-8">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className={`h-1.5 flex-1 rounded-full transition-colors ${i < step ? 'bg-primary' : 'bg-muted'}`}
        />
      ))}
    </div>
  )
}
