# react-playground [![Build Status](https://travis-ci.org/WJsjtu/react-datepicker.svg?branch=master)](https://travis-ci.org/WJsjtu/react-playground)
A pruned live jsx editor from React.

###Usage

Set your code to the `codeText` prop of `window.ReactPlayground.default`.

`ReactDOM.render(React.createElement(ReactPlayground.default, {codeText: TIMER_COMPONENT}), document.getElementById('container'));`

[View online demo](http://wjsjtu.github.io/react-playground/test/index.html)

This component can alsp be used to test some ES6 codes.

`Babel` is also exposed in `window.ReactPlayground.Babel` Object, if you want to  some properties of Babel (presets, plugins and etc.), you can do it yourself by set `transformer` prop properly. 

###Install

`npm install react-ui-playground`