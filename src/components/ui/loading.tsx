interface LoadingProps {
  message?: string
  fullScreen?: boolean
}

export function Loading({ message = "Carregando...", fullScreen = false }: LoadingProps) {
  if (fullScreen) {
    return (
      <div className="flex-1 p-4 sm:p-6 min-h-screen">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#5A6ACF] mx-auto mb-4"></div>
              <p className="text-gray-600">{message}</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex justify-center items-center py-8">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#5A6ACF] mx-auto mb-3"></div>
        <p className="text-gray-600 text-sm">{message}</p>
      </div>
    </div>
  )
}