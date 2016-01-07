jest.dontMock('../restful');
let restful = require('../restful').default;
const HEADERS = {
 'Accept': 'application/json',
 'Content-Type': 'application/json',
};

describe('Restful Service', () => {
  let article, fetch;
  beforeEach(() => {
    fetch = jest.genMockFn().mockImpl(function () {
      return Promise.resolve();
    });
    article = restful.model('article', fetch);
  });

  describe('static function', () => {
    it('should create an instance of itself by `model` function', () => {
      expect(article instanceof restful).toBeTruthy();
    });
  });
  describe('constructor', () => {
    it('should throw an error if no arguments', () => {
      let hello = function () {
        restful.model(undefined, fetch);
      };
      expect(hello).toThrow('undefined name argument when creating an instance of restful model');
    });
    it('should set `this.url`', () => {
      expect(article.url).toBe('/backend/articles');
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
        article.query('/hello');
        expect(fetch.mock.calls[0][0]).toBe('/hello');
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
        article.mutate('post', '/hello', data);
        expect(fetch.mock.calls[0][0]).toBe('/hello');
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
        article.one('2').create();
        article.one('3').update();
        article.one('4').remove();
        expect(fetch.mock.calls[0][0]).toBe('/backend/articles/1');
        expect(fetch.mock.calls[1][0]).toBe('/backend/articles');
        expect(fetch.mock.calls[2][0]).toBe('/backend/articles/3');
        expect(fetch.mock.calls[3][0]).toBe('/backend/articles/4');
        expect(fetch.mock.calls[0][1].method).toBeUndefined();
        expect(fetch.mock.calls[1][1].method).toBe('post');
        expect(fetch.mock.calls[2][1].method).toBe('put');
        expect(fetch.mock.calls[3][1].method).toBe('delete');
      });
      it('should throw an error when getting, posting, putting without an id', () => {
        const get = () => article.get();
        const update = () => article.update();
        const errorMessage = 'id is undefined of current restful instance';
        expect(get).toThrow(errorMessage);
        expect(update).toThrow(errorMessage);
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
          article.one('1').create(data1);
          article.one('2').update(data2);
          expect(fetch.mock.calls[0][1].body).toBe(JSON.stringify(data1));
          expect(fetch.mock.calls[1][1].body).toBe(JSON.stringify(data2));
        });
      });
    });
  });
});
