'use strict';

angular.module('testmeApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/questions/create', {
        templateUrl: 'app/question/create.html',
        controller: 'QuestionCreateCtrl'
      })
      .when('/questions/edit/:id', {
        templateUrl: 'app/question/edit.html'
      })
      .when('/questions', {
        templateUrl: 'app/question/index.html',
        controller: 'QuestionCtrl'
      });
  });