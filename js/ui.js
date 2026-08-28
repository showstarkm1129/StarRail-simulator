document.addEventListener('DOMContentLoaded', () => {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');

    const notifyTabChange = targetId => {
        window.dispatchEvent(new CustomEvent('srsim:tab-change', {
            detail: { targetId },
        }));
    };

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            if(btn.disabled) return;

            // Remove active class from all
            tabBtns.forEach(b => b.classList.remove('active'));
            tabPanes.forEach(p => p.classList.remove('active'));

            // Add active class to clicked
            btn.classList.add('active');
            const targetId = btn.getAttribute('data-target');
            const targetPane = document.getElementById(targetId);
            if (!targetPane) return;
            targetPane.classList.add('active');
            notifyTabChange(targetId);
        });
    });

    const initialTarget = document.querySelector('.tab-btn.active')?.getAttribute('data-target');
    if (initialTarget) notifyTabChange(initialTarget);
});
