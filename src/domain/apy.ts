import type { IPricesInWax } from "./currencies";

export class APY {
  /**
   * hourly percentage yield in dollars
   */
  private _hpy: number = 0;

  constructor(hpy: number) {
    this._hpy = hpy;
  }

  hpy(): number {
    return this._hpy;
  }

  dpy(): number {
    return this.hpy() * 24;
  }

  wpy(): number {
    return this.hpy() * 24 * 7;
  }

  mpy(): number {
    return this.hpy() * 24 * 30;
  }

  apy(): number {
    return this.hpy() * 24 * 365;
  }

  hpyFormatted(): string {
    return `${(this.hpy() * 100).toFixed(2)} %`;
  }

  dpyFormatted(): string {
    return `${(this.dpy() * 100).toFixed(2)} %`;
  }

  wpyFormatted(): string {
    return `${(this.wpy() * 100).toFixed(2)} %`;
  }

  mpyFormatted(): string {
    return `${(this.mpy() * 100).toFixed(2)} %`;
  }

  apyFormatted(): string {
    return `${(this.apy() * 100).toFixed(2)} %`;
  }
}

/**
 * calculate hourly percentage yield in usd dollars
 * of a given asset that yields x wax per Aether per Hour
 */
export function getAPY(
  waxPerAH: number,
  waxInUsd: number,
  prices: IPricesInWax
): APY {
  const aethInWax = prices.AETHER;
  const aethInUsd = aethInWax * waxInUsd;

  // this gives how many dollars you need to invest
  // in order to get 1 dollar of yield per hour, we are
  // interested in the inverse
  const inverseHpy = (waxPerAH * waxInUsd) / aethInUsd;

  const hpy = 1 / inverseHpy;
  return new APY(hpy);
}
