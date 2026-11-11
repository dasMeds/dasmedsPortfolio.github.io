function copyWithFallback(text) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.setAttribute('readonly', '');
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.append(textarea);
    textarea.select();
    const copied = document.execCommand('copy');
    textarea.remove();
    if (!copied) throw new Error('Clipboard copy was not available in this browser.');
}

export function initRepositories() {
    document.querySelectorAll('.repo-copy').forEach(button => {
        button.addEventListener('click', async () => {
            const command = button.dataset.copyText;
            const status = button.closest('.repo-card')?.querySelector('.repo-copy-status');
            if (!command || !status) {
                console.error('Repository copy control is missing its command or status element.', button);
                return;
            }

            try {
                if (navigator.clipboard?.writeText) {
                    await navigator.clipboard.writeText(command);
                } else {
                    copyWithFallback(command);
                }
                button.textContent = 'COPIED';
                status.textContent = 'CLONE COMMAND COPIED';
                window.setTimeout(() => {
                    button.textContent = 'COPY';
                    status.textContent = '';
                }, 1800);
            } catch (error) {
                console.error('Unable to copy the repository clone command.', error);
                button.textContent = 'RETRY';
                status.textContent = 'COPY FAILED — SELECT THE COMMAND ABOVE';
            }
        });
    });
}
