export default interface IPayment {
  balance: number;
  addMoney: (moneyElements: number[]) => void;
  returnMoney: () => number[];
  finishTransaction: (amountToCommit: number | undefined) => void;
}
