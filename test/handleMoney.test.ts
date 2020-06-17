import MoneyRepository from "../src/model/MoneyRepository";

describe("The app should be able to handle money correctly", () => {
  test("add valid currency should increase the balance", () => {
    const moneyStorage = new MoneyRepository([25, 50, 100]);

    moneyStorage.addMoney([50, 50, 100, 25]);

    expect(moneyStorage.balance).toBe(225);
  });

  test("add invalid currency should not be allowed", () => {
    const moneyStorage = new MoneyRepository([25, 50, 100]);

    const t = () => {
      moneyStorage.addMoney([50, 50, 100, 75]);
    };

    expect(t).toThrow();
  });

  test("return money should return the amount of available money to spend", () => {
    const moneyStorage = new MoneyRepository([25, 50, 100]);

    moneyStorage.addMoney([50, 50, 100, 25]);
    const result = moneyStorage.returnMoney();

    expect(moneyStorage.balance).toBe(0);
    expect(
      result.reduce((accumulator, currentValue) => {
        return accumulator + currentValue;
      }, 0)
    ).toBe(225);
    expect(result.length).toBe(4);
  });

  test("return money should return the amount of available money to spend (with some money spent)", () => {
    const moneyStorage = new MoneyRepository([25, 50, 100]);

    moneyStorage.addMoney([50, 50, 100, 25, 25, 25]);
    moneyStorage.finishTransaction(175);
    const result = moneyStorage.returnMoney();

    expect(moneyStorage.balance).toBe(0);
    expect(
      result.reduce((accumulator, currentValue) => {
        return accumulator + currentValue;
      }, 0)
    ).toBe(100);
    expect(result.length).toBe(1);
  });

  test("return money should return the amount of available money to spend (with some money spent)", () => {
    const moneyStorage = new MoneyRepository([25, 50, 100]);

    moneyStorage.addMoney([50, 50, 25, 25]);
    moneyStorage.finishTransaction();

    moneyStorage.addMoney([100, 100]);
    moneyStorage.finishTransaction(50);
    const result = moneyStorage.returnMoney();

    expect(moneyStorage.balance).toBe(0);
    expect(
      result.reduce((accumulator, currentValue) => {
        return accumulator + currentValue;
      }, 0)
    ).toBe(150);
    expect(result.length).toBe(2);
  });

  test("return money should throw if there is no available currency for the necesary change", () => {
    const moneyStorage = new MoneyRepository([25, 50, 100]);

    moneyStorage.addMoney([50]);
    moneyStorage.finishTransaction(25);

    const t = () => {
      moneyStorage.returnMoney();
    };

    expect(t).toThrow();
  });
});
