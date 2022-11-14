import { Greeter } from '../src/scripts/greeter';

describe('Greeter', (): void => {
  let greeter: Greeter;
  beforeEach((): void => {
    greeter = new Greeter('testing');
  });
  test('greets', (): void => {
    const container = document.createElement('div');
    greeter.start(container);
    expect(Array.from(container.classList)).toContain('greeter');
    expect(container.innerHTML).toEqual('<h1>Welcome to testing!</h1>');
  });
  test('throws without container', (): void => {
    expect(() => greeter.start(null)).toThrowError('no container');
  });
});
