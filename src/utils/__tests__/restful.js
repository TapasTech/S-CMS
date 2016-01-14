jest.dontMock('../restful');
let {
  configRoot,
  configFetch,
  collection,
  model,
  Model,
  Collection,
  camelCase2SnakeCase,
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
  it('`collection` should create a collection instance', () => {
    const articles = collection('articles');
    expect(articles instanceof Collection).toBeTruthy();
    expect(articles.url).toBe('/articles');
  });
  it('`model` should create a model instance', () => {
    const article = model('article');
    expect(article instanceof Model).toBeTruthy();
    expect(article.url).toBe('/article');
  });
  it('`configRoot` should config the root url', () => {
    configRoot('/root');
    const articles = collection('articles');
    expect(articles.url).toBe('/root/articles');
  });
  it('`camelCase2SnakeCase` should make effects', () => {
    const todo = {
      todoTitle: 'hello',
      todoContent: 'world',
    };
    expect(camelCase2SnakeCase(todo)).toEqual({
      todo_title: 'hello',
      todo_content: 'world'
    });
    const article = {
      title: 'tom',
      articleAuthor: {
        authorName: 'jerry',
        authorCountry: 'America'
      }
    };
    expect(camelCase2SnakeCase(article)).toEqual({
      title: 'tom',
      article_author: {
        author_name: 'jerry',
        author_country: 'America'
      }
    });
  });
});

describe('Collection', () => {
  let articles;
  beforeEach(() => {
    articles = collection('articles');
  });
  it('should launch a correct GET request', () => {
    articles.get();
    expect(fetch.mock.calls[0][0]).toBe('/articles');
    expect(fetch.mock.calls[0][1].method).toBe('get');
  });
  it('should launch a GET request with query string', () => {
    articles.get({
      type: 'economy',
    });
    articles.get({
      type: 'economy',
      date: '20160101',
    });
    articles.get({});
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
  it('should apply `camelCase2SnakeCase` when posting data', () => {
    const newArticle = {articleTitle: 'hello', articleContent: 'world'};
    articles.post(newArticle);
    expect(fetch.mock.calls[0][1].body).toBe(JSON.stringify({
      article_title: 'hello', article_content: 'world'
    }));
  });
  it('should return a new Model instance', () => {
    const article = articles.model('1234');
    expect(article instanceof Model).toBeTruthy();
    expect(article.url).toBe('/articles/1234');
  });
  it('should create a new Collection instance', () => {
    const workflows = articles.collection('workflows');
    expect(workflows instanceof Collection).toBeTruthy();
    expect(workflows.url).toBe('/articles/workflows');
  })
});

describe('Model', () => {
  let article;
  beforeEach(() => {
    article = collection('articles').model('1234');
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
  it('should apply `camelCase2SnakeCase` when putting data', () => {
    const newArticle = {articleTitle: 'hello', articleContent: 'world'};
    article.put(newArticle);
    expect(fetch.mock.calls[0][1].body).toBe(JSON.stringify({
      article_title: 'hello', article_content: 'world'
    }));
  });
  it('should launch a correct DELETE request', () => {
    article.delete();
    expect(fetch.mock.calls[0][0]).toBe('/articles/1234');
    expect(fetch.mock.calls[0][1].method).toBe('delete');
  });
  it('should create a new Collection instance', () => {
    const workflows = article.collection('workflows');
    expect(workflows instanceof Collection).toBeTruthy();
    expect(workflows.url).toBe('/articles/1234/workflows');
  });
  it('should create a new Model instance', () => {
    const workflow = article.model('workflow');
    expect(workflow instanceof Model).toBeTruthy();
    expect(workflow.url).toBe('/articles/1234/workflow');
  });
});
