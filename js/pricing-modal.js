// Pricing — redirect to app instead of modal form
document.addEventListener('DOMContentLoaded', function () {
    var APP_URL = 'https://app.contentpulse.media/login';

    document.querySelectorAll('.pricing-btn').forEach(function (btn) {
        btn.addEventListener('click', function (e) {
            e.preventDefault();
            var planType = this.getAttribute('data-plan');

            if (planType === 'enterprise') {
                // Enterprise — scroll to callback form
                var demo = document.getElementById('demo');
                if (demo) demo.scrollIntoView({ behavior: 'smooth' });
            } else {
                window.location.href = APP_URL;
            }
        });
    });

    // Pricing toggle (main / extra plans)
    var toggleBtn = document.getElementById('pricingToggle');
    var extraGrid = document.getElementById('pricingExtraGrid');

    if (toggleBtn && extraGrid) {
        toggleBtn.addEventListener('click', function () {
            var isHidden = extraGrid.style.display === 'none' || extraGrid.style.display === '';
            extraGrid.style.display = isHidden ? 'grid' : 'none';
            var label = this.querySelector('.toggle-label');
            var chevron = this.querySelector('.toggle-chevron');
            if (label) label.textContent = isHidden ? 'Скрыть' : 'Смотреть все тарифы';
            if (chevron) chevron.style.transform = isHidden ? 'rotate(180deg)' : 'rotate(0deg)';
        });
    }
});
