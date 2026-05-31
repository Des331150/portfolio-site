# Projects Section Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a live GitHub Projects tab to the existing portfolio site.

**Architecture:** Lazy-loaded tab section that fetches 3-5 curated GitHub repos via REST API on first tab activation, renders minimal language-colored cards in a responsive grid. Config array in JS keeps the repo list easy to edit.

**Tech Stack:** Vanilla JS, GitHub REST API, Tailwind CSS

---

### Task 1: Add Projects tab button and container to HTML

**Files:**
- Modify: `index.html:114-140` (tab bar buttons), `index.html:163-165` (after last tab-content)

- [ ] **Step 1: Add the "Projects" tab button**

Insert after the "Schedule call" button in the tab bar block (around line 137):

```html
<button
    class="tab-btn"
    onclick="openTab(event, 'projects')"
>
    Projects
</button>
```

- [ ] **Step 2: Add the Projects tab content section**

Insert after the Schedule Call `</section>` (around line 380), before the closing `</div>` at line 381:

```html
<section
    class="tab-content tw-relative tw-flex tw-hidden tw-h-full tw-w-full tw-flex-col tw-overflow-hidden max-lg:tw-p-4"
    data-tab-name="projects"
>
    <div
        class="tw-flex tw-h-full tw-w-full tw-flex-wrap tw-place-content-center tw-gap-6 tw-p-[5%] tw-px-[10%] max-xl:tw-place-items-center max-lg:tw-px-4"
        id="projects-container"
    >
    </div>
</section>
```

---

### Task 2: Add GitHub config, fetch logic, and card rendering to JS

**Files:**
- Modify: `index.js` (append to end of file)

- [ ] **Step 1: Add GitHub configuration and fetch function**

Add at the end of `index.js`:

```js
// ========== Projects Tab ==========

const GITHUB_USER = 'your-username'
const HIGHLIGHTED_REPOS = ['repo1', 'repo2', 'repo3']

const LANG_COLORS = {
    JavaScript: '#f7df1e',
    TypeScript: '#3178c6',
    Python: '#3572A5',
    HTML: '#e34c26',
    CSS: '#563d7c',
    Java: '#b07219',
    Go: '#00ADD8',
    Rust: '#dea584',
    C: '#555555',
    'C++': '#f34b7d',
    Ruby: '#701516',
    PHP: '#4F5D95',
    Swift: '#F05138',
    Kotlin: '#A97BFF',
    Dart: '#00B4AB',
    Shell: '#89e051',
    Vue: '#4fc08d',
    SCSS: '#c6538c',
    Less: '#1d365d',
    Dockerfile: '#384d54',
}

let projectsLoaded = false
```

- [ ] **Step 2: Add the fetch and render function**

Continue after the config:

```js
async function loadProjects() {
    const container = document.getElementById('projects-container')
    if (!container) return

    if (projectsLoaded) return
    projectsLoaded = true

    showSkeleton(container)

    try {
        const results = await Promise.allSettled(
            HIGHLIGHTED_REPOS.map(name =>
                fetch(`https://api.github.com/repos/${GITHUB_USER}/${name}`)
                    .then(r => {
                        if (!r.ok) throw new Error(`HTTP ${r.status}`)
                        return r.json()
                    })
            )
        )

        const repos = results
            .filter(r => r.status === 'fulfilled' && r.value && !r.value.message)
            .map(r => r.value)

        if (repos.length === 0) {
            showEmpty(container)
            return
        }

        renderProjects(container, repos)
    } catch (err) {
        console.error('Failed to load projects:', err)
        showError(container)
    }
}
```

- [ ] **Step 3: Add render function for project cards**

Continue after `loadProjects`:

```js
function renderProjects(container, repos) {
    container.innerHTML = ''
    container.classList.remove('tw-flex-wrap', 'tw-place-content-center')
    container.classList.add('tw-grid', 'lg:tw-grid-cols-3', 'md:tw-grid-cols-2', 'tw-grid-cols-1', 'tw-gap-6', 'tw-w-full', 'tw-max-w-5xl', 'tw-mx-auto')

    repos.forEach(repo => {
        const lang = repo.language || ''
        const langColor = LANG_COLORS[lang] || '#6e7681'
        const card = document.createElement('div')
        card.className = 'tw-flex tw-flex-col tw-overflow-hidden tw-rounded-lg tw-border tw-border-gray-200 tw-bg-white tw-shadow-xl dark:tw-border-gray-600 dark:tw-bg-slate-800'

        card.innerHTML = `
            <div style="height: 3px; background-color: ${langColor};"></div>
            <div class="tw-flex tw-flex-col tw-gap-2 tw-p-4">
                <div class="tw-flex tw-items-center tw-gap-2">
                    <i class="bi bi-github tw-text-xl"></i>
                    <a href="${repo.html_url}" target="_blank" rel="noopener noreferrer" class="tw-text-lg tw-font-semibold tw-text-black hover:tw-text-primary dark:tw-text-white dark:hover:tw-text-primary tw-transition-colors">
                        ${repo.name}
                    </a>
                </div>
                <p class="tw-text-sm tw-text-gray-500 dark:tw-text-gray-400 tw-line-clamp-2">
                    ${repo.description || 'No description'}
                </p>
                <div class="tw-mt-auto tw-flex tw-items-center tw-gap-4 tw-text-sm tw-text-gray-600 dark:tw-text-gray-400">
                    <span class="tw-flex tw-items-center tw-gap-1">
                        <span style="display: inline-block; width: 10px; height: 10px; border-radius: 50%; background-color: ${langColor};"></span>
                        ${lang || 'N/A'}
                    </span>
                    <span>★ ${repo.stargazers_count}</span>
                </div>
            </div>
        `
        container.appendChild(card)
    })
}
```

- [ ] **Step 4: Add skeleton, error, and empty state functions**

Continue after `renderProjects`:

```js
function showSkeleton(container) {
    container.innerHTML = ''
    container.classList.remove('tw-flex-wrap', 'tw-place-content-center')
    container.classList.add('tw-grid', 'lg:tw-grid-cols-3', 'md:tw-grid-cols-2', 'tw-grid-cols-1', 'tw-gap-6', 'tw-w-full', 'tw-max-w-5xl', 'tw-mx-auto')

    for (let i = 0; i < 3; i++) {
        const skeleton = document.createElement('div')
        skeleton.className = 'tw-flex tw-flex-col tw-overflow-hidden tw-rounded-lg tw-border tw-border-gray-200 tw-bg-white tw-shadow-xl dark:tw-border-gray-600 dark:tw-bg-slate-800 tw-animate-pulse'
        skeleton.innerHTML = `
            <div class="tw-h-[3px] tw-bg-gray-200 dark:tw-bg-gray-600"></div>
            <div class="tw-flex tw-flex-col tw-gap-3 tw-p-4">
                <div class="tw-flex tw-items-center tw-gap-2">
                    <div class="tw-h-6 tw-w-6 tw-rounded-full tw-bg-gray-200 dark:tw-bg-gray-600"></div>
                    <div class="tw-h-5 tw-w-28 tw-rounded tw-bg-gray-200 dark:tw-bg-gray-600"></div>
                </div>
                <div class="tw-h-3 tw-w-full tw-rounded tw-bg-gray-200 dark:tw-bg-gray-600"></div>
                <div class="tw-h-3 tw-w-3/4 tw-rounded tw-bg-gray-200 dark:tw-bg-gray-600"></div>
                <div class="tw-mt-2 tw-flex tw-gap-4">
                    <div class="tw-h-4 tw-w-16 tw-rounded tw-bg-gray-200 dark:tw-bg-gray-600"></div>
                    <div class="tw-h-4 tw-w-12 tw-rounded tw-bg-gray-200 dark:tw-bg-gray-600"></div>
                </div>
            </div>
        `
        container.appendChild(skeleton)
    }
}

function showError(container) {
    container.innerHTML = ''
    container.classList.remove('tw-grid', 'lg:tw-grid-cols-3', 'md:tw-grid-cols-2', 'tw-grid-cols-1', 'tw-gap-6', 'tw-max-w-5xl', 'tw-mx-auto')
    container.classList.add('tw-flex', 'tw-flex-col', 'tw-place-content-center', 'tw-items-center', 'tw-gap-4', 'tw-h-full')

    container.innerHTML = `
        <i class="bi bi-exclamation-triangle tw-text-4xl tw-text-gray-400"></i>
        <p class="tw-text-gray-500 dark:tw-text-gray-400">Couldn't load projects</p>
        <button class="btn-primary" onclick="retryLoadProjects()">Retry</button>
    `
}

function showEmpty(container) {
    container.innerHTML = ''
    container.classList.remove('tw-grid', 'lg:tw-grid-cols-3', 'md:tw-grid-cols-2', 'tw-grid-cols-1', 'tw-gap-6', 'tw-max-w-5xl', 'tw-mx-auto')
    container.classList.add('tw-flex', 'tw-flex-col', 'tw-place-content-center', 'tw-items-center', 'tw-gap-4', 'tw-h-full')

    container.innerHTML = `
        <p class="tw-text-gray-500 dark:tw-text-gray-400">No projects to show yet</p>
    `
}
```

- [ ] **Step 5: Add the tab activation hook and retry function**

Continue after `showEmpty`:

```js
function retryLoadProjects() {
    projectsLoaded = false
    loadProjects()
}

// Hook into openTab to trigger projects load
const originalOpenTab = openTab
openTab = function(evt, tabName) {
    originalOpenTab(evt, tabName)
    if (tabName === 'projects') {
        loadProjects()
    }
}
```

---

### Task 3: Add custom CSS for language color bar

**Files:**
- Modify: `css/tailwind.css` (add within the `@layer components` block, before the closing `}`)

- [ ] **Step 1: Add `.line-clamp-2` utility**

The project description uses `tw-line-clamp-2` which is not a default Tailwind utility and might not be in the build. Add it:

```css
.line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}
```

---

### Task 4: Verify the build

- [ ] **Step 1: Rebuild Tailwind CSS**

Run: `npm run build:tailwind`

Expected: `tailwind-build.css` is regenerated.

- [ ] **Step 2: Open index.html in browser**

Navigate to the page, click the "Projects" tab, and verify:
- Skeleton cards appear briefly during loading
- Project cards render with language color bars
- Cards link to GitHub repos
- Error state shows if API fails (test by disconnecting network)
- Empty state shows if no repos configured
- Dark mode works on the new section
