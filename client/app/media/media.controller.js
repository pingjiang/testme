'use strict';

angular.module('testmeApp')
  .controller('MediaCtrl', [ '$scope', '$http', function ($scope, $http) {
    // console.log('Media controller ... ', $scope.queue, $scope.file);
    var file = $scope.file || {}, state;
    if (file.url) {
      file.$state = function() {
        return state;
      };
      file.$destroy = function() {
        state = 'pending';
        return $http({
          url: file.deleteUrl,
          method: file.deleteType
        }).then(
          function() {
            state = 'resolved';
            $scope.clear(file);
          },
          function() {
            state = 'rejected';
          }
        );
      };
    } else if (!file.$cancel && !file._index) {
      file.$cancel = function() {
        $scope.clear(file);
      };
    }

    $scope.medias = [];
    $http.get('/api/medias').success(function(medias) {
      if (medias && medias.files) {
        $scope.medias = medias.files;
        $scope.medias.forEach(function(v) {
          v.$destroy = function(i) {
            return $http({
              url: v.deleteUrl,
              method: v.deleteType
            }).then(
              function() {
                $scope.medias.splice(i, 1);
              },
              function() {
                $scope.medias.splice(i, 1);
              }
            );
          };
        });
      }
    });
  }]);
