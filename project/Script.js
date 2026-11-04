// Live Clock
function updateClock() {
    const clockElement = document.getElementById('live-clock');
    if (clockElement) {
        const now = new Date();
        clockElement.textContent = now.toLocaleTimeString();
    }
}
setInterval(updateClock, 1000);
updateClock();

// Console Logger Helper
function logToTerminal(message, isHighlight = false) {
    const logsContainer = document.getElementById('terminal-logs');
    if (!logsContainer) return;
    const p = document.createElement('p');
    p.className = 'log-line' + (isHighlight ? ' highlight' : '');
    const timestamp = new Date().toLocaleTimeString();
    p.textContent = `[${timestamp}] ${message}`;
    logsContainer.appendChild(p);
    logsContainer.scrollTop = logsContainer.scrollHeight;
}

// Interactive Buttons
document.getElementById('btn-health')?.addEventListener('click', () => {
    logToTerminal('Running local health check...');
    setTimeout(() => {
        logToTerminal('SUCCESS: HTTP 200 OK - Localhost container is responding perfectly!', true);
    }, 400);
});

document.getElementById('btn-simulate')?.addEventListener('click', () => {
    logToTerminal('Triggering pipeline simulation:');
    setTimeout(() => logToTerminal('--> 1. GitHub SCM Webhook received. Pulling commit...'), 300);
    setTimeout(() => logToTerminal('--> 2. Building Docker image devops-app:latest...'), 700);
    setTimeout(() => logToTerminal('--> 3. Pushing Docker image to Docker Hub...'), 1100);
    setTimeout(() => logToTerminal('--> 4. Deploying container to localhost:8081...'), 1500);
    setTimeout(() => logToTerminal('Pipeline simulation finished with status: SUCCESS', true), 1900);
});

document.getElementById('btn-toggle-theme')?.addEventListener('click', () => {
    const currentTheme = document.body.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    document.body.setAttribute('data-theme', newTheme);
    logToTerminal(`Theme switched to ${newTheme} mode.`);
});
