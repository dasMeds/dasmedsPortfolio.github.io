export function initStatsCounter() {
    const counters = [...document.querySelectorAll('.stat-number')];
    if (!counters.length) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            observer.unobserve(entry.target);

            const element = entry.target;
            const target = Number(element.dataset.countTarget ?? element.textContent);
            if (!Number.isFinite(target)) return;
            if (reducedMotion) {
                element.textContent = new Intl.NumberFormat().format(target);
                return;
            }

            const startedAt = performance.now();
            const duration = 900;
            const animate = now => {
                const progress = Math.min(1, (now - startedAt) / duration);
                const eased = 1 - (1 - progress) ** 3;
                element.textContent = new Intl.NumberFormat().format(Math.round(target * eased));
                if (progress < 1) requestAnimationFrame(animate);
            };
            requestAnimationFrame(animate);
        });
    }, { threshold: 0.35 });

    counters.forEach(counter => observer.observe(counter));
}
