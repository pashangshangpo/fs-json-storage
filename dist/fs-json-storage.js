function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var fs = _interopDefault(require('fs'));
var path = _interopDefault(require('path'));
var os = _interopDefault(require('os'));

function _interopDefault$1 (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var Fs = _interopDefault$1(fs);
var Path = _interopDefault$1(path);
var Os = _interopDefault$1(os);

// A type of promise-like that resolves synchronously and supports only one observer
const _Pact = /*#__PURE__*/(function() {
	function _Pact() {}
	_Pact.prototype.then = function(onFulfilled, onRejected) {
		const result = new _Pact();
		const state = this.s;
		if (state) {
			const callback = state & 1 ? onFulfilled : onRejected;
			if (callback) {
				try {
					_settle(result, 1, callback(this.v));
				} catch (e) {
					_settle(result, 2, e);
				}
				return result;
			} else {
				return this;
			}
		}
		this.o = function(_this) {
			try {
				const value = _this.v;
				if (_this.s & 1) {
					_settle(result, 1, onFulfilled ? onFulfilled(value) : value);
				} else if (onRejected) {
					_settle(result, 1, onRejected(value));
				} else {
					_settle(result, 2, value);
				}
			} catch (e) {
				_settle(result, 2, e);
			}
		};
		return result;
	};
	return _Pact;
})();

// Settles a pact synchronously
function _settle(pact, state, value) {
	if (!pact.s) {
		if (value instanceof _Pact) {
			if (value.s) {
				if (state & 1) {
					state = value.s;
				}
				value = value.v;
			} else {
				value.o = _settle.bind(null, pact, state);
				return;
			}
		}
		if (value && value.then) {
			value.then(_settle.bind(null, pact, state), _settle.bind(null, pact, 2));
			return;
		}
		pact.s = state;
		pact.v = value;
		const observer = pact.o;
		if (observer) {
			observer(pact);
		}
	}
}

function _isSettledPact(thenable) {
	return thenable instanceof _Pact && thenable.s & 1;
}

// Asynchronously iterate through an object that has a length property, passing the index as the first argument to the callback (even as the length property changes)
function _forTo(array, body, check) {
	var i = -1, pact, reject;
	function _cycle(result) {
		try {
			while (++i < array.length && (!check || !check())) {
				result = body(i);
				if (result && result.then) {
					if (_isSettledPact(result)) {
						result = result.v;
					} else {
						result.then(_cycle, reject || (reject = _settle.bind(null, pact = new _Pact(), 2)));
						return;
					}
				}
			}
			if (pact) {
				_settle(pact, 1, result);
			} else {
				pact = result;
			}
		} catch (e) {
			_settle(pact || (pact = new _Pact()), 2, e);
		}
	}
	_cycle();
	return pact;
}

const _iteratorSymbol = /*#__PURE__*/ typeof Symbol !== "undefined" ? (Symbol.iterator || (Symbol.iterator = Symbol("Symbol.iterator"))) : "@@iterator";

// Asynchronously iterate through an object's values
// Uses for...of if the runtime supports it, otherwise iterates until length on a copy
function _forOf(target, body, check) {
	if (typeof target[_iteratorSymbol] === "function") {
		var iterator = target[_iteratorSymbol](), step, pact, reject;
		function _cycle(result) {
			try {
				while (!(step = iterator.next()).done && (!check || !check())) {
					result = body(step.value);
					if (result && result.then) {
						if (_isSettledPact(result)) {
							result = result.v;
						} else {
							result.then(_cycle, reject || (reject = _settle.bind(null, pact = new _Pact(), 2)));
							return;
						}
					}
				}
				if (pact) {
					_settle(pact, 1, result);
				} else {
					pact = result;
				}
			} catch (e) {
				_settle(pact || (pact = new _Pact()), 2, e);
			}
		}
		_cycle();
		if (iterator.return) {
			var _fixup = function(value) {
				try {
					if (!step.done) {
						iterator.return();
					}
				} catch(e) {
				}
				return value;
			};
			if (pact && pact.then) {
				return pact.then(_fixup, function(e) {
					throw _fixup(e);
				});
			}
			_fixup();
		}
		return pact;
	}
	// No support for Symbol.iterator
	if (!("length" in target)) {
		throw new TypeError("Object is not iterable");
	}
	// Handle live collections properly
	var values = [];
	for (var i = 0; i < target.length; i++) {
		values.push(target[i]);
	}
	return _forTo(values, function(i) { return body(values[i]); }, check);
}

const _asyncIteratorSymbol = /*#__PURE__*/ typeof Symbol !== "undefined" ? (Symbol.asyncIterator || (Symbol.asyncIterator = Symbol("Symbol.asyncIterator"))) : "@@asyncIterator";

/**
 * 初始化目录
 * @param {String} path 目录路径
 */

var initDir = function (path$$1) {
  try {
    var splitLine = Os.platform() === 'win32' ? '\\' : '/';
    var paths = path$$1.split(splitLine);
    paths.pop();
    var dir = paths.join(splitLine);

    var _temp2 = function () {
      if (dir) {
        return Promise.resolve(exists(dir)).then(function (isExists) {
          var _temp = function () {
            if (!isExists) {
              return Promise.resolve(mkdir(dir)).then(function () {});
            }
          }();

          if (_temp && _temp.then) { return _temp.then(function () {}); }
        });
      }
    }();

    return Promise.resolve(_temp2 && _temp2.then ? _temp2.then(function () {}) : void 0);
  } catch (e) {
    return Promise.reject(e);
  }
};
/**
 * 判断文件路径是否存在
 * @param {String} path 文件路径
 */


var exists = function (path$$1) {
  return new Promise(function (resolve) {
    Fs.access(path$$1, Fs.constants.F_OK, function (err) {
      resolve(err ? false : true);
    });
  });
};
/**
 * 判断是否是文件目录
 * @param {String} path 文件路径
 */


var isDir = function (path$$1) {
  return new Promise(function (resolve) {
    Fs.stat(path$$1, function (err, stats) {
      resolve(err ? false : stats.isDirectory());
    });
  });
};
/**
 * 写入文件
 * @param {String} path 文件路径
 * @param {String|Buffer} content 内容
 */


var writeFile = function (path$$1, content) {
  try {
    return Promise.resolve(initDir(path$$1)).then(function () {
      return new Promise(function (resolve) {
        Fs.writeFile(path$$1, content, function (err) {
          resolve(err ? false : true);
        });
      });
    });
  } catch (e) {
    return Promise.reject(e);
  }
};
/**
 * 写入JSON数据到文件
 * @param {String} path 文件路径
 * @param {Object} json JSON数据
 */


var writeJson = function (path$$1, json) {
  try {
    return Promise.resolve(initDir(path$$1)).then(function () {
      return new Promise(function (resolve) {
        Fs.writeFile(path$$1, JSON.stringify(json), function (err) {
          resolve(err ? false : true);
        });
      });
    });
  } catch (e) {
    return Promise.reject(e);
  }
};
/**
 * 读取文件目录
 * @param {String} path 文件路径
 */


var readdir = function (path$$1) {
  return new Promise(function (resolve) {
    Fs.readdir(path$$1, function (err, files) {
      resolve(files || []);
    });
  });
};
/**
 * 递归读取目录下符合条件的所有文件
 * @param {String} dir 目录路径
 * @param {Function} filter 过滤文件函数
 */


var readFilePaths = function (dir, filter) {
  try {
    return Promise.resolve(readdir(dir)).then(function (files) {
      var paths = [];

      var _temp6 = _forOf(files, function (file) {
        var filePath = Path.join(dir, file);
        return Promise.resolve(isDir(filePath)).then(function (_isDir) {
          function _temp5() {
            var _push = paths.push;
            return Promise.resolve(readFilePaths(filePath, filter)).then(function (_readFilePaths) {
              _push.call.apply(_push, [ paths ].concat( _readFilePaths ));
            });
          }

          var _temp4 = function () {
            if (!_isDir) {
              function _temp3(_filter) {
                if (filter && _filter === false) {
                  return;
                }

                paths.push(filePath);
              }

              return filter ? Promise.resolve(filter(filePath)).then(_temp3) : _temp3(filter);
            }
          }();

          return _temp4 && _temp4.then ? _temp4.then(_temp5) : _temp5(_temp4);
        });
      });

      return _temp6 && _temp6.then ? _temp6.then(function () {
        return paths;
      }) : paths;
    });
  } catch (e) {
    return Promise.reject(e);
  }
};
/**
 * 读取文件
 * @param {String} path 文件路径
 */


var readFile = function (path$$1) {
  return new Promise(function (resolve) {
    Fs.readFile(path$$1, function (err, data) {
      resolve(err ? null : data);
    });
  });
};
/**
 * 读取文本文件内容
 * @param {String} path 文件路径
 */


var readText = function (path$$1) {
  return new Promise(function (resolve) {
    Fs.readFile(path$$1, function (err, data) {
      resolve(err ? null : data.toString());
    });
  });
};
/**
 * 读取Json文件数据
 * @param {String} path 文件路径
 */


var readJson = function (path$$1) {
  return new Promise(function (resolve) {
    Fs.readFile(path$$1, function (err, data) {
      data = data.toString() || null;

      if (data) {
        data = JSON.parse(data);
      }

      resolve(err ? null : data);
    });
  });
};
/**
 * 创建目录
 * @param {String} path 目录路径
 */


var mkdir = function (path$$1) {
  try {
    return Promise.resolve(initDir(path$$1)).then(function () {
      return new Promise(function (resolve) {
        Fs.mkdir(path$$1, function () {
          try {
            return Promise.resolve(exists(path$$1)).then(function (_exists) {
              resolve(_exists);
            });
          } catch (e) {
            return Promise.reject(e);
          }
        });
      });
    });
  } catch (e) {
    return Promise.reject(e);
  }
};
/**
 * 删除文件
 * @param {String} path 文件路径
 */


var deleteFile = function (path$$1) {
  return new Promise(function (resolve) {
    Fs.unlink(path$$1, function (err) {
      resolve(err ? false : true);
    });
  });
};
/**
 * 删除目录
 * @param {String} path 目录路径
 */


var deleteDir = function (path$$1) {
  try {
    return Promise.resolve(readdir(path$$1)).then(function (dir) {
      function _temp9() {
        return new Promise(function (resolve) {
          Fs.rmdir(path$$1, function (err) {
            resolve(err ? false : true);
          });
        });
      }

      var _temp8 = _forOf(dir, function (p) {
        var currentPath = Path.join(path$$1, p);
        return Promise.resolve(isDir(currentPath)).then(function (dir) {
          var _temp7 = function () {
            if (dir) {
              return Promise.resolve(deleteDir(currentPath)).then(function () {});
            } else {
              return Promise.resolve(deleteFile(currentPath)).then(function () {});
            }
          }();

          if (_temp7 && _temp7.then) { return _temp7.then(function () {}); }
        });
      });

      return _temp8 && _temp8.then ? _temp8.then(_temp9) : _temp9(_temp8);
    });
  } catch (e) {
    return Promise.reject(e);
  }
};

var exists_1 = exists;
var isDir_1 = isDir;
var writeFile_1 = writeFile;
var writeJson_1 = writeJson;
var readdir_1 = readdir;
var readFilePaths_1 = readFilePaths;
var readFile_1 = readFile;
var readText_1 = readText;
var readJson_1 = readJson;
var mkdir_1 = mkdir;
var deleteDir_1 = deleteDir;
var deleteFile_1 = deleteFile;

var fsPromise = {
	exists: exists_1,
	isDir: isDir_1,
	writeFile: writeFile_1,
	writeJson: writeJson_1,
	readdir: readdir_1,
	readFilePaths: readFilePaths_1,
	readFile: readFile_1,
	readText: readText_1,
	readJson: readJson_1,
	mkdir: mkdir_1,
	deleteDir: deleteDir_1,
	deleteFile: deleteFile_1
};

/**
 * 储存类
 * @param {String} storagePath 文件路径
 */

var Storage = function (storagePath) {
  // set列表，防止连续set导致数据互相覆盖
  var sets = [];
  var adds = [];
  var isSeted = false;
  var isAdded = false;

  var getStorage = function () {
    try {
      return Promise.resolve(fsPromise.exists(storagePath)).then(function (isExists) {
        return isExists ? fsPromise.readJson(storagePath) : null;
      });
    } catch (e) {
      return Promise.reject(e);
    }
  };

  var saveStorage = function (storage) {
    return fsPromise.writeJson(storagePath, storage);
  };
  /**
   * 获取数据
   * @param {String} key 键，可选，不写获取全部
   * @returns {Object|Array|Null}
   */


  var get = function (key) {
    try {
      return Promise.resolve(getStorage()).then(function (storage) {
        return storage ? key != null ? storage[key] || null : storage : null;
      });
    } catch (e) {
      return Promise.reject(e);
    }
  };
  /**
   * 替换键数据或添加数据，传递对象则覆盖整个数据
   * @param  {...any} args key,value|{}
   */


  var set = function () {
    var args = [], len = arguments.length;
    while ( len-- ) args[ len ] = arguments[ len ];

    try {
      if (isSeted) {
        sets.unshift(set.bind.apply(set, [ null ].concat( args )));
        return Promise.resolve();
      }

      isSeted = true;
      return Promise.resolve(getStorage()).then(function (storage) {
        storage = storage || {};

        if (args.length === 2) {
          storage[args[0]] = args[1];
        } else if (args.length === 1) {
          var isObject = Object.prototype.toString.call(args[0]).toLowerCase() === '[object object]';

          if (isObject) {
            storage = args[0];
          }
        } else {
          for (var i = 0, list = args; i < list.length; i += 1) {
            var item = list[i];

            var key = item[0];
            var value = item[1];
            storage[key] = value;
          }
        }

        return Promise.resolve(saveStorage(storage)).then(function (res) {
          isSeted = false;

          if (sets.length) {
            sets.pop()();
          }

          return res;
        });
      });
    } catch (e) {
      return Promise.reject(e);
    }
  };
  /**
   * 向数组添加数据
   * @param  {...any} args {}|[...{}]
   */


  var add = function () {
    var args = [], len = arguments.length;
    while ( len-- ) args[ len ] = arguments[ len ];

    try {
      if (isAdded) {
        adds.unshift(add.bind.apply(add, [ null ].concat( args )));
        return Promise.resolve();
      }

      isAdded = true;
      return Promise.resolve(getStorage()).then(function (storage) {
        if (!storage) {
          storage = [];
        }

        storage.push.apply(storage, args);
        return Promise.resolve(saveStorage(storage)).then(function (res) {
          isAdded = false;

          if (adds.length) {
            adds.pop()();
          }

          return res;
        });
      });
    } catch (e) {
      return Promise.reject(e);
    }
  };
  /**
   * 删除指定键下的数据
   * @param {String} key 键，可选，不写删除所有数据
   */


  var remove = function (key) {
    try {
      return Promise.resolve(getStorage()).then(function (storage) {
        if (!storage) {
          return;
        }

        if (!key) {
          return fsPromise.deleteFile(storagePath);
        }

        delete storage[key];
        return saveStorage(storage);
      });
    } catch (e) {
      return Promise.reject(e);
    }
  };
  /**
   * 清空数据
   */


  var empty = function () {
    return fsPromise.deleteFile(storagePath);
  };
  /**
   * 查找符合条件的数组数据
   * @param {Function} func 过滤数据方法
   * @returns {Array} Promise
   */


  var find = function (func) {
    try {
      return Promise.resolve(getStorage()).then(function (storage) {
        return !storage || !Array.isArray(storage) ? [] : storage.filter(func);
      });
    } catch (e) {
      return Promise.reject(e);
    }
  };

  return {
    get: get,
    set: set,
    add: add,
    remove: remove,
    empty: empty,
    find: find
  };
};

module.exports = Storage;
