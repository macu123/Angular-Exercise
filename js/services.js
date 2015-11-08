angular.module('tweetsSearchApp.services', []).factory('tweetsSearchService', function($q) {
  //constant declared globally
  var ENDPOINT = '/1.1/search/tweets.json?q=';
  var PUBLICK_KEY = 'llUq8lrTe6qeqP-NZP89W9vXL8Q';
  var PROVIDER = 'twitter';
  //initial state
  var authorizationResult = false;

  return {
    initialize: function() {
      //initialize OAuth.io with public key
      OAuth.initialize(PUBLICK_KEY, {
        cache: true //execute the callback if the tokens are already there
      });

      //create an authorization result when initialize
      authorizationResult = OAuth.create(PROVIDER);

    },

    isReady: function() {
      return authorizationResult;
    },

    connectToTwitter: function(callback) {
      //Using popup
      OAuth.popup('twitter')
      .done(function(result) {
        authorizationResult = result;
        callback();
      })
      .fail(function(error) {
        alert("Cannot connect to Twitter currently! Please try it later.");
      });
    },

    clearCache: function() {
      OAuth.clearCache(PROVIDER);
      authorizationResult = false;
    },

    getUser: function() {
      //create a deferred object
      var deferred = $q.defer();
      var promise = authorizationResult.me().done(function(data) {
        deferred.resolve(data);
      }).fail(function(error) {
        deferred.reject(error);
      });

      return deferred.promise;
    },

    getTweets: function(keyword) {
      //create a deferred object
      var deferred = $q.defer();
      var url = ENDPOINT + keyword;
      var promise = authorizationResult.get(url).done(function(data) {
        deferred.resolve(data);
      }).fail(function(error) {
        deferred.reject(error);
      });

      return deferred.promise;
    }

  }
});