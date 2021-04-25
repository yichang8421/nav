// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"epB2":[function(require,module,exports) {
var $siteList = $('.siteList');
var lastLi = $siteList.find('li.last'); // 读出localStorage中之前存储的x值

var x = localStorage.getItem('x'); //将x变成对象

var xObject = JSON.parse(x);
var hashMap = xObject || [{
  logo: 'B',
  logoType: 'text',
  url: 'https://bilibili.com'
}, {
  logo: 'F',
  logoType: 'image',
  url: 'https://figma.com/'
}, {
  logo: 'G',
  logoType: 'text',
  url: 'https://github.com/'
}, {
  logo: 'N',
  logoType: 'text',
  url: 'https://nicovideo.jp/'
}];

var simplifyUrl = function simplifyUrl(url) {
  return url.replace('https://', '').replace('https://', '').replace('www.', '').replace(/\/.*/, ''); //删除/之后的所有内容
};

var render = function render() {
  // 重新渲染hashMap之前，将之前渲染过的hashMap全部删除。然后渲染新增加li的hashMap。
  // console.log($siteList.find('li.last')[0].innerText);
  $siteList.find('li:not(.last)').remove(); // 优化：可以使用hashMap.slice(2:)从第三个元素开始渲染

  hashMap.forEach(function (node, index) {
    // console.log(index);
    var $li = $("\n        <li>\n            <div class=\"site\">\n                <div class=\"logo\">".concat(node.logo, "</div>\n                <div class=\"link\">").concat(simplifyUrl(node.url), "</div>\n                <div class=\"close\">\n                    <svg class=\"icon\">\n                        <use xlink:href=\"#icon-baseline-close-px\"></use>\n                    </svg>\n                </div>\n            </div>\n        </li> \n    ")).insertBefore(lastLi);
    /* 页面跳转功能 */

    $li.on('click', function (e) {
      window.open(node.url);
    });
    /* 删除功能 */

    $li.on('click', '.close', function (e) {
      e.stopPropagation(); // console.log(hashMap);

      hashMap.splice(index, 1);
      render();
    });
  });
};

render();
/*
*   <li>
        <a href="https://www.acfun.cn/">
            <div class="site">
                <div class="logo">A</div>
                <div class="link">acfun.cn</div>
            </div>
        </a>
    </li>
    <li>
        <a href="//bilibili.com">
            <div class="site">
                <div class="logo">
                    <img src="./img/bilibiliLogo.jpeg" alt="">
                </div>
                <div class="link">bilibili.com</div>
            </div>
        </a>
    </li>
*
*
* */

$('.addButton').on('click', function () {
  var url = window.prompt('请输入您要添加的网址：');
  console.log(url);

  if (url.indexOf('https') !== 0) {
    url = 'https://' + url;
  }

  console.log(url);
  hashMap.push({
    logo: simplifyUrl(url)[0],
    // 可以使用.toUpperCase()大写，也可以使用css控制logo大写，此处选择后者。
    logoType: 'text',
    url: url
  });
  render();
});

window.onbeforeunload = function () {
  /* 用户关闭页面之前触发。 */
  console.log('页面将关闭'); // localstorage只能存储字符串
  // jQuery对象变成字符串：
  // const string = hashMap.toString(); 错误

  var string = JSON.stringify(hashMap); // 将string存入localStorage

  localStorage.setItem('x', string);
}; // 键盘事件


$(document).on('keypress', function (e) {
  var key = e.key; //const key = e.key;
  // console.log(key);

  for (var i = 0; i < hashMap.length; i++) {
    if (hashMap[i].logo.toLowerCase() === key) {
      window.open(hashMap[i].url);
    }
  }
});
},{}]},{},["epB2"], null)
//# sourceMappingURL=main.a36a17cf.js.map