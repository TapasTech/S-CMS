jest.dontMock('../restful');
let Restful = require('../restful').Restful;
const HEADERS = {
  'Accept': 'application/json',
  'Content-Type': 'application/json',
};
Restful.configRoot('');

describe('normal restful', () => {
  let articles, fetch;
  beforeEach(() => {
    fetch = jest.genMockFn().mockImpl(function () {
      return Promise.resolve();
    });
    articles = Restful.create('articles', fetch);
  });

  function createModel(...args) {
    return function () {
      Restful.create(...args);
    };
  }

  describe('static function', () => {
    it('should create an instance of itself by `create` function', () => {
      expect(articles instanceof Restful).toBeTruthy();
    });
    it('should throw an error if arguments are invalid', () => {
      const errorMessage = 'invalid resource name when creating an instance of restful model';
      expect(createModel(undefined, fetch)).toThrow(errorMessage);
      expect(createModel('', fetch)).toThrow(errorMessage);
      expect(createModel('a/b', fetch)).toThrow(errorMessage);
    });
    it('should throw an error if 2nd argument are not function', () => {
      const errorMessage = 'invalid fetch function';
      expect(createModel('hello', '')).toThrow(errorMessage);
      expect(createModel('hello', {})).toThrow(errorMessage);
      expect(createModel('hello', function () {})).not.toThrow();
    });
    it('should set `this.url`', () => {
      expect(articles.url).toBe('/articles');
    });
    it('should set type as `normal`', () => {
      expect(articles.type).toBe('normal');
    });
  });
  describe('basic api', () => {
    describe('one', () => {
      it('should set `this.id`', () => {
        articles.one('1234');
        expect(articles.id).toBe('1234');
      });
    });
    describe('query', () => {
      it('should launch a request', () => {
        articles.query('/hello');
        expect(fetch.mock.calls[0][0]).toBe('/hello');
        expect(fetch.mock.calls[0][1].headers).toEqual(HEADERS);
      });
      it('should set id to null after executed', () => {
        articles.one('1234');
        expect(articles.id).toBe('1234');
        articles.query('/world');
        expect(articles.id).toBeNull();
      });
    });
    describe('mutation', () => {
      it('should be able to launch a post request', () => {
        const data = {data: 'world'}
        articles.mutate('post', '/hello', data);
        expect(fetch.mock.calls[0][0]).toBe('/hello');
        const {method, headers, body} = fetch.mock.calls[0][1];
        expect(method).toBe('post');
        expect(headers).toEqual(HEADERS);
        expect(body).toBe(JSON.stringify(data));
      });
      it('should be able to launch a put request', () => {
        articles.mutate('put', '/tom', {});
        expect(fetch.mock.calls[0][1].method).toBe('put');
      });
      it('should set id to null after executed', () => {
        articles.one('1234');
        expect(articles.id).toBe('1234');
        articles.mutate('/world');
        expect(articles.id).toBeNull();
      });
    });
  });
  describe('common api', () => {
    describe('getAll', () => {
      it('should be able to request a collection', () => {
        articles.getAll();
        expect(fetch.mock.calls[0][0]).toBe('/articles');
      });
    });
    describe('CRUD', () => {
      it('should be able to launch a get|post|put|delete request', () => {
        articles.one('1').get();
        articles.post();
        articles.one('3').put();
        articles.one('4').delete();
        expect(fetch.mock.calls[0][0]).toBe('/articles/1');
        expect(fetch.mock.calls[1][0]).toBe('/articles');
        expect(fetch.mock.calls[2][0]).toBe('/articles/3');
        expect(fetch.mock.calls[3][0]).toBe('/articles/4');
        expect(fetch.mock.calls[0][1].method).toBeUndefined();
        expect(fetch.mock.calls[1][1].method).toBe('post');
        expect(fetch.mock.calls[2][1].method).toBe('put');
        expect(fetch.mock.calls[3][1].method).toBe('delete');
      });
      it('should omit id when getting, putting, deleting without an id', () => {
        articles.get();
        articles.put();
        articles.delete();
        expect(fetch.mock.calls[0][0]).toBe('/articles');
        expect(fetch.mock.calls[1][0]).toBe('/articles');
        expect(fetch.mock.calls[2][0]).toBe('/articles');
        expect(fetch.mock.calls[0][1].method).toBeUndefined();
        expect(fetch.mock.calls[1][1].method).toBe('put');
        expect(fetch.mock.calls[2][1].method).toBe('delete');
      });
      describe('get', () => {
        it('should be able to receive params', () => {
          articles.one('1').get({
            type: 'economy',
          });
          articles.one('2').get({
            type: 'economy',
            date: '20160101',
          });
          articles.one('3').get({});
          expect(fetch.mock.calls[0][0]).toBe('/articles/1?type=economy');
          expect(fetch.mock.calls[1][0]).toBe('/articles/2?type=economy&date=20160101');
          expect(fetch.mock.calls[2][0]).toBe('/articles/3');
        });
      });
      describe('put and post', () => {
        it('should be able to post data', () => {
          const data1 = {hello: 'world'};
          const data2 = {tom: 'jerry'};
          articles.one('1').post(data1);
          articles.one('2').put(data2);
          expect(fetch.mock.calls[0][1].body).toBe(JSON.stringify(data1));
          expect(fetch.mock.calls[1][1].body).toBe(JSON.stringify(data2));
        });
      });
    });
  });
  describe('child model', () => {
    it('should throw an error when creating a child model without executing `one` method', () => {
      const errorMessage = 'should execute `one` method before creating a child model from a normal-type restful instance';
      expect(function () {articles.create('notes')}).toThrow(errorMessage);
      expect(function () {articles.createSingle('note')}).toThrow(errorMessage);
    });
    it('should create child model', () => {
      const note = articles.one('1234').create('notes');
      expect(note.url).toBe('/articles/1234/notes');
      expect(note instanceof Restful).toBeTruthy();
    });
    it('should create a single child model', () => {
      const note = articles.one('1234').createSingle('note');
      expect(note.url).toBe('/articles/1234/note');
      expect(note instanceof Restful).toBeTruthy();
    });
  });
});

describe('single restful', () => {
  let article, fetch;
  beforeEach(() => {
    fetch = jest.genMockFn().mockImpl(function () {
      return Promise.resolve();
    });
    article = Restful.createSingle('article', fetch);
  });

  describe('createSingle', () => {
    it('should create a single restful instance', () => {
      expect(article instanceof Restful).toBeTruthy();
    });
    it('should set `this.url`', () => {
      expect(article.url).toBe('/article');
    });
    it('should set type as `normal`', () => {
      expect(article.type).toBe('single');
    });
    it('should throw when executing `one` method on prototype', () => {
      const execOne = function () {
        article.one('1234');
      };
      const errorMessage = 'this method is not avaliable to single type restful instance';
      expect(execOne).toThrow(errorMessage);
    });
  });

  describe('child model', () => {
    it('should create normal child model', () => {
      let editor = article.create('editors', fetch);
      editor.one('1234').get();
      expect(fetch.mock.calls[0][0]).toBe('/article/editors/1234');
    });
    it('should create single child model', () => {
      let editor = article.createSingle('editor', fetch);
      editor.get();
      expect(fetch.mock.calls[0][0]).toBe('/article/editor');
    });
  });
});
