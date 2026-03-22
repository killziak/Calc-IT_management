const {
  normalizeNumberString,
  compute,
  inputDigit,
  inputDot,
  clearAll,
  backspace,
  toggleSign,
  percent,
  chooseOp,
  equals,
  getState,
} = require("../script.js");

describe("Calculator unit tests", () => {
  beforeEach(() => {
    clearAll();
  });

  test("normalizeNumberString removes leading zeros", () => {
    expect(normalizeNumberString("00012")).toBe("12");
  });

  test("normalizeNumberString keeps decimal value correct", () => {
    expect(normalizeNumberString("000.5")).toBe("0.5");
  });

  test("compute adds numbers correctly", () => {
    expect(compute(2, 3, "+")).toBe(6);
  });

  test("compute multiplies numbers correctly", () => {
    expect(compute(4, 5, "*")).toBe(20);
  });

  test("inputDigit builds number correctly", () => {
    inputDigit("1");
    inputDigit("2");
    inputDigit("3");
    expect(getState().current).toBe("123");
  });

  test("inputDot adds only one decimal point", () => {
    inputDigit("5");
    inputDot();
    inputDot();
    inputDigit("2");
    expect(getState().current).toBe("5.2");
  });

  test("backspace removes last digit", () => {
    inputDigit("7");
    inputDigit("8");
    backspace();
    expect(getState().current).toBe("7");
  });

  test("toggleSign changes positive number to negative", () => {
    inputDigit("9");
    toggleSign();
    expect(getState().current).toBe("-9");
  });

  test("percent converts number to percent", () => {
    inputDigit("5");
    inputDigit("0");
    percent();
    expect(getState().current).toBe("0.5");
  });

  test("equals performs full operation correctly", () => {
    inputDigit("8");
    chooseOp("+");
    inputDigit("2");
    equals();
    expect(getState().current).toBe("10");
  });
});