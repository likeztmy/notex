# UI Design Comparison & Implementation Plan

## Visual Details Analysis

### 1. Sidebar (`GlobalSidebar.tsx`)

#### Current Implementation:
- Background: `#fdfdfd` (very light gray)
- "My Space" area: Has icon badge "Ms" with colored background
- "New Document": Icon-only button in header
- Search: Button inside sidebar header
- Spacing: Moderate padding (`1rem`)

#### Design Requirements:
- **Colors**:
  - Sidebar background: `#f8f8f8` (slightly darker light gray)
  - Active item background: `#ebebeb` (soft gray)
  - Text primary: `#222` or `#333` (dark gray/black)
  - Text secondary: `#888` (medium gray)
  - Border: `#e0e0e0` (light gray)

- **Spacing**:
  - Top padding: `24px`
  - Section spacing: `20-24px` between sections
  - List item padding: `8-10px` vertical, `16-20px` horizontal
  - Nested folder indentation: `20-24px` per level

- **"My Space" Area**:
  - Display: Flex container with icon, text, and dropdown caret
  - Icon: Document icon (not colored badge)
  - Text: `font-size: 14px`, `font-weight: 500`, `color: #222`
  - Dropdown caret: Small chevron on right
  - Margin bottom: `24px`

- **"New Document" Button**:
  - Style: Full button (not icon-only)
  - Background: `#ffffff`
  - Border: `1px solid #e0e0e0`
  - Border radius: `6px`
  - Padding: `10px 16px`
  - Font: `14px`, `font-weight: 500`
  - Layout: Flex with icon + text, `gap: 8px`
  - Margin bottom: `24px`

- **Navigation Links**:
  - Font size: `14px`
  - Padding: `8px 12px`
  - Border radius: `4px`
  - Hover: `background-color: #ebebeb`
  - Active: `background-color: #ebebeb`, `font-weight: 500`

- **Section Headings** (`Starred`, `Folders`, `Tags`):
  - Font size: `14px`
  - Font weight: `500`
  - Color: `#888`
  - Margin top: `20px`
  - Margin bottom: `8px`

- **Descriptive Text**:
  - Font size: `12px`
  - Color: `#888`
  - Margin left: `12px`
  - Margin bottom: `12px`

- **Bottom Icons**:
  - Three utility icons at bottom
  - Border top: `1px solid #e0e0e0`
  - Padding top: `20px`
  - Display: Flex, justify-content: space-around

### 2. Main Content Area

#### Current Implementation:
- Search bar: Inside content area or sidebar
- Header: Uses `PageHeader` component with icon + title
- Toolbar: Separate component with view toggles

#### Design Requirements:

- **Global Search Bar**:
  - Position: **Absolute/Fixed at very top**, centered horizontally
  - Location: Above both sidebar and main content (not in sidebar)
  - Width: `500px`
  - Height: `40px`
  - Background: `#ffffff`
  - Border: `1px solid #e0e0e0`
  - Border radius: `8px`
  - Padding: `0 12px`
  - Display: Flex, align-items: center
  - Z-index: `100`
  - Placeholder: "Open"

- **Main Header** ("All Docs"):
  - Font size: `28px` (currently `24px` or `2xl`)
  - Font weight: `700-800` (currently `semibold` ~600)
  - Color: `#222` or `#333`
  - Position: Left-aligned in main content
  - Layout: Flex container with heading + circular add button
  - Padding left: `30-40px`

- **Circular Add Button** (next to "All Docs"):
  - Size: `32px × 32px`
  - Border radius: `50%` (circular)
  - Background: `#ffffff`
  - Border: `1px solid #e0e0e0`
  - Display: Flex, centered
  - Margin left: `12px`
  - Icon: Plus icon (`+`)

- **Toolbar Buttons** (top-right):
  - **"Get Craft Plus" Button**:
    - Background: `#ffffff`
    - Border: `1px solid #e0e0e0`
    - Border radius: `6px`
    - Padding: `8px 14px`
    - Font size: `13px`
    - Font weight: `500`
    - Display: Flex, icon + text, `gap: 6px`
    - Icon: Crown icon

  - **View Toggle Buttons** (Grid, List, Table):
    - Size: `36px × 36px`
    - Border radius: `6px`
    - Background: `#ffffff`
    - Border: `1px solid #e0e0e0`
    - Display: Flex, centered
    - Margin left: `4px` between buttons
    - Active state: `background-color: #ebebeb`

  - **Ellipsis Button** (More options):
    - Same styling as view toggles
    - Icon: Three dots (`...`)

### 3. Content Table (`ContentTable.tsx`)

#### Current Implementation:
- Has actions column with star/more buttons
- Icons: Simple FileText icons
- Row hover shows action buttons

#### Design Requirements:

- **Table Container**:
  - Padding: `24px 30px` (approximate)

- **Column Headers**:
  - Font size: `13px`
  - Font weight: `500`
  - Color: `#888`
  - Padding: `12px 16px`
  - Border bottom: `1px solid #e0e0e0`
  - Alignment: "Name" left, date columns right
  - Sort icon: Down arrow on "Updated" column

- **Table Rows**:
  - Border bottom: `1px solid #e0e0e0`
  - Hover: `background-color: #f9f9f9`
  - Padding: `10px 16px` (cells)
  - Display: Grid layout

- **Document Icons**:
  - Size: `24×24px`
  - Box shadow: `0 1px 2px rgba(0,0,0,0.05)`
  - Border radius: Small radius for softer look
  - Some show preview content (text, chart, image)

- **Document Name Column**:
  - Container: Flex, `align-items: center`, `gap: 12px`
  - Title: `font-size: 15px`, `font-weight: 500`, `color: #222`
  - Description: `font-size: 12px`, `color: #888`, `margin-top: 4px`

- **Date Columns**:
  - Font size: `13px`
  - Color: `#888`
  - Text align: Right
  - Padding: `10px 16px`

- **Actions Column**:
  - **REMOVE** from visible columns (design shows no actions column)
  - Actions should be hidden or accessible via hover/context menu only

### 4. Typography

#### Current:
- Uses CSS variables from design system
- Font sizes: Various, generally smaller
- Font weights: Lighter (400-600)

#### Design Requirements:

- **Font Family**: Modern sans-serif (system-ui, Inter, or similar)
- **Font Weights**:
  - Heavy (`700-800`): Main headers ("All Docs")
  - Medium (`500-600`): Section titles, document titles, button text
  - Regular (`400`): Navigation links, date entries
  - Light (`300-400`): Descriptive text

- **Font Sizes**:
  - "All Docs" header: `28px`
  - Sidebar section titles: `14-16px`
  - Sidebar navigation: `14px`
  - "New Document" button: `14px`
  - Table document titles: `15px`
  - Table descriptions/dates: `12-13px`
  - Search bar input: `14px`

- **Colors**:
  - Primary text: `#222` or `#333`
  - Secondary text: `#888` or `#a0a0a0`
  - Placeholder: Light gray

### 5. Overall Layout

#### Current:
- Sidebar and content in flex layout
- Search in sidebar or content area

#### Design Requirements:

- **Background Colors**:
  - Main app: `#fcfcfc` or `#ffffff` (very light gray/white)
  - Sidebar: `#f8f8f8` (slightly darker light gray)

- **Margins/Padding**:
  - Sidebar width: `260px` to `280px` (fixed)
  - Main content padding: `24px` to `32px` on all sides
  - Global search bar: Positioned at top, centered

- **Layout Structure**:
  - Global search bar: **Fixed/absolute at very top**, centered, above everything
  - Two-column layout: Sidebar (fixed width) + Main content (flexible)
  - Search bar floats independently outside the grid

---

## Specific Changes Needed

### 1. Global Styling (`src/styles/app.css`)

**Add CSS Variables:**
```css
:root {
  --color-background-primary: #fcfcfc;
  --color-background-sidebar: #f8f8f8;
  --color-background-active-item: #ebebeb;
  --color-text-primary: #222;
  --color-text-secondary: #888;
  --color-border-light: #e0e0e0;
  --border-radius-sm: 4px;
  --border-radius-md: 6px;
  --border-radius-lg: 8px;
}
```

**Update Base Font:**
```css
body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
}
```

### 2. Sidebar (`src/components/GlobalSidebar.tsx` & `.module.css`)

**Changes:**
1. Update sidebar background to `#f8f8f8`
2. Restructure "My Space" area:
   - Remove colored badge, use document icon
   - Add dropdown caret icon
   - Adjust spacing
3. Change "New Document" from icon button to full button:
   - White background, border, rounded corners
   - Icon + "New Document" text
   - Proper padding and spacing
4. Remove search button from sidebar header
5. Update navigation link styles:
   - Adjust padding, colors, hover/active states
   - Use `#ebebeb` for active/hover
6. Update section headers:
   - Font size `14px`, weight `500`, color `#888`
   - Proper margins
7. Update descriptive text:
   - Font size `12px`, color `#888`
   - Proper margins
8. Add bottom icons section:
   - Three utility icons
   - Border top separator
   - Flex layout

### 3. Global Search Bar (`src/routes/__root.tsx` or new component)

**Create/Update:**
1. Position search bar at very top, centered
2. Style: White background, border, rounded (`8px` radius)
3. Width: `500px`, height: `40px`
4. Placeholder: "Open"
5. Z-index: `100` to stay above content
6. Remove search from sidebar

### 4. Main Content Header (`src/routes/content.tsx`)

**Changes:**
1. Update "All Docs" heading:
   - Font size: `28px`
   - Font weight: `700-800`
   - Color: `#222`
2. Add circular add button next to heading:
   - `32px × 32px`, circular
   - White background, border
   - Plus icon
3. Move toolbar to right side:
   - "Get Craft Plus" button (styled as per design)
   - View toggle buttons (Grid, List, Table)
   - Ellipsis button
   - Proper spacing and active states

### 5. Content Table (`src/components/ContentTable.tsx` & `.module.css`)

**Changes:**
1. Update table container padding: `24px 30px`
2. Update column headers:
   - Font size `13px`, weight `500`, color `#888`
   - Right-align date columns
   - Add sort icon to "Updated" column
3. Update row styling:
   - Hover: `#f9f9f9`
   - Border: `1px solid #e0e0e0`
   - Proper cell padding
4. Update document icons:
   - Size `24×24px`
   - Box shadow for depth
   - Border radius
5. Update name column:
   - Title: `15px`, weight `500`
   - Description: `12px`, color `#888`
6. Update date columns:
   - Font size `13px`, color `#888`
   - Right alignment
7. **Remove or hide actions column** (design shows no visible actions)

### 6. Layout Structure (`src/routes/__root.tsx`)

**Changes:**
1. Add global search bar component at root level
2. Position it absolutely/fixed at top center
3. Ensure it's above sidebar and content
4. Update main content background to `#fcfcfc` or `#ffffff`

---

## Implementation Priority

1. **High Priority:**
   - Global search bar positioning and styling
   - Sidebar background and spacing updates
   - "New Document" button restructure
   - Main header typography ("All Docs")

2. **Medium Priority:**
   - Table styling updates
   - Navigation link hover/active states
   - Toolbar button styling

3. **Low Priority:**
   - Bottom icons in sidebar
   - Descriptive text styling
   - Fine-tuning spacing and colors
