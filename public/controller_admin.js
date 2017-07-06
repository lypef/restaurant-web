var app = angular.module('restweb', ['ngRoute'])
var token = "eyJhbGciOiJIUzI1NiJ9.cGF5bG9hZA.f_0OBq6Yxx-jymUjCMcifD5ji1adKKYWUmwZF94VvTA";

app.config(function($routeProvider){
    $routeProvider
        .when('/', {
            templateUrl : '/Admin/index.html'
        })
        .when('/dashboard_clients', {
            templateUrl : '/Admin/dashboard_clients.html'
        })
        .when('/management_clients', {
            templateUrl : '/Admin/management_clients.html'
        })
        .when('/add_client', {
            templateUrl : '/Admin/add_client.html'
        })
        .otherwise({
            redirectTo : '/'
        })
})

app.controller("clients_users", function($scope, $http, $window)
{
    $http.defaults.headers.common['x-access-token']=token;
    $scope.NewClient = {};  

    $http.get('/api/clients_users/')
        .success(function(data) {
            $scope.all = data;
        })
        .error(function(data) {
            console.log('Error: ' + data);
    });

    $scope.CreateClient = function(){
        $http.post('/api/clients', $scope.NewClient)
            .success(function(id) {
                $scope.NewClient = {};
                pushMessage('success', 'HECHO', 'Cliente agregado con exito', "checkmark")
                $window.location = "dashboard#/editclient/" + id;
            })
            .error(function(msg) {
                pushMessage('alert','ERROR',msg, "cross")
            });
    };  

    $scope.SearchClient = function(){
        $scope.inputbox
        $http.post('/api/clients_users/search', $scope.inputbox)
            .success(function(data) {
                pushMessage('success','FOUNT',"Cliente's encontrados", "checkmark")
                $scope.all = data;
            })
            .error(function(msg) {
                pushMessage('info','NOT FOUND',msg, "question")
            });
    };  


})

app.controller("add_client", function($scope, $http){
    
    $http.defaults.headers.common['x-access-token'] = token;
    
    $scope.addClient_user = function(){

        $http.post('/api/clients_users/add', $scope.add)
            .success(function(data) {
                $scope.add = {};
                pushMessage('success', 'HECHO', 'Cliente agregado', "checkmark")
            })
            .error(function(msg) {
                pushMessage('alert','ERROR',msg, "cross")
            });
    }; 

    
})