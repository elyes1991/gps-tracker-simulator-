angular.module('authService',[])
// =====================================================================
// auth factory to login and to get user information
// inject $http for communicating with API
// inject $q to return promise objects
// inject AuthToken to manage tokens
// =====================================================================
.factory('Auth',function($http,$q,AuthToken){

        // create auth factory object
        var authFactory = {};

        // log a user in
        authFactory.login =  function(username, password){

            // return the promise data and its data
            return $http.post('/api/authenticate',{
                username : username,
                password : password
            }).success(function(data){
                AuthToken.setToken(data.token);
                return data;
            });
        };

        // log a user out by clearing the token
        authFactory.logout = function(){
            AuthToken.setToken();
        };

        // check if the user is connected
        authFactory.isLoggedIn = function(){
            if (AuthToken.getToken()){
                return true;
            }else{
                return false;
            }
        };

        // get the logged in user
        authFactory.getUser = function(){
            if(AuthToken.getToken())
                return $http.get('/api/me',{cache : true});
            else
               return $q.reject({message : 'User has nos token'});
        };

        // return the auth factory object
        return authFactory;
})
// =====================================================================
// AuthToken factory for handling tokens
// inject $window for communicating with API
// =====================================================================
.factory('AuthToken',function($window){

    var authFactoryToken = {};

    // get the token from local storage
    authFactoryToken.getToken = function(){
       return $window.localStorage.getItem('token');
    };

    // get the token from local storage
    authFactoryToken.setToken = function(token){
        if(token)
            $window.localStorage.setItem('token',token);
        else
            $window.localStorage.removeItem('token');
    };

    return authFactoryToken;

})
// =====================================================================
// application configuration to integrate token into requests
// =====================================================================
.factory('AuthInterceptor',function($q,$location,AuthToken){
   var interceptorFactory = {};

        // this will happen on all HTTP requests
        interceptorFactory.request =  function(config){
            // grab the token
            var token =  AuthToken.getToken();

            // if token exists, add it to the header as w-access-token
            if(token)
                config.headers['x-access-token'] =  token;
            return config;
        };

        // this will happen on all HTTP requests
        interceptorFactory.responseError =  function(response){
            if(response.status === 403)
                $location.path('/login');

            // return the errors from the server as a promise
            return $q.reject(response);
        };

   return interceptorFactory;
});