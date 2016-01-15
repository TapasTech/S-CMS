jest.dontMock('../restful');
let {
  config,
  collection,
  fetch,
  handleQueryString,
  camelCase2SnakeCase,
  Model,
  Collection,
  Resource,
  CRUD,
} = require('../restful');

const HEADERS = {
  'Accept': 'application/json',
  'Content-Type': 'application/json',
};

let fetchMock;
beforeEach(() => {
  fetchMock = jest.genMockFn().mockImpl(function () {
    return Promise.resolve();
  });
  config({
    fetch: fetchMock,
    root: '',
  });
});

describe('config', () => {
  afterEach(() => {
    config({root: '', headers: HEADERS});
  });
  it('`config` should config the root url', () => {
    config({root: '/root'});
    const articles = collection('articles');
    expect(articles.url).toBe('/root/articles');
  });
  it('`config should config the headers`', () => {
    const articles = collection('articles');
    articles.get();
    const headers = {Auth: '12345678'};
    config({headers});
    articles.get();
    expect(fetchMock.mock.calls[0][1].headers).toEqual(HEADERS);
    expect(fetchMock.mock.calls[1][1].headers).toEqual(headers);
  });
});

describe('helper function', () => {
  it('`collection` should create a Resource instance', () => {
    const articles = collection('articles');
    expect(articles instanceof Collection).toBeTruthy();
    expect(articles.url).toBe('/articles');
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
    const articles = {
      title: 'tom',
      articleAuthor: {
        authorName: 'jerry',
        authorCountry: 'America'
      }
    };
    expect(camelCase2SnakeCase(articles)).toEqual({
      title: 'tom',
      article_author: {
        author_name: 'jerry',
        author_country: 'America'
      }
    });
  });
  describe('CRUD', () => {
    const {get, post, put, del} = CRUD;
    describe('get|delete', () => {
      it('should launch a get|delete request', () => {
        get('/user');
        del('/user');
        expect(fetchMock.mock.calls[0][0]).toBe('/user');
        expect(fetchMock.mock.calls[0][1].method).toBe('get');
        expect(fetchMock.mock.calls[1][0]).toBe('/user');
        expect(fetchMock.mock.calls[1][1].method).toBe('delete');
      });
      it('should apply `handleQueryString` before launching a request', () => {
        get('/articles', {type: 'economy'});
        expect(fetchMock.mock.calls[0][0]).toBe('/articles?type=economy');
      });
    });
    describe('post|put', () => {
      it('should launch a post|put request', () => {
        const data = {name: 'test@test.com', password: '123456'};
        post('/user', data);
        put('/user', data);
        expect(fetchMock.mock.calls[0][0]).toBe('/user');
        expect(fetchMock.mock.calls[0][1].method).toBe('post');
        expect(fetchMock.mock.calls[0][1].body).toBe(JSON.stringify(data));
        expect(fetchMock.mock.calls[1][0]).toBe('/user');
        expect(fetchMock.mock.calls[1][1].method).toBe('put');
        expect(fetchMock.mock.calls[1][1].body).toBe(JSON.stringify(data));
      });
      it('should apply `camelCase2SnakeCase` before launching a post|put orequest', () => {
        const camelCasedArticle = {articleTitle: 'hello', articleContent: 'world'};
        const snakeCasedArticle = {article_title: 'hello', article_content: 'world'};
        post('/user', camelCasedArticle);
        put('/user', camelCasedArticle);
        expect(fetchMock.mock.calls[0][1].body).toBe(JSON.stringify(snakeCasedArticle));
        expect(fetchMock.mock.calls[1][1].body).toBe(JSON.stringify(snakeCasedArticle));
      });
    });
  });
});

describe('Collection', () => {
  let articles;
  beforeEach(() => {
    articles = collection('articles');
  });
  it('should create an instance with `url` static attribute', () => {
    expect(articles.url).toBe('/articles');
  });
  it('should contain get and post method', () => {
    const newArticle = {title: 'hello', content: 'world'};
    articles.get();
    articles.post(newArticle);
    expect(fetchMock.mock.calls[0][0]).toBe('/articles');
    expect(fetchMock.mock.calls[0][1].method).toBe('get');
    expect(fetchMock.mock.calls[1][0]).toBe('/articles');
    expect(fetchMock.mock.calls[1][1].method).toBe('post');
    expect(fetchMock.mock.calls[1][1].body).toBe(JSON.stringify(newArticle));
  });
  it('should be able to create an instance of Model', () => {
    const article = articles.model('1234');
    expect(article instanceof Model).toBeTruthy();
    expect(article.url).toBe('/articles/1234');
  });
});

describe('Model', () => {
  let article;
  beforeEach(() => {
    article = collection('articles').model('1234');
  });
  it('should create an instance with `url` static attribute', () => {
    expect(article.url).toBe('/articles/1234');
  });
  it('should contain get and post method', () => {
    const newArticle = {title: 'hello', content: 'monica'};
    article.get();
    article.put(newArticle);
    article.delete();
    expect(fetchMock.mock.calls[0][0]).toBe('/articles/1234');
    expect(fetchMock.mock.calls[0][1].method).toBe('get');
    expect(fetchMock.mock.calls[1][0]).toBe('/articles/1234');
    expect(fetchMock.mock.calls[1][1].method).toBe('put');
    expect(fetchMock.mock.calls[1][1].body).toBe(JSON.stringify(newArticle));
    expect(fetchMock.mock.calls[2][0]).toBe('/articles/1234');
    expect(fetchMock.mock.calls[2][1].method).toBe('delete');
  });
  it('should be able to create an instance of Collection', () => {
    const workflows = article.collection('workflows');
    expect(workflows instanceof Collection).toBeTruthy();
    expect(workflows.url).toBe('/articles/1234/workflows');
  });
});

describe('Resource', () => {
  let resource;
  beforeEach(() => {
    resource = fetch('user/_invite');
  });
  it('should create an instance with `url` static attribute', () => {
    expect(resource.url).toBe('/user/_invite');
  });
  it('should contain get|post|put|delete method', () => {
    const newArticle = {title: 'hello', content: 'monica'};
    resource.get();
    resource.post(newArticle);
    resource.put(newArticle);
    resource.delete();
    expect(fetchMock.mock.calls[0][0]).toBe('/user/_invite');
    expect(fetchMock.mock.calls[1][0]).toBe('/user/_invite');
    expect(fetchMock.mock.calls[2][0]).toBe('/user/_invite');
    expect(fetchMock.mock.calls[3][0]).toBe('/user/_invite');
    expect(fetchMock.mock.calls[0][1].method).toBe('get');
    expect(fetchMock.mock.calls[1][1].method).toBe('post');
    expect(fetchMock.mock.calls[1][1].body).toBe(JSON.stringify(newArticle));
    expect(fetchMock.mock.calls[2][1].method).toBe('put');
    expect(fetchMock.mock.calls[2][1].body).toBe(JSON.stringify(newArticle));
    expect(fetchMock.mock.calls[3][1].method).toBe('delete');
  });
});
