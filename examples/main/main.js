import $ from '../../src/lib/jqlite';
console.log("test start")
$(function(){
    console.log("dom ready!")
})

var test = $('#test');
var test1 = $('.test1');

var buttonDisabled = test1.find('[disabled]');
var items = $('.test1 li');
// var button1 = $('=button-1');

console.log("id",test);
console.log("test1 by  class:",test1);
console.log("buttonDisabled",buttonDisabled);
// console.log("button-1 by name",button1);
console.log("items by find tagName",items);
