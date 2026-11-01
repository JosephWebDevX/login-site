const USERS_KEY = 'nx_users';
const CURRENT_USER_KEY = 'nx_current_user';

const getUsers = () => JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
const saveUsers = (users) => localStorage.setItem(USERS_KEY, JSON.stringify(users));

const setCurrentUser = (user) => localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
const getCurrentUser = () => {
  const raw = localStorage.getItem(CURRENT_USER_KEY);
  return raw ? JSON.parse(raw) : null;
};

const clearCurrentUser = () => localStorage.removeItem(CURRENT_USER_KEY);

const applySavedTheme = () => {
  const savedTheme = localStorage.getItem('nx_theme');
  if (savedTheme === 'dark') {
    document.body.classList.add('dark-theme');
  }
};

const toggleTheme = () => {
  const isDark = document.body.classList.toggle('dark-theme');
  localStorage.setItem('nx_theme', isDark ? 'dark' : 'light');
};

const bindThemeToggle = () => {
  const buttons = document.querySelectorAll('.theme-toggle');
  buttons.forEach((button) => {
    button.addEventListener('click', toggleTheme);
  });
};

const protectDashboard = () => {
  const currentUser = getCurrentUser();
  if (!currentUser && document.body.dataset.page === 'dashboard') {
    window.location.href = 'index.html';
  }
};

const loadDashboardUser = () => {
  if (document.body.dataset.page !== 'dashboard') return;
  const currentUser = getCurrentUser();
  if (!currentUser) return;
  const userName = document.getElementById('userName');
  if (userName) userName.textContent = currentUser.name || currentUser.email;
};

const handleSignup = () => {
  const form = document.getElementById('signupForm');
  if (!form) return;

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('signupEmail').value.trim();
    const password = document.getElementById('signupPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    if (!name || !email || !password || !confirmPassword) {
      alert('Preencha todos os campos.');
      return;
    }

    if (password.length < 6) {
      alert('A senha deve ter pelo menos 6 caracteres.');
      return;
    }

    if (password !== confirmPassword) {
      alert('As senhas não conferem.');
      return;
    }

    const users = getUsers();
    const emailExists = users.some((user) => user.email.toLowerCase() === email.toLowerCase());

    if (emailExists) {
      alert('Este e-mail já está cadastrado.');
      return;
    }

    users.push({ name, email, password });
    saveUsers(users);
    alert('Conta criada com sucesso!');
    form.reset();
    window.location.href = 'index.html';
  });
};

const handleLogin = () => {
  const form = document.getElementById('loginForm');
  if (!form) return;

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;

    if (!email || !password) {
      alert('Informe e-mail e senha.');
      return;
    }

    const users = getUsers();
    const user = users.find(
      (entry) => entry.email.toLowerCase() === email.toLowerCase() && entry.password === password
    );

    if (!user) {
      alert('Credenciais inválidas.');
      return;
    }

    setCurrentUser({ name: user.name, email: user.email });
    alert('Login realizado com sucesso!');
    window.location.href = 'dashboard.html';
  });
};

const handleReset = () => {
  const form = document.getElementById('resetForm');
  if (!form) return;

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const email = document.getElementById('resetEmail').value.trim();
    if (!email) {
      alert('Informe seu e-mail.');
      return;
    }

    const userExists = getUsers().some((user) => user.email.toLowerCase() === email.toLowerCase());

    if (!userExists) {
      alert('Esse e-mail não está cadastrado.');
      return;
    }

    alert('Link de recuperação enviado para o seu e-mail.');
    form.reset();
  });
};

const handleLogout = () => {
  const button = document.getElementById('logoutBtn');
  if (!button) return;

  button.addEventListener('click', () => {
    clearCurrentUser();
    window.location.href = 'index.html';
  });
};

applySavedTheme();
bindThemeToggle();
protectDashboard();
loadDashboardUser();
handleSignup();
handleLogin();
handleReset();
handleLogout();
