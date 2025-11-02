import { Button } from "@/components/ui/button"

interface ErrorDisplayProps {
  message: string
  onRetry?: () => void
  fullScreen?: boolean
}

export function ErrorDisplay({ message, onRetry, fullScreen = false }: ErrorDisplayProps) {
  if (fullScreen) {
    return (
      <div className="flex-1 p-4 sm:p-6 min-h-screen">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <p className="text-red-600 mb-4">{message}</p>
              {onRetry && (
                <Button onClick={onRetry} className="bg-[#5A6ACF] hover:bg-[#5A6ACF]">
                  Tentar novamente
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
      <p>{message}</p>
      {onRetry && (
        <Button onClick={onRetry} variant="outline" size="sm" className="mt-2">
          Tentar novamente
        </Button>
      )}
    </div>
  )
}