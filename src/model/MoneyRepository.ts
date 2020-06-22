import CodedError from '../utils/CodedError';

import IPayment from '../interface/IPayment';
import IState from '../interface/IState';

export default class MoneyRepository implements IPayment {
  private existingMoney: Map<number, number>;
  private availableBalance: number;
  private _stateProvider?: IState;

  public constructor(acceptedValues: number[]) {
    this.existingMoney = new Map<number, number>();
    acceptedValues.forEach((value) => {
      this.existingMoney.set(value, 0);
    });
    this.availableBalance = 0;
  }

  public set stateProvider(stateProvider: IState) {
    this._stateProvider = stateProvider;
  }

  public get balance(): number {
    return this.availableBalance;
  }

  public addMoney(moneyElements: number[]): void {
    if (!moneyElements.every((moneyValue) => this.isAceptedValue(moneyValue)))
      throw new CodedError('Invalid currency format', 400);

    moneyElements.forEach((element) => this.addMoneyValues(element, 1));
    this.availableBalance = moneyElements.reduce((accumulator, currentValue) => {
      return accumulator + currentValue;
    }, this.availableBalance);
  }

  public setMoney(moneyElement: number, amount: number): void {
    if (this._stateProvider && !this._stateProvider.isOnService)
      throw new CodedError('Service mode is required for this operation', 403);
    if (!this.isAceptedValue(moneyElement)) throw new CodedError('Invalid currency format', 400);

    this.setMoneyValues(moneyElement, amount);
  }

  public returnMoney(): number[] {
    const returnMap = this.howToReturn(this.availableBalance);

    const moneyToReturn: number[] = [];
    for (const [value, amount] of returnMap) {
      this.removeMoneyValues(value, amount);
      moneyToReturn.push(...Array(amount).fill(value));
    }
    this.finishTransaction();
    return moneyToReturn;
  }

  public finishTransaction(amountToCommit?: number): void {
    this.availableBalance = this.availableBalance - (amountToCommit ?? this.availableBalance);
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

  private setMoneyValues(value: number, amount: number): void {
    this.existingMoney.set(value, amount);
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
    if (reducedAmount) throw new CodedError('given amount is not returnable', 500);
    return valuesToReturn;
  }
}
