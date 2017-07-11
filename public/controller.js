var app = angular.module('restweb', ['ngRoute'])
var token = "eyJhbGciOiJIUzI1NiJ9.cGF5bG9hZA.f_0OBq6Yxx-jymUjCMcifD5ji1adKKYWUmwZF94VvTA";


app.config(function($routeProvider){
    $routeProvider
        .when('/', {
            templateUrl : '/clients_users/index.html'
        })
        .when('/clients', {
        	templateUrl : '/clients_users/clients/Clients.html'
        })
        .when('/addclient', {
            templateUrl : '/clients_users/clients/AddClient.html'
        })
        .when('/editclient/:id', {
            templateUrl : '/clients_users/clients/UpdateClient.html'
        })
        .when('/catproducts', {
            templateUrl: '/clients_users/products/catproducts.html'
        })
        .when('/catproducts/:id', {
            templateUrl : '/clients_users/products/UpdateCatproducts.html'
        })
        .when('/ingredientes', {
            templateUrl: '/clients_users/Ingredientes/Ingredientes.html'
        })
        .when('/ingredientes/:id', {
            templateUrl : '/clients_users/Ingredientes/UpdateIngredientes.html'
        })
        .otherwise({
            redirectTo : '/'
        })
})

app.controller("UserValues", function($scope, $http){
    $http.defaults.headers.common['x-access-token']=token;
    $scope.usuario = {};  

    $http.get('/api/users/values')
        .success(function(data) {
            $scope.usuario = data;
        })
        .error(function(data) {
            console.log('Error: ' + data);
    });
});

app.controller("clients", function($scope, $http, $window)
{
    $http.defaults.headers.common['x-access-token']=token;
    $scope.Client = {};  

    $http.get('/api/clients/')
        .success(function(data) {
            $scope.all = data;
        })
        .error(function(data) {
            console.log('Error: ' + data);
    });

    $scope.CreateClient = function(){
        $http.post('/api/clients/add', $scope.Client)
            .success(function(id) {
                $scope.Client = {};
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
    
    $scope.productstmp = {};

    $http.get('/api/catproducts/')
        .success(function(data) {
            $scope.productstmp = data;
        })
        .error(function(data) {
            pushMessage('alert','ERROR',data, "cross")
    });


    $scope.CreateCatProduct = function(){

        $http.post('api/catproducts/add', $scope.Newproduct)
            .success(function(data) {
                $scope.productstmp = data;
                $scope.Newproduct = {}
                pushMessage('success', 'HECHO', 'Categoria agregada', "checkmark")
            })
            .error(function(msg) {
                pushMessage('alert','ERROR',msg, "cross")
            });
    }; 

    $scope.SearchCatProduct = function(){
        $scope.inputbox
        $http.post('/api/catproducts/search', $scope.inputbox)
            .success(function(data) {
                pushMessage('success','FOUNT',"Categoria encontrada", "checkmark")
                $scope.productstmp = data;
            })
            .error(function(msg) {
                pushMessage('info','NOT FOUND',msg, "question")
            });
    };  
})


app.controller("UpdateCatproducts", function($scope, $http, $routeParams, $window)
{
    $http.defaults.headers.common['x-access-token']=token;
    $scope.DateCatProduct = {};  

    $scope.id = $routeParams.id
    

    $http.get('/api/catproducts/' + $scope.id)
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
        $http.post('/api/catproducts/update', $scope.DateCatProduct)
            .success(function(err) 
            {
                pushMessage('success', 'HECHO', 'Categoria actualizada con exito', "checkmark")
                $scope.DateCatProduct = {};
                $window.location = "dashboard#/catproducts";
            })
            .error(function(msg) 
            {
                pushMessage('alert','ERROR', msg, "cross")
            })
    }  

    
    $scope.Delete = function()
    {
        $http.post('/api/catproducts/delete', $scope.DateCatProduct)
            .success(function(err) 
            {
                pushMessage('success', 'HECHO', 'Categoria eliminada con exito', "checkmark")
                $scope.DateCatProduct = {};
                $window.location = "dashboard#/catproducts";
            })
            .error(function(msg) 
            {
                pushMessage('alert','ERROR', msg, "cross")
            })
    };  
})

app.controller("ingredientes", function($scope, $http){
    
    $http.defaults.headers.common['x-access-token']=token;
    
    $scope.ingredientestmp = {};

    $http.get('/api/ingredientes/')
        .success(function(data) {
            $scope.ingredientestmp = data;
        })
        .error(function(data) {
            pushMessage('alert','ERROR',data, "cross")
    });


    $scope.CreateIngrediente = function(){

        $http.post('api/ingredientes/add', $scope.Newproduct)
            .success(function(data) {
                $scope.ingredientestmp = data;
                $scope.Newproduct = {}
                pushMessage('success', 'HECHO', 'Categoria agregada', "checkmark")
            })
            .error(function(msg) {
                pushMessage('alert','ERROR',msg, "cross")
            });
    }; 

    $scope.SearchIngredient = function(){
        $scope.inputbox
        $http.post('/api/ingredientes/search', $scope.inputbox)
            .success(function(data) {
                pushMessage('success','FOUNT',"Cliente's encontrados", "checkmark")
                $scope.ingredientestmp = data;
            })
            .error(function(msg) {
                pushMessage('info','NOT FOUND',msg, "question")
            });
    };  
})


app.controller("UpdateIngrediente", function($scope, $http, $routeParams, $window)
{
    $http.defaults.headers.common['x-access-token']=token;
    $scope.ingrediente = {};  

    $scope.id = $routeParams.id
    

    $http.get('/api/ingredientes/' + $scope.id)
        .success(function(data) 
        {
            $scope.ingrediente = data;
        })
        .error(function(data) 
        {
            $window.location = "dashboard#clients";
            pushMessage('alert','ERROR', 'ID no encontrado.')
        });

    $scope.Update = function()
    {
        $http.post('/api/ingredientes/update', $scope.ingrediente)
            .success(function(err) 
            {
                pushMessage('success', 'HECHO', 'Ingrediente actualizado con exito', "checkmark")
                $scope.ingrediente = {};
                $window.location = "dashboard#/ingredientes";
            })
            .error(function(msg) 
            {
                pushMessage('alert','ERROR', msg, "cross")
            })
    }  

    
    $scope.Delete = function()
    {
        $http.post('/api/ingredientes/delete', $scope.ingrediente)
            .success(function(err) 
            {
                pushMessage('success', 'HECHO', 'Ingrediente eliminado con exito', "checkmark")
                $scope.ingrediente = {};
                $window.location = "dashboard#/ingredientes";
            })
            .error(function(msg) 
            {
                pushMessage('alert','ERROR', msg, "cross")
            })
    };  
})