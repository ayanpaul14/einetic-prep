// State Management
let transactions = JSON.parse(localStorage.getItem('transactions')) || [];

// DOM Elements
const form = document.getElementById('trackerForm');
const editIdInput = document.getElementById('editId');
const titleInput = document.getElementById('title');
const amountInput = document.getElementById('amount');
const typeInput = document.getElementById('type');
const submitBtn = document.getElementById('submitBtn');
const cancelBtn = document.getElementById('cancelBtn');
const filterSelect = document.getElementById('filter');
const list = document.getElementById('transactionList');

const totalBalance = document.getElementById('totalBalance');
const totalIncome = document.getElementById('totalIncome');
const totalExpense = document.getElementById('totalExpense');

// Save to LocalStorage
function persistData() {
  localStorage.setItem('transactions', JSON.stringify(transactions));
}

// Calculate Summary Cards
function updateSummary() {
  let income = 0;
  let expense = 0;

  transactions.forEach((tx) => {
    if (tx.type === 'income') {
      income += tx.amount;
    } else {
      expense += tx.amount;
    }
  });

  const balance = income - expense;

  totalIncome.textContent = `+₹${income.toFixed(2)}`;
  totalExpense.textContent = `-₹${expense.toFixed(2)}`;
  totalBalance.textContent = `₹${balance.toFixed(2)}`;

  if (balance < 0) {
    totalBalance.className = 'val expense-text';
  } else {
    totalBalance.className = 'val income-text';
  }
}

// Render Transactions List
function renderList() {
  list.innerHTML = '';
  const filter = filterSelect.value;

  const filteredItems = transactions.filter((tx) => {
    if (filter === 'all') return true;
    return tx.type === filter;
  });

  if (filteredItems.length === 0) {
    list.innerHTML = '<li class="empty-state">No transactions recorded.</li>';
    return;
  }

  filteredItems.forEach((tx) => {
    const li = document.createElement('li');
    li.className = `tx-item ${tx.type}`;

    const sign = tx.type === 'income' ? '+' : '-';

    li.innerHTML = `
      <div class="tx-info">
        <span class="tx-title">${escapeHTML(tx.title)}</span>
        <span class="tx-amount">${sign}₹${tx.amount.toFixed(2)}</span>
      </div>
      <div class="tx-actions">
        <button type="button" class="action-btn edit-btn" data-id="${tx.id}">Edit</button>
        <button type="button" class="action-btn del-btn" data-id="${tx.id}">Delete</button>
      </div>
    `;

    list.appendChild(li);
  });
}

// Sanitize user inputs to prevent basic XSS
function escapeHTML(str) {
  const div = document.createElement('div');
  div.innerText = str;
  return div.innerHTML;
}

// Form Submission (Add or Update)
form.addEventListener('submit', (e) => {
  e.preventDefault();

  const title = titleInput.value.trim();
  const amount = parseFloat(amountInput.value);
  const type = typeInput.value;
  const editId = editIdInput.value;

  if (!title || isNaN(amount) || amount <= 0) return;

  if (editId) {
    // Update existing transaction
    const targetIndex = transactions.findIndex((tx) => tx.id === Number(editId));
    if (targetIndex !== -1) {
      transactions[targetIndex] = { id: Number(editId), title, amount, type };
    }
    resetForm();
  } else {
    // Add new transaction
    const newTransaction = {
      id: Date.now(),
      title,
      amount,
      type
    };
    transactions.unshift(newTransaction);
    form.reset();
  }

  persistData();
  updateSummary();
  renderList();
});

// Event Delegation for Edit and Delete buttons
list.addEventListener('click', (e) => {
  const target = e.target;
  const id = Number(target.dataset.id);

  // Handle Delete
  if (target.classList.contains('del-btn')) {
    transactions = transactions.filter((tx) => tx.id !== id);
    if (Number(editIdInput.value) === id) {
      resetForm();
    }
    persistData();
    updateSummary();
    renderList();
  }

  // Handle Edit
  if (target.classList.contains('edit-btn')) {
    const item = transactions.find((tx) => tx.id === id);
    if (!item) return;

    editIdInput.value = item.id;
    titleInput.value = item.title;
    amountInput.value = item.amount;
    typeInput.value = item.type;

    submitBtn.textContent = 'Update Transaction';
    cancelBtn.style.display = 'block';
    titleInput.focus();
  }
});

// Cancel Edit Mode
cancelBtn.addEventListener('click', resetForm);

function resetForm() {
  editIdInput.value = '';
  form.reset();
  submitBtn.textContent = 'Add Transaction';
  cancelBtn.style.display = 'none';
}

// Filter Change
filterSelect.addEventListener('change', renderList);

// Initial Load
updateSummary();
renderList();