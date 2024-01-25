import { randNumber, seed } from '@ngneat/falso';

interface Limits {
  min: number;
  max: number;
  precision?: number;
}

/**
 * Defines a base class for generating mock data.
 *
 * To generate "real-looking" mock data please use `@ngneat/falso`
 *
 * https://ngneat.github.io/falso/docs/getting-started
 */
export abstract class FakeObjectFactory<T extends object, P extends object | undefined = undefined> {
  constructor(
    /** The seed string that serves as the base for random value generation */
    protected readonly seedBase: string,
    /** The callback that returns the base mock object. */
    private readonly baseFn: (id: string, additionalConfig?: P) => T
  ) {}

  private seedString = this.seedBase;

  get(id: string | number, partial?: Partial<T>, additionalConfig?: P): T {
    id = `${id}`;

    this.setSeed(id);

    return {
      ...this.baseFn(id, additionalConfig),
      ...(partial || {}),
    };
  }

  getRandomNumber(id: string | number, opt: Limits): number {
    this.setSeed(`${id}`);
    return randNumber(opt);
  }

  getRandomAvatar(id: string | number, size = 100): string {
    this.setSeed(`${id}`);
    return `https://i.pravatar.cc/${size}?u=${this.getSeed()}`;
  }

  protected setSeed(seedString: string): void {
    this.seedString = seedString;
    seed(this.getSeed());
  }

  protected getSeed() {
    return `${this.seedBase}_${this.seedString}`;
  }

  protected getArrayOfLength(length: number): undefined[] {
    return Array.from(new Array(length));
  }
}
