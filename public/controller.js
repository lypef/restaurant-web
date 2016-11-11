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
        .when('/catproducts', {
            templateUrl: 'products/catproducts.html'
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
            .error(function(msg) {
                pushMessage('alert','ERROR',msg, "cross")
            });
    };  

    $scope.SearchClient = function(){
        $scope.inputbox
        $http.post('/api/client/search', $scope.inputbox)
            .success(function(data) {
                pushMessage('success','FOUNT',"Cliente's encontrados", "checkmark")
                $scope.all = data;
            })
            .error(function(msg) {
                pushMessage('info','NOT FOUND',msg, "question")
            });
    };  


})

app.controller("UpdateClient", function($scope, $http, $routeParams, $window)
{
    $http.defaults.headers.common['x-access-token']=token;
    $scope.DateClient = {};  

    $scope.id = $routeParams.id
    

    $http.get('/api/clientedit/' + $scope.id)
        .success(function(data) 
        {
            $scope.DateClient = data;
        })
        .error(function(data) 
        {
            $window.location = "dashboard#clients";
            pushMessage('alert','ERROR', 'ID no encontrado.')
        });

    $scope.Update = function()
    {
        $http.post('/api/client/update', $scope.DateClient)
            .success(function(err) 
            {
                pushMessage('success', 'HECHO', 'Cliente actualizado con exito', "checkmark")
                $scope.DateClient = {};
                $window.location = "dashboard#/clients";
            })
            .error(function(msg) 
            {
                pushMessage('alert','ERROR', msg, "cross")
            })
    }  

    
    $scope.Delete = function()
    {
        $http.post('/api/client/delete', $scope.DateClient)
            .success(function(err) 
            {
                pushMessage('success', 'HECHO', 'Cliente eliminado con exito', "checkmark")
                $scope.DateClient = {};
                $window.location = "dashboard#/clients";
            })
            .error(function(msg) 
            {
                pushMessage('alert','ERROR', msg, "cross")
            })
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

app.controller("products", function($scope, $http){
    
    $http.defaults.headers.common['x-access-token']=token;
    $scope.productstmp = {}  
    $scope.Newproduct = {}  

    $http.get('/api/catproducts/')
        .success(function(data) {
            $scope.productstmp = data;
        })
        .error(function(data) {
            console.log('Error: ' + data);
    });


    $scope.CreateCatProduct = function(){

        $http.post('api/catproducts/add', $scope.Newproduct)
            .success(function(data) {
                pushMessage('success', 'HECHO', 'Categoria agregada', "checkmark")
            })
            .error(function(msg) {
                pushMessage('alert','ERROR',msg, "cross")
            });
    }; 

})


