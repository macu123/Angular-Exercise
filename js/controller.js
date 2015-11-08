app.controller('TwitterController', function($scope, $q, twitterService) {
  //indicate if users are authorized or not
  $scope.if_authorized = false;

  twitterService.initialize();

  //use OAuth to get tweets according to keywords provided by users
  $scope.getTweetsByKeyword = function() {
    twitterService.getTweets($scope.keyword).then(function(data) {
      $scope.tweets = data.statuses;
    }, function() {
      alert("Cannot reach to Twitter API");
    });
  };

  $scope.login = function() {
    var callback = function() {
      $scope.if_authorized = true;
      //reload the current page
      location.reload();
    };

    twitterService.connectToTwitter(callback);
  };

  $scope.logout = function() {
    twitterService.clearCache();
    $scope.tweets = [];
    $scope.if_authorized = false;
  };

  $scope.$watch(function(scope) {
    return scope.if_authorized;
  }, function(newValue, oldValue) {
    if (newValue == true) {
      twitterService.getUser().then(function(data) {
        $scope.user = data;
      }, function() {
        alert("cannot reach to Twitter API");
      });
    }
  });

  //After authorization, users will still be login even if they close browser
  if (twitterService.isReady()) {
    $scope.if_authorized = true;
  }

});