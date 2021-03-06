'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////

// Creating usernames
const createUsernames = function (accs) {
  accs.forEach(acc => {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};
createUsernames(accounts);

// Displaying UI
const updateUI = function () {
  displayBalance(accounts);
  displayMovements(currentAccount.movements);
  displaySummary();
};

// Setting login and displaying the UI data
let currentAccount;
btnLogin.addEventListener('click', function (e) {
  e.preventDefault();

  containerApp.style.opacity = 1;
  currentAccount = accounts.find(
    account => account.username === inputLoginUsername.value
  );
  if (currentAccount.pin === Number(inputLoginPin.value)) {
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;
  }
  inputLoginUsername.value = inputLoginPin.value = '';
  inputLoginPin.blur();
  updateUI();
});

// Displaying balance
const displayBalance = function (accs) {
  accs.forEach(acc => {
    acc.balance = acc.movements.reduce((prev, curr) => prev + curr, 0);
  });
  labelBalance.textContent = currentAccount.balance;
};

// Displaying Movements
const displayMovements = function (movements, sort = false) {
  containerMovements.textContent = '';

  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;

  movs.forEach(mov => {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const html = `<div class="movements__row">
                  <div class="movements__type movements__type--${type}">2 ${type}</div>
                  <div class="movements__date">3 days ago</div>
                  <div class="movements__value">${mov} ???</div>
                  </div>`;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

// Sorting movements
let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault;
  displayMovements(currentAccount.movements, (sorted = !sorted));
  sorted = !sorted;
  console.log(sorted);
});

// Displaying summary

const displaySummary = function () {
  const income = currentAccount.movements
    .filter(mov => mov > 0)
    .reduce((sum, curr) => sum + curr);

  labelSumIn.textContent = income;

  const outcome = currentAccount.movements
    .filter(mov => mov < 0)
    .reduce((sum, curr) => sum + curr);

  labelSumOut.textContent = outcome;

  const interest = currentAccount.movements
    .filter(mov => mov > 0)
    .map(mov => (mov / 100) * currentAccount.interestRate)
    .filter(mov => mov > 1)
    .reduce((sum, curr) => sum + curr);

  labelSumInterest.textContent = interest;
};

// Tranferring money
btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();

  const receiver = accounts.find(acc => acc.username === inputTransferTo.value);
  const amount = Number(inputTransferAmount.value);

  inputTransferTo.value = inputTransferAmount.value = '';

  if (
    receiver &&
    receiver?.username !== currentAccount.username &&
    amount > 0 &&
    amount <= currentAccount.balance
  ) {
    receiver.movements.push(amount);
    currentAccount.movements.push(-amount);
    updateUI();
  }
});

// Requesting loan
btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputLoanAmount.value);
  inputLoanAmount.value = '';
  if (
    amount &&
    amount > 0 &&
    currentAccount.movements.some(mov => mov >= amount * 0.1)
  ) {
    currentAccount.movements.push(amount);
    updateUI();
  }
  inputLoanAmount.blur();
});

// Closing account
btnClose.addEventListener('click', function (e) {
  e.preventDefault();
  if (
    currentAccount.username === inputCloseUsername.value &&
    currentAccount.pin === Number(inputClosePin.value)
  ) {
    const index = accounts.findIndex(acc => acc === currentAccount);
    console.log(index);
    accounts.splice(index, 1);
    containerApp.style.opacity = 0;
  }
  inputCloseUsername.value = inputClosePin.value = '';
  inputClosePin.blur();
});
