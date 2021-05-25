import type { IPricesInWax } from "../store";
import * as Price from "./Price";

export interface CalculatedBalance {
  currency: string;
  amount: number;
  waxAmount: number;
  usdAmount: number;
}

export function calcBalances(
  balances: Array<string>
): Array<CalculatedBalance> {
  return balances.map((balance) => {
    const split = balance.split(" ");
    return {
      currency: split[1],
      amount: Number.parseFloat(split[0]),
      waxAmount: 0,
      usdAmount: 0,
    };
  });
}

export function calcPrices(
  balances: Array<CalculatedBalance>,
  prices: IPricesInWax,
  waxPrice: number
): Array<CalculatedBalance> {
  return balances.map((blc) => {
    const price = Price.getPrice(prices, blc.currency);
    const waxAmount = blc.amount * price;
    const usdAmount = waxAmount * waxPrice;

    return {
      ...blc,
      waxAmount,
      usdAmount,
    };
  });
}

export function getTotals(balances: Array<CalculatedBalance>): {
  wax: number;
  usd: number;
} {
  let totalWax = 0;
  let totalUsd = 0;
  balances.forEach(({ waxAmount, usdAmount }) => {
    totalWax += waxAmount;
    totalUsd += usdAmount;
  });

  return { wax: totalWax, usd: totalUsd };
}
