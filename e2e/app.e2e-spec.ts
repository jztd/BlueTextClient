import { BlueTextPage } from './app.po';

describe('blue-text App', () => {
  let page: BlueTextPage;

  beforeEach(() => {
    page = new BlueTextPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
