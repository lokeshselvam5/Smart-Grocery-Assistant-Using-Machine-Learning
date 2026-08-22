/**
 * calculator.js - Premium Calculator Feature Logic with Keyboard input, History reloading, memory features and percentage support.
 */

let calcDisplay;
let calcFormula;
let calcMemoryIndicator;
let currentInput = '0';
let currentExpression = [];
let waitingForNewValue = false;
let memory = 0;
let calcHistory = [];

function initCalculator() {
    // Only init once
    if (document.getElementById('calc-display').hasAttribute('data-initialized')) return;
    
    calcDisplay = document.getElementById('calc-display');
    calcFormula = document.getElementById('calc-formula');
    calcMemoryIndicator = document.getElementById('calc-memory-indicator');
    
    const buttons = document.querySelectorAll('.calc-btn');
    const clearHistoryBtn = document.getElementById('clear-calc-history');

    buttons.forEach(btn => {
        btn.addEventListener('click', handleCalcBtnClick);
    });

    clearHistoryBtn.addEventListener('click', clearHistory);

    // Mark as initialized
    calcDisplay.setAttribute('data-initialized', 'true');
    
    loadHistory();
    updateDisplay();
}

function handleCalcBtnClick(e) {
    const btn = e.target.closest('.calc-btn');
    if (!btn) return;

    const action = btn.getAttribute('data-action');
    const val = btn.getAttribute('data-val');

    if (!action) {
        inputNumber(val);
    } else if (action === 'operator') {
        inputOperator(val);
    } else if (action === 'calculate') {
        calculate();
    } else if (action === 'clear') {
        clearCalculator();
    } else if (action === 'delete') {
        deleteDigit();
    } else if (action === 'percentage') {
        inputPercentage();
    } else if (action === 'toggle-sign') {
        toggleSign();
    } else if (action.startsWith('memory-')) {
        handleMemoryAction(action);
    }
    
    updateDisplay();
}

function inputNumber(num) {
    if (waitingForNewValue) {
        currentInput = num;
        waitingForNewValue = false;
    } else {
        if (num === '.' && currentInput.includes('.')) return;
        if (currentInput === '0' && num !== '.') {
            currentInput = num;
        } else {
            currentInput += num;
        }
    }
}

function inputOperator(op) {
    if (waitingForNewValue) {
        if (currentExpression.length > 0) {
            currentExpression[currentExpression.length - 1] = op;
        }
        updateDisplay();
        return;
    }
    
    currentExpression.push(currentInput);
    currentExpression.push(op);
    
    let intermediate = evaluateExpression(currentExpression.slice(0, -1));
    currentInput = String(intermediate);
    waitingForNewValue = true;
    updateDisplay();
}

function evaluateExpression(arr) {
    if (arr.length === 0) return 0;
    let copy = [...arr];
    
    // First pass: multiply and divide
    for (let i = 0; i < copy.length; i++) {
        if (copy[i] === '*' || copy[i] === '/') {
            let prev = parseFloat(copy[i-1]);
            let next = parseFloat(copy[i+1]);
            let res = copy[i] === '*' ? prev * next : prev / next;
            copy.splice(i-1, 3, String(res));
            i -= 2; 
        }
    }
    
    // Second pass: add and subtract
    for (let i = 0; i < copy.length; i++) {
        if (copy[i] === '+' || copy[i] === '-') {
            let prev = parseFloat(copy[i-1]);
            let next = parseFloat(copy[i+1]);
            let res = copy[i] === '+' ? prev + next : prev - next;
            copy.splice(i-1, 3, String(res));
            i -= 2;
        }
    }
    
    return parseFloat(copy[0]);
}

function toggleSign() {
    if (currentInput === '0' || currentInput === 'Error') return;
    if (currentInput.startsWith('-')) {
        currentInput = currentInput.slice(1);
    } else {
        currentInput = '-' + currentInput;
    }
}

function inputPercentage() {
    let curr = parseFloat(currentInput);
    if (isNaN(curr)) return;
    
    if (currentExpression.length > 0) {
        let lastOp = currentExpression[currentExpression.length - 1];
        if (lastOp === '+' || lastOp === '-') {
            let intermediate = evaluateExpression(currentExpression.slice(0, -1));
            currentInput = String(intermediate * (curr / 100));
        } else {
            currentInput = String(curr / 100);
        }
    } else {
        currentInput = String(curr / 100);
    }
}

function handleMemoryAction(action) {
    let curr = parseFloat(currentInput);
    if (isNaN(curr)) curr = 0;
    
    switch (action) {
        case 'memory-clear':
            memory = 0;
            break;
        case 'memory-recall':
            currentInput = String(memory);
            waitingForNewValue = false;
            break;
        case 'memory-add':
            memory += curr;
            waitingForNewValue = true;
            break;
        case 'memory-subtract':
            memory -= curr;
            waitingForNewValue = true;
            break;
    }
    updateMemoryIndicator();
}

function updateMemoryIndicator() {
    if (calcMemoryIndicator) {
        calcMemoryIndicator.textContent = memory !== 0 ? 'M' : '';
    }
}

function calculate(logToHistory = true) {
    if (currentExpression.length === 0 || waitingForNewValue) return;

    currentExpression.push(currentInput);
    
    let result = evaluateExpression(currentExpression);
    let valid = !isNaN(result) && isFinite(result);

    if (!valid) {
        currentInput = 'Error';
    } else {
        // Format to handle JS floating point issues
        result = Math.round(result * 100000000) / 100000000;
        
        if (logToHistory) {
            let formulaStr = currentExpression.map(item => item === '*' ? '×' : item).join(' ');
            addHistoryEntry({
                id: Date.now().toString() + Math.random().toString(36).substring(2, 7),
                formula: formulaStr,
                result: String(result)
            });
        }
        
        currentInput = String(result);
    }
    
    currentExpression = [];
    waitingForNewValue = true;
    updateDisplay();
}

function clearCalculator() {
    currentInput = '0';
    currentExpression = [];
    waitingForNewValue = false;
    updateDisplay();
}

function deleteDigit() {
    if (waitingForNewValue) return;
    if (currentInput.length > 1) {
        currentInput = currentInput.slice(0, -1);
    } else {
        currentInput = '0';
    }
}

function updateDisplay() {
    if (calcDisplay) {
        calcDisplay.textContent = currentInput;
    }
    if (calcFormula) {
        if (currentExpression.length > 0) {
            calcFormula.textContent = currentExpression.map(item => item === '*' ? '×' : item).join(' ');
        } else {
            calcFormula.textContent = '';
        }
    }
}

function addHistoryEntry(entry) {
    calcHistory.unshift(entry);
    if (calcHistory.length > 50) {
        calcHistory.pop(); // keep last 50
    }
    saveHistory();
    renderHistory();
}

function clearHistory() {
    calcHistory = [];
    saveHistory();
    renderHistory();
}

function saveHistory() {
    localStorage.setItem('mds_calc_history', JSON.stringify(calcHistory));
}

function loadHistory() {
    const saved = localStorage.getItem('mds_calc_history');
    if (saved) {
        let parsed = JSON.parse(saved);
        calcHistory = parsed.map(item => {
            if (typeof item === 'string') {
                const parts = item.split('=');
                return {
                    id: Date.now().toString() + Math.random().toString(36).substring(2, 7),
                    formula: parts[0] ? parts[0].trim() : item,
                    result: parts[1] ? parts[1].trim() : ''
                };
            }
            return item;
        });
        renderHistory();
    }
}

function renderHistory() {
    const historyContainer = document.getElementById('calc-history-items');
    if (!historyContainer) return;
    historyContainer.innerHTML = '';
    
    if (calcHistory.length === 0) {
        historyContainer.innerHTML = '<div style="color: var(--text-muted); text-align: center; padding: 20px;">No history yet.</div>';
        return;
    }

    calcHistory.forEach(entry => {
        const item = document.createElement('div');
        item.className = 'history-item';
        
        item.innerHTML = `
            <div class="history-content" style="flex: 1; cursor: pointer; display: flex; flex-direction: column; align-items: flex-start; overflow: hidden;">
                <span style="color: var(--text-muted); font-size: 0.95rem; margin-bottom: 4px; word-break: break-all;">${entry.formula} =</span>
                <span style="font-weight: 700; color: var(--primary); font-size: 1.2rem; word-break: break-all;">${entry.result}</span>
            </div>
            <button class="history-delete-btn" data-id="${entry.id}" title="Delete history entry">
                <i class="fi fi-rr-trash"></i>
            </button>
        `;
        
        // Click to load result back into calculator
        const contentDiv = item.querySelector('.history-content');
        contentDiv.addEventListener('click', () => {
            currentInput = entry.result;
            currentExpression = [];
            waitingForNewValue = false;
            updateDisplay();
        });

        const delBtn = item.querySelector('.history-delete-btn');
        delBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            calcHistory = calcHistory.filter(h => h.id !== entry.id);
            saveHistory();
            renderHistory();
        });
        
        historyContainer.appendChild(item);
    });
}

// Global Keyboard Handler
document.addEventListener('keydown', (e) => {
    // Only handle if Calculator view is active/visible
    const calcView = document.getElementById('calculator-view');
    if (!calcView || calcView.style.display === 'none') return;
    
    const key = e.key;
    if (/[0-9]/.test(key)) {
        inputNumber(key);
    } else if (key === '.') {
        inputNumber('.');
    } else if (key === '+') {
        inputOperator('+');
    } else if (key === '-') {
        inputOperator('-');
    } else if (key === '*') {
        inputOperator('*');
    } else if (key === '/') {
        inputOperator('/');
    } else if (key === 'Enter' || key === '=') {
        e.preventDefault();
        calculate();
    } else if (key === 'Backspace') {
        deleteDigit();
    } else if (key === 'Escape') {
        clearCalculator();
    } else if (key === '%') {
        inputPercentage();
    }
    updateDisplay();
});
