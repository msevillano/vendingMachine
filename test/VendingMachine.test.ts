import MoneyRepository from "../src/model/MoneyRepository";
import VendingMachine from "../src/model/VendingMachine";

describe("Vending machine should be able to handle article sellings", () => {
  test("add exact amount of change for 1 article and buy it", () => {
    const moneyStorage = new MoneyRepository([25, 50, 100]);

    const vendingMachine = new VendingMachine(
      [
        { name: "WATER", price: 25 },
        { name: "CHIPS", price: 100 },
      ],
      moneyStorage
    );

    vendingMachine.serviceMode();
    vendingMachine.setStock("WATER", 1);
    vendingMachine.serviceMode();

    moneyStorage.addMoney([25]);
    vendingMachine.selectArticle("WATER");

    expect(moneyStorage.balance).toBe(0);
    expect(vendingMachine.getArticleData("WATER").amount).toBe(0);
  });

  test("add more than exact amount of change for 1 article and buy it", () => {
    const moneyStorage = new MoneyRepository([25, 50, 100]);

    const vendingMachine = new VendingMachine(
      [
        { name: "WATER", price: 25 },
        { name: "CHIPS", price: 100 },
      ],
      moneyStorage
    );

    vendingMachine.serviceMode();
    vendingMachine.setStock("WATER", 1);
    vendingMachine.serviceMode();

    moneyStorage.addMoney([25, 50, 25]);
    vendingMachine.selectArticle("WATER");

    expect(moneyStorage.balance).toBe(75);
    expect(vendingMachine.getArticleData("WATER").amount).toBe(0);
  });

  test("add exact amount of change for 2 articles and buy them", () => {
    const moneyStorage = new MoneyRepository([25, 50, 100]);

    const vendingMachine = new VendingMachine(
      [
        { name: "WATER", price: 25 },
        { name: "CHIPS", price: 100 },
      ],
      moneyStorage
    );

    vendingMachine.serviceMode();
    vendingMachine.setStock("WATER", 1);
    vendingMachine.setStock("CHIPS", 1);
    vendingMachine.serviceMode();

    moneyStorage.addMoney([50, 50, 25]);
    vendingMachine.selectArticle("WATER");
    vendingMachine.selectArticle("CHIPS");

    expect(moneyStorage.balance).toBe(0);
    expect(vendingMachine.getArticleData("WATER").amount).toBe(0);
    expect(vendingMachine.getArticleData("CHIPS").amount).toBe(0);
  });

  test("if stock of an article is gone it should not be able to sell it", () => {
    const moneyStorage = new MoneyRepository([25, 50, 100]);

    const vendingMachine = new VendingMachine(
      [
        { name: "WATER", price: 25 },
        { name: "CHIPS", price: 100 },
      ],
      moneyStorage
    );

    moneyStorage.addMoney([50, 50, 25]);

    const t = () => {
      vendingMachine.selectArticle("WATER");
    };

    expect(t).toThrow();
  });

  test("if not enough money it should not be able to sell it", () => {
    const moneyStorage = new MoneyRepository([25, 50, 100]);

    const vendingMachine = new VendingMachine(
      [
        { name: "WATER", price: 25 },
        { name: "CHIPS", price: 100 },
      ],
      moneyStorage
    );

    moneyStorage.addMoney([50, 25]);

    vendingMachine.serviceMode();
    vendingMachine.setStock("CHIPS", 1);
    vendingMachine.serviceMode();

    const t = () => {
      vendingMachine.selectArticle("CHIPS");
    };

    expect(t).toThrow();
  });

  test("Cant sell unsupported articles", () => {
    const moneyStorage = new MoneyRepository([25, 50, 100]);

    const vendingMachine = new VendingMachine(
      [
        { name: "WATER", price: 25 },
        { name: "CHIPS", price: 100 },
      ],
      moneyStorage
    );

    moneyStorage.addMoney([50, 25]);

    vendingMachine.serviceMode();
    vendingMachine.setStock("CHIPS", 1);
    vendingMachine.serviceMode();

    const t = () => {
      moneyStorage.addMoney([50, 50, 25]);
      vendingMachine.selectArticle("CAR");
    };

    expect(t).toThrow();
  });
});
