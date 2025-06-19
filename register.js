// ملف JavaScript لصفحة التسجيل

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('registerForm');
    const messageDiv = document.getElementById('message');
    const submitBtn = document.getElementById('submitBtn');
    
    form.addEventListener('submit', handleRegistration);
});

async function handleRegistration(e) {
    e.preventDefault();
    
    const form = e.target;
    const formData = new FormData(form);
    const submitBtn = document.getElementById('submitBtn');
    const messageDiv = document.getElementById('message');
    
    // جمع البيانات
    const userData = {
        userId: formData.get('userId').trim(),
        password: formData.get('password'),
        confirmPassword: formData.get('confirmPassword'),
        name: formData.get('name').trim(),
        email: formData.get('email').trim()
    };
    
    // التحقق من صحة البيانات
    const validation = validateRegistrationData(userData);
    if (!validation.isValid) {
        showMessage(validation.message, 'error');
        return;
    }
    
    // تعطيل الزر أثناء المعالجة
    submitBtn.disabled = true;
    submitBtn.textContent = 'جاري الإنشاء...';
    
    try {
        // التحقق من وجود المستخدم
        const userExists = await checkUserExists(userData.userId);
        if (userExists) {
            showMessage('هذا المعرف مستخدم بالفعل. يرجى اختيار معرف آخر.', 'error');
            return;
        }
        
        // إنشاء المستخدم الجديد
        const newUser = await createUser(userData);
        if (newUser) {
            showMessage('تم إنشاء البروفايل بنجاح! جاري التوجيه...', 'success');
            
            // حفظ بيانات الجلسة
            localStorage.setItem('currentUser', userData.userId);
            localStorage.setItem('userSession', JSON.stringify({
                userId: userData.userId,
                loginTime: new Date().toISOString()
            }));
            
            // التوجه إلى صفحة البروفايل
            setTimeout(() => {
                window.location.href = 'profile.html';
            }, 2000);
        }
        
    } catch (error) {
        showMessage('حدث خطأ أثناء إنشاء البروفايل. يرجى المحاولة مرة أخرى.', 'error');
        console.error('Registration error:', error);
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'إنشاء البروفايل';
    }
}

function validateRegistrationData(userData) {
    // التحقق من معرف المستخدم
    if (userData.userId.length < 3 || userData.userId.length > 20) {
        return { isValid: false, message: 'معرف المستخدم يجب أن يكون بين 3 و 20 حرف' };
    }
    
    if (!/^[a-zA-Z0-9_]+$/.test(userData.userId)) {
        return { isValid: false, message: 'معرف المستخدم يجب أن يحتوي على أحرف وأرقام فقط' };
    }
    
    // التحقق من كلمة المرور
    if (userData.password.length < 6) {
        return { isValid: false, message: 'كلمة المرور يجب أن تكون 6 أحرف على الأقل' };
    }
    
    if (userData.password !== userData.confirmPassword) {
        return { isValid: false, message: 'كلمتا المرور غير متطابقتين' };
    }
    
    // التحقق من الاسم
    if (userData.name.length < 2) {
        return { isValid: false, message: 'الاسم يجب أن يكون حرفين على الأقل' };
    }
    
    // التحقق من البريد الإلكتروني
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userData.email)) {
        return { isValid: false, message: 'البريد الإلكتروني غير صحيح' };
    }
    
    return { isValid: true };
}

async function checkUserExists(userId) {
    try {
        const response = await fetch('/api/check-user', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userId })
        });
        
        const result = await response.json();
        return result.exists;
    } catch (error) {
        console.error('Error checking user:', error);
        throw error;
    }
}

async function createUser(userData) {
    try {
        // تشفير كلمة المرور (تشفير بسيط)
        const hashedPassword = btoa(userData.password + userData.userId);
        
        const userProfile = {
            userId: userData.userId,
            password: hashedPassword,
            name: userData.name,
            email: userData.email,
            bio: '',
            website: '',
            avatar: '',
            joinDate: new Date().toISOString(),
            lastLogin: new Date().toISOString()
        };
        
        const response = await fetch('/api/create-user', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userProfile)
        });
        
        if (response.ok) {
            const result = await response.json();
            return result;
        } else {
            throw new Error('Failed to create user');
        }
    } catch (error) {
        console.error('Error creating user:', error);
        throw error;
    }
}

function showMessage(message, type) {
    const messageDiv = document.getElementById('message');
    messageDiv.innerHTML = `<div class="${type}-message">${message}</div>`;
    
    // إخفاء الرسالة بعد 5 ثوان
    setTimeout(() => {
        messageDiv.innerHTML = '';
    }, 5000);
}