/**
 * Created with JetBrains WebStorm.
 * User: leewonjae
 * Date: 2014. 6. 9.
 * Time: 오전 11:54
 * To change this template use File | Settings | File Templates.
 */

var WEB_SERVER_PORT = process.env.NODE_ENV === 'development' ? 8888 : 80;

var express = require('express');
var fs = require('fs');
var app = express();
var basepath = __dirname + '/..';

app.use('/', express.static(basepath + '/publish'));
app.listen(WEB_SERVER_PORT);

console.log("WebServer is listening : " + WEB_SERVER_PORT);
