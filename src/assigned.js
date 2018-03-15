const jqlite = require('./lib/jqlite').default;
if(typeof window !== 'undefined'){
    if(!window.jQuery){
        window.jQuery = jqlite;
    }
    window.jqlite = jqlite;
}
module.exports = jqlite;