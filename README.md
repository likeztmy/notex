# notex

A thoughtful space for your documents. Clean, focused, and beautifully designed.

## ✨ Features

### **Document Management**

- 📝 **Beautiful Editor** - Rich text editing with Tiptap, markdown support, keyboard shortcuts
- 📊 **Table View** - See all your documents at a glance with sortable columns
- 📁 **Smart Organization** - Folders, tags, and quick navigation
- ⭐ **Quick Access** - Starred and recent documents
- 🔍 **Powerful Search** - Find what you need instantly with real-time filtering
- 🔄 **Smart Sorting** - Sort by title, created date, or last updated
- 🤝 **Sharing** - Share your documents with others

### **Editor Features**

- ✍️ **Rich Text** - Headings, bold, italic, lists, code blocks, and more
- ⌨️ **Keyboard Shortcuts** - Full keyboard navigation and formatting shortcuts
- 💾 **Auto-save** - Never lose your work with automatic saving
- 📝 **Markdown Support** - Write in markdown and export easily
- 🎯 **Block Commands** - Slash commands for quick formatting
- ✨ **Bubble Menu** - Context-aware formatting toolbar

### **Design**

- 🎨 **Warm Minimalism** - Craft-inspired design with warm colors and refined typography
- ⚡ **Fast & Local** - Lightning-fast performance with local storage
- 🔒 **Private** - Your data stays on your device
- 📱 **Clean Interface** - Distraction-free writing environment

Built with TanStack Start, Tiptap editor, and modern React patterns.

## Getting Started

From your terminal:

```sh
pnpm install
pnpm dev
```

This starts your app in development mode, rebuilding assets on file changes.

## Build

To build the app for production:

```sh
pnpm build
```

## 📚 Documentation

- **[ROUTES.md](./ROUTES.md)** - Complete routing structure and navigation
- **[DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md)** - Design system guidelines and components
- **[REFACTOR_SUMMARY.md](./REFACTOR_SUMMARY.md)** - Latest refactoring details

## 🎨 Design System

This project uses a **Warm Minimalism** design system inspired by Craft and Heptabase:

- Warm neutral palette (creams, soft tans, warm whites)
- Elegant serif typography (Source Serif 4, Playfair Display)
- Refined sans-serif for body (IBM Plex Sans)
- Generous spacing and breathing room
- Smooth, delightful animations with refined easing
- Soft shadows for depth
- Thoughtful, calm interface perfect for long work sessions

See [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md) for complete guidelines.

## 🗺️ Page Structure

| Route          | Description                                   |
| -------------- | --------------------------------------------- |
| `/`            | Landing page                                  |
| `/editor`      | Document editor with rich text editing        |
| `/content`     | All documents (table view) with search & sort |
| `/recent`      | Recently viewed documents                     |
| `/starred`     | Starred documents                             |
| `/folders/:id` | Folder contents (table view)                  |
| `/tags/:name`  | Tagged content                                |
| `/shared`      | Shared content                                |
| `/docs`        | Alternative document list view                |

## 🛠️ Tech Stack

- **Framework**: TanStack Start (React)
- **Routing**: TanStack Router
- **Editor**: Tiptap
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui
- **Icons**: Lucide React
- **Drag & Drop**: dnd-kit

## 🚀 Recent Updates

### 2026-01-27: Craft-Inspired Redesign

- ✅ **Warm Minimalism Design** - Beautiful warm color palette inspired by Craft and Heptabase
- ✅ **Table View** - Professional table layout for document lists with sortable columns
- ✅ **Simplified UI** - Clean, focused document management (removed canvas complexity)
- ✅ **Refined Typography** - Playfair Display, Source Serif 4, and IBM Plex Sans
- ✅ **Smooth Animations** - Custom easing curves and delightful micro-interactions
- ✅ **Clean Sidebar** - Flat navigation with emoji folders
- ✅ **View Controls** - Grid/list toggle, sort, filter, and search buttons
- ✅ **Chinese Dates** - Localized date formatting (今天, 昨天, X天前)

See [CRAFT_REDESIGN.md](./CRAFT_REDESIGN.md) and [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md) for details.
