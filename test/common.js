var CookieTestHelper = {};

CookieTestHelper.fire = function(name, detail, node) {
  var event = new CustomEvent(name, {
    bubbles: true,
    composed: true,
    cancelable: true,
    detail: detail
  });
  (node || document).dispatchEvent(event);
  return event;
};

CookieTestHelper.createHeaders = function(cookieStr) {
  var headers = {
    'host': 'domain.com',
    'set-cookie': cookieStr || 'test=ok',
    'content-length': '4',
    'content-type': 'plain/text'
  };
  return new Headers(headers);
};

CookieTestHelper.createResponse = function(cookieStr, status, statusText) {
  status = status || 200;
  statusText = statusText || 'OK';
  var headers = CookieTestHelper.createHeaders(cookieStr);
  var response = new Response('test', {
    status: status,
    statusText: statusText,
    headers: headers
  });
  return response;
};
CookieTestHelper.createRequest = function(url) {
  url = url || 'http://sub.domain.com/path/resource/?param=value';
  return new Request(url, {
    method: 'GET',
    headers: {
      'x-token': 'abc'
    }
  });
};

CookieTestHelper.afterRequestEvent = function(cookieStr, url, status, statusText) {
  return CookieTestHelper.fire('response-ready', {
    request: CookieTestHelper.createRequest(url),
    response: CookieTestHelper.createResponse(cookieStr, status, statusText),
    auth: undefined
  });
};
/**
 * Deletes PouchDB database
 *
 * @param {String} name Database name without `_pouch_` prefix
 * @return {Promise}
 */
CookieTestHelper.deleteDatabase = function() {
  return new Promise(function(resolve, reject) {
    var request = window.indexedDB.deleteDatabase('_pouch_cookies');
    request.onerror = function() {
      reject(new Error('Unable to delete _pouch_cookies database'));
    };
    request.onsuccess = function() {
      resolve();
    };
    request.onblocked = function() {
      reject(new Error('Unable to delete _pouch_cookies database. Transaction is blocked'));
    };
  });
};
