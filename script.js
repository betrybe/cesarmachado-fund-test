function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
}

async function fetchMLB(shopping) {
  const response = await fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${shopping}`);
  const products = await response.json();
  return products.results;
}

function renderProducts(products) {
  const elementProducts = document.querySelector('.items');
  products.forEach((product) => {
    const allProducts = {
          sku: product.id,
          name: product.title,
          image: product.thumbnail,
        };
      const creatProducts = createProductItemElement(allProducts);
      elementProducts.appendChild(creatProducts);
  });
}

function loading() {
  const getContainer = document.querySelector('.container');
  getContainer.appendChild(createCustomElement('section', 'loading', 'loading...'));
  const now = new Date().getTime();
  const apiLoadTime = now - performance.timing.fetchStart;
  const time = apiLoadTime;
  setTimeout(async () => {
    document.querySelector('.loading').remove();
  }, time);
}

const cartItems = '.cart__items';

function sumCart() {
  const getCartList = document.querySelectorAll('.cart__item'); 
  const listPrice = [];
  getCartList.forEach((item) => {
    const price = Number(item.innerText.split('$')[1]);
    listPrice.push(price);
  });
  const sum = listPrice.reduce((a, b) => a + b, 0);
  return sum;
}

function createTitlePrice() {
  const elementProducts = document.querySelector('.cart');
  elementProducts.appendChild(createCustomElement('span', '', 'Total: $'));
  const createSection = elementProducts
    .appendChild(createCustomElement('section', 'total-price', ''));
  createSection.appendChild(createCustomElement('span', 'price', sumCart()));
  return createSection;
}

function saveLocalStorage() {
  const getCartList = document.querySelector(cartItems).innerHTML;
  localStorage.setItem('card', getCartList);
}

function clearItemClickListener() {
  localStorage.clear();
  const getCartList = document.querySelector(cartItems);
  getCartList.innerHTML = localStorage.getItem('card');
  document.querySelector('.price').innerText = sumCart();
}

function clearCart() {
  const clearButton = document.querySelector('.empty-cart');
  clearButton.addEventListener('click', clearItemClickListener);
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) {
  // coloque seu código aqui
  const getItem = event.target;
  getItem.remove();
  saveLocalStorage();
  document.querySelector('.price').innerText = sumCart();
}

function loadLocalStorage() {
  const getCartList = document.querySelector(cartItems);
  getCartList.innerHTML = localStorage.getItem('card');
  getCartList.addEventListener('click', cartItemClickListener);
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

async function addItemCard(event) {
  const ItemID = getSkuFromProductItem(event.target.parentNode); 
  const responseItem = await fetch(`https://api.mercadolibre.com/items/${ItemID}`);
  const products = await responseItem.json(); 
  const productsCard = {
    sku: products.id,
    name: products.title,
    salePrice: products.price,
  };
  const createCart = createCartItemElement(productsCard);
  const getCartItems = document.querySelector(cartItems);
  getCartItems.appendChild(createCart);
  saveLocalStorage();
  document.querySelector('.price').innerText = sumCart();
}

function getBtn() {
  const getButton = document.querySelectorAll('.item button');
  getButton.forEach((buttonAdd) => {
      buttonAdd.addEventListener('click', addItemCard);
    });
}

window.onload = async function onload() {
  loadLocalStorage();
  await loading();
  const products = await fetchMLB('computador');
  renderProducts(products);
  getBtn();
  createTitlePrice();
  clearCart();
 };
