// سیستم مدیریت کاربران و احراز هویت (Auth Store)
class AuthStore {
  constructor() {
    this.userKey = 'valiasr_sports_user';
    this.usersKey = 'valiasr_sports_all_users';
  }

  getCurrentUser() {
    try {
      const u = localStorage.getItem(this.userKey);
      return u ? JSON.parse(u) : null;
    } catch (e) {
      return null;
    }
  }

  getRegisteredUsers() {
    try {
      const u = localStorage.getItem(this.usersKey);
      return u ? JSON.parse(u) : [];
    } catch (e) {
      return [];
    }
  }

  register(fullName, emailOrPhone, password) {
    let users = this.getRegisteredUsers();
    if (users.some(u => u.identifier === emailOrPhone)) {
      return { success: false, message: 'این شماره یا ایمیل قبلاً ثبت نام شده است' };
    }

    const newUser = {
      id: Date.now(),
      fullName,
      identifier: emailOrPhone,
      password,
      createdAt: new Date().toLocaleDateString('fa-IR')
    };

    users.push(newUser);
    localStorage.setItem(this.usersKey, JSON.stringify(users));
    
    // Auto-login
    localStorage.setItem(this.userKey, JSON.stringify(newUser));
    this.updateUserUI();
    return { success: true, message: 'ثبت‌نام با موفقیت انجام شد' };
  }

  login(emailOrPhone, password) {
    let users = this.getRegisteredUsers();
    // Default test user
    if (users.length === 0) {
      users = [{
        id: 1,
        fullName: 'کاربر پارسا',
        identifier: '09306397710',
        password: '123456'
      }];
      localStorage.setItem(this.usersKey, JSON.stringify(users));
    }

    const found = users.find(u => u.identifier === emailOrPhone && u.password === password);
    if (found) {
      localStorage.setItem(this.userKey, JSON.stringify(found));
      this.updateUserUI();
      return { success: true, message: 'ورود با موفقیت انجام شد' };
    } else {
      return { success: false, message: 'اطلاعات ورود (شماره/ایمیل یا رمز عبور) اشتباه است' };
    }
  }

  logout() {
    localStorage.removeItem(this.userKey);
    this.updateUserUI();
    if (window.showToast) {
      window.showToast('از حساب کاربری خارج شدید', 'info');
    }
    setTimeout(() => {
      window.location.reload();
    }, 800);
  }

  updateUserUI() {
    const user = this.getCurrentUser();
    const userNavBtns = document.querySelectorAll('.auth-nav-link');
    
    userNavBtns.forEach(btn => {
      if (user) {
        btn.innerHTML = `<i class="ph ph-user-circle"></i> <span>${user.fullName.split(' ')[0]}</span>`;
        btn.href = window.location.pathname.includes('/Page/') || window.location.pathname.includes('/pages/') 
          ? '#' 
          : '#';
        btn.onclick = (e) => {
          e.preventDefault();
          if (confirm(`حساب: ${user.fullName}\nآیا قصد خروج از حساب را دارید؟`)) {
            this.logout();
          }
        };
      } else {
        const loginPath = window.location.pathname.includes('/Page/') || window.location.pathname.includes('/pages/')
          ? 'login.html'
          : 'Page/login.html';
        btn.innerHTML = `<i class="ph ph-user-plus"></i> <span>ورود / ثبت‌نام</span>`;
        btn.href = loginPath;
        btn.onclick = null;
      }
    });
  }
}

window.authStore = new AuthStore();
document.addEventListener('DOMContentLoaded', () => {
  window.authStore.updateUserUI();
});
