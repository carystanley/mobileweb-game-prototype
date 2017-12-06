/*
function scopedEval(source, scope) {
    var keys = [];
    var values = [];
    Object.keys(scope).forEach(function (key) {
         var value = scope[key];
         if (key !== 'this') {
             values.push(value);
             keys.push(key);
         }
    });
    return (new Function(keys.join(','), "return eval(" + JSON.stringify(source) + ")")).apply({}, values);
}
*/

// https://gist.github.com/sukima/6088546

function scopedEval(code, module, scope) {
    var func = new Function('module',
        'with(module){return(function(global,window,document,self){\"use strict\";return eval(\"' +
        code +
        '\");})(this,this,this,this)}'
    );
    return func.call(scope, module);
}

module.exports = scopedEval;
