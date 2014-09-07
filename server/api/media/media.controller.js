/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /medias              ->  index
 * POST    /medias              ->  create
 * GET     /medias/:id          ->  show
 * PUT     /medias/:id          ->  update
 * DELETE  /medias/:id          ->  destroy
 */

'use strict';

var _ = require('lodash');
var Media = require('./media.model');
var config = require('../../config/environment');

var path = require('path'),
    fs = require('fs'),
    // Since Node 0.8, .existsSync() moved from path to fs:
    _existsSync = fs.existsSync || path.existsSync,
    formidable = require('formidable'),
    imageMagick = require('imagemagick'),
    options = config.mediaOptions,
    utf8encode = function (str) {
        return unescape(encodeURIComponent(str));
    },
    nameCountRegexp = /(?:(?: \(([\d]+)\))?(\.[^.]+))?$/,
    nameCountFunc = function (s, index, ext) {
        return ' (' + ((parseInt(index, 10) || 0) + 1) + ')' + (ext || '');
    };
    
var FileInfo = function (file) {
  this.name = file.name;
  this.size = file.size;
  this.type = file.type;
  this.deleteType = 'DELETE';
};

FileInfo.prototype.validate = function () {
    if (options.minFileSize && options.minFileSize > this.size) {
        this.error = 'File is too small';
    } else if (options.maxFileSize && options.maxFileSize < this.size) {
        this.error = 'File is too big';
    } else if (!options.acceptFileTypes.test(this.name)) {
        this.error = 'Filetype not allowed';
    }
    return !this.error;
};
FileInfo.prototype.safeName = function () {
    // Prevent directory traversal and creating hidden system files:
    this.name = path.basename(this.name).replace(/^\.+/, '');
    // Prevent overwriting existing files:
    while (_existsSync(options.uploadDir + '/' + this.name)) {
        this.name = this.name.replace(nameCountRegexp, nameCountFunc);
    }
};
FileInfo.prototype.initUrls = function (req) {
    if (!this.error) {
        var that = this,
            baseUrl = (options.ssl ? 'https:' : 'http:') +
                '//' + req.headers.host + options.uploadUrl;
        this.url = this.deleteUrl = baseUrl + encodeURIComponent(this.name);
        Object.keys(options.imageVersions).forEach(function (version) {
            if (_existsSync(
                    options.uploadDir + '/' + version + '/' + that.name
                )) {
                that[version + 'Url'] = baseUrl + encodeURIComponent(that.name) + '?v=' + version;
            }
        });
    }
};

// Override headers
var overrideHeaders = function(req, res) {
  res.setHeader(
      'Access-Control-Allow-Origin',
      options.accessControl.allowOrigin
  );
  res.setHeader(
      'Access-Control-Allow-Methods',
      options.accessControl.allowMethods
  );
  res.setHeader(
      'Access-Control-Allow-Headers',
      options.accessControl.allowHeaders
  );
};

// Get list of medias
exports.index = function(req, res) {
  var files = [];
  fs.readdir(options.uploadDir, function (err, list) {
      list && list.forEach(function (name) {
          var stats = fs.statSync(options.uploadDir + '/' + name),
              fileInfo;
          if (stats.isFile() && name[0] !== '.') {
              fileInfo = new FileInfo({
                  name: name,
                  size: stats.size
              });
              fileInfo.initUrls(req);
              files.push(fileInfo);
          }
      });
      res.json(200, {files: files});
  });
};

// Get a single media
exports.show = function(req, res) {
  var filename = req.params.id;
  var version = req.query.v; // thumbnail
  var filepath = path.join(options.uploadDir, filename);
  filepath = (version&&(version.length>0)) ? path.join(options.uploadDir, version, filename) : filepath;
  if (filename && filename.length > 0 && filename[0] !== '.') {
    return fs.exists(filepath, function (exists) {
      if (exists) {
        if (!options.inlineFileTypes.test(filename)) {
            // Force a download dialog for unsafe file extensions:
            return res.download(filepath, utf8encode(path.basename(filename)));
        }

        return res.sendfile(filepath);
      }
      
      return res.send(404);
    });
  }
  
  // // Prevent browsers from MIME-sniffing the content-type:
  // _headers['X-Content-Type-Options'] = 'nosniff';
  return res.send(400);
};

// Creates a new media in the DB.
exports.create = function(req, res) {
  var form = new formidable.IncomingForm(),
      tmpFiles = [],
      files = [],
      map = {},
      counter = 1,
      redirect,// not used
      finish = function () {
          counter -= 1;
          if (!counter) {
              files.forEach(function (fileInfo) {
                  fileInfo.initUrls(req);
              });
              res.json(200, {files: files});
          }
      };
  form.uploadDir = options.tmpDir;
  form.on('fileBegin', function (name, file) {
      tmpFiles.push(file.path);
      var fileInfo = new FileInfo(file, req, true);
      fileInfo.safeName();
      map[path.basename(file.path)] = fileInfo;
      files.push(fileInfo);
  }).on('field', function (name, value) {
      if (name === 'redirect') {
          redirect = value;
      }
  }).on('file', function (name, file) {
      var fileInfo = map[path.basename(file.path)];
      fileInfo.size = file.size;
      if (!fileInfo.validate()) {
          fs.unlink(file.path);
          return;
      }
      fs.renameSync(file.path, options.uploadDir + '/' + fileInfo.name);
      if (options.imageTypes.test(fileInfo.name)) {
          Object.keys(options.imageVersions).forEach(function (version) {
              counter += 1;
              var opts = options.imageVersions[version];
              imageMagick.resize({
                  width: opts.width,
                  height: opts.height,
                  srcPath: options.uploadDir + '/' + fileInfo.name,
                  dstPath: options.uploadDir + '/' + version + '/' +
                      fileInfo.name
              }, finish);
          });
      }
  }).on('aborted', function () {
      tmpFiles.forEach(function (file) {
          fs.unlink(file);
      });
  }).on('error', function (e) {
      console.log(e);
  }).on('progress', function (bytesReceived) {
      if (bytesReceived > options.maxPostSize) {
          req.connection.destroy();
      }
  }).on('end', finish).parse(req);
};

// Deletes a media from the DB.
exports.destroy = function(req, res) {
  var filename = req.params.id;
  if (filename && filename.length > 0 && filename[0] !== '.') {
    var filepath = path.join(options.uploadDir, filename);
    return fs.unlink(filepath, function (ex) {
        Object.keys(options.imageVersions).forEach(function (version) {
          var versionpath = path.join(options.uploadDir, version, filename);
          fs.unlink(versionpath, function(err) {
            // ignore
          });
        });
        
        return res.send(ex ? 404 : 200);
    });
  }
  
  return res.send(400);
};

function handleError(res, err) {
  return res.send(500, err);
}
