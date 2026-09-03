const expressionEl = document.getElementById('expression');
const resultEl = document.getElementById('result');
const buttons = document.querySelectorAll('.btn');

let current = '0';
let previous = null;
let operator = null;
let justEvaluated = false;

function updateDisplay() {
  resultEl.textContent = current;
  if (operator && previous !== null) {
    expressionEl.textContent = `${previous} ${opSymbol(operator)}`;
  } else {
    expressionEl.textContent = '';
  }
}

function opSymbol(op) {
  return { add: '+', subtract: '−', multiply: '×', divide: '÷' }[op] || '';
}

function inputNumber(value) {
  if (justEvaluated) {
    current = value === '.' ? '0.' : value;
    justEvaluated = false;
    return;
  }
  if (value === '.' && current.includes('.')) return;
  if (current === '0' && value !== '.') {
    current = value;
  } else {
    current += value;
  }
}

function chooseOperator(op) {
  if (operator !== null && !justEvaluated) {
    evaluate();
  }
  previous = current;
  operator = op;
  current = '0';
  justEvaluated = false;
  highlightOperator(op);
}

function highlightOperator(op) {
  document.querySelectorAll('.op').forEach(b => b.classList.remove('active'));
  const activeBtn = document.querySelector(`.op[data-action="${op}"]`);
  if (activeBtn) activeBtn.classList.add('active');
}

function evaluate() {
  if (operator === null || previous === null) return;
  const a = parseFloat(previous);
  const b = parseFloat(current);
  let result;
  switch (operator) {
    case 'add': result = a + b; break;
    case 'subtract': result = a - b; break;
    case 'multiply': result = a * b; break;
    case 'divide': result = b === 0 ? NaN : a / b; break;
    default: return;
  }
  current = trimResult(result);
  previous = null;
  operator = null;
  justEvaluated = true;
  document.querySelectorAll('.op').forEach(b => b.classList.remove('active'));
}

function trimResult(num) {
  if (Number.isNaN(num)) return 'Error';
  const rounded = Math.round(num * 1e10) / 1e10;
  return rounded.toString();
}

function clearAll() {
  current = '0';
  previous = null;
  operator = null;
  justEvaluated = false;
  document.querySelectorAll('.op').forEach(b => b.classList.remove('active'));
}

function deleteLast() {
  if (justEvaluated) return;
  current = current.length > 1 ? current.slice(0, -1) : '0';
}

function percent() {
  current = trimResult(parseFloat(current) / 100);
}

buttons.forEach(btn => {
  btn.addEventListener('click', () => {
    const value = btn.dataset.value;
    const action = btn.dataset.action;

    if (value !== undefined) {
      inputNumber(value);
    } else if (action === 'add' || action === 'subtract' || action === 'multiply' || action === 'divide') {
      chooseOperator(action);
    } else if (action === 'equals') {
      evaluate();
    } else if (action === 'clear') {
      clearAll();
    } else if (action === 'delete') {
      deleteLast();
    } else if (action === 'percent') {
      percent();
    }
    updateDisplay();
  });
});

window.addEventListener('keydown', (e) => {
  if (e.key >= '0' && e.key <= '9') inputNumber(e.key);
  else if (e.key === '.') inputNumber('.');
  else if (e.key === '+') chooseOperator('add');
  else if (e.key === '-') chooseOperator('subtract');
  else if (e.key === '*') chooseOperator('multiply');
  else if (e.key === '/') { e.preventDefault(); chooseOperator('divide'); }
  else if (e.key === 'Enter' || e.key === '=') evaluate();
  else if (e.key === 'Backspace') deleteLast();
  else if (e.key === 'Escape') clearAll();
  else return;
  updateDisplay();
});

updateDisplay();