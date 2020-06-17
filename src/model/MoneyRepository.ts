export default class MoneyRepository {
  private existingMoney: Map<number, number>;
  private availableBalance: number;

  public constructor(acceptedValues: number[]) {
    this.existingMoney = new Map<number, number>();
    acceptedValues.forEach((value) => {
      this.existingMoney.set(value, 0);
    });
    this.availableBalance = 0;
  }

  public get balance(): number {
    return this.availableBalance;
  }

  public addMoney(moneyElements: number[]): void {
    if (!moneyElements.every((moneyValue) => this.isAceptedValue(moneyValue)))
      throw new Error("invalid currency format");

    moneyElements.forEach((element) => this.addMoneyValues(element, 1));
    this.availableBalance = moneyElements.reduce(
      (accumulator, currentValue) => {
        return accumulator + currentValue;
      },
      this.availableBalance
    );
  }

  public returnMoney(): number[] {
    const returnMap = this.howToReturn(this.availableBalance);

    const moneyToReturn = [];
    for (const [value, amount] of returnMap) {
      this.removeMoneyValues(value, amount);
      moneyToReturn.push(...Array(amount).fill(value));
    }
    this.finishTransaction();
    return moneyToReturn;
  }

  public finishTransaction(amountToCommit?: number): void {
    this.availableBalance =
      this.availableBalance - (amountToCommit ?? this.availableBalance);
  }

  private isAceptedValue(moneyValue: number): boolean {
    return this.existingMoney.has(moneyValue);
  }

  private listAcceptedValues(): number[] {
    return Array.from(this.existingMoney.keys()).sort((a, b) => {
      return b - a;
    });
  }

  private haveEnoughOf(moneyValue: number, amount: number): boolean {
    const currentAmountOf = this.existingMoney.get(moneyValue) as number;
    return currentAmountOf >= amount;
  }

  private addMoneyValues(value: number, amount: number): void {
    const currentValue = this.existingMoney.get(value) as number;
    this.existingMoney.set(value, currentValue + amount);
  }

  private removeMoneyValues(value: number, amount: number): void {
    const currentValue = this.existingMoney.get(value) as number;
    this.existingMoney.set(value, currentValue - amount);
  }

  private howToReturn(amount: number): Map<number, number> {
    const moneyValues = this.listAcceptedValues();

    let reducedAmount = amount;
    const valuesToReturn = new Map<number, number>();
    for (const value of moneyValues) {
      if (this.haveEnoughOf(value, ~~(reducedAmount / value))) {
        valuesToReturn.set(value, ~~(reducedAmount / value));
        reducedAmount = reducedAmount % value;
      } else {
        const availableAmount = this.existingMoney.get(value) as number;
        valuesToReturn.set(value, availableAmount);
        reducedAmount = reducedAmount - value * availableAmount;
      }
    }
    if (reducedAmount) throw new Error("given amount is not returnable");
    return valuesToReturn;
  }
}
