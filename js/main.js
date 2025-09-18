// Mobile menu functionality
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM Content Loaded');
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navLinks = document.querySelector('.nav-links');
    
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', function() {
            // Toggle menu visibility
            navLinks.classList.toggle('nav-links-open');
            mobileMenuBtn.classList.toggle('mobile-menu-open');
            
            // Toggle body scroll
            document.body.style.overflow = navLinks.classList.contains('nav-links-open') 
                ? 'hidden' 
                : '';
        });

        // Close menu when clicking on links
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('nav-links-open');
                mobileMenuBtn.classList.remove('mobile-menu-open');
                document.body.style.overflow = '';
            });
        });
    }

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Header scroll effect
    const header = document.querySelector('.header');
    let lastScrollY = window.scrollY;

    window.addEventListener('scroll', function() {
        const currentScrollY = window.scrollY;
        
        if (currentScrollY > 100) {
            header.classList.add('header-scrolled');
        } else {
            header.classList.remove('header-scrolled');
        }

        // Hide/show header on scroll
        if (currentScrollY > lastScrollY && currentScrollY > 200) {
            header.style.transform = 'translateY(-100%)';
        } else {
            header.style.transform = 'translateY(0)';
        }
        
        lastScrollY = currentScrollY;
    });

    // Animate elements on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);

    // Observe elements for animation
    document.querySelectorAll('.feature-card, .problem-item, .testimonial, .pricing-card').forEach(el => {
        observer.observe(el);
    });

    // Counter animation for stats
    function animateCounter(element, target, duration = 2000) {
        let start = 0;
        const increment = target / (duration / 16);
        
        function updateCounter() {
            start += increment;
            if (start < target) {
                element.textContent = Math.floor(start);
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = target;
            }
        }
        
        updateCounter();
    }

    // Animate stats when they come into view
    const statsObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const statNumber = entry.target.querySelector('.stat-number');
                if (statNumber && !statNumber.classList.contains('animated')) {
                    statNumber.classList.add('animated');
                    const text = statNumber.textContent;
                    const number = parseInt(text.replace(/\D/g, ''));
                    if (number) {
                        statNumber.textContent = '0';
                        animateCounter(statNumber, number);
                    }
                }
            }
        });
    }, observerOptions);

    document.querySelectorAll('.stat-item').forEach(el => {
        statsObserver.observe(el);
    });

    // Callback form handling
    const callbackForm = document.getElementById('callbackForm');
    const phoneInput = document.getElementById('phoneInput');
    
    console.log('Callback form found:', callbackForm);
    console.log('Phone input found:', phoneInput);
    
    if (callbackForm) {
        console.log('Adding event listener to callback form');
        callbackForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const phone = phoneInput.value.trim();
            if (!phone) {
                alert('Пожалуйста, введите номер телефона');
                return;
            }
            
            // Validate phone number
            const phoneRegex = /^[\+]?[7-8]?[\s\-]?\(?[0-9]{3}\)?[\s\-]?[0-9]{3}[\s\-]?[0-9]{2}[\s\-]?[0-9]{2}$/;
            if (!phoneRegex.test(phone)) {
                alert('Пожалуйста, введите корректный номер телефона');
                return;
            }
            
            // Show loading state
            const submitBtn = callbackForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<span class="loading-spinner"></span> Отправляем...';
            submitBtn.disabled = true;
            
            // Send to Telegram bot
            sendToTelegram(phone)
                .then(() => {
                    alert('Спасибо! Мы перезвоним вам в течение 15 минут.');
                    phoneInput.value = '';
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;
                    
                    // Track conversion
                    console.log('Callback request submitted:', phone);
                })
                .catch((error) => {
                    console.error('Error sending to Telegram:', error);
                    alert('Произошла ошибка. Попробуйте еще раз или позвоните нам напрямую.');
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;
                });
        });
    } else {
        console.error('Callback form not found!');
    }

    // Alternative: Add click handler to button directly
    const callbackButton = document.querySelector('#callbackForm button[type="submit"]');
    if (callbackButton) {
        console.log('Adding click handler to callback button');
        callbackButton.addEventListener('click', function(e) {
            console.log('Callback button clicked');
            // The form submit handler should handle this, but this is a backup
        });
    } else {
        console.error('Callback button not found!');
    }

    // Phone input formatting
    if (phoneInput) {
        phoneInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            
            // Если пользователь начинает вводить с 9, автоматически добавляем 7
            if (value.length > 0 && value[0] === '9') {
                value = '7' + value;
            }
            
            // Если пользователь вводит 8, заменяем на 7
            if (value.length > 0 && value[0] === '8') {
                value = '7' + value.slice(1);
            }
            
            if (value.length <= 11) {
                let formatted = '+7';
                if (value.length > 1) {
                    formatted += ' (' + value.slice(1, 4);
                    if (value.length > 4) {
                        formatted += ') ' + value.slice(4, 7);
                        if (value.length > 7) {
                            formatted += '-' + value.slice(7, 9);
                            if (value.length > 9) {
                                formatted += '-' + value.slice(9, 11);
                            }
                        }
                    }
                }
                e.target.value = formatted;
            }
        });
    }

    // Form handling (other forms)
    document.querySelectorAll('form:not(#callbackForm)').forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            console.log('Form submitted');
        });
    });

    // CTA button tracking
    document.querySelectorAll('.btn-primary').forEach(btn => {
        btn.addEventListener('click', function() {
            // Add analytics tracking here
            console.log('CTA clicked:', this.textContent.trim());
        });
    });

    // Pricing card selection
    document.querySelectorAll('.pricing-card').forEach(card => {
        card.addEventListener('click', function() {
            document.querySelectorAll('.pricing-card').forEach(c => c.classList.remove('selected'));
            this.classList.add('selected');
        });
    });

    // Lazy loading for images (if images are added)
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });

        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }

    // Add loading states for buttons
    document.querySelectorAll('.btn').forEach(btn => {
        btn.addEventListener('click', function() {
            if (this.href && (this.href.includes('/register') || this.href.includes('/login'))) {
                this.classList.add('loading');
                this.innerHTML = '<span class="loading-spinner"></span> Загрузка...';
            }
        });
    });
});

// Utility functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Smooth reveal animation
function revealOnScroll() {
    const reveals = document.querySelectorAll('.reveal');
    
    reveals.forEach(element => {
        const windowHeight = window.innerHeight;
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;
        
        if (elementTop < windowHeight - elementVisible) {
            element.classList.add('active');
        }
    });
}

window.addEventListener('scroll', debounce(revealOnScroll, 10));

// Initialize reveal on load
revealOnScroll();

// Telegram Bot Integration
async function sendToTelegram(phone) {
    const botToken = '8432776737:AAEFGMCviRfKTt2Di6IDdINsiFhzQkxH-Io';
    // Используем правильный chat_id
    const chatId = '-1003062794351';
    
    // Получаем дополнительную информацию
    const currentTime = new Date().toLocaleString('ru-RU');
    const userAgent = navigator.userAgent;
    const referrer = document.referrer || 'Прямой переход';
    const currentUrl = window.location.href;
    
    const message = `🎯 ЗАПРОС НА ДЕМО С ЛЕНДИНГА!

📞 Телефон: ${phone}
⏰ Время: ${currentTime}
🌐 Страница: ${currentUrl}
📱 Устройство: ${userAgent.includes('Mobile') ? 'Мобильное' : 'Десктоп'}
🔗 Источник: ${referrer}

#демо #лендинг #contentfactory`;

    const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
    
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                chat_id: chatId,
                text: message,
                parse_mode: 'HTML'
            })
        });

        if (response.ok) {
            console.log(`Message sent successfully to chat_id: ${chatId}`);
            return response.json();
        } else {
            const errorData = await response.json();
            console.error(`Failed to send message:`, errorData);
            throw new Error(`Telegram API error: ${errorData.description}`);
        }
    } catch (error) {
        console.error(`Error sending to Telegram:`, error);
        throw error;
    }
}

// Modal functionality
const modal = document.getElementById('pricingModal');
const modalClose = document.getElementById('modalClose');
const pricingForm = document.getElementById('pricingForm');
const selectedPlanInput = document.getElementById('selectedPlan');
const userPhoneModal = document.getElementById('userPhone');
const privacyCheckbox = document.getElementById('privacyPolicy');
const termsCheckbox = document.getElementById('termsAgreement');
const submitBtn = document.getElementById('submitBtn');

// Open modal when pricing button is clicked
document.querySelectorAll('[data-plan]').forEach(btn => {
    btn.addEventListener('click', function(e) {
        if (this.classList.contains('pricing-btn')) {
            e.preventDefault();
            const plan = this.getAttribute('data-plan');
            selectedPlanInput.value = plan;
            
            // Update modal title with tariff name from card
            const modalTitle = document.querySelector('.modal-title');
            const cardTitle = this.closest('.pricing-card').querySelector('h3').textContent;
            modalTitle.textContent = `Подключение тарифа "${cardTitle}"`;
            
            modal.classList.add('show');
            document.body.style.overflow = 'hidden';

            if (privacyCheckbox && termsCheckbox && submitBtn) {
                updateSubmitState();
            }
        }
    });
});

// Close modal
function closeModal() {
    modal.classList.remove('show');
    document.body.style.overflow = '';
    pricingForm.reset();
}

modalClose.addEventListener('click', closeModal);

// Close modal when clicking outside
modal.addEventListener('click', function(e) {
    if (e.target === modal) {
        closeModal();
    }
});

// Close modal with Escape key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && modal.classList.contains('show')) {
        closeModal();
    }
});

// Управление активностью кнопки отправки в зависимости от согласий
function updateSubmitState() {
    if (!submitBtn || !privacyCheckbox || !termsCheckbox) return;
    submitBtn.disabled = !(privacyCheckbox.checked && termsCheckbox.checked);
}

if (privacyCheckbox) privacyCheckbox.addEventListener('change', updateSubmitState);
if (termsCheckbox) termsCheckbox.addEventListener('change', updateSubmitState);

// Phone formatting for modal
if (userPhoneModal) {
    // Запрещаем ввод нецифровых символов
    userPhoneModal.addEventListener('keypress', function(e) {
        // Разрешаем только цифры, backspace, delete, tab, escape, enter
        if (!/[0-9]/.test(e.key) && 
            !['Backspace', 'Delete', 'Tab', 'Escape', 'Enter', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
            e.preventDefault();
        }
    });
    
    // Форматирование при вводе
    userPhoneModal.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        
        // Ограничиваем длину до 11 цифр (включая код страны)
        if (value.length > 11) {
            value = value.slice(0, 11);
        }
        
        // Если пользователь начинает вводить с 9, автоматически добавляем 7
        if (value.length > 0 && value[0] === '9') {
            value = '7' + value;
        }
        
        // Если пользователь вводит 8, заменяем на 7
        if (value.length > 0 && value[0] === '8') {
            value = '7' + value.slice(1);
        }
        
        // Форматируем номер
        let formatted = '';
        if (value.length > 0) {
            formatted = '+7';
            if (value.length > 1) {
                formatted += ' (' + value.slice(1, 4);
                if (value.length > 4) {
                    formatted += ') ' + value.slice(4, 7);
                    if (value.length > 7) {
                        formatted += '-' + value.slice(7, 9);
                        if (value.length > 9) {
                            formatted += '-' + value.slice(9, 11);
                        }
                    }
                }
            }
        }
        
        e.target.value = formatted;
    });
    
    // Запрещаем вставку нецифровых символов
    userPhoneModal.addEventListener('paste', function(e) {
        e.preventDefault();
        let paste = (e.clipboardData || window.clipboardData).getData('text');
        let numbersOnly = paste.replace(/\D/g, '');
        
        if (numbersOnly) {
            // Имитируем ввод цифр
            let currentValue = e.target.value.replace(/\D/g, '');
            let newValue = currentValue + numbersOnly;
            
            // Ограничиваем длину
            if (newValue.length > 11) {
                newValue = newValue.slice(0, 11);
            }
            
            // Применяем форматирование
            let formatted = '';
            if (newValue.length > 0) {
                // Если начинается с 9, добавляем 7
                if (newValue[0] === '9') {
                    newValue = '7' + newValue;
                }
                // Если начинается с 8, заменяем на 7
                if (newValue[0] === '8') {
                    newValue = '7' + newValue.slice(1);
                }
                
                formatted = '+7';
                if (newValue.length > 1) {
                    formatted += ' (' + newValue.slice(1, 4);
                    if (newValue.length > 4) {
                        formatted += ') ' + newValue.slice(4, 7);
                        if (newValue.length > 7) {
                            formatted += '-' + newValue.slice(7, 9);
                            if (newValue.length > 9) {
                                formatted += '-' + newValue.slice(9, 11);
                            }
                        }
                    }
                }
            }
            
            e.target.value = formatted;
        }
    });
}

// Handle pricing form submission
if (pricingForm) {
    pricingForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = new FormData(pricingForm);
        const data = {
            name: formData.get('name'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            company: formData.get('company') || 'Не указано',
            message: formData.get('message') || 'Нет комментариев',
            plan: formData.get('plan')
        };
        
        // Validate required fields
        if (!data.name || !data.email || !data.phone) {
            alert('Пожалуйста, заполните все обязательные поля');
            return;
        }
        
        // Validate phone number format
        const phoneDigits = data.phone.replace(/\D/g, '');
        if (phoneDigits.length !== 11 || !phoneDigits.startsWith('7')) {
            alert('Пожалуйста, введите корректный номер телефона');
            return;
        }
        
        // Проверяем согласия
        if ((privacyCheckbox && !privacyCheckbox.checked) || (termsCheckbox && !termsCheckbox.checked)) {
            alert('Пожалуйста, подтвердите Политику конфиденциальности и Пользовательское соглашение');
            return;
        }

        // Show loading state
        const originalText = submitBtn ? submitBtn.innerHTML : '';
        if (submitBtn) {
            submitBtn.innerHTML = '<span class="loading-spinner"></span> Отправляем...';
            submitBtn.disabled = true;
        }
        
        // Send to Telegram
        sendPricingToTelegram(data)
            .then(() => {
                alert('Спасибо! Мы свяжемся с вами в ближайшее время для подключения тарифа.');
                closeModal();
                if (submitBtn) {
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;
                }
            })
            .catch((error) => {
                console.error('Error sending pricing request:', error);
                alert('Произошла ошибка. Попробуйте еще раз или свяжитесь с нами напрямую.');
                if (submitBtn) {
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;
                }
            });
    });
}

// Send pricing data to Telegram
async function sendPricingToTelegram(data) {
    const botToken = '8432776737:AAEFGMCviRfKTt2Di6IDdINsiFhzQkxH-Io';
    const chatId = '-1003062794351';
    
    const currentTime = new Date().toLocaleString('ru-RU');
    const currentUrl = window.location.href;
    
    const planNames = {
        'starter': 'Стартер ($0/месяц)',
        'pro': 'Профи ($19/месяц)', 
        'agency': 'Агентство ($49/месяц)'
    };
    
    const message = `💼 ПОДКЛЮЧЕНИЕ ТАРИФОВ!

👤 Имя: ${data.name}
📧 Email: ${data.email}
📞 Телефон: ${data.phone}
🏢 Компания: ${data.company}
📋 Тариф: ${planNames[data.plan]}
💬 Комментарий: ${data.message}

⏰ Время: ${currentTime}
🌐 Страница: ${currentUrl}

#подключение_тарифов #лендинг #contentfactory`;

    const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
    
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                chat_id: chatId,
                text: message,
                parse_mode: 'HTML'
            })
        });

        if (response.ok) {
            console.log(`Pricing request sent successfully`);
            return response.json();
        } else {
            const errorData = await response.json();
            console.error(`Failed to send pricing request:`, errorData);
            throw new Error(`Telegram API error: ${errorData.description}`);
        }
    } catch (error) {
        console.error(`Error sending pricing request to Telegram:`, error);
        throw error;
    }
}
