const openLogin = document.getElementById('openLogin');
const heroLogin = document.getElementById('heroLogin');
const loginModal = document.getElementById('loginModal');
const closeModal = document.getElementById('closeModal');
const closeModalBtn = document.getElementById('closeModalBtn');
const authLogin = document.getElementById('authLogin');
const authRegister = document.getElementById('authRegister');
const tabButtons = document.querySelectorAll('.tab-button');
const dashboardSection = document.getElementById('userPanel');
const logoutBtn = document.getElementById('logoutBtn');
const sidebarItems = document.querySelectorAll('.sidebar-item');
const overviewTab = document.getElementById('overviewTab');
const settingsTab = document.getElementById('settingsTab');
const reportsTab = document.getElementById('reportsTab');
const loginUser = document.getElementById('loginUser');
const loginPass = document.getElementById('loginPass');
const navToggle = document.getElementById('navToggle');
const mainNav = document.getElementById('mainNav');
const ratingStars = document.querySelectorAll('#ratingStars button');
const ratingResult = document.getElementById('ratingResult');
const productButtons = document.querySelectorAll('.btn-add');
const cartSummary = document.getElementById('cartSummary');
const cartList = document.getElementById('cartList');
const cartTotal = document.getElementById('cartTotal');
const problemCards = document.querySelectorAll('.problem-card');
const solutionCards = document.querySelectorAll('.solution-card');
const addressForm = document.getElementById('addressForm');
const buyerName = document.getElementById('buyerName');
const buyerAddress = document.getElementById('buyerAddress');
const addressListWrapper = document.getElementById('addressListWrapper');
const addressList = document.getElementById('addressList');

let cart = [];
let currentRating = 0;
let buyerAddresses = JSON.parse(localStorage.getItem('buyerAddresses') || '[]');

function toggleModal(show) {
  if (show) {
    loginModal.classList.remove('hidden');
    loginModal.setAttribute('aria-hidden', 'false');
  } else {
    loginModal.classList.add('hidden');
    loginModal.setAttribute('aria-hidden', 'true');
  }
}

function showDashboard() {
  dashboardSection.classList.remove('hidden');
  toggleModal(false);
}

function showTab(tabId) {
  sidebarItems.forEach(item => {
    item.classList.toggle('active', item.dataset.tab === tabId);
  });
  overviewTab.classList.toggle('hidden', tabId !== 'overview');
  settingsTab.classList.toggle('hidden', tabId !== 'settings');
  reportsTab.classList.toggle('hidden', tabId !== 'reports');
}

function setActiveTabOnClick() {
  sidebarItems.forEach(item => {
    item.addEventListener('click', () => {
      showTab(item.dataset.tab);
    });
  });
}

function setAuthFormTabs() {
  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      tabButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');
      document.querySelectorAll('.tab-panel').forEach(panel => panel.classList.add('hidden'));
      document.getElementById(button.dataset.tab).classList.remove('hidden');
    });
  });
}

function handleLogin(event) {
  event.preventDefault();
  const user = loginUser.value.trim();
  const pass = loginPass.value.trim();
  if (!user || !pass) {
    alert('Preencha usuário e senha.');
    return;
  }
  localStorage.setItem('agroUser', user);
  showDashboard();
}

function handleRegister(event) {
  event.preventDefault();
  const name = document.getElementById('registerName').value.trim();
  const email = document.getElementById('registerEmail').value.trim();
  const password = document.getElementById('registerPassword').value.trim();
  if (!name || !email || !password) {
    alert('Preencha todos os campos do cadastro.');
    return;
  }
  alert(`Conta criada para ${name}! Agora faça login.`);
  loginUser.value = email;
  document.getElementById('loginForm').classList.remove('hidden');
  document.getElementById('registerForm').classList.add('hidden');
  tabButtons.forEach(btn => btn.classList.toggle('active', btn.dataset.tab === 'loginForm'));
}

function setSmoothScroll() {
  document.querySelectorAll('.main-nav a').forEach(link => {
    link.addEventListener('click', () => {
      if (window.innerWidth <= 720) {
        mainNav.classList.remove('open');
      }
    });
  });
}

function updateRating(value) {
  currentRating = value;
  ratingStars.forEach(star => {
    const starValue = Number(star.dataset.value);
    star.classList.toggle('active', starValue <= value);
  });
  ratingResult.textContent = `Sua nota: ${value} estrela${value > 1 ? 's' : ''}`;
}

function addProductToCart(product, price) {
  cart.push({ product, price });
  renderCart();
}

function renderCart() {
  cartList.innerHTML = '';
  let total = 0;
  cart.forEach(item => {
    total += item.price;
    const li = document.createElement('li');
    li.textContent = `${item.product}`;
    const value = document.createElement('strong');
    value.textContent = `R$ ${item.price.toFixed(2)}`;
    li.appendChild(value);
    cartList.appendChild(li);
  });
  cartTotal.textContent = `R$ ${total.toFixed(2)}`;
  cartSummary.classList.toggle('hidden', cart.length === 0);
}

function selectProblem(card) {
  problemCards.forEach(item => item.classList.remove('active'));
  solutionCards.forEach(solution => solution.classList.add('hidden'));
  card.classList.add('active');
  const solutionId = card.dataset.solution;
  const selected = document.getElementById(solutionId);
  if (selected) {
    selected.classList.remove('hidden');
  }
}

function renderAddresses() {
  addressList.innerHTML = '';
  if (buyerAddresses.length === 0) {
    addressListWrapper.classList.add('hidden');
    return;
  }
  buyerAddresses.forEach(entry => {
    const li = document.createElement('li');
    li.innerHTML = `<strong>${entry.name}</strong><br>${entry.address}`;
    addressList.appendChild(li);
  });
  addressListWrapper.classList.remove('hidden');
}

function handleAddressSubmit(event) {
  event.preventDefault();
  const name = buyerName.value.trim();
  const address = buyerAddress.value.trim();
  if (!name || !address) {
    alert('Preencha nome e endereço do comprador.');
    return;
  }
  buyerAddresses.push({ name, address });
  localStorage.setItem('buyerAddresses', JSON.stringify(buyerAddresses));
  buyerName.value = '';
  buyerAddress.value = '';
  renderAddresses();
}

openLogin.addEventListener('click', () => toggleModal(true));
heroLogin.addEventListener('click', () => toggleModal(true));
closeModal.addEventListener('click', () => toggleModal(false));
closeModalBtn.addEventListener('click', () => toggleModal(false));

authLogin.addEventListener('submit', handleLogin);
authRegister.addEventListener('submit', handleRegister);
logoutBtn.addEventListener('click', () => {
  localStorage.removeItem('agroUser');
  dashboardSection.classList.add('hidden');
  toggleModal(false);
});

ratingStars.forEach(star => {
  star.addEventListener('click', () => updateRating(Number(star.dataset.value)));
});

productButtons.forEach(button => {
  button.addEventListener('click', () => {
    const card = button.closest('.product-card');
    const product = card.dataset.product;
    const price = Number(card.dataset.price || 0);
    addProductToCart(product, price);
  });
});

problemCards.forEach(card => {
  card.addEventListener('click', () => selectProblem(card));
});

addressForm.addEventListener('submit', handleAddressSubmit);

setAuthFormTabs();
setActiveTabOnClick();
setSmoothScroll();
renderAddresses();
showTab('overview');

navToggle.addEventListener('click', () => {
  mainNav.classList.toggle('open');
});

if (localStorage.getItem('agroUser')) {
  showDashboard();
}
