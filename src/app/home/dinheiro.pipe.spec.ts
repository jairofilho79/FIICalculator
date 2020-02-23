import { DinheiroPipe } from './dinheiro.pipe';

describe('DinheiroPipe', () => {
  it('create an instance', () => {
    const pipe = new DinheiroPipe();
    expect(pipe).toBeTruthy();
  });
});
