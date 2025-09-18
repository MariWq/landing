// Pricing Modal functionality
document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('pricingModal');
    const modalTitle = document.querySelector('.modal-title');
    const selectedPlanInput = document.getElementById('selectedPlan');
    
    // Handle pricing button clicks
    document.querySelectorAll('.pricing-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Get tariff name from card title
            const card = this.closest('.pricing-card');
            const planName = card.querySelector('h3').textContent;
            const planType = this.getAttribute('data-plan');
            
            // Update modal
            modalTitle.textContent = `Подключение тарифа "${planName}"`;
            selectedPlanInput.value = planType;
            
            // Show modal
            modal.classList.add('show');
            document.body.style.overflow = 'hidden';
        });
    });
});
