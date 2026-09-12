/**
 * ==============================================================================
 * NICHARAT SEELALAI - PORTFOLIO JAVASCRIPT
 * Features:
 * 1. Navbar Scroll Blur & Styling Effect
 * 2. Mobile Navbar Auto-Collapse on Click
 * 3. Animated Progress Bars on Scroll (Intersection Observer)
 * 4. Contact Form Validation with Custom Colorful Alerts
 * 5. Back to Top Button Logic
 * 6. Smooth Scroll Offset Support
 * ==============================================================================
 */

document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================================================
       1. NAVBAR SCROLL EFFECT
       เพิ่มเงาและเปลี่ยนสไตล์เมื่อผู้ใช้เลื่อนหน้าจอลงมามากกว่า 50px
       ========================================================================== */
    const mainNavbar = document.getElementById('mainNavbar');

    function handleNavbarScroll() {
        if (window.scrollY > 50) {
            mainNavbar.classList.add('navbar-scrolled');
        } else {
            mainNavbar.classList.remove('navbar-scrolled');
        }
    }

    window.addEventListener('scroll', handleNavbarScroll);
    handleNavbarScroll(); // Initial check on page load


    /* ==========================================================================
       2. MOBILE NAVBAR AUTO-COLLAPSE
       เมื่อผู้ใช้คลิกเลือกลิงก์บนมือถือ ให้ปิดเมนู Hamburger ทันทีโดยอัตโนมัติ
       ========================================================================== */
    const navLinks = document.querySelectorAll('.modern-navbar .nav-link, .modern-navbar .btn-nav-contact');
    const navbarCollapse = document.getElementById('navbarMenu');

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navbarCollapse.classList.contains('show')) {
                const bsCollapse = bootstrap.Collapse.getInstance(navbarCollapse);
                if (bsCollapse) {
                    bsCollapse.hide();
                }
            }
        });
    });


    /* ==========================================================================
       3. SKILLS PROGRESS BARS ANIMATION
       เมื่อ Scroll มาถึง Section Skills ให้แถบ Progress Bar ค่อย ๆ วิ่งตามค่า %
       ========================================================================== */
    const skillsSection = document.getElementById('skills');
    const progressBars = document.querySelectorAll('.custom-progress .progress-bar');
    let skillsAnimated = false;

    if (skillsSection && progressBars.length > 0) {
        const skillsObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !skillsAnimated) {
                    progressBars.forEach(bar => {
                        const targetWidth = bar.getAttribute('data-width');
                        bar.style.width = targetWidth + '%';
                    });
                    skillsAnimated = true; // ให้ Animation ทำงานเพียงครั้งเดียว
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.25 // ทำงานเมื่อเห็นพื้นที่ 25% ของ Section
        });

        skillsObserver.observe(skillsSection);
    }


    /* ==========================================================================
       4. CONTACT FORM VALIDATION & NOTIFICATION
       ตรวจสอบความถูกต้องของแบบฟอร์มติดต่อ:
       - ตรวจสอบช่องว่าง (Required fields)
       - ตรวจสอบรูปแบบอีเมล (Email Regex)
       - แสดงผล Alert แจ้งเตือนน่ารักและชัดเจน
       ========================================================================== */
    const contactForm = document.getElementById('contactForm');
    const alertBox = document.getElementById('contactAlertBox');

    // ฟังก์ชันตรวจสอบรูปแบบ Email
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email.trim());
    }

    // ฟังก์ชันแสดง Alert Box ในหน้าเว็บ
    function showAlert(message, type = 'danger') {
        if (!alertBox) return;

        const icon = type === 'success' 
            ? '<i class="bi bi-heart-fill text-danger fs-5"></i>' 
            : '<i class="bi bi-exclamation-triangle-fill text-danger fs-5"></i>';

        const alertClass = type === 'success' ? 'custom-alert-success' : 'custom-alert-danger';

        alertBox.className = `alert-container mb-3 custom-alert ${alertClass}`;
        alertBox.innerHTML = `
            ${icon}
            <div>${message}</div>
        `;
        alertBox.style.display = 'flex';

        // เลื่อนหน้าจอเล็กน้อยเพื่อให้เห็น Alert อย่างชัดเจน
        alertBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault(); // ป้องกันการ reload หน้า

            // รับค่าจาก input
            const name = document.getElementById('contactName').value.trim();
            const email = document.getElementById('contactEmail').value.trim();
            const subject = document.getElementById('contactSubject').value.trim();
            const message = document.getElementById('contactMessage').value.trim();

            // 1. ตรวจสอบว่ากรอกครบทุกช่องหรือไม่
            if (!name || !email || !subject || !message) {
                showAlert('กรุณากรอกข้อมูลให้ครบทุกช่องก่อนส่งข้อความค่ะ ⚠️', 'danger');
                return;
            }

            // 2. ตรวจสอบความถูกต้องของ Email
            if (!isValidEmail(email)) {
                showAlert('กรุณาระบุอีเมลในรูปแบบที่ถูกต้อง เช่น name@example.com ⚠️', 'danger');
                return;
            }

            // 3. หากข้อมูลครบถ้วนและถูกต้อง
            showAlert('ส่งข้อความสำเร็จ! ขอบคุณสำหรับการติดต่อ 💖', 'success');

            // Reset ฟอร์มหลังจากส่งสำเร็จ
            contactForm.reset();

            // ซ่อน Alert อัตโนมัติหลังจาก 6 วินาที
            setTimeout(() => {
                if (alertBox) {
                    alertBox.style.display = 'none';
                }
            }, 6000);
        });
    }


    /* ==========================================================================
       5. BACK TO TOP BUTTON
       แสดงปุ่มเมื่อเลื่อนลงมามากกว่า 300px และกดเพื่อเลื่อนกลับสู่ด้านบนสุดอย่างนุ่มนวล
       ========================================================================== */
    const backToTopBtn = document.getElementById('backToTopBtn');

    if (backToTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                backToTopBtn.classList.add('show');
            } else {
                backToTopBtn.classList.remove('show');
            }
        });

        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }


    /* ==========================================================================
       6. SCROLL REVEAL ANIMATION (Intersection Observer)
       แสดง Effect ค่อย ๆ เลื่อนขึ้น (Fade Up) เมื่อเลื่อนมาถึง Section งานอดิเรก
       ========================================================================== */
    const revealElements = document.querySelectorAll('.reveal-on-scroll');

    if (revealElements.length > 0) {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-revealed');
                    observer.unobserve(entry.target); // ให้ทำงานครั้งเดียวเมื่อเลื่อนผ่าน
                }
            });
        }, {
            threshold: 0.15,
            rootMargin: '0px 0px -40px 0px'
        });

        revealElements.forEach(el => revealObserver.observe(el));
    }

});
