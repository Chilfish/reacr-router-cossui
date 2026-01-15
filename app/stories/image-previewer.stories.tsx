import type { Meta, StoryObj } from '@storybook/react-vite'
import type { ComponentProps } from 'react'
import type { MediaItem } from '~/components/ui/image-previewer'
import { DownloadIcon, HeartIcon, InfoIcon, ShareIcon } from 'lucide-react'
import { useState } from 'react'
import { Button } from '~/components/ui/button'
import { ImagePreviewer } from '~/components/ui/image-previewer'

const meta = {
  title: 'UI/ImagePreviewer',
  component: ImagePreviewer,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    onOpenChange: { action: 'onOpenChange' },
  },
} satisfies Meta<typeof ImagePreviewer>

export default meta

type Story = StoryObj<typeof ImagePreviewer>

const sampleImages: MediaItem[] = [
  {
    id: '1',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?auto=format&fit=crop&w=1200&q=80',
    alt: 'Mountain landscape',
  },
  {
    id: '2',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1682687221038-404670e01d46?auto=format&fit=crop&w=1200&q=80',
    alt: 'Ocean view',
  },
  {
    id: '3',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1682687220063-4742bd7fd538?auto=format&fit=crop&w=1200&q=80',
    alt: 'Forest path',
  },
]

const mixedMedia: MediaItem[] = [
  {
    id: '1',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1579353977828-2a4eab540b9a?auto=format&fit=crop&w=1200&q=80',
    alt: 'Abstract Art',
  },
  {
    id: '2',
    type: 'video',
    url: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
    alt: 'Flower Video',
  },
  {
    id: '3',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
    alt: 'Oil Painting',
  },
]

// Wrapper to handle state since Storybook controls can be tricky with internal/external state sync
function PreviewerWrapper(args: ComponentProps<typeof ImagePreviewer>) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <div className="flex flex-col items-center gap-4">
        <p className="text-muted-foreground text-sm">Click the button to open the previewer</p>
        <Button onClick={() => setIsOpen(true)}>Open Gallery</Button>
      </div>

      <ImagePreviewer
        {...args}
        open={isOpen}
        onOpenChange={(open) => {
          setIsOpen(open)
          args.onOpenChange?.(open)
        }}
      />
    </>
  )
}

export const Default: Story = {
  render: args => <PreviewerWrapper {...args} />,
  args: {
    items: sampleImages,
    initialIndex: 0,
  },
}

export const MixedMedia: Story = {
  render: args => <PreviewerWrapper {...args} />,
  args: {
    items: mixedMedia,
    initialIndex: 0,
  },
}

export const WithToolbars: Story = {
  render: args => <PreviewerWrapper {...args} />,
  args: {
    items: sampleImages,
    headerStart: (
      <div className="flex items-center gap-2 text-white/90">
        <div className="size-8 rounded-full bg-slate-500/50 flex items-center justify-center border border-white/10">
          <span className="text-xs font-bold">JD</span>
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-medium shadow-black drop-shadow-md">John Doe</span>
          <span className="text-xs text-white/70 shadow-black drop-shadow-md">Today at 10:42 AM</span>
        </div>
      </div>
    ),
    headerEnd: (
      <Button variant="ghost" size="icon" className="text-white/80 hover:bg-white/20 hover:text-white rounded-full">
        <InfoIcon className="size-5" />
      </Button>
    ),
    footerStart: (
      <Button variant="ghost" size="icon" className="text-white/80 hover:bg-white/20 hover:text-white rounded-full">
        <HeartIcon className="size-5" />
      </Button>
    ),
    footerEnd: (
      <div className="flex gap-2">
        <Button variant="ghost" size="icon" className="text-white/80 hover:bg-white/20 hover:text-white rounded-full">
          <ShareIcon className="size-5" />
        </Button>
        <Button variant="ghost" size="icon" className="text-white/80 hover:bg-white/20 hover:text-white rounded-full">
          <DownloadIcon className="size-5" />
        </Button>
      </div>
    ),
  },
}
