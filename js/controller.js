app.controller('tweetsSearchController', function($scope, $q, tweetsSearchService) {
  //indicate if users are authorized or not
  $scope.if_authorized = false;

  tweetsSearchService.initialize();

  //use OAuth to get tweets according to keywords provided by users
  $scope.getTweetsByKeyword = function() {
    tweetsSearchService.getTweets($scope.keyword).then(function(data) {
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

    tweetsSearchService.connectToTwitter(callback);
  };

  $scope.logout = function() {
    tweetsSearchService.clearCache();
    $scope.tweets = [];
    $scope.if_authorized = false;
  };

  $scope.$watch(function(scope) {
    return scope.if_authorized;
  }, function(newValue, oldValue) {
    if (newValue == true) {
      tweetsSearchService.getUser().then(function(data) {
        $scope.user = data;
      }, function() {
        alert("cannot reach to Twitter API");
      });
    }
  });

  //After authorization, users will still be login even if they close browser
  if (tweetsSearchService.isReady()) {
    $scope.if_authorized = true;
  }

});