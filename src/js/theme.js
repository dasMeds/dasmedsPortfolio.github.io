const themeStorageKey = 'dasmeds-theme';

export function initTheme() {
    const toggle = document.querySelector('.theme-toggle');
    if (!toggle) return;

    const label = toggle.querySelector('.theme-toggle-label');
    const applyTheme = (theme, persist = false) => {
        const isDark = theme === 'dark';
        document.documentElement.dataset.theme = isDark ? 'dark' : 'light';
        document.documentElement.style.colorScheme = isDark ? 'dark' : 'light';
        toggle.setAttribute('aria-pressed', String(isDark));
        toggle.setAttribute('aria-label', `Switch to ${isDark ? 'light' : 'dark'} theme`);
        if (label) label.textContent = isDark ? 'Light mode' : 'Dark mode';

        if (persist) {
            try {
                window.localStorage.setItem(themeStorageKey, isDark ? 'dark' : 'light');
            } catch (error) {
                console.warn('Theme preference could not be saved for the next visit.', error);
            }
        }

        window.dispatchEvent(new CustomEvent('portfolio:theme-change', {
            detail: { theme: isDark ? 'dark' : 'light' }
        }));
    };

    // The head bootstrap sets a saved dark preference before CSS loads; otherwise light remains the default.
    applyTheme(document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light');
    toggle.addEventListener('click', () => {
        const nextTheme = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
        applyTheme(nextTheme, true);
    });
}
