// ملف JavaScript الرئيسي للصفحة الرئيسية

// التحقق من حالة تسجيل الدخول عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', function() {
    checkLoginStatus();
});

function checkLoginStatus() {
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
        // إذا كان المستخدم مسجل الدخول، إخفاء أزرار التسجيل وإظهار رابط البروفايل
        updateUIForLoggedInUser();
    }
}

function updateUIForLoggedInUser() {
    const leftBtn = document.querySelector('.fixed-btn-left');
    const rightBtn = document.querySelector('.fixed-btn-right');
    
    if (leftBtn && rightBtn) {
        leftBtn.textContent = 'بروفايلي';
        leftBtn.href = 'profile.html';
        
        rightBtn.textContent = 'تسجيل الخروج';
        rightBtn.href = '#';
        rightBtn.onclick = function(e) {
            e.preventDefault();
            logout();
        };
    }
}

function logout() {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('userSession');
    window.location.reload();
}

// إضافة تأثيرات بصرية للأزرار
document.addEventListener('DOMContentLoaded', function() {
    const buttons = document.querySelectorAll('.fixed-btn');
    
    buttons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px) scale(1.05)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
});

// إضافة تأثير للكروت
document.addEventListener('DOMContentLoaded', function() {
    const cards = document.querySelectorAll('.feature-card');
    
    cards.forEach((card, index) => {
        setTimeout(() => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(50px)';
            card.style.transition = 'all 0.6s ease';
            
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, 100);
        }, index * 200);
    });
});