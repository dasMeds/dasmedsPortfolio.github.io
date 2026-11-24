const sections = {
    certifications: {
        label: 'Certifications',
        fields: [
            ['id', 'ID'], ['date', 'Date (YYYY-MM-DD)'], ['title', 'Title'],
            ['issuer', 'Issuer'], ['track', 'Track'], ['image', 'Preview image path'],
            ['verifyUrl', 'Verification URL'], ['document', 'Certificate PDF path']
        ],
        create: () => ({
            id: `certificate-${Date.now()}`,
            date: new Date().toISOString().slice(0, 10),
            title: '',
            issuer: '',
            track: '',
            image: '',
            verifyUrl: '',
            document: ''
        })
    },
    posters: {
        label: 'Posters',
        fields: [
            ['title', 'Title'], ['category', 'Category'], ['image', 'Image path'],
            ['width', 'Image width', 'number'], ['height', 'Image height', 'number'],
            ['class', 'Layout class'], ['tools', 'Tools'], ['intent', 'Intent'], ['note', 'Note']
        ],
        create: () => ({ title: '', category: '', image: '', width: 1200, height: 1600, class: '', tools: '', intent: '', note: '' })
    },
    repositories: {
        label: 'Repositories',
        fields: [['name', 'GitHub repository name'], ['callSign', 'Display name'], ['objective', 'Description'], ['technologies', 'Technologies (comma separated)', 'list']],
        create: () => ({ name: '', callSign: '', objective: '', technologies: [] })
    },
    videos: {
        label: 'Videos',
        fields: [['title', 'Title'], ['shortTitle', 'Short title'], ['src', 'MP4 path'], ['poster', 'Poster image path'], ['channel', 'Channel'], ['software', 'Software (comma separated)', 'list']],
        create: () => ({ title: '', shortTitle: '', src: '', poster: '', channel: '', software: [] })
    }
};

const loginPanel = document.querySelector('#admin-login');
const dashboard = document.querySelector('#admin-dashboard');
const loginForm = document.querySelector('#admin-login-form');
const loginMessage = document.querySelector('#admin-login-message');
const message = document.querySelector('#admin-message');
const sectionNavigation = document.querySelector('#admin-sections');
const recordsContainer = document.querySelector('#admin-records');
const editor = document.querySelector('#admin-editor');
const saveButton = document.querySelector('#admin-save');
let csrfToken = '';
let portfolio = null;
let currentSection = 'certifications';
let currentIndex = -1;

const request = async (path, options = {}) => {
    const headers = { ...(options.headers || {}) };
    if (options.body && !headers['Content-Type']) headers['Content-Type'] = 'application/json';
    if (csrfToken && options.method && options.method !== 'GET') headers['X-CSRF-Token'] = csrfToken;
    const response = await fetch(path, { ...options, headers, credentials: 'same-origin', cache: 'no-store' });
    const result = await response.json();
    if (!response.ok) {
        if (response.status === 401) {
            showLogin();
            setMessage(loginMessage, result.error || 'Please sign in again.', true);
        }
        throw new Error(result.error || `Request failed with HTTP ${response.status}.`);
    }
    return result;
};

const setMessage = (element, text, isError = false) => {
    element.textContent = text;
    element.classList.toggle('is-error', isError);
};

const showLogin = () => {
    dashboard.hidden = true;
    loginPanel.hidden = false;
    csrfToken = '';
    portfolio = null;
};

const showDashboard = async () => {
    loginPanel.hidden = true;
    dashboard.hidden = false;
    const result = await request('/api/admin/portfolio');
    portfolio = result.portfolio;
    document.querySelector('#admin-resume-path').value = portfolio.resume || '';
    renderSections();
    renderRecords();
};

const renderSections = () => {
    sectionNavigation.replaceChildren();
    Object.entries(sections).forEach(([key, section]) => {
        const button = document.createElement('button');
        button.type = 'button';
        button.textContent = section.label;
        button.setAttribute('aria-current', String(currentSection === key));
        button.addEventListener('click', () => {
            currentSection = key;
            currentIndex = -1;
            renderSections();
            renderRecords();
        });
        sectionNavigation.append(button);
    });
    document.querySelector('#admin-list-title').textContent = sections[currentSection].label;
};

const renderRecords = () => {
    const records = portfolio[currentSection];
    if (currentIndex >= records.length) currentIndex = records.length - 1;
    recordsContainer.replaceChildren();
    records.forEach((record, index) => {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'admin-record';
        button.setAttribute('aria-current', String(index === currentIndex));
        button.textContent = record.title || record.name || record.shortTitle || record.id || `Item ${index + 1}`;
        button.addEventListener('click', () => {
            currentIndex = index;
            renderRecords();
        });
        recordsContainer.append(button);
    });
    renderEditor();
};

const updateRecord = (field, value, type) => {
    const record = portfolio[currentSection][currentIndex];
    if (type === 'list') {
        record[field] = value.split(',').map(item => item.trim()).filter(Boolean);
    } else if (type === 'number') {
        record[field] = value === '' ? '' : Number(value);
    } else if (value === '' && ['verifyUrl', 'document', 'note', 'tools', 'intent', 'class'].includes(field)) {
        delete record[field];
    } else {
        record[field] = value;
    }
};

const uploadFile = async (file, kind, input) => {
    if (!file) return;
    if (file.size > 4 * 1024 * 1024) throw new Error('Choose a file smaller than 4 MB.');
    const bytes = new Uint8Array(await file.arrayBuffer());
    let binary = '';
    bytes.forEach(byte => { binary += String.fromCharCode(byte); });
    const result = await request('/api/admin/upload', {
        method: 'POST',
        body: JSON.stringify({ kind, name: file.name, content: btoa(binary) })
    });
    input.value = result.path;
    const event = new Event('input', { bubbles: true });
    input.dispatchEvent(event);
    setMessage(message, result.message);
};

const renderEditor = () => {
    editor.replaceChildren();
    const record = portfolio[currentSection][currentIndex];
    if (!record) {
        const placeholder = document.createElement('p');
        placeholder.className = 'admin-empty';
        placeholder.textContent = 'Choose an item to edit, or add a new one.';
        editor.append(placeholder);
        return;
    }

    sections[currentSection].fields.forEach(([field, label, type = 'text']) => {
        const wrapper = document.createElement('label');
        wrapper.className = 'admin-field';
        const caption = document.createElement('span');
        caption.textContent = label;
        const input = type === 'list' || field === 'objective' || field === 'intent' || field === 'note'
            ? document.createElement('textarea')
            : document.createElement('input');
        if (input instanceof HTMLInputElement) input.type = type === 'number' ? 'number' : 'text';
        input.value = type === 'list' ? (record[field] || []).join(', ') : (record[field] ?? '');
        input.addEventListener('input', () => updateRecord(field, input.value, type));
        wrapper.append(caption, input);
        editor.append(wrapper);

        if (field === 'image' || field === 'poster' || field === 'document') {
            const upload = document.createElement('label');
            upload.className = 'admin-upload';
            upload.textContent = field === 'document' ? 'Upload certificate PDF' : 'Upload image';
            const fileInput = document.createElement('input');
            fileInput.type = 'file';
            fileInput.accept = field === 'document' ? 'application/pdf,.pdf' : 'image/png,image/jpeg,image/webp';
            fileInput.addEventListener('change', async () => {
                try {
                    await uploadFile(fileInput.files?.[0], field === 'document' ? 'documents' : 'images', input);
                } catch (error) {
                    setMessage(message, error.message, true);
                }
                fileInput.value = '';
            });
            upload.append(fileInput);
            editor.append(upload);
        }
    });
    const removeButton = document.createElement('button');
    removeButton.type = 'button';
    removeButton.className = 'admin-danger';
    removeButton.dataset.deleteRecord = '';
    removeButton.textContent = 'Remove this item';
    editor.append(removeButton);
};

document.querySelector('#admin-add').addEventListener('click', () => {
    portfolio[currentSection].push(sections[currentSection].create());
    currentIndex = portfolio[currentSection].length - 1;
    renderRecords();
});

document.querySelector('#admin-resume-path').addEventListener('input', event => {
    portfolio.resume = event.currentTarget.value;
});

document.querySelector('#admin-resume-file').addEventListener('change', async event => {
    try {
        const input = document.querySelector('#admin-resume-path');
        await uploadFile(event.currentTarget.files?.[0], 'documents', input);
    } catch (error) {
        setMessage(message, error.message, true);
    }
    event.currentTarget.value = '';
});

loginForm.addEventListener('submit', async event => {
    event.preventDefault();
    setMessage(loginMessage, 'Signing in…');
    const formData = new FormData(loginForm);
    try {
        const result = await request('/api/admin/login', {
            method: 'POST',
            body: JSON.stringify({
                username: formData.get('username'),
                password: formData.get('password')
            })
        });
        csrfToken = result.csrfToken;
        loginForm.reset();
        await showDashboard();
    } catch (error) {
        setMessage(loginMessage, error.message, true);
    }
});

document.querySelector('#admin-logout').addEventListener('click', async () => {
    try {
        await request('/api/admin/logout', { method: 'POST', body: '{}' });
        showLogin();
        setMessage(loginMessage, 'You have signed out.');
    } catch (error) {
        setMessage(message, error.message, true);
    }
});

saveButton.addEventListener('click', async () => {
    saveButton.disabled = true;
    setMessage(message, 'Committing changes to GitHub…');
    try {
        const result = await request('/api/admin/portfolio', {
            method: 'PUT',
            body: JSON.stringify({ portfolio })
        });
        setMessage(message, result.message);
    } catch (error) {
        setMessage(message, error.message, true);
    } finally {
        saveButton.disabled = false;
    }
});

document.querySelector('#admin-editor').addEventListener('submit', event => event.preventDefault());

document.querySelector('#admin-editor').addEventListener('click', event => {
    if (!(event.target instanceof Element) || !event.target.matches('[data-delete-record]')) return;
    if (!window.confirm('Remove this item from the portfolio?')) return;
    portfolio[currentSection].splice(currentIndex, 1);
    currentIndex = -1;
    renderRecords();
});

const initialize = async () => {
    try {
        const session = await request('/api/admin/session');
        if (!session.configured) {
            setMessage(loginMessage, 'Admin login is not configured on the server yet.', true);
            loginForm.querySelector('button').disabled = true;
            return;
        }
        if (!session.authenticated) return;
        csrfToken = session.csrfToken;
        await showDashboard();
    } catch (error) {
        setMessage(loginMessage, error.message, true);
    }
};

initialize();
