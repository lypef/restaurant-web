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
        .when('/manager_measurement', {
            templateUrl : '/Admin/measurement/index.html'
        })
        .otherwise({
            redirectTo : '/'
        })
})


app.controller("UserValues", function($scope, $http){
    $http.defaults.headers.common['x-access-token']=token;
    $scope.usuario = {};  

    $scope.$on('load', function(){$scope.loading = true})
    $scope.$on('unload', function(){$scope.loading = false})

    $scope.$on('loadasc', function(){$scope.loadinasc = true})
    $scope.$on('unloadasc', function(){$scope.loadinasc = false})

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

    $scope.GetClientsuser = function (){
        $scope.$emit('load')
        $http.get('/api/admin/accounts/')
        .success(function(data) {
            $scope.all = data;
        })
        .error(function(data) {
            console.log('Error: ' + data);
        })
        .finally ( function (){
            $scope.$emit('unload')
        })
    }
    $scope.GetClientsuser()

    $scope.SearchClient = function(){
        $scope.$emit('loadasc')
        $scope.inputbox
        $http.post('/api/admin/accounts/search', $scope.inputbox)
        .success(function(data) {
            pushMessage('success','FOUNT',"Cliente's encontrados", "checkmark")
            $scope.all = data;
        })
        .error(function(msg) {
            console.log(msg);
            pushMessage('warning','NOT FOUND',msg, "question")
        })
        .finally (function (){
            $scope.$emit('unloadasc')
        })
    };  

})

app.controller("add_client", function($scope, $http,$window){
    
    $http.defaults.headers.common['x-access-token'] = token;
    
    $scope.addClient_user = function(){
        $scope.$emit('loadasc')
        $http.post('/api/admin/accounts/create', $scope.add)
        .success(function(data) {
            pushMessage('success', 'HECHO', 'Cliente agregado', "checkmark")
            $window.location = "admin_dashboard#/management_clients";
            $scope.add = {};
        })
        .error(function(msg) {
            console.log(msg);
            pushMessage('alert','ERROR','VERIFIQUE LA INFORMACION', "cross")
        })
        .finally(function (){
            $scope.$emit('unloadasc')
        })
    }; 
    
})

app.controller("clientUpdate", function($scope, $http, $routeParams, $window)
{
    $http.defaults.headers.common['x-access-token']=token;

    $scope.Client = {};  
    $scope.all = {};  
    
    $scope.GetClientsuser = function (){
        $scope.$emit('load')
        $http.get('/api/admin/accounts/' + $routeParams.id)
        .success(function(data) 
        {
            $scope.Client = data;
        })
        .error(function(data) 
        {
            console.log(msg);
            $window.location = "admin_dashboard#/management_clients";
            pushMessage('alert','ERROR', 'ID no encontrado.')
        })
    }
    
    $scope.Getusers = function (){
        $http.get('/api/admin/accounts/users/' + $routeParams.id)
        .success(function(data) 
        {
            $scope.all = data;
        })
        .error(function(data) 
        {
            console.log(msg);
            $window.location = "admin_dashboard#/management_clients";
            pushMessage('alert','ERROR', 'ID no encontrado.')
        })
        .finally (function (){
            $scope.$emit('unload')
        })
    }
    $scope.GetClientsuser()  
    $scope.Getusers()     

    $scope.Update = function()
    {
        $scope.$emit('loadasc')
        $http.post('/api/admin/accounts/update', $scope.Client)
        .success(function(err) 
        {
            pushMessage('success', 'HECHO', err, "checkmark")
            $scope.Client = {};
            $window.location = "admin_dashboard#/management_clients";
        })
        .error(function(msg) 
        {
            console.log(msg);
            pushMessage('alert','ERROR', 'VERIFIQUE LA INFORMACION', "cross")
        })
        .finally (function (){
            $scope.$emit('unloadasc')
        })
    }  

    
    $scope.Delete = function()
    {
        $http.post('/api/admin/accounts/delete', $scope.Client)
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
    
    $scope.Getclient_user = function (){
        $scope.$emit('load')
        $http.get('/api/admin/accounts/')
        .success(function(data) 
        {
            $scope.Clients = data;
        })
        .error(function(data) 
        {
            console.log(msg);
        })
        .finally (function (){
            $scope.$emit('unload')
        })
    }
    $scope.Getclient_user()

    $scope.CreateUser = function(){
        $scope.$emit('loadasc')
        $http.post('/api/admin/accounts/users/create', $scope.variables)
        .success(function(data) {
            pushMessage('success', 'HECHO', 'Usuario creado', "checkmark")
            $window.location = "admin_dashboard#/edit_client/" + $scope.variables.admin;
            $scope.variables = {};
        })
        .error(function(msg) {
            console.log(msg);
            pushMessage('alert','ERROR','VERIFIQUE LA INFORMACION', "cross")
        })
        .finally (function (){
            $scope.$emit('unloadasc')
        })
    }; 

    
})

app.controller("clients_users_user", function($scope, $http, $window)
{
    $http.defaults.headers.common['x-access-token']=token;
    $scope.NewClient = {};  

    $scope.GetClientsuser = function (){
        $scope.$emit('load')
        $http.get('/api/admin/users')
        .success(function(data) {
            $scope.all = data;
        })
        .error(function(data) {
            console.log('Error: ' + data);
        })
        .finally (function (){
            $scope.$emit('unload')
        })
    }
    $scope.GetClientsuser()

    $scope.SearchClient = function(){
        $scope.$emit('loadasc')
        $scope.inputbox
        $http.post('/api/admin/accounts/users/search', $scope.inputbox)
        .success(function(data) {
            pushMessage('success','FOUNT',"Usuario's encontrados", "checkmark")
            $scope.all = data;
        })
        .error(function(msg) {
            console.log(msg);
            pushMessage('warning','NOT FOUND',msg, "question")
        })
        .finally (function (){
            $scope.$emit('unloadasc')
        })
    };  


})

app.controller("ClientUserUpdate", function($scope, $http, $routeParams, $window)
{
    $http.defaults.headers.common['x-access-token']=token;

    $scope.Client = {};  
    $scope.variables = {};  
    
    $scope.GetUser = function (){
        $scope.$emit('load')
        $http.get('/api/admin/accounts/user/' + $routeParams.id)
        .success(function(data) 
        {
            $scope.variables = data;
        })
        .error(function(data) 
        {
            console.log(msg);
            $window.location = "admin_dashboard#/management_clients";
            pushMessage('alert','ERROR', 'ID no encontrado.')
        })
    }

    $scope.GetUser_client = function (){
        $http.get('/api/admin/accounts/')
        .success(function(data) 
        {
            $scope.Clients = data;
        })
        .error(function(data) 
        {
            console.log(msg);
        })
        .finally (function (){
            $scope.$emit('unload')
        })
    }
    $scope.GetUser()
    $scope.GetUser_client()
    
    
    $scope.Update = function()
    {
        $http.post('/api/admin/accounts/user/update', $scope.variables)
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
        $http.post('/api/admin/accounts/users/delete', $scope.variables)
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

    $scope.Getcatproducts = function (){
        $scope.$emit('load')
        $http.get('/api/catproducts/')
        .success(function(data) {
            $scope.all = data;
        })
        .error(function(data) {
            console.log('Error: ' + data);
        })
        .finally(function (){
            $scope.$emit('unload')
        })
    }
    $scope.Getcatproducts()   

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
        $scope.$emit('loadasc')
        $scope.inputbox
        $http.post('/api/catproducts/search', $scope.inputbox)
        .success(function(data) {
            pushMessage('success','FOUNT',"categoria's encontrados", "checkmark")
            $scope.all = data;
        })
        .error(function(msg) {
            console.log(msg);
            pushMessage('info','NOT FOUND',msg, "question")
        })
        .finally (function (){
            $scope.$emit('unloadasc')
        })
    };  


})

app.controller("add_category", function($scope, $http, $window)
{
    $http.defaults.headers.common['x-access-token']=token;
    $scope.NewClient = {};  

    $scope.CreateCatProduct = function(){
        $scope.$emit('loadasc')
        $http.post('/api/catproducts/add/admin', $scope.Newproduct)
            .success(function(data) {
                $scope.productstmp = data;
                $scope.Newproduct = {}
                pushMessage('success', 'HECHO', 'Categoria agregada', "checkmark")
            })
            .error(function(msg) {
                pushMessage('alert','ERROR',msg, "cross")
            })
            .finally (function (){
            $scope.$emit('unloadasc')
        })
    }; 

})

app.controller("UpdateCatproducts", function($scope, $http, $routeParams, $window)
{
    $http.defaults.headers.common['x-access-token']=token;
    $scope.DateCatProduct = {};  

    $scope.GetProduct = function (){
        $scope.$emit('load')
        $http.get('/api/catproducts/' + $routeParams.id)
        .success(function(data) 
        {
            $scope.DateCatProduct = data;
        })
        .error(function(data) 
        {
            $window.location = "dashboard#clients";
            pushMessage('alert','ERROR', 'ID no encontrado.')
        })
        .finally (function (){
            $scope.$emit('unload')
        })
    }
    $scope.GetProduct()

    $scope.Update = function()
    {
        $scope.$emit('loadasc')
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
        .finally (function (){
            $scope.$emit('unloadasc')
        })
    }  

    
    $scope.Delete = function()
    {
        $scope.$emit('loadasc')
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
        .finally (function (){
            $scope.$emit('unloadasc')
        })
    };  
})


app.controller("measurement", function($scope, $http, $routeParams, $window)
{
    $http.defaults.headers.common['x-access-token']=token;
    
    $scope.measurement = {};  
    $scope.measurements = {};  
    $scope.measurementsID = {};  
    $scope.select = {};  


    $scope.Get_measurements = function (){
        $scope.$emit('load')
        $http.get('/api/get_measurements/')
        .success(function(data) 
        {
            $scope.measurements = data;
            $scope.select = data;
        })
        .error(function(data) 
        {
            pushMessage('alert','ERROR', 'Error')
        })
        .finally (function (){
            $scope.$emit('unload')
        })
    }
    $scope.Get_measurements()

    $scope.update = function()
    {
        $scope.$emit('loadasc')
        $http.post('/api/measurement/update', $scope.measurementsID)
        .success(function(doc) 
        {
            pushMessage('success', 'HECHO', doc, "checkmark")

            $http.get('/api/get_measurements/')
            .success(function(data) 
            {
                $scope.measurements = data;
                $scope.select = data;
            })
            
            $scope.measurementsID = {}
        })
        .error(function(msg) 
        {
            pushMessage('alert','ERROR', msg, "cross")
        })
        .finally (function (){
            $scope.$emit('unloadasc')
        })
    }  

    
    $scope.create = function()
    {
        $scope.$emit('loadasc')
        $http.post('/api/measurement/add', $scope.measurement)
        .success(function(err) 
        {
            $http.get('/api/get_measurements/')
                .success(function(data) 
                {
                    $scope.measurements = data
                    $scope.select = data
                })
            pushMessage('success', 'HECHO', err, "checkmark")
            $scope.measurement = {};
        })
        .error(function(msg) 
        {
            pushMessage('alert','ERROR', msg, "cross")
        })
        .finally (function (){
            $scope.$emit('unloadasc')
        })
    };  

    $scope.delete = function ()
    {
        $scope.$emit('loadasc')
        $http.post('/api/measurement/delete', $scope.measurementsID)
        .success(function(err) 
        {
            $http.get('/api/get_measurements/')
                .success(function(data) 
                {
                    $scope.measurements = data
                    $scope.select = data
                    $scope.measurementsID = {}
                })
            pushMessage('success', 'HECHO', err, "checkmark")
            $scope.measurement = {};
        })
        .error(function(msg) 
        {
            pushMessage('alert','ERROR', msg, "cross")
        })
        .finally (function (){
            $scope.$emit('unloadasc')
        })
    }

    $scope.LoadValuesEdit = function(){
        $scope.$emit('loadasc')
        $http.get('/api/get_measurements/' + $scope.select.select)
        .success(function(data) {
            $scope.measurementsID = data
            pushMessage('warning', 'HECHO', 'Unidad encontrada', "checkmark")
        })
        .error(function(msg) {
            pushMessage('alert','ERROR',msg, "cross")
        })
        .finally (function (){
            $scope.$emit('unloadasc')
        })
    };

    $scope.search = function(){
        $scope.$emit('loadasc')
        $scope.inputbox
        $http.post('/api/measurement/search', $scope.inputbox)
        .success(function(data) {
            pushMessage('success','FOUNT',"Medida encontrada", "checkmark")
            $scope.measurements = data;
        })
        .error(function(msg) {
            console.log(msg);
            pushMessage('info','NOT FOUND',msg, "question")
        })
        .finally (function (){
            $scope.$emit('unloadasc')
        })
    }

})
