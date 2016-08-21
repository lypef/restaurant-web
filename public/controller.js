var app = angular.module('restweb', ['ngRoute'])
var token = "eyJhbGciOiJIUzI1NiJ9.cGF5bG9hZA.f_0OBq6Yxx-jymUjCMcifD5ji1adKKYWUmwZF94VvTA";

app.config(function($routeProvider){
    $routeProvider
        .when('/', {
            templateUrl : 'main.html'
        })
        .when('/clients', {
        	templateUrl : 'clients/Clients.html'
        })
        .when('/addclient', {
            templateUrl : 'clients/AddClient.html'
        })
        .when('/editclient/:id', {
            templateUrl : 'clients/UpdateClient.html'
        })
        .otherwise({
            redirectTo : '/'
        })
})

app.controller("clients", function($scope, $http, $window)
{
    $http.defaults.headers.common['x-access-token']=token;
    $scope.NewClient = {};    
    $http.get('/api/clients/')
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
            .error(function(id) {
                pushMessage('alert','ERROR', 'Verifique todo los campos', "cross")
            });
    };  
})

app.controller("UpdateClient", function($scope, $http, $routeParams, $window)
{
    $http.defaults.headers.common['x-access-token']=token;
    
    $scope.id = $routeParams.id

    $http.get('/api/clientedit/' + $scope.id)
        .success(function(data) 
        {
            $scope.client = data;
        })
        .error(function(data) 
        {
            $window.location = "dashboard#clients";
            pushMessage('alert','ERROR', 'ID no encontrado.')
        });

    $scope.DeleteClient = function()
    {
        pushMessage('success', 'HECHO', 'Cliente eliminado con exito', "checkmark")
    };  
})

app.controller("login", function($scope, $http, $window, $routeParams)
{
    $scope.CreateSession = function()
    {
        $window.location = "dashboard#"
        console.log($routeParams.password)
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
