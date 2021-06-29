import type { IPricesInWax } from "./currencies";

export class APY {
  static getBoundedMpy(apy: APY | undefined, defaultVal = 0.1): number {
    let mpy = apy?.mpy() || defaultVal;
    if (mpy == Infinity) {
      mpy = defaultVal;
    }

    return mpy;
  }

  static toPercentage(value: number): string {
    return `${(value * 100).toFixed(2)} %`;
  }

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
    return APY.toPercentage(this.hpy());
  }

  dpyFormatted(): string {
    return APY.toPercentage(this.dpy());
  }

  wpyFormatted(): string {
    return APY.toPercentage(this.wpy());
  }

  mpyFormatted(): string {
    return APY.toPercentage(this.mpy());
  }

  apyFormatted(): string {
    return APY.toPercentage(this.apy());
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
