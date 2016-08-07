var app = angular.module('restweb', ['ngRoute'])

app.config(function($routeProvider){
    $routeProvider
        .when('/', {
            templateUrl : 'Clients.html'
        })
        .when('/clients', {
            templateUrl : 'Clients.html'
        })
        .when('/addclient', {
            templateUrl : 'AddClient.html'
        })
        .otherwise({
            redirectTo : '/'
        })
})

app.controller("clients", function($scope, $http)
{
    $scope.NewClient = {};

    $http.get('/api/clients/')
        .success(function(data) {
            $scope.all = data;
            console.log(data)
        })
        .error(function(data) {
            console.log('Error: ' + data);
    });

    $scope.CreateClient = function(){
        $http.post('/api/clients', $scope.NewClient)
            .success(function(data) {
                $scope.NewClient = {};
                $scope.all = data;
                console.log(data);
            })
            .error(function(data) {
                console.log('Error:' + data);
            });
    };  
})

app.controller("users", function($scope, $http)
{
    $scope.NewUser = {};

    $http.get('/api/users/')
        .success(function(data) {
            $scope.all = data;
            console.log(data)
        })
        .error(function(data) {
            console.log('Error: ' + data);
    });

    $scope.CreateUsers = function(){
        $http.post('/api/users', $scope.NewUser)
            .success(function(data) {
                $scope.NewUser = {};
                $scope.all = data;
                console.log(data);
            })
            .error(function(data) {
                console.log('Error:' + data);
            });
    };  
})
