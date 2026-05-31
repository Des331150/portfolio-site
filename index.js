// initialization


const tabs = document.querySelectorAll(".tab-content") 
const tabButtons = document.querySelectorAll(".tab-btn")

function openTab(evt, tabName){

    tabs.forEach((tab) => {
        tab.style.display = 'none'
    })

    tabButtons.forEach((btn) => btn.classList.remove("tab-active"))

    document.querySelector(`[data-tab-name=${tabName}]`).style.display = 'block'

    evt.target.classList.add("tab-active") // set current button to be active

}

function switchTheme(){
    const themeSelector = document.querySelector("#theme-selector")

    document.querySelector("html").setAttribute("data-theme", themeSelector.value)
}

if (localStorage.getItem('color-mode') === 'dark' || (!('color-mode' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    document.documentElement.classList.add('tw-dark')
    updateToggleModeBtn()
} else {
    document.documentElement.classList.remove('tw-dark')
    updateToggleModeBtn()
}

function toggleMode(){
    //toggle between dark and light mode

    document.documentElement.classList.toggle("tw-dark")
    updateToggleModeBtn()
    
}

function updateToggleModeBtn(){

    const toggleIcon = document.querySelector("#toggle-mode-icon")
    
    if (document.documentElement.classList.contains("tw-dark")){
        // dark mode
        toggleIcon.classList.remove("bi-sun-fill")
        toggleIcon.classList.add("bi-moon-fill")
        localStorage.setItem("color-mode", "dark")
        
    }else{
        toggleIcon.classList.add("bi-sun-fill")
        toggleIcon.classList.remove("bi-moon-fill")
        localStorage.setItem("color-mode", "light")
    }

}

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