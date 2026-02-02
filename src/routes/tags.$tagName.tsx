import { createFileRoute, Link } from '@tanstack/react-router'
import { TagIcon, ArrowLeftIcon } from 'lucide-react'

export const Route = createFileRoute('/tags/$tagName')({
  component: TagPage,
})

function TagPage() {
  const { tagName } = Route.useParams()
  
  // Decode the tag name (in case it has special characters)
  const displayTagName = decodeURIComponent(tagName)

  return (
    <div className="min-h-screen px-8 pb-8" style={{ background: 'var(--color-linear-bg-secondary)' }}>
      <div className="max-w-6xl mx-auto pt-8">
        {/* Back Button */}
        <Link
          to="/docs"
          className="inline-flex items-center gap-2 mb-6 text-sm font-light transition-opacity hover:opacity-70"
          style={{ color: 'var(--color-linear-text-secondary)' }}
        >
          <ArrowLeftIcon className="h-4 w-4" />
          <span>Back to All Docs</span>
        </Link>

        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <TagIcon
              className="h-6 w-6"
              style={{ color: 'var(--color-linear-accent-primary)' }}
            />
            <h1
              className="text-3xl font-light tracking-tight"
              style={{ color: 'var(--color-linear-text-primary)' }}
            >
              #{displayTagName}
            </h1>
          </div>
          <p
            className="text-sm font-light"
            style={{ color: 'var(--color-linear-text-secondary)' }}
          >
            All documents with this tag
          </p>
        </div>

        {/* Documents with this tag */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <TaggedDocument
            title="Project Planning"
            preview="Strategic planning for Q4 initiatives..."
            lastModified="Today"
            tags={[displayTagName, 'planning']}
          />
          <TaggedDocument
            title="Research Notes"
            preview="Key findings and observations..."
            lastModified="Yesterday"
            tags={[displayTagName, 'research']}
          />
        </div>

        {/* Related Tags */}
        <div className="mt-12">
          <h3 className="text-sm font-medium mb-4" style={{ color: 'var(--color-linear-text-primary)' }}>
            Related Tags
          </h3>
          <div className="flex flex-wrap gap-2">
            <RelatedTag name="work" />
            <RelatedTag name="ideas" />
            <RelatedTag name="personal" />
            <RelatedTag name="planning" />
          </div>
        </div>
      </div>
    </div>
  )
}

function TaggedDocument({
  title,
  preview,
  lastModified,
  tags,
}: {
  title: string
  preview: string
  lastModified: string
  tags: string[]
}) {
  return (
    <div
      className="p-6 rounded-xl cursor-pointer transition-all duration-200 hover:scale-[1.02]"
      style={{
        background: 'var(--color-linear-bg-primary)',
        border: '1px solid var(--color-linear-border-primary)',
      }}
    >
      <h3 className="text-lg font-medium mb-2" style={{ color: 'var(--color-linear-text-primary)' }}>
        {title}
      </h3>
      <p className="text-sm font-light mb-3 line-clamp-2" style={{ color: 'var(--color-linear-text-secondary)' }}>
        {preview}
      </p>
      <div className="flex flex-wrap gap-2 mb-3">
        {tags.map((tag) => (
          <span
            key={tag}
            className="px-2 py-1 rounded text-xs"
            style={{
              background: 'var(--color-linear-bg-secondary)',
              color: 'var(--color-linear-text-tertiary)',
            }}
          >
            #{tag}
          </span>
        ))}
      </div>
      <p className="text-xs font-light" style={{ color: 'var(--color-linear-text-tertiary)' }}>
        {lastModified}
      </p>
    </div>
  )
}

function RelatedTag({ name }: { name: string }) {
  return (
    <Link
      to="/tags/$tagName"
      params={{ tagName: name }}
      className="px-3 py-2 rounded-lg text-sm transition-all duration-150 hover:opacity-80"
      style={{
        background: 'var(--color-linear-bg-primary)',
        color: 'var(--color-linear-text-primary)',
        border: '1px solid var(--color-linear-border-primary)',
      }}
    >
      #{name}
    </Link>
  )
}
