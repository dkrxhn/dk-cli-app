# Terminal Portfolio Website - Design Guidelines

## Design Approach

**Reference-Based Design**: Authentic Linux terminal interface (bash/zsh aesthetic)
Drawing inspiration from classic terminal emulators (iTerm2, Hyper, GNOME Terminal) with modern web polish. This is a utility-focused interface where functionality and authentic CLI experience drive all design decisions.

## Core Design Principles

1. **Terminal Authenticity**: Mimic real CLI behavior and visual treatment
2. **Functional Clarity**: Every element serves the command-line interaction
3. **Retro-Modern Balance**: Classic terminal aesthetics with contemporary polish

## Typography System

**Primary Font**: JetBrains Mono, Fira Code, or Source Code Pro (monospace via Google Fonts CDN)
- All text: 14px-16px base, consistent monospace throughout
- Command prompt: Regular weight
- User input: Regular weight, slightly increased letter-spacing
- Output text: Regular weight
- Section headers (ASCII art): Regular weight, larger size (18px-24px)
- Help text/descriptions: Same size, slightly reduced opacity for hierarchy

**No font weight variations** - terminals use a single weight with color/brightness for emphasis.

## Layout System

**Spacing Primitives**: Tailwind units of 1, 2, 4, 8 (ultra-tight spacing for terminal density)

**Terminal Window Structure**:
- Full viewport height (h-screen)
- Fixed terminal chrome: Window titlebar with traffic light buttons (h-8 to h-10)
- Terminal content area: Remaining viewport minus chrome
- Content padding: p-4 to p-6 for breathing room
- Line height: leading-relaxed (1.625) for readability in monospace

**Responsive Behavior**:
- Desktop: Full terminal window with chrome
- Mobile: Simplified chrome, full-screen terminal, same spacing system

## Component Library

### Terminal Chrome
- Window titlebar with traffic light controls (red, yellow, green dots)
- Terminal tab indicator showing current "session"
- Subtle window border/shadow for depth

### Command Line Interface
- Prompt indicator: Username@hostname format (e.g., `visitor@dkportfolio:~$`)
- Current directory indicator in prompt
- Blinking cursor (subtle animation, 1s interval)
- Command input field: Full-width, transparent background, monospace
- Output area: Scrollable content region

### Command History Display
- Previous commands shown above current prompt
- Each command followed by its output
- Timestamped entries (optional minimal timestamp)
- Proper indentation for multi-line output

### Content Sections (Rendered as Terminal Output)

**Directory Listings**:
```
drwxr-xr-x  resume/
drwxr-xr-x  projects/
drwxr-xr-x  contact/
-rw-r--r--  README.md
```
Use proper permission syntax, file type indicators, aligned columns

**File Content Display** (cat command):
- Plain text rendering with proper line breaks
- Syntax highlighting for code files (resume could be markdown-styled)
- Horizontal rules as ASCII dividers (e.g., `---`)

**ASCII Art Welcome Banner**:
- Displayed on initial load
- Your name/brand in ASCII art (keep under 10 lines height)
- Version/tagline below banner
- `type 'help' for available commands` instruction

### Navigation Elements

**Command Autocomplete Dropdown**:
- Appears below input when Tab pressed
- List of matching commands/paths
- Minimal styling: thin border, subtle highlight on selection
- Positioned absolutely below cursor

**Help Menu Display**:
- Table-like layout with command names and descriptions
- Aligned columns for clean readability
- Categories: Navigation, Information, External Links, Utilities

### External Link Handling
- Commands that open external links (blog, github, dktechhelp)
- Display "Opening [URL] in new tab..." message
- Brief loading indicator (spinning ASCII character: `/-\|`)

### Interactive Features
- Command history navigation (up/down arrows)
- Tab completion for commands and paths
- Clear screen command (scrolls to top, fresh prompt)
- Ctrl+L keyboard shortcut support (standard terminal)

## Animation Strategy

**Minimal, Purposeful Animations**:
- Cursor blink: 1s interval, smooth opacity transition
- Text typing effect: Optional fast typing for initial welcome (20-30ms per character)
- Loading spinner: ASCII character rotation for external links
- Scroll behavior: Smooth auto-scroll to bottom on new output

**No Animations**: Page transitions, hover effects, or decorative movements

## Accessibility Considerations

- High contrast maintained throughout (terminal standard)
- Keyboard-first navigation (arrow keys, Tab, Enter, Ctrl shortcuts)
- Screen reader announcements for command output
- Focus indicators on interactive elements (subtle terminal-style underline)
- Skip to content option for screen readers

## Special Sections

### Resume Section
- Rendered as formatted text output (cat resume.txt)
- Clean ASCII layout with section headers
- Contact info, experience, skills in readable columns
- File size indicator before display

### Projects/Blog Links
- Display as clickable links within terminal output
- Format: `[Enter] to open | [URL preview]`
- Visual indicator for external navigation

### Error States
- "Command not found" messages for invalid input
- "Permission denied" for restricted areas (playful)
- Helpful suggestions for typos (did you mean...?)

## Content Density

Terminal interfaces are information-dense by nature:
- Minimal whitespace between output blocks (space-y-1 to space-y-2)
- Tight line spacing appropriate for code reading
- Maximum content width: None (full terminal width)
- Scrollable output area for long content

## Images

**No images in this design**. Terminal interfaces are text-only. Any visual elements should be ASCII art or Unicode characters. No hero images, no decorative graphics - maintain pure terminal authenticity.