jest.dontMock('../restful');
let Restful = require('../restful').Restful;
const HEADERS = {
  'Accept': 'application/json',
  'Content-Type': 'application/json',
};

describe('nromal restful', () => {
  let article, fetch;
  beforeEach(() => {
    fetch = jest.genMockFn().mockImpl(function () {
      return Promise.resolve();
    });
    article = Restful.create('article', fetch);
  });

  describe('static function', () => {
    it('should create an instance of itself by `create` function', () => {
      expect(article instanceof Restful).toBeTruthy();
    });
  });
  describe('constructor', () => {
    it('should throw an error if no arguments', () => {
      let hello = function () {
        Restful.create(undefined, fetch);
      };
      expect(hello).toThrow('undefined url argument when creating an instance of restful model');
    });
    it('should set `this.url`', () => {
      expect(article.url).toBe('articles');
    });
    it('should set type as `normal`', () => {
      expect(article.type).toBe('normal');
    });
  });
  describe('basic api', () => {
    describe('one', () => {
      it('should set `this.id`', () => {
        article.one('1234');
        expect(article.id).toBe('1234');
      });
    });
    describe('query', () => {
      it('should launch a request', () => {
        article.query('hello');
        expect(fetch.mock.calls[0][0]).toBe('/backend/hello');
        expect(fetch.mock.calls[0][1].headers).toEqual(HEADERS);
      });
      it('should set id to null after executed', () => {
        article.one('1234');
        expect(article.id).toBe('1234');
        article.query('/world');
        expect(article.id).toBeNull();
      });
    });
    describe('mutation', () => {
      it('should be able to launch a post request', () => {
        const data = {data: 'world'}
        article.mutate('post', 'hello', data);
        expect(fetch.mock.calls[0][0]).toBe('/backend/hello');
        const {method, headers, body} = fetch.mock.calls[0][1];
        expect(method).toBe('post');
        expect(headers).toEqual(HEADERS);
        expect(body).toBe(JSON.stringify(data));
      });
      it('should be able to launch a put request', () => {
        article.mutate('put', '/tom', {});
        expect(fetch.mock.calls[0][1].method).toBe('put');
      });
      it('should set id to null after executed', () => {
        article.one('1234');
        expect(article.id).toBe('1234');
        article.mutate('/world');
        expect(article.id).toBeNull();
      });
    });
  });
  describe('common api', () => {
    describe('getAll', () => {
      it('should be able to request a collection', () => {
        article.getAll();
        expect(fetch.mock.calls[0][0]).toBe('/backend/articles');
      });
    });
    describe('CRUD', () => {
      it('should be able to launch a get|post|put|delete request', () => {
        article.one('1').get();
        article.post();
        article.one('3').put();
        article.one('4').delete();
        expect(fetch.mock.calls[0][0]).toBe('/backend/articles/1');
        expect(fetch.mock.calls[1][0]).toBe('/backend/articles');
        expect(fetch.mock.calls[2][0]).toBe('/backend/articles/3');
        expect(fetch.mock.calls[3][0]).toBe('/backend/articles/4');
        expect(fetch.mock.calls[0][1].method).toBeUndefined();
        expect(fetch.mock.calls[1][1].method).toBe('post');
        expect(fetch.mock.calls[2][1].method).toBe('put');
        expect(fetch.mock.calls[3][1].method).toBe('delete');
      });
      it('should omit id when getting, putting, deleting without an id', () => {
        article.get();
        article.put();
        article.delete();
        expect(fetch.mock.calls[0][0]).toBe('/backend/articles');
        expect(fetch.mock.calls[1][0]).toBe('/backend/articles');
        expect(fetch.mock.calls[2][0]).toBe('/backend/articles');
        expect(fetch.mock.calls[0][1].method).toBeUndefined();
        expect(fetch.mock.calls[1][1].method).toBe('put');
        expect(fetch.mock.calls[2][1].method).toBe('delete');
      });
      describe('get', () => {
        it('should be able to receive params', () => {
          article.one('1').get({
            type: 'economy',
          });
          article.one('2').get({
            type: 'economy',
            date: '20160101',
          });
          article.one('3').get({});
          expect(fetch.mock.calls[0][0]).toBe('/backend/articles/1?type=economy');
          expect(fetch.mock.calls[1][0]).toBe('/backend/articles/2?type=economy&date=20160101');
          expect(fetch.mock.calls[2][0]).toBe('/backend/articles/3');
        });
      });
      describe('put and post', () => {
        it('should be able to post data', () => {
          const data1 = {hello: 'world'};
          const data2 = {tom: 'jerry'};
          article.one('1').post(data1);
          article.one('2').put(data2);
          expect(fetch.mock.calls[0][1].body).toBe(JSON.stringify(data1));
          expect(fetch.mock.calls[1][1].body).toBe(JSON.stringify(data2));
        });
      });
    });
  });
  describe('child model', () => {
    it('should create child model', () => {
      const note = article.create('1234', 'note');
      expect(note.url).toBe('articles/1234/notes');
      expect(note instanceof Restful).toBeTruthy();
    });
    it('should create a single child model', () => {
      const note = article.createSingle('1234', 'note');
      expect(note.url).toBe('articles/1234/note');
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
      expect(article.url).toBe('article');
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
      let editor = article.create('editor', fetch);
      editor.one('1234').get();
      expect(fetch.mock.calls[0][0]).toBe('/backend/article/editors/1234');
    });
    it('should create single child model', () => {
      let editor = article.createSingle('editor', fetch);
      editor.get();
      expect(fetch.mock.calls[0][0]).toBe('/backend/article/editor');
    });
  });
});
