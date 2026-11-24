const formatDate = date => new Intl.DateTimeFormat('en', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC'
}).format(date);

const dateKey = date => date.toISOString().slice(0, 10);

const getActivityLevel = count => {
    if (!count) return 0;
    if (count === 1) return 1;
    if (count <= 3) return 2;
    if (count <= 6) return 3;
    return 4;
};

const renderContributions = (grid, events) => {
    const today = new Date();
    const end = new Date(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate()));
    const start = new Date(end);
    start.setUTCDate(start.getUTCDate() - end.getUTCDay() - 52 * 7);
    const activityByDate = new Map();

    events.forEach(event => {
        if (!event.created_at) return;
        const key = event.created_at.slice(0, 10);
        activityByDate.set(key, (activityByDate.get(key) || 0) + 1);
    });

    const cells = Array.from({ length: 53 * 7 }, (_, index) => {
        const date = new Date(start);
        date.setUTCDate(start.getUTCDate() + index);
        const count = activityByDate.get(dateKey(date)) || 0;
        const cell = document.createElement('span');
        cell.dataset.level = String(getActivityLevel(count));
        cell.title = `${count} public ${count === 1 ? 'activity' : 'activities'} on ${formatDate(date)}`;
        cell.setAttribute('aria-hidden', 'true');
        return cell;
    });
    grid.replaceChildren(...cells);
};

export function initLiveGithub() {
    const panel = document.querySelector('#github-live');
    if (!panel) return;

    const username = panel.dataset.githubUser;
    const status = panel.querySelector('#github-live-status');
    const grid = panel.querySelector('#github-contribution-grid');
    if (!username || !status || !grid) return;

    const update = async () => {
        status.textContent = 'Connecting to GitHub…';
        try {
            const response = await fetch(
                `https://api.github.com/users/${encodeURIComponent(username)}/events/public?per_page=100`,
                { headers: { Accept: 'application/vnd.github+json' }, cache: 'no-store' }
            );
            if (!response.ok) throw new Error(`GitHub returned HTTP ${response.status}.`);
            const events = await response.json();
            if (!Array.isArray(events)) throw new Error('GitHub returned an unexpected activity response.');

            renderContributions(grid, events);
            status.textContent = `Latest 100 public events · refreshed ${new Date().toLocaleTimeString()}.`;
        } catch (error) {
            console.error('Unable to load public GitHub activity.', error);
            status.textContent = `GitHub activity unavailable: ${error.message}`;
        } finally {
            window.setTimeout(update, 5 * 60 * 1000);
        }
    };

    update();
}
