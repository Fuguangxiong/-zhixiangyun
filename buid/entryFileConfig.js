/**
 * Created by dell on 2017/9/12.
 */
var config=require('../config/envConfig');
var configFile=config.ENTRY_FILE;
var mp=config.MULTIPLE_PAGES;
var path = require("path");
var glob = require('glob');

var entries= function () {
    var map = {};
    if(mp==true){
        var entryPath=configFile.replace('./src/','');
        entryPath=entryPath.slice(0,entryPath.indexOf("/"));
        var jsDir = path.resolve('./src/'+entryPath, 'entry');
        var entryFiles = glob.sync(jsDir + '/*.{js,jsx}')
        for (var i = 0; i < entryFiles.length; i++) {
            var filePath = entryFiles[i];
            var filename = filePath.substring(filePath.lastIndexOf('\/') + 1, filePath.lastIndexOf('.'));
            map[filename] = filePath;
        }
        map['public']='./src/'+entryPath+'/publicCss/public.js';
    }
    else{
        map.main=configFile;
    }

    return map;
};

module.exports = {
    entryFile: Object.assign(entries(),{'vendor': ['jquery', 'vue','vue-router','element-ui','babel-polyfill']}),
}