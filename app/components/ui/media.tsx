import * as React from 'react'
import { Skeleton } from '~/components/ui/skeleton'
import { cn } from '~/lib/utils'

// --- Context ---
type MediaStatus = 'loading' | 'error' | 'success'

interface MediaContextValue {
  status: MediaStatus
  setStatus: React.Dispatch<React.SetStateAction<MediaStatus>>
}

const MediaContext = React.createContext<MediaContextValue | undefined>(undefined)

export function useMedia() {
  const context = React.useContext(MediaContext)
  if (!context) {
    throw new Error('Media compound components must be used within a Media component')
  }
  return context
}

// --- Components ---

const Media = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => {
    const [status, setStatus] = React.useState<MediaStatus>('loading')

    return (
      <MediaContext.Provider value={{ status, setStatus }}>
        <div
          ref={ref}
          className={cn('relative overflow-hidden', className)}
          {...props}
        >
          {children}
        </div>
      </MediaContext.Provider>
    )
  },
)
Media.displayName = 'Media'

// --- Media Image ---

export interface MediaImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {}

const MediaImage = React.forwardRef<HTMLImageElement, MediaImageProps>(
  ({ className, onLoad, onError, ...props }, ref) => {
    const { status, setStatus } = useMedia()
    const internalRef = React.useRef<HTMLImageElement>(null)

    // Handle cached images
    React.useLayoutEffect(() => {
      if (internalRef.current?.complete) {
        setStatus('success')
      }
    }, [setStatus])

    const handleLoad = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
      setStatus('success')
      onLoad?.(e)
    }

    const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
      setStatus('error')
      onError?.(e)
    }

    // Merge refs
    const mergedRef = (node: HTMLImageElement) => {
      internalRef.current = node
      if (typeof ref === 'function') {
        ref(node)
      }
      else if (ref) {
        ref.current = node
      }
    }

    return (
      <img
        ref={mergedRef}
        onLoad={handleLoad}
        onError={handleError}
        data-status={status}
        loading="lazy"
        className={cn(
          'h-full w-full object-cover transition-opacity duration-300',
          status === 'loading' ? 'opacity-0' : 'opacity-100',
          status === 'error' ? 'hidden' : '',
          className,
        )}
        {...props}
      />
    )
  },
)

// --- Media Video ---

export interface MediaVideoProps extends React.VideoHTMLAttributes<HTMLVideoElement> {}

const MediaVideo = React.forwardRef<HTMLVideoElement, MediaVideoProps>(
  ({ className, onLoadedData, onError, ...props }, ref) => {
    const { status, setStatus } = useMedia()

    const handleLoadedData = (e: React.SyntheticEvent<HTMLVideoElement, Event>) => {
      setStatus('success')
      onLoadedData?.(e)
    }

    const handleError = (e: React.SyntheticEvent<HTMLVideoElement, Event>) => {
      setStatus('error')
      onError?.(e)
    }

    return (
      <video
        ref={ref}
        onLoadedData={handleLoadedData}
        onError={handleError}
        data-status={status}
        className={cn(
          'h-full w-full object-cover transition-opacity duration-300',
          status === 'loading' ? 'opacity-0' : 'opacity-100',
          status === 'error' ? 'hidden' : '',
          className,
        )}
        {...props}
      />
    )
  },
)

MediaVideo.displayName = 'MediaVideo'

// --- Loading State (Skeleton) ---

const MediaLoading = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
  const { status } = useMedia()

  if (status !== 'loading')
    return null

  if (children) {
    return (
      <div ref={ref} className={className} {...props}>
        {children}
      </div>
    )
  }

  return (
    <Skeleton
      ref={ref}
      className={cn('absolute inset-0 size-full', className)}
      {...props}
    />
  )
})
MediaLoading.displayName = 'MediaLoading'

// --- Fallback State ---

const MediaFallback = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { status } = useMedia()

  if (status !== 'error')
    return null

  return (
    <div
      ref={ref}
      className={cn(
        'absolute inset-0 flex items-center justify-center bg-muted text-muted-foreground',
        className,
      )}
      {...props}
    />
  )
})
MediaFallback.displayName = 'MediaFallback'

export { Media, MediaFallback, MediaImage, MediaLoading, MediaVideo }
