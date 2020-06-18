import MoneyRepository from "../src/model/MoneyRepository";
import VendingMachine from "../src/model/VendingMachine";

describe("Service mode, should be able to add change and articles to the machine", () => {
  test("Adding change on service mode should allow transactions that require change", () => {
    const moneyStorage = new MoneyRepository([25, 50, 100]);

    const vendingMachine = new VendingMachine(
      [
        { name: "WATER", price: 25 },
        { name: "CHIPS", price: 100 },
      ],
      moneyStorage
    );
    moneyStorage.stateProvider = vendingMachine;

    vendingMachine.serviceMode();
    vendingMachine.setStock("WATER", 1);
    moneyStorage.setMoney(25, 1);
    vendingMachine.serviceMode();

    moneyStorage.addMoney([50]);
    vendingMachine.selectArticle("WATER");
    moneyStorage.returnMoney();

    expect(moneyStorage.balance).toBe(0);
    expect(vendingMachine.getArticleData("WATER").amount).toBe(0);
  });

  test("Adding money or stock to the machine requires service mode", () => {
    const moneyStorage = new MoneyRepository([25, 50, 100]);

    const vendingMachine = new VendingMachine(
      [
        { name: "WATER", price: 25 },
        { name: "CHIPS", price: 100 },
      ],
      moneyStorage
    );
    moneyStorage.stateProvider = vendingMachine;

    const t = () => {
      vendingMachine.setStock("WATER", 1);
    };
    const u = () => {
      moneyStorage.setMoney(25, 1);
    };

    expect(t).toThrow();
    expect(u).toThrow();
  });

  test("Only allowed money or stock can be added", () => {
    const moneyStorage = new MoneyRepository([25, 50, 100]);

    const vendingMachine = new VendingMachine(
      [
        { name: "WATER", price: 25 },
        { name: "CHIPS", price: 100 },
      ],
      moneyStorage
    );
    moneyStorage.stateProvider = vendingMachine;

    vendingMachine.serviceMode();

    const t = () => {
      vendingMachine.setStock("CAR", 1);
    };
    const u = () => {
      moneyStorage.setMoney(75, 1);
    };

    expect(t).toThrow();
    expect(u).toThrow();
  });

  test("While on service mode it cant sell stuff", () => {
    const moneyStorage = new MoneyRepository([25, 50, 100]);

    const vendingMachine = new VendingMachine(
      [
        { name: "WATER", price: 25 },
        { name: "CHIPS", price: 100 },
      ],
      moneyStorage
    );
    moneyStorage.stateProvider = vendingMachine;

    vendingMachine.serviceMode();
    vendingMachine.setStock("WATER", 1);

    const t = () => {
      moneyStorage.addMoney([25]);
      vendingMachine.selectArticle("WATER");
    };

    expect(t).toThrow();
  });
});
