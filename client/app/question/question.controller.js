'use strict';

angular.module('testmeApp')
  .controller('QuestionCtrl', function ($scope, $http, socket) {
    $scope.quetions = [];

    $http.get('/api/questions').success(function(questions) {
      $scope.questions = questions;
    });

    $scope.deleteQuestion = function(question) {
      $http.delete('/api/questions/' + question._id);
    };
  })
  .controller('QuestionCreateCtrl', function ($scope, $http, socket) {
    $scope.quetionTypes = [];
    $scope.question = $scope.question || {
      images: [],
      choices: [],
      answers: [],
      coef: 0.5
    };

    $http.get('/api/questions/types').success(function(types) {
      $scope.quetionTypes = types;
    });
    
    $scope.addQuestion = function() {
      console.log('add question: ', $scope.question);
      if($scope.question === '') {
        return;
      }
      // $http.post('/api/questions', $scope.question);
      // $scope.question = {};
    };
    
    $scope.$watchCollection('question.answers', function(newValue, oldValue) {
      console.log('watch: ', newValue, ' <= ', oldValue);
    });
    
    /// fileinput
    $scope.$on('$viewContentLoaded', function(event) {
      console.log('viewContentLoaded: ', event);
      
      $("#images").fileinput({
        'uploadUrl': '/api/storage',
        'showUpload':false, 
        'previewFileType':'image',
        'showPreview': false,
				'browseLabel':"选择&hellip;",
				'removeLabel':"移除",
        uploadLabel: '上传',
        maxFileSize: 4096,
        maxFileCount: 10,
        msgSizeTooLarge: '文件"{name}"(<b>{size} KB</b>)超出允许上传最大限制<b>{maxSize} KB</b>. 请重新上传!',
        msgFilesTooMany: '选择上传的文件个数 <b>({n})</b>超出了允许上传的最大限制<b>{m}</b>. 请重新上传!',
        msgFileNotFound: '文件"{name}"没有找到!',
        msgFileNotReadable: '文件"{name}"不可读.',
        msgFilePreviewAborted: '预览文件"{name}"终止.',
        msgFilePreviewError: '预览文件"{name}出现了错误".',
        msgValidationError: '<span class="text-danger"><i class="glyphicon glyphicon-exclamation-sign"></i> 文件上传失败</span>',
        msgLoading: '加载文件{index} of {files} &hellip;',
        msgProgress: '已加载{index} of {files} - {name} - {percent}% 完成.',
        msgSelected: '已经选择{n}个文件',
      });
    });
  });
