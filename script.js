"use strict";

const display = typeof document !== "undefined"
  ? document.getElementById("display")
  : null;
const keys = typeof document !== "undefined"
  ? document.querySelector(".keys")
  : null;

// Стан калькулятора
let current = "0";   // що зараз на екрані
let stored = null;   // перше число
let op = null;       // операція
let justEvaluated = false;

function setDisplay(v) {
  current = v;
  if (display) display.value = v;
}

function normalizeNumberString(s) {
  // прибрати зайві нулі типу 00012, але зберегти "0." і "-" варіанти
  if (s === "" || s === "-" || s === "-0") return s;
  if (s.includes(".")) {
    // "000.5" -> "0.5"
    const [a, b] = s.split(".");
    const na = String(Number(a)); // Number("000") -> 0
    return `${na}.${b}`;
  }
  return String(Number(s));
}

function inputDigit(d) {
  if (justEvaluated) {
    setDisplay(d);
    justEvaluated = false;
    return;
  }

  if (current === "0") setDisplay(d);
  else if (current === "-0") setDisplay("-" + d);
  else setDisplay(current + d);
}

function inputDot() {
  if (justEvaluated) {
    setDisplay("0.");
    justEvaluated = false;
    return;
  }
  if (!current.includes(".")) setDisplay(current + ".");
}

function clearAll() {
  stored = null;
  op = null;
  justEvaluated = false;
  setDisplay("0");
}

function backspace() {
  if (justEvaluated) {
    // після "=" backspace повертає до 0
    clearAll();
    return;
  }
  if (current.length <= 1 || (current.length === 2 && current.startsWith("-"))) {
    setDisplay("0");
  } else {
    setDisplay(current.slice(0, -1));
  }
}

function toggleSign() {
  if (current === "0") return;
  if (current.startsWith("-")) setDisplay(current.slice(1));
  else setDisplay("-" + current);
}

function percent() {
  const n = Number(current);
  if (!Number.isFinite(n)) return;
  setDisplay(String(n / 100));
}

function compute(a, b, operator) {
  switch (operator) {
    case "+": return a + b;
    case "-": return a - b;
    case "*": return a * b;
    case "/": return b === 0 ? NaN : a / b;
    default: return b;
  }
}

function chooseOp(nextOp) {
  // якщо вже є stored і op, то рахуємо проміжний результат
  const currNum = Number(current);
  if (!Number.isFinite(currNum)) return;

  if (stored === null) {
    stored = currNum;
  } else if (op && !justEvaluated) {
    const res = compute(stored, currNum, op);
    stored = res;
    setDisplay(formatResult(res));
  }

  op = nextOp;
  justEvaluated = true; // наступний digit почне нове число
}

function equals() {
  if (op === null || stored === null) return;

  const a = stored;
  const b = Number(current);
  if (!Number.isFinite(b)) return;

  const res = compute(a, b, op);
  setDisplay(formatResult(res));

  // скидаємо операцію, але залишаємо результат як stored для можливих наступних "="
  stored = res;
  op = null;
  justEvaluated = true;
}

function formatResult(x) {
  if (!Number.isFinite(x)) return "Error";
  // обрізати дрібні артефакти типу 0.30000000004
  const rounded = Math.round((x + Number.EPSILON) * 1e12) / 1e12;
  return String(rounded);
}

// Кліки по кнопках
if (keys) {
  keys.addEventListener("click", (e) => {
    const btn = e.target.closest("button");
    if (!btn) return;

    const digit = btn.dataset.digit;
    const operator = btn.dataset.op;
    const action = btn.dataset.action;

    if (digit) inputDigit(digit);
    else if (operator) chooseOp(operator);
    else if (action === "dot") inputDot();
    else if (action === "equals") equals();
    else if (action === "clear") clearAll();
    else if (action === "back") backspace();
    else if (action === "sign") toggleSign();
    else if (action === "percent") percent();

    if (display) display.focus();
  });
}

// Ввід з клавіатури
if (typeof document !== "undefined") {
  document.addEventListener("keydown", (e) => {
    const k = e.key;

    if (k >= "0" && k <= "9") inputDigit(k);
    else if (k === ".") inputDot();
    else if (k === "+" || k === "-" || k === "*" || k === "/") chooseOp(k);
    else if (k === "Enter" || k === "=") { e.preventDefault(); equals(); }
    else if (k === "Backspace") backspace();
    else if (k === "Escape") clearAll();
  });
}

// Ініціалізація
if (display) {
  display.value = current;
  display.addEventListener("input", () => {
    // Дозволяємо ручний ввод, але чистимо сміття
    const s = display.value.replace(/[^\d\.\-]/g, "");
    setDisplay(normalizeNumberString(s));
  });
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    normalizeNumberString,
    compute,
    formatResult,
    inputDigit,
    inputDot,
    clearAll,
    backspace,
    toggleSign,
    percent,
    chooseOp,
    equals,
    setDisplay,
    getState: () => ({
      current,
      stored,
      op,
      justEvaluated,
    }),
  };
}