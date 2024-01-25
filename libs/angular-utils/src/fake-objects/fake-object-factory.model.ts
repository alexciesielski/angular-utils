import { FakeObjectFactory } from './fake-object-factory';

export interface BaseModel {
  id: string;
}

export class BaseFakeObjectFactory extends FakeObjectFactory<BaseModel> {
  constructor() {
    super('base', (id) => ({
      id,
    }));
  }
}
