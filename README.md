# DescribeJS

`yarn global add describejs`

or 

`npm install -g describejs`

`describe <fileName or a whole director>`

A good passing JavaScript file should look something like this

```javascript
/*
describe:
A simple greeting function
*/
const name = 'Felix'
const sayName = function(yourName){
    return `${name} is greeting to you ${yourName}`;
}
```
It will pass the DescribeJS test, since you add the `describe syntax` to your code, or else DescribeJS will throw a error to you

# Describe Syntax
`describe syntax` is a stand multi-line comment in JavaScript, it look something like this
```javascript
/*
describe:
<description>
*/
```
You can add `describe syntax` any where you want inside you JS file