# react-playground [![Build Status](https://travis-ci.org/WJsjtu/react-datepicker.svg?branch=master)](https://travis-ci.org/WJsjtu/react-playground)
A pruned live jsx editor from React.

###Usage

Set your code to the `codeText` prop of `window.ReactPlayground`.

`ReactDOM.render(React.createElement(ReactPlayground, {codeText: TIMER_COMPONENT}), document.getElementById('container'));`

[View online demo](http://wjsjtu.github.io/react-playground/test/index.html)

This component can alsp be used to test some ES6 codes.

`Babel` is also exposed in `window` Object, if you want to  some properties of Babel (presets, plugins and etc.), you can do it yourself by set `transformer` prop properly. 

###Install

`npm install react-ui-playground``

###The MIT License (MIT)

Copyright (c) 2016 Jason Wang, contributors

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.