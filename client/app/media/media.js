'use strict';

angular.module('testmeApp')
  .config(function ($routeProvider, $httpProvider, fileUploadProvider) {
    $routeProvider
      .when('/medias', {
        templateUrl: 'app/media/media.html',
        controller: 'MediaCtrl'
      });
      
  delete $httpProvider.defaults.headers.common['X-Requested-With'];
  // fileUploadProvider.defaults.redirect = window.location.href.replace(
  //   /\/[^\/]*$/,
  //   '/cors/result.html?%s'
  // );
  // if (isOnGitHub) {
  //   // Demo settings:
  //   angular.extend(fileUploadProvider.defaults, {
  //       // Enable image resizing, except for Android and Opera,
  //       // which actually support image resizing, but fail to
  //       // send Blob objects via XHR requests:
  //       disableImageResize: /Android(?!.*Chrome)|Opera/
  //           .test(window.navigator.userAgent),
  //       maxFileSize: 5000000,
  //       acceptFileTypes: /(\.|\/)(gif|jpe?g|png)$/i
  //   });
  // }
  });