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

function scopedEval(code, module, scope) {
    var func = new Function('module',
        'with(module){return(function(global,window,document){\"use strict\";return eval(\"' +
        code +
        '\");})(this,this,this)}'
    );
    return func.call(scope, module);
}

module.exports = scopedEval;
