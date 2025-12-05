interface ProgressBarProps {
  currentStep: number
  totalSteps: number
  stepLabels: string[]
}

export function ProgressBar({ currentStep, totalSteps, stepLabels }: ProgressBarProps) {
  return (
    <div className="w-full max-w-2xl mx-auto mb-8">
      <div className="relative">
        {/* Container with fixed positioning */}
        <div className="relative flex items-center" style={{ minHeight: '60px' }}>
          {/* Steps */}
          {stepLabels.map((label, index) => {
            const step = index + 1
            const isActive = step === currentStep
            const isCompleted = step < currentStep
            const isLast = index === stepLabels.length - 1
            
            // Calculate position: distribute evenly across width
            const positionPercent = isLast 
              ? 100 
              : (index / (stepLabels.length - 1)) * 100
            
            return (
              <div
                key={step}
                className="absolute flex flex-col items-center"
                style={{
                  left: `${positionPercent}%`,
                  transform: 'translateX(-50%)',
                }}
              >
                {/* Circle */}
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-all duration-300 shrink-0 relative z-10 ${
                    isCompleted
                      ? 'bg-[#D4AF37] text-white'
                      : isActive
                      ? 'bg-white/20 border-2 border-[#D4AF37] text-white'
                      : 'bg-white/10 border-2 border-white/20 text-white/50'
                  }`}
                >
                  {isCompleted ? '✓' : step}
                </div>
                
                {/* Label */}
                <div className="mt-2">
                  <span
                    className={`text-xs md:text-sm font-medium transition-colors text-center whitespace-nowrap block ${
                      isActive ? 'text-white' : 'text-white/60'
                    }`}
                  >
                    {label}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
