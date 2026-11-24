const formatDate = value => new Intl.DateTimeFormat('en', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
}).format(new Date(value));

const eventDescription = event => {
    const repo = event.repo?.name?.replace(/^.*?\//, '') || 'a repository';
    const payload = event.payload || {};
    const messages = {
        PushEvent: `Pushed ${payload.size || payload.commits?.length || 1} commit(s) to ${repo}`,
        CreateEvent: `Created ${payload.ref_type || 'a branch'} in ${repo}`,
        WatchEvent: `Starred ${repo}`,
        ForkEvent: `Forked ${repo}`,
        IssuesEvent: `${payload.action || 'Updated'} an issue in ${repo}`,
        PullRequestEvent: `${payload.action || 'Updated'} a pull request in ${repo}`,
        ReleaseEvent: `Published a release in ${repo}`
    };
    return messages[event.type] || `Activity in ${repo}`;
};

const makeRepositoryItem = repository => {
    const item = document.createElement('li');
    const link = document.createElement('a');
    const url = new URL(repository.html_url);
    if (url.protocol !== 'https:' || url.hostname !== 'github.com') return null;
    link.href = url.href;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.textContent = repository.full_name;

    const details = document.createElement('span');
    details.textContent = `${repository.description || repository.language || 'Public repository'} · updated ${formatDate(repository.updated_at)}`;
    item.append(link, details);
    return item;
};

export function initLiveGithub() {
    const panel = document.querySelector('#github-live');
    if (!panel) return;

    const username = panel.dataset.githubUser;
    const status = panel.querySelector('#github-live-status');
    const repoList = panel.querySelector('#github-recent-repos');
    const profileLink = panel.querySelector('#github-profile-link');
    const avatar = panel.querySelector('#github-avatar');
    if (!username || !status || !repoList || !profileLink || !avatar) return;

    const update = async () => {
        status.textContent = 'Connecting to GitHub…';
        try {
            const headers = { Accept: 'application/vnd.github+json' };
            const [profileResponse, repositoriesResponse, eventsResponse] = await Promise.all([
                fetch(`https://api.github.com/users/${encodeURIComponent(username)}`, { headers, cache: 'no-store' }),
                fetch(`https://api.github.com/users/${encodeURIComponent(username)}/repos?sort=updated&per_page=6`, { headers, cache: 'no-store' }),
                fetch(`https://api.github.com/users/${encodeURIComponent(username)}/events/public?per_page=5`, { headers, cache: 'no-store' })
            ]);
            for (const response of [profileResponse, repositoriesResponse, eventsResponse]) {
                if (!response.ok) throw new Error(`GitHub returned HTTP ${response.status}.`);
            }
            const [profile, repositories, events] = await Promise.all([
                profileResponse.json(),
                repositoriesResponse.json(),
                eventsResponse.json()
            ]);

            if (profile.login?.toLowerCase() !== username.toLowerCase() ||
                !Array.isArray(repositories) || !Array.isArray(events)) {
                throw new Error('GitHub returned an unexpected profile response.');
            }

            panel.querySelector('#github-live-title').textContent = profile.name || profile.login;
            panel.querySelector('#github-bio').textContent = profile.bio || 'IT student building projects and creative work.';
            panel.querySelector('#github-repos-count').textContent = new Intl.NumberFormat().format(profile.public_repos);
            panel.querySelector('#github-followers-count').textContent = new Intl.NumberFormat().format(profile.followers);
            panel.querySelector('#github-following-count').textContent = new Intl.NumberFormat().format(profile.following);
            profileLink.href = `https://github.com/${encodeURIComponent(profile.login)}`;

            const avatarUrl = new URL(profile.avatar_url);
            if (avatarUrl.protocol === 'https:' && avatarUrl.hostname === 'avatars.githubusercontent.com') {
                avatar.src = avatarUrl.href;
            }

            const items = repositories
                .filter(repository => !repository.fork)
                .map(makeRepositoryItem)
                .filter(Boolean);
            repoList.replaceChildren(...items);

            if (!items.length) {
                status.textContent = 'No public repositories were returned.';
            } else {
                status.textContent = `Live from GitHub · refreshed ${new Date().toLocaleTimeString()}.`;
            }

            const activity = events.find(event => event.type && event.repo?.name && event.created_at);
            if (activity) {
                const activityItem = document.createElement('li');
                activityItem.className = 'github-live-event';
                activityItem.textContent = `Latest public activity: ${eventDescription(activity)} · ${formatDate(activity.created_at)}`;
                repoList.append(activityItem);
            }
        } catch (error) {
            console.error('Unable to load the live GitHub profile.', error);
            status.textContent = `GitHub profile unavailable: ${error.message}`;
        } finally {
            window.setTimeout(update, 5 * 60 * 1000);
        }
    };

    update();
}
