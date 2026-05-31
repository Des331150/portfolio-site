# Projects Section — Portfolio Site

## Overview
Add a new "Projects" tab to the existing tabbed portfolio site that displays live data from GitHub repos using the GitHub REST API.

## Approach
**Approach 1: Fetch individual repos by name** — a config array of repo names, fetched in parallel via `api.github.com/repos/{user}/{repo}`. No authentication needed, minimal data fetched, easy to curate.

## Layout
- **Option C: Minimal language-colored cards** — compact cards in a responsive grid (3 cols → 2 → 1), each with a language accent bar at the top.

## Architecture

### Files to modify
| File | Change |
|------|--------|
| `index.html` | Add "Projects" tab button to the tab bar; add new `<section data-tab-name="projects">` container |
| `index.js` | Add GitHub API fetch logic, card rendering, loading skeleton, error state |
| `css/tailwind.css` | Add custom styles for skeleton animation and language color bar |

### Tab integration
- New tab button: `<button class="tab-btn" onclick="openTab(event, 'projects')">Projects</button>`
- New content section: `<section class="tab-content tw-hidden" data-tab-name="projects">`
- Uses existing `openTab()` JS function — no changes needed to the tab switching logic

### Data flow
1. Config array in `index.js`:
   ```js
   const GITHUB_USER = 'your-username';
   const HIGHLIGHTED_REPOS = ['repo1', 'repo2', 'repo3'];
   ```
2. Fetch happens on first activation of the Projects tab (lazy load). This avoids unnecessary API calls on page load.
   ```js
   const repoData = await Promise.all(
     HIGHLIGHTED_REPOS.map(name =>
       fetch(`https://api.github.com/repos/${GITHUB_USER}/${name}`).then(r => r.json())
     )
   );
   ```
3. Render cards into the `data-tab-name="projects"` section

### Card design (Option C)
```
┌──────────────────────┐
│ ████████████████████  │  ← language accent bar (3px, language color)
│                      │
│  repo-name           │  ← bold
│  Short description   │  ← 12px, muted text
│                      │
│  ★ 42          JS    │  ← stars + language label
└──────────────────────┘
```
- Gray border: `tw-border tw-border-gray-200` (subtle, neutral — not primary)
- Border radius: `tw-rounded-lg`
- Background: white (`tw-bg-white`), dark: `dark:tw-bg-slate-800`
- Shadow: `tw-shadow-xl`
- Language accent bar: 3px solid bar at top of card, colored by language
- Grid: `lg:tw-grid-cols-3 md:tw-grid-cols-2 tw-grid-cols-1`

### States

**Loading (skeleton):**
- 3 placeholder cards with animated pulse/gray bars
- Match card dimensions exactly so no layout shift
- Use Tailwind `tw-animate-pulse` on gray placeholder divs

**Error state:**
- Centered message: "Couldn't load projects"
- Retry button that re-fetches
- Use existing `btn-primary` class for the retry button

**Empty state:**
- If no repos configured or API returns 0 results
- "No projects to show yet" message

## Language colors
Use a hardcoded map of common GitHub language colors:
```js
const LANG_COLORS = {
  JavaScript: '#f7df1e',
  TypeScript: '#3178c6',
  Python: '#3572A5',
  HTML: '#e34c26',
  CSS: '#563d7c',
  // ...
};
```

## Dark mode
Cards inherit dark mode from existing styles (`dark:tw-bg-slate-800`, `dark:tw-text-white`). No additional dark mode handling needed.

## Edge cases
- **API rate limiting**: If unauthenticated (60 req/hr), the fetch may fail for many refreshes. For 3-5 repos this is unlikely to be an issue during normal use. The error state handles this gracefully.
- **Repo not found**: If a repo name is incorrect or deleted, that specific card is skipped with a console warning.
- **Network offline**: Caught by the error state handler.
