/* ===================================
   Детские праздники и развлечения
   JavaScript функционал
   =================================== */

document.addEventListener('DOMContentLoaded', function() {
    
    // ===================================
    // Обработка формы обратной связи
    // ===================================
    const feedbackForm = document.getElementById('feedbackForm');
    
    if (feedbackForm) {
        feedbackForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            const data = Object.fromEntries(formData);
            
            // Валидация
            if (!data.name || !data.phone) {
                showAlert('Пожалуйста, заполните обязательные поля!', 'error');
                return;
            }
            
            if (!validatePhone(data.phone)) {
                showAlert('Пожалуйста, введите корректный номер телефона!', 'error');
                return;
            }
            
            // Имитация отправки на сервер
            const submitBtn = this.querySelector('.btn-submit');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="bi bi-hourglass-split"></i> Отправка...';
            submitBtn.disabled = true;
            
            setTimeout(() => {
                showAlert('Спасибо за заявку! Мы свяжемся с вами в ближайшее время.', 'success');
                feedbackForm.reset();
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }, 1500);
        });
    }
    
    // ===================================
    // Маска для телефона
    // ===================================
    const phoneInput = document.getElementById('phone');
    
    if (phoneInput) {
        phoneInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            
            if (value.length > 11) {
                value = value.slice(0, 11);
            }
            
            if (value.length === 0) {
                e.target.value = '';
                return;
            }
            
            // Добавляем +7 если нет
            if (value[0] === '8') {
                value = '7' + value.slice(1);
            }
            if (value[0] !== '7') {
                value = '7' + value;
            }
            
            // Форматируем
            let formatted = '+7';
            if (value.length > 1) {
                formatted += ' (' + value.slice(1, 4);
            }
            if (value.length >= 5) {
                formatted += ') ' + value.slice(4, 7);
            }
            if (value.length >= 8) {
                formatted += '-' + value.slice(7, 9);
            }
            if (value.length >= 10) {
                formatted += '-' + value.slice(9, 11);
            }
            
            e.target.value = formatted;
        });
    }
    
    // ===================================
    // Плавный скролл для якорных ссылок
    // ===================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            if (href === '#') return;
            
            e.preventDefault();
            const target = document.querySelector(href);
            
            if (target) {
                const offsetTop = target.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
                
                // Закрываем мобильное меню
                const navbarCollapse = document.querySelector('.navbar-collapse');
                if (navbarCollapse.classList.contains('show')) {
                    navbarCollapse.classList.remove('show');
                }
            }
        });
    });
    
    // ===================================
    // Анимация при скролле
    // ===================================
    const animatedElements = document.querySelectorAll('.service-card, .benefit-item, .gallery-item, .section-title, .contact-wrapper');

    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, index * 100);
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    animatedElements.forEach(el => {
        observer.observe(el);
    });
    
    // ===================================
    // Подсветка активного пункта меню
    // ===================================
    const sections = document.querySelectorAll('section[id]');
    
    window.addEventListener('scroll', () => {
        const scrollY = window.pageYOffset;
        
        sections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - 100;
            const sectionId = section.getAttribute('id');
            
            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                document.querySelectorAll('.nav-link').forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    });
    
    // ===================================
    // Лайтбокс для галереи
    // ===================================
    const galleryItems = document.querySelectorAll('.gallery-item img');
    
    galleryItems.forEach(img => {
        img.parentElement.addEventListener('click', () => {
            openLightbox(img.src);
        });
    });
    
    function openLightbox(src) {
        const lightbox = document.createElement('div');
        lightbox.className = 'lightbox';
        lightbox.innerHTML = `
            <div class="lightbox-content">
                <span class="lightbox-close">&times;</span>
                <img src="${src}" alt="Просмотр">
            </div>
        `;
        
        lightbox.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.9);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 9999;
            cursor: pointer;
        `;
        
        const lightboxContent = lightbox.querySelector('.lightbox-content');
        lightboxContent.style.cssText = `
            position: relative;
            max-width: 90%;
            max-height: 90%;
        `;
        
        const lightboxImg = lightboxContent.querySelector('img');
        lightboxImg.style.cssText = `
            max-width: 100%;
            max-height: 90vh;
            border-radius: 8px;
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
        `;
        
        const closeBtn = lightboxContent.querySelector('.lightbox-close');
        closeBtn.style.cssText = `
            position: absolute;
            top: -40px;
            right: 0;
            font-size: 40px;
            color: white;
            cursor: pointer;
            line-height: 1;
        `;
        
        document.body.appendChild(lightbox);
        
        // Закрытие
        const closeLightbox = () => {
            lightbox.style.opacity = '0';
            lightbox.style.transition = 'opacity 0.3s';
            setTimeout(() => lightbox.remove(), 300);
        };
        
        lightbox.addEventListener('click', (e) => {
            if (e.target !== lightboxImg) {
                closeLightbox();
            }
        });
        
        closeBtn.addEventListener('click', closeLightbox);
        
        // Закрытие по ESC
        document.addEventListener('keydown', function escHandler(e) {
            if (e.key === 'Escape') {
                closeLightbox();
                document.removeEventListener('keydown', escHandler);
            }
        });
    }
    
    // ===================================
    // Уведомления (alert)
    // ===================================
    function showAlert(message, type = 'info') {
        const alert = document.createElement('div');
        alert.className = `custom-alert alert-${type}`;
        
        const icons = {
            success: 'bi-check-circle-fill',
            error: 'bi-exclamation-triangle-fill',
            info: 'bi-info-circle-fill'
        };
        
        alert.innerHTML = `
            <i class="bi ${icons[type] || icons.info}"></i>
            <span>${message}</span>
        `;
        
        alert.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            padding: 15px 25px;
            background: ${type === 'success' ? '#6bcb77' : type === 'error' ? '#ff6b6b' : '#7b68ee'};
            color: white;
            border-radius: 12px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
            display: flex;
            align-items: center;
            gap: 12px;
            font-weight: 600;
            z-index: 10000;
            animation: slideIn 0.3s ease-out;
        `;
        
        document.body.appendChild(alert);
        
        setTimeout(() => {
            alert.style.opacity = '0';
            alert.style.transition = 'opacity 0.3s';
            setTimeout(() => alert.remove(), 300);
        }, 4000);
    }
    
    // ===================================
    // Валидация телефона
    // ===================================
    function validatePhone(phone) {
        const cleaned = phone.replace(/\D/g, '');
        return cleaned.length === 11;
    }
    
    // ===================================
    // Изменение navbar при скролле
    // ===================================
    const navbar = document.querySelector('.navbar');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // ===================================
    // Шарик следует за секциями при скролле
    // ===================================
    const heroVisual = document.querySelector('.hero-visual');
    const heroSection = document.querySelector('.hero');
    
    console.log('heroVisual:', heroVisual);
    console.log('heroSection:', heroSection);
    console.log('sections:', sections.length);
    
    if (heroVisual && heroSection && sections.length > 0) {
        let isFixed = false;
        
        window.addEventListener('scroll', () => {
            const scrollY = window.scrollY;
            const triggerPoint = heroSection.offsetHeight * 0.5;
            
            console.log('scrollY:', scrollY, 'triggerPoint:', triggerPoint, 'isFixed:', isFixed);
            
            if (scrollY > triggerPoint && !isFixed) {
                // Фиксируем блок
                heroVisual.style.position = 'fixed';
                heroVisual.style.top = '100px';
                heroVisual.style.right = '50px';
                heroVisual.style.width = '150px';
                heroVisual.style.zIndex = '999';
                heroVisual.style.transition = 'all 0.3s';
                isFixed = true;
                console.log('FIXED!');
            } else if (scrollY <= triggerPoint && isFixed) {
                // Возвращаем как было
                heroVisual.style.position = '';
                heroVisual.style.top = '';
                heroVisual.style.right = '';
                heroVisual.style.width = '';
                heroVisual.style.zIndex = '';
                heroVisual.style.transition = '';
                isFixed = false;
                console.log('UNFIXED!');
            }
            
            // Перемещаем шарик к активной секции
            if (isFixed) {
                const sectionPositions = [];
                sections.forEach((section, i) => {
                    sectionPositions.push({
                        id: section.id,
                        top: section.offsetTop,
                        bottom: section.offsetTop + section.offsetHeight,
                        index: i
                    });
                });
                
                const viewportCenter = scrollY + window.innerHeight / 2;
                
                sectionPositions.forEach(pos => {
                    if (viewportCenter >= pos.top && viewportCenter < pos.bottom) {
                        // Позиция шарика для каждой секции
                        const newTop = 100 + (pos.index * 70);
                        heroVisual.style.top = newTop + 'px';
                        console.log('Section:', pos.id, 'newTop:', newTop);
                    }
                });
            }
        });
        
        // Клик - переход к следующей секции
        heroVisual.addEventListener('click', () => {
            const scrollY = window.scrollY;
            let nextSection = null;
            let found = false;
            
            sections.forEach(section => {
                if (scrollY >= section.offsetTop - 100) {
                    if (found) {
                        nextSection = section;
                    }
                    found = true;
                }
            });
            
            if (nextSection) {
                nextSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
            } else {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        });
    }

});

// ===================================
// CSS анимации для уведомлений
// ===================================
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    .navbar.scrolled {
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    }
    
    .nav-link.active {
        color: #ff6b9d !important;
    }
    
    .nav-link.active::after {
        width: 80%;
    }
`;
document.head.appendChild(style);
