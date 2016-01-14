jest.dontMock('../restful');
let {
  configRoot,
  configFetch,
  collection,
  single,
  Model,
  Collection,
  Single,
  handleQueryString,
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
  it('`single` should create a single instance', () => {
    const article = single('article');
    expect(article instanceof Single).toBeTruthy();
    expect(article.url).toBe('/article');
  });
  it('`configRoot` should config the root url', () => {
    configRoot('/root');
    const articles = collection('articles');
    expect(articles.url).toBe('/root/articles');
  });
  it('`handleQueryString` should make effects', () => {
    const qs1 = {
      type: 'economy',
    };
    const qs2 = {
      type: 'economy',
      date: '20160101',
    };
    const qs3 = {};
    expect(handleQueryString(qs1)).toBe('?type=economy');
    expect(handleQueryString(qs2)).toBe('?type=economy&date=20160101');
    expect(handleQueryString(qs3)).toBe('');
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
    articles.get({type: 'economy'});
    expect(fetch.mock.calls[0][0]).toBe('/articles?type=economy');
  });
  it('should launch a correct POST request', () => {
    const newArticle = {title: 'hello', content: 'world'};
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
  it('should not be able to launch a PUT or DELETE request', () => {
    expect(articles.put).toBeUndefined();
    expect(articles.delete).toBeUndefined();
  });
  it('should create a new Single instance', () => {
    const workflow = articles.single('workflow');
    expect(workflow instanceof Single).toBeTruthy();
    expect(workflow.url).toBe('/articles/workflow');
  });
  it('should return a new Model instance', () => {
    const article = articles.model('1234');
    expect(article instanceof Model).toBeTruthy();
    expect(article.url).toBe('/articles/1234');
  });
  it('should be uncapable to create a Collection instance', () => {
    expect(articles.collection).toBeUndefined();
  });
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
    article.get({type: 'economy'});
    expect(fetch.mock.calls[0][0]).toBe('/articles/1234?type=economy');
  });
  it('should launch a correct PUT request', () => {
    const newArticle = {title: 'hello', content: 'world'};
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
  it('should not be able to launch a POST request', () => {
    expect(article.post).toBeUndefined();
  });
  it('should create a new Collection instance', () => {
    const workflows = article.collection('workflows');
    expect(workflows instanceof Collection).toBeTruthy();
    expect(workflows.url).toBe('/articles/1234/workflows');
  });
  it('should create a new Single instance', () => {
    const workflow = article.single('workflow');
    expect(workflow instanceof Single).toBeTruthy();
    expect(workflow.url).toBe('/articles/1234/workflow');
  });
  it('should be uncapable to create a Model instance', () => {
    expect(article.model).toBeUndefined();
  });
});

describe('Single', () => {
  let article;
  beforeEach(() => {
    article = single('article');
  });
  it('should launch a correct GET request', () => {
    article.get();
    expect(fetch.mock.calls[0][0]).toBe('/article');
    expect(fetch.mock.calls[0][1].method).toBe('get');
  });
  it('should launch a GET request with query string', () => {
    article.get({type: 'economy'});
    expect(fetch.mock.calls[0][0]).toBe('/article?type=economy');
  });
  it('should launch a correct POST request', () => {
    const newArticle = {title: 'hello', content: 'world'};
    article.post(newArticle);
    expect(fetch.mock.calls[0][0]).toBe('/article');
    expect(fetch.mock.calls[0][1].method).toBe('post');
    expect(fetch.mock.calls[0][1].body).toBe(JSON.stringify(newArticle));
  });
  it('should apply `camelCase2SnakeCase` when posting data', () => {
    const newArticle = {articleTitle: 'hello', articleContent: 'world'};
    article.post(newArticle);
    expect(fetch.mock.calls[0][1].body).toBe(JSON.stringify({
      article_title: 'hello', article_content: 'world'
    }));
  });
  it('should launch a correct PUT request', () => {
    const newArticle = {title: 'hello', content: 'world'};
    article.put(newArticle);
    expect(fetch.mock.calls[0][0]).toBe('/article');
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
    expect(fetch.mock.calls[0][0]).toBe('/article');
    expect(fetch.mock.calls[0][1].method).toBe('delete');
  });
  it('should create a new Collection instance', () => {
    const workflows = article.collection('workflows');
    expect(workflows instanceof Collection).toBeTruthy();
    expect(workflows.url).toBe('/article/workflows');
  });
  it('should create a new Single instance', () => {
    const workflow = article.single('workflow');
    expect(workflow instanceof Single).toBeTruthy();
    expect(workflow.url).toBe('/article/workflow');
  });
  it('should be uncapable to create a Model instance', () => {
    expect(article.model).toBeUndefined();
  });
});
