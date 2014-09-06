'use strict';

describe('Controller: QuestionCtrl', function () {

  // load the controller's module
  beforeEach(module('testmeApp'));
  beforeEach(module('socketMock'));

  var QuestionCtrl,
      scope,
      $httpBackend;

  // Initialize the controller and a mock scope
  beforeEach(inject(function (_$httpBackend_, $controller, $rootScope) {
    $httpBackend = _$httpBackend_;
    $httpBackend.expectGET('/api/questions')
      .respond([]);

    scope = $rootScope.$new();
    QuestionCtrl = $controller('QuestionCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of questions to the scope', function () {
    $httpBackend.flush();
    expect(scope.questions.length).toBe(0);
  });
});
