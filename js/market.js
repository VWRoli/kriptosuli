'use strict';

const tableHeader = document.querySelector('.thead');
const tableBody = document.querySelector('.table-body');
const coinPriceChangeLabel = document.querySelector('.coin-price-change');

const marketTable = document.querySelector('.market-table');
const hideMarketBtn = document.querySelector('.hide-market-btn');

const API_URL = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=huf&order=market_cap_desc&per_page=10&page=1&sparkline=false`;

//Toggle market price table
hideMarketBtn.addEventListener('click', function () {
  marketTable.classList.toggle('visibility');
});
////////////////////////////////////////////////////////////
//CoinGecko API
//Get data from CoinGecko
const getCoinMarkets = async function () {
  try {
    renderSpinner();
    //Fetch data, or throw error after timeout
    const res = await Promise.race([fetch(API_URL), timeout(15)]);
    if (!res.ok)
      throw new Error(
        'Problem getting coin data. Please refresh the page, or try again later!'
      );

    const data = await res.json();
    renderCoinData(data);
  } catch (err) {
    renderError(`${err.message}`);
  }
};
getCoinMarkets();

//Render error
function renderError(msg) {
  clear(tableBody);
  tableBody.insertAdjacentText('beforeend', msg);
}

//Display coins
function renderCoinData(coins) {
  //Sirting table
  tableHeader.addEventListener('click', sortTable.bind(coins));
  //Render coins to display
  clear(tableBody);
  coins.forEach(buildTableData);
}
//Formatter functions
//Format supply and marketcap
const numberFormatter = (supply) => {
  const formattedSupply = new Intl.NumberFormat('hu-HU', {
    notation: 'compact',
    compactDisplay: 'long',
  }).format(supply);
  return formattedSupply;
};
//Format Price Change
const priceChangeFormatter = (priceChange) => {
  const formattedPriceChange = new Intl.NumberFormat('hu-HU', {
    style: 'percent',
    signDisplay: 'exceptZero',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(priceChange / 100);

  return formattedPriceChange;
};
//Format price
const priceFormatter = (price) => {
  const formattedPrice = new Intl.NumberFormat('hu-HU', {
    style: 'currency',
    currency: 'HUF',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
  return formattedPrice;
};

//Build table data
const buildTableData = (coin) => {
  //Format price
  const price = priceFormatter(coin.current_price);

  //Format price change
  const priceChange = priceChangeFormatter(coin.price_change_percentage_24h);
  //Price change color
  const type = coin.price_change_percentage_24h > 0 ? `positive` : `negative`;

  //Format supply and market cap
  const supply = numberFormatter(coin.circulating_supply);
  const marketcap = numberFormatter(coin.market_cap);

  //Display table
  const html = `
      <tr class="tr-grid">
       <td class="coin-rank">${coin.market_cap_rank}</td>
       <td class="coin-icon"><img src="${coin.image}" alt="" /></td>
       <td class="coin-symbol">${coin.symbol.toUpperCase()}</td>
       <td class="coin-name">${coin.name}</td>
       <td class="coin-price">${price}</td>
       <td class="coin-price-change ${type}">${priceChange}</td>
       <td class="coin-marketcap">${marketcap}</td>
       <td class="coin-supply">${supply} ${coin.symbol.toUpperCase()}</td>
      </tr>
      `;
  tableBody.insertAdjacentHTML('beforeend', html);
};

//Sorting table data
function sortTable(e) {
  const clicked = e.target.closest('th');
  let columnClicked =
    e.target.closest('th').dataset.column || e.target.dataset.column;
  let columnOrder =
    e.target.closest('th').dataset.order || e.target.dataset.order;

  //Add sorted by class
  sortedBy(clicked);
  //Sorting
  if (columnOrder === 'desc') {
    clicked.setAttribute('data-order', 'asc');
    this.sort((a, b) => (a[columnClicked] > b[columnClicked] ? 1 : -1));
  } else {
    clicked.setAttribute('data-order', 'desc');
    this.sort((a, b) => (b[columnClicked] < a[columnClicked] ? -1 : 1));
  }
  clear(tableBody);
  //Render sorted coins to display
  this.forEach(buildTableData);
}

//Add sortedby class
function sortedBy(target) {
  //Remove Sorted class from every element
  const tableHeaderElements = [...tableHeader.firstElementChild.cells];
  tableHeaderElements.forEach((item) =>
    item.firstElementChild.classList.remove('sorted-by')
  );
  //Add sorted class to clicked element
  const sortTarget = target.firstElementChild || target;
  sortTarget.classList.add('sorted-by');
}

//Loading spinner
function renderSpinner() {
  const markup = `<div class="spinner">
  <i class="fas fa-spinner fa-2x"></i>
  </div> `;
  clear(tableBody);
  tableBody.insertAdjacentHTML('afterbegin', markup);
}

//Timeout function
function timeout(s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
}

//Clear function
function clear(element) {
  element.innerHTML = '';
}
