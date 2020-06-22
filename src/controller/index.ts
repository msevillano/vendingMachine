import { Request, Response } from 'express';

import MoneyRepository from '../model/MoneyRepository';
import VendingMachine from '../model/VendingMachine';

const moneyStorage = new MoneyRepository([5, 10, 25, 100]);

const vendingMachine = new VendingMachine(
  [
    { name: 'WATER', price: 65 },
    { name: 'JUICE', price: 100 },
    { name: 'SODA', price: 150 }
  ],
  moneyStorage
);

export function reportCurrentBalance(_req: Request, res: Response): void {
  res.send(`${moneyStorage.balance}`);
}

export function addFunds(req: Request, res: Response): void {
  const body = req.body as moneyInput;
  moneyStorage.addMoney(body.values);
  res.send(`${moneyStorage.balance}`);
}

export function returnFunds(_req: Request, res: Response): void {
  res.send();
}

export function buy(req: Request, res: Response): void {
  const body = req.body as buyRequest;
  vendingMachine.selectArticle(body.article);
  res.send({ article: body.article, funds: moneyStorage.returnMoney() });
}

export function toggleServiceMode(_req: Request, res: Response): void {
  vendingMachine.serviceMode();
  res.send();
}

export function fillMachine(req: Request, res: Response): void {
  const body = req.body as fillRequest;
  body.articles.forEach((article) => vendingMachine.setStock(article[0], article[1]));
  body.values.forEach((value) => moneyStorage.setMoney(value[0], value[1]));
  res.send();
}

interface moneyInput {
  values: number[];
}

interface buyRequest {
  article: string;
}

interface fillRequest {
  articles: [string, number][];
  values: [number, number][];
}
