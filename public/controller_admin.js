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
            templateUrl : '/Admin/users/add_user.html'
        })
        .when('/manager_users', {
            templateUrl : '/Admin/users/manager_users.html'
        })
        .when('/update_users/:id', {
            templateUrl : '/Admin/users/update_user.html'
        })
        .when('/manager_category/', {
            templateUrl : '/Admin/category/manager_category.html'
        })
        .when('/manager_category/add', {
            templateUrl : '/Admin/category/add_category.html'
        })
        .when('/manager_category/:id', {
            templateUrl : '/Admin/category/update_category.html'
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

app.controller("add_client", function($scope, $http,$window){
    
    $http.defaults.headers.common['x-access-token'] = token;
    
    $scope.addClient_user = function(){

        $http.post('/api/clients_users/add', $scope.add)
            .success(function(data) {
                pushMessage('success', 'HECHO', 'Cliente agregado', "checkmark")
                $window.location = "admin_dashboard#/management_clients";
                $scope.add = {};
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
    $scope.all = {};  
    
    $http.get('/api/clients_users/' + $routeParams.id)
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

    $http.get('/api/users/search/' + $routeParams.id)
        .success(function(data) 
        {
            $scope.all = data;
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
                pushMessage('success', 'HECHO', 'Usuario creado', "checkmark")
                $window.location = "admin_dashboard#/edit_client/" + $scope.variables.admin;
                $scope.variables = {};
            })
            .error(function(msg) {
                console.log(msg);
                pushMessage('alert','ERROR','VERIFIQUE LA INFORMACION', "cross")
            });
    }; 

    
})

app.controller("clients_users_user", function($scope, $http, $window)
{
    $http.defaults.headers.common['x-access-token']=token;
    $scope.NewClient = {};  

    $http.get('/api/users/')
        .success(function(data) {
            $scope.all = data;
        })
        .error(function(data) {
            console.log('Error: ' + data);
    });

    
    $scope.SearchClient = function(){
        $scope.inputbox
        $http.post('/api/users/search', $scope.inputbox)
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

app.controller("ClientUserUpdate", function($scope, $http, $routeParams, $window)
{
    $http.defaults.headers.common['x-access-token']=token;

    $scope.Client = {};  
    $scope.variables = {};  
    
    $http.get('/api/users/' + $routeParams.id)
        .success(function(data) 
        {
            $scope.variables = data;
        })
        .error(function(data) 
        {
            console.log(msg);
            $window.location = "admin_dashboard#/management_clients";
            pushMessage('alert','ERROR', 'ID no encontrado.')
        });

    
    $http.get('/api/clients_users/')
        .success(function(data) 
        {
            $scope.Clients = data;
        })
        .error(function(data) 
        {
            console.log(msg);
        });

    $scope.Update = function()
    {
        $http.post('/api/users/update', $scope.variables)
            .success(function(err) 
            {
                pushMessage('success', 'HECHO', 'Cliente actualizado con exito', "checkmark")
                $window.location = "admin_dashboard#/edit_client/" + $scope.variables.admin;
                $scope.variables = {};
            })
            .error(function(msg) 
            {
                console.log(msg);
                pushMessage('alert','ERROR', 'VERIFIQUE LA INFORMACION', "cross")
            })
    }  

    
    $scope.Delete = function()
    {
        $http.post('/api/users/delete', $scope.variables)
            .success(function(err) 
            {
                pushMessage('success', 'HECHO', 'Cliente eliminado con exito', "checkmark")
                $window.location = "admin_dashboard#/edit_client/" + $scope.variables.admin;
                $scope.variables = {};
            })
            .error(function(msg) 
            {
                console.log(msg);
                pushMessage('alert','ERROR', 'VERIFIQUE LA INFORMACION', "cross")
            })
    };  
})

app.controller("category", function($scope, $http, $window)
{
    $http.defaults.headers.common['x-access-token']=token;
    $scope.NewClient = {};  

    $http.get('/api/catproducts/')
        .success(function(data) {
            $scope.all = data;
        })
        .error(function(data) {
            console.log('Error: ' + data);
    });

    $scope.CreateCatProduct = function(){

        $http.post('/api/catproducts/add/admin', $scope.Newproduct)
            .success(function(data) {
                $scope.productstmp = data;
                $scope.Newproduct = {}
                pushMessage('success', 'HECHO', 'Categoria agregada', "checkmark")
            })
            .error(function(msg) {
                pushMessage('alert','ERROR',msg, "cross")
            });
    }; 

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
        $http.post('/api/catproducts/search', $scope.inputbox)
            .success(function(data) {
                pushMessage('success','FOUNT',"categoria's encontrados", "checkmark")
                $scope.all = data;
            })
            .error(function(msg) {
                console.log(msg);
                pushMessage('info','NOT FOUND',msg, "question")
            });
    };  


})

app.controller("UpdateCatproducts", function($scope, $http, $routeParams, $window)
{
    $http.defaults.headers.common['x-access-token']=token;
    $scope.DateCatProduct = {};  

    

    $http.get('/api/catproducts/' + $routeParams.id)
        .success(function(data) 
        {
            $scope.DateCatProduct = data;
        })
        .error(function(data) 
        {
            $window.location = "dashboard#clients";
            pushMessage('alert','ERROR', 'ID no encontrado.')
        });

    $scope.Update = function()
    {
        $http.post('/api/catproducts/update/admin', $scope.DateCatProduct)
            .success(function(err) 
            {
                pushMessage('success', 'HECHO', err, "checkmark")
                $scope.DateCatProduct = {};
                $window.location = "admin_dashboard#/manager_category/";
            })
            .error(function(msg) 
            {
                pushMessage('alert','ERROR', msg, "cross")
            })
    }  

    
    $scope.Delete = function()
    {
        $http.post('/api/catproducts/delete/admin', $scope.DateCatProduct)
            .success(function(err) 
            {
                pushMessage('success', 'HECHO', err, "checkmark")
                $scope.DateCatProduct = {};
                $window.location = "admin_dashboard#/manager_category/";
            })
            .error(function(msg) 
            {
                pushMessage('alert','ERROR', msg, "cross")
            })
    };  
})
