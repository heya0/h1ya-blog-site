'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var base = require('@theme-ui/preset-base');

function _interopDefault (e) { return e && e.__esModule ? e : { 'default': e }; }

var base__default = /*#__PURE__*/_interopDefault(base);

const funk = { ...base__default['default'],
  fonts: {
    body: 'Poppins, sans-serif',
    heading: 'Poppins, sans-serif',
    monospace: 'Menlo, monospace'
  },
  lineHeights: {
    body: 1.625,
    heading: 1.25
  },
  fontWeights: {
    body: 400,
    heading: 900,
    bold: 700
  },
  colors: { ...base__default['default'].colors,
    primary: '#609',
    secondary: '#306'
  },
  styles: { ...base__default['default'].styles
  }
};

exports.default = funk;
exports.funk = funk;
