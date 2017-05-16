# Reduced Disjunctive Normal Form

This module allows to find a reduced DNF.

## Install

To install this module you need to use [NPM](https://www.npmjs.com/)

```
npm install reduced-dnf
```

## Usage

![f(x1,x2,x3,x4)|_1=U(0,1,2,3,4,5,7,13,15)](https://goo.gl/15KJ62)

If you've got a function of 4 arguments and points {0,1,2,3,4,5,7,13,15} where the function takes true-defined value (meaning 1), then you can get a reduced DNF function using this:

```js
let dnf = require("reduced-dnf");
let data = dnf(["x_1","x_2","x_3","x_4"], [0,1,2,3,4,5,7,13,15]);

data.columns.forEach((column, i) => {
  console.log("Column no." + (i + 1));
  column.forEach(v => console.log(v));
});

console.log("Function F =", data.F);
console.log("Сomplexity L =", data.L);
```

As a result, you get function itself (`F`), its complexity (`L`) and templates for points (`columns`).