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
            
            submitDemoLead(phone)
                .then(() => {
                    alert('Спасибо! Мы перезвоним вам в течение 15 минут.');
                    phoneInput.value = '';
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;
                    
                    // Track conversion
                    console.log('Callback request submitted:', phone);
                })
                .catch((error) => {
                    console.error('Error sending lead:', error);
                    const msg = !isWeb3FormsConfigured()
                        ? 'Форма не настроена: укажите web3formsProxyUrl (рекомендуется) или web3formsAccessKey в js/lead-config.js.'
                        : 'Произошла ошибка. Попробуйте еще раз или позвоните нам напрямую.';
                    alert(msg);
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

    // Form handling (other forms — без демо и модалки тарифов)
    document.querySelectorAll('form:not(#callbackForm):not(#pricingForm)').forEach(form => {
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

// Заявки → Web3Forms (напрямую или через прокси-Worker)
const WEB3FORMS_URL = 'https://api.web3forms.com/submit';

function getWeb3FormsProxyUrl() {
    const c = window.CONTENTPULSE_LEAD || {};
    const url = String(c.web3formsProxyUrl || '').trim();
    if (!url) return '';
    if (!/^https?:\/\//i.test(url)) return '';
    return url;
}

function isWeb3FormsConfigured() {
    const c = window.CONTENTPULSE_LEAD || {};
    if (getWeb3FormsProxyUrl()) return true;
    const key = String(c.web3formsAccessKey || '').trim();
    return Boolean(key && key !== 'YOUR_WEB3FORMS_ACCESS_KEY');
}

async function submitToWeb3Forms(fields) {
    if (!isWeb3FormsConfigured()) {
        throw new Error('Web3Forms not configured');
    }
    const c = window.CONTENTPULSE_LEAD || {};
    const proxyUrl = getWeb3FormsProxyUrl();
    const useProxy = Boolean(proxyUrl);

    const response = await fetch(useProxy ? proxyUrl : WEB3FORMS_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
        },
        body: JSON.stringify(
            useProxy
                ? fields
                : {
                      access_key: c.web3formsAccessKey,
                      botcheck: '',
                      ...fields,
                  }
        ),
    });

    const data = await response.json().catch(() => ({}));
    if (response.ok && data.success) {
        return data;
    }
    throw new Error(data.message || data.error || response.statusText || 'Submit failed');
}

async function submitDemoLead(phone) {
    const time = new Date().toLocaleString('ru-RU');
    const page = window.location.href;
    const ref = document.referrer || 'Прямой переход';
    const device = /Mobile/i.test(navigator.userAgent) ? 'Мобильное' : 'Десктоп';

    return submitToWeb3Forms({
        subject: 'Content Pulse — запрос демо с лендинга',
        name: 'Демо (лендинг)',
        phone,
        message:
            `Телефон: ${phone}\n\n` +
            `Время: ${time}\n` +
            `Страница: ${page}\n` +
            `Устройство: ${device}\n` +
            `Источник: ${ref}`,
    });
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
        
        const planNames = {
            start: 'Старт (0 ₽/мес)',
            micro: 'Микро (990 ₽/мес)',
            blogger: 'Блогер (2 490 ₽/мес)',
            team: 'Команда (4 990 ₽/мес)',
            agency: 'Агентство (14 990 ₽/мес)',
            enterprise: 'Корпорация / API (от 30 000 ₽/мес)',
        };
        const planLabel =
            planNames[data.plan] ||
            (data.plan ? String(data.plan) : 'тариф не указан');

        submitToWeb3Forms({
            subject: `Content Pulse — заявка: ${planLabel}`,
            name: data.name,
            email: data.email,
            phone: data.phone,
            message:
                `Тариф: ${planLabel}\n\n` +
                `Имя: ${data.name}\n` +
                `Email: ${data.email}\n` +
                `Телефон: ${data.phone}\n` +
                `Компания: ${data.company}\n\n` +
                `Комментарий:\n${data.message}\n\n` +
                `Время: ${new Date().toLocaleString('ru-RU')}\n` +
                `Страница: ${window.location.href}`,
        })
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
                const msg = !isWeb3FormsConfigured()
                    ? 'Форма не настроена: укажите web3formsProxyUrl (рекомендуется) или web3formsAccessKey в js/lead-config.js.'
                    : 'Произошла ошибка. Попробуйте еще раз или свяжитесь с нами напрямую.';
                alert(msg);
                if (submitBtn) {
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;
                }
            });
    });
}

