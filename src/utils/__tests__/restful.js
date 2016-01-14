jest.dontMock('../restful');
let {
  configRoot,
  configFetch,
  create,
  createSingle,
  Model,
  Collection,
} = require('../restful');

const HEADERS = {
  'Accept': 'application/json',
  'Content-Type': 'application/json',
};

let fetch;
beforeEach(() => {
  fetch = jest.genMockFn().mockImpl(function () {
    return Promise.resolve();
  });
  configFetch(fetch);
  configRoot('');
});

describe('helper function', () => {
  afterEach(() => {
    configRoot('');
  });
  it('`create` should create a collection instance', () => {
    const articles = create('articles');
    expect(articles instanceof Collection);
    expect(articles.url).toBe('/articles');
  });
  it('`createSingle` should create a model instance', () => {
    const article = create('article');
    expect(article instanceof Model);
    expect(article.url).toBe('/article');
  });
  it('`configRoot` should config the root url', () => {
    configRoot('/root');
    const articles = create('articles');
    expect(articles.url).toBe('/root/articles');
  });
});

describe('Collection', () => {
  let articles;
  beforeEach(() => {
    articles = create('articles');
  });
  it('should launch a correct GET request', () => {
    articles.getAll();
    expect(fetch.mock.calls[0][0]).toBe('/articles');
    expect(fetch.mock.calls[0][1].method).toBe('get');
  });
  it('should launch a GET request with query string', () => {
    articles.getAll({
      type: 'economy',
    });
    articles.getAll({
      type: 'economy',
      date: '20160101',
    });
    articles.getAll({});
    expect(fetch.mock.calls[0][0]).toBe('/articles?type=economy');
    expect(fetch.mock.calls[1][0]).toBe('/articles?type=economy&date=20160101');
    expect(fetch.mock.calls[2][0]).toBe('/articles');
  });
  it('should launch a correct POST request', () => {
    const newArticle = {
      title: 'hello', content: 'world',
    };
    articles.post(newArticle);
    expect(fetch.mock.calls[0][0]).toBe('/articles');
    expect(fetch.mock.calls[0][1].method).toBe('post');
    expect(fetch.mock.calls[0][1].body).toBe(JSON.stringify(newArticle));
  });
  it('should return a new Model instance', () => {
    const article = articles.one('1234');
    expect(article.url).toBe('/articles/1234');
  });
});

describe('Model', () => {
  let article;
  beforeEach(() => {
    article = create('articles').one('1234');
  });
  it('should launch a correct GET request', () => {
    article.get();
    expect(fetch.mock.calls[0][0]).toBe('/articles/1234');
    expect(fetch.mock.calls[0][1].method).toBe('get');
  });
  it('should launch a GET request with query string', () => {
    article.get({
      type: 'economy',
    });
    article.get({
      type: 'economy',
      date: '20160101',
    });
    article.get({});
    expect(fetch.mock.calls[0][0]).toBe('/articles/1234?type=economy');
    expect(fetch.mock.calls[1][0]).toBe('/articles/1234?type=economy&date=20160101');
    expect(fetch.mock.calls[2][0]).toBe('/articles/1234');
  });
  it('should launch a correct PUT request', () => {
    const newArticle = {
      title: 'hello', content: 'world',
    };
    article.put(newArticle);
    expect(fetch.mock.calls[0][0]).toBe('/articles/1234');
    expect(fetch.mock.calls[0][1].method).toBe('put');
    expect(fetch.mock.calls[0][1].body).toBe(JSON.stringify(newArticle));
  });
  it('should launch a correct DELETE request', () => {
    article.delete();
    expect(fetch.mock.calls[0][0]).toBe('/articles/1234');
    expect(fetch.mock.calls[0][1].method).toBe('delete');
  });
  it('should create a new Collection instance', () => {
    const workflows = article.create('workflows');
    expect(workflows instanceof Collection).toBeTruthy();
    expect(workflows.url).toBe('/articles/1234/workflows');
  });
  it('should create a new Model instance', () => {
    const workflow = article.createSingle('workflow');
    expect(workflow instanceof Model).toBeTruthy();
    expect(workflow.url).toBe('/articles/1234/workflow');
  });
});
