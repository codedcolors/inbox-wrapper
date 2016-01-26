'use strict';

const electron = require('electron');
const app = electron.app;  // Module to control application life.
const BrowserWindow = electron.BrowserWindow;  // Module to create native browser window.
const ipcMain = require('electron').ipcMain;
const shell = require('electron').shell;

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
var mainWindow = null;
var secondaryWindow = null;
var path = require('path');
var fs = require('fs');
var _ = require('lodash');
var initPath = path.join(app.getPath('appData'), 'init.json');
var windowData;
try {
    windowData = JSON.parse(fs.readFileSync(initPath, 'utf8'));
} catch(error) {
  console.log("Error loading window specs");
}


// Quit when all windows are closed.
app.on('window-all-closed', function() {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform != 'darwin') {
    app.quit();
  }
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.on('ready', function() {

  // Create the browser window.
  var windowOptions = {
    "web-preferences": {
      "web-security": false
    }
  };

  _.extend(windowOptions, windowData.bounds || {width: 800, height: 600})
  mainWindow = new BrowserWindow(windowOptions);

  var addUser = function(user) {
    var users = windowData.users || [];
    users.push(user);
    _.extend(windowData, users);
    fs.writeFileSync(initPath, JSON.stringify(windowData));
  };

  var clearUsers = function() {
    windowData.users = [];
    fs.writeFileSync(initPath, JSON.stringify(windowData));
  };

  mainWindow.webContents.on('did-finish-load', function() {
    mainWindow.webContents.send('populateUsers', windowData.users);
  });

  // and load the index.html of the app.
  mainWindow.loadURL('file://' + __dirname + '/views/index.html');
  // mainWindow.loadURL('https://inbox.google.com/');

  mainWindow.on('resize', function() {
    windowData = {
      bounds: mainWindow.getBounds()
    };
    fs.writeFileSync(initPath, JSON.stringify(windowData));
    mainWindow.webContents.send('handleResize', windowData.bounds);
  })

  ipcMain.on('openLink', function(event, url) {
    shell.openExternal(url);
  });

  ipcMain.on('addUser', function(event, user) {
    addUser(user);
  })

  ipcMain.on('logout', function(event) {
    clearUsers();
  })



  // Open the DevTools.
  mainWindow.webContents.openDevTools();

  // Emitted when the window is closed.
  mainWindow.on('closed', function() {

    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
    secondaryWindow = null;
  });
});
