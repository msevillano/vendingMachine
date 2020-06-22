import CodedError from '../utils/CodedError';

import IPayment from '../interface/IPayment';
import IState from '../interface/IState';

export default class VendingMachine implements IState {
  private collection: Map<string, ArticleData>;
  private paymentSystem: IPayment;
  private state: boolean;

  public constructor(supportedArticles: Article[], paymentSystem: IPayment) {
    this.collection = new Map<string, ArticleData>();
    supportedArticles.forEach((article) => this.collection.set(article.name, { price: article.price, amount: 0 }));
    this.paymentSystem = paymentSystem;
    this.state = false;
  }

  public serviceMode(): void {
    this.state = !this.state;
  }

  public get isOnService(): boolean {
    return this.state;
  }

  public setStock(articleName: string, amount: number): void {
    if (!this.isOnService) throw new CodedError('Service mode is required for this operation', 403);
    if (!this.collection.has(articleName)) throw new CodedError('This article is not supported', 400);
    const currentArticleStatus = this.getArticleData(articleName);
    this.collection.set(articleName, {
      price: currentArticleStatus.price,
      amount: amount
    });
  }

  public selectArticle(articleName: string): void {
    if (this.isOnService) throw new CodedError('Cant sell articles while on service', 400);
    if (!this.collection.has(articleName)) throw new CodedError('This article is not supported', 400);

    const articleData = this.getArticleData(articleName);
    if (!articleData.amount) throw new CodedError('This article is out of stock', 400);

    if (articleData.price > this.paymentSystem.balance)
      throw new CodedError('Insufficient balance to perform transaction', 400);

    this.paymentSystem.finishTransaction(articleData.price);
    this.collection.set(articleName, {
      price: articleData.price,
      amount: articleData.amount - 1
    });
  }

  public getArticleData(articleName: string): ArticleData {
    const currentArticleStatus = this.collection.get(articleName) ?? {
      price: 0,
      amount: 0
    };
    return currentArticleStatus;
  }
}

type ArticleData = {
  price: number;
  amount: number;
};

type Article = {
  name: string;
  price: number;
};
