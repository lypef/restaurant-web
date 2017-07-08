var app = angular.module('restweb', ['ngRoute'])
var token = "eyJhbGciOiJIUzI1NiJ9.cGF5bG9hZA.f_0OBq6Yxx-jymUjCMcifD5ji1adKKYWUmwZF94VvTA";


app.config(function($routeProvider){
    $routeProvider
        .when('/', {
            templateUrl : '/Admin/index.html'
        })
        .when('/management_clients', {
            templateUrl : '/Admin/clients/management_clients.html'
        })
        .when('/add_client', {
            templateUrl : '/Admin/clients/add_client.html'
        })
        .when('/edit_client/:id', {
            templateUrl : '/Admin/clients/edit_client.html'
        })
        .when('/add_client_user', {
            templateUrl : '/Admin/clients/add_client_user.html'
        })
        .otherwise({
            redirectTo : '/'
        })
})


app.controller("UserValues", function($scope, $http){
    $http.defaults.headers.common['x-access-token']=token;
    $scope.usuario = {};  

    $http.get('/api/admin/values')
        .success(function(data) {
            $scope.usuario = data;
        })
        .error(function(data) {
            console.log('Error: ' + data);
    });
});

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
                console.log(msg);
                pushMessage('alert','ERROR','VERIFIQUE LA INFORMACION', "cross")
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
                console.log(msg);
                pushMessage('warning','NOT FOUND',msg, "question")
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
                console.log(msg);
                pushMessage('alert','ERROR','VERIFIQUE LA INFORMACION', "cross")
            });
    }; 
    
})

app.controller("clientUpdate", function($scope, $http, $routeParams, $window)
{
    $http.defaults.headers.common['x-access-token']=token;

    $scope.Client = {};  
    $scope.id = $routeParams.id;  
    
    $http.get('/api/clients_users/' + $scope.id)
        .success(function(data) 
        {
            $scope.Client = data;
        })
        .error(function(data) 
        {
            console.log(msg);
            $window.location = "admin_dashboard#/management_clients";
            pushMessage('alert','ERROR', 'ID no encontrado.')
        });

    $scope.Update = function()
    {
        $http.post('/api/clients_users/update', $scope.Client)
            .success(function(err) 
            {
                pushMessage('success', 'HECHO', 'Cliente actualizado con exito', "checkmark")
                $scope.Client = {};
                $window.location = "admin_dashboard#/management_clients";
            })
            .error(function(msg) 
            {
                console.log(msg);
                pushMessage('alert','ERROR', 'VERIFIQUE LA INFORMACION', "cross")
            })
    }  

    
    $scope.Delete = function()
    {
        $http.post('/api/clients_users/delete', $scope.Client)
            .success(function(err) 
            {
                pushMessage('success', 'HECHO', 'Cliente eliminado con exito', "checkmark")
                $scope.Client = {};
                $window.location = "admin_dashboard#/management_clients";
            })
            .error(function(msg) 
            {
                console.log(msg);
                pushMessage('alert','ERROR', 'VERIFIQUE LA INFORMACION', "cross")
            })
    };  
})

// Agregar usuario a partir de un cliente

app.controller("AddUser_Client", function($scope, $http, $routeParams, $window)
{
    $http.defaults.headers.common['x-access-token']=token;

    $scope.Clients = {};  
    $scope.variables = {};
    
    $http.get('/api/clients_users/')
        .success(function(data) 
        {
            $scope.Clients = data;
        })
        .error(function(data) 
        {
            console.log(msg);
        });

    $scope.CreateUser = function(){
        
        $http.post('/api/users/add', $scope.variables)
            .success(function(data) {
                $scope.variables = {};
                pushMessage('success', 'HECHO', 'Usuario creado', "checkmark")
            })
            .error(function(msg) {
                console.log(msg);
                pushMessage('alert','ERROR','VERIFIQUE LA INFORMACION', "cross")
            });
    }; 

    
})


