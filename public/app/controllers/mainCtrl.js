angular.module('mainCtrl',[])
       .controller('mainController',function($rootScope,$location,Auth){
            var vm =this;

            // get info if a person is loggedIn
            vm.isLoggedIn = Auth.isLoggedIn();

            // check if user is logged in in every request
            $rootScope.$on('$routeChangeStart',function(){
                vm.isLoggedIn = Auth.isLoggedIn();

                // get User info on route change
                Auth.getUser()
                    .success(function(data){
                        vm.user = data;
                });
            });

            vm.doLogin = function(){
                // call the Auth.login() function
                vm.processing =  true;
                Auth.login(vm.loginData.username,vm.loginData.password)
                    .success(function(data){
                        vm.processing =  false;
                        //clear the error
                        vm.error = '';
                        // if user successfully logs in, redirect to users page
                        if(data.success)
                            $location.path('/users');
                        else
                        vm.error = data.message;
                    });
            };

            // function to handle logging out
            vm.doLogout = function(){
                // call the Auth.login() function
                Auth.logout();

                // reset all user info
                vm.user = {};
                $location.path('/login');
            };

        });