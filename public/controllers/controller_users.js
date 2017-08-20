var app = angular.module('restweb', ['ngRoute'])

var token = "eyJhbGciOiJIUzI1NiJ9.cGF5bG9hZA.f_0OBq6Yxx-jymUjCMcifD5ji1adKKYWUmwZF94VvTA";


app.config(function($routeProvider){
    $routeProvider
        .when('/', {
            templateUrl : '/clients_users/index.html'
        })
        .when('/sales/vtd', {
            templateUrl : 'clients_users/sales/vtd.html'
        })
        .when('/clients', {
        	templateUrl : '/clients_users/clients/Clients.html'
        })
        .when('/direcciones/:id', {
            templateUrl : '/clients_users/clients/direcciones.html'
        })
        .when('/catproducts', {
            templateUrl: '/clients_users/catproducts/catproducts.html'
        })
        .when('/products', {
            templateUrl : '/clients_users/products/index.html'
        })
        .when('/products_shopping', {
            templateUrl : '/clients_users/products/products_shopping.html'
        })
        .when('/products/:id', {
            templateUrl : '/clients_users/products/edit.html'
        })
        .when('/ingredientes', {
            templateUrl : '/clients_users/ingredients/index.html'
        })
        .when('/ingredientes_shopping', {
            templateUrl : '/clients_users/ingredients/shopping.html'
        })
        .when('/recetas', {
            templateUrl : '/clients_users/recetas/index.html'
        })
        .when('/add_recetas', {
            templateUrl : '/clients_users/recetas/add.html'
        })
        .when('/edit_recetas/:id', {
            templateUrl : '/clients_users/recetas/edit.html'
        })
        .when('/surtir_receta/:id', {
            templateUrl : '/clients_users/recetas/surtir_receta.html'
        })
        .when('/view_recetas/:id', {
            templateUrl : '/clients_users/recetas/view.html'
        })
        .when('/admin', {
            templateUrl : '/clients_users/admin.html'
        })
        .when('/admin_movements', {
            templateUrl : '/clients_users/caja/movements.html'
        })
        .when('/caja/cut_x', {
            templateUrl : 'clients_users/caja/cut_x_user.html'
        })
        .when('/caja/cut_x_global', {
            templateUrl : 'clients_users/caja/cut_x_global.html'
        })
        .when('/admin_finance', {
            templateUrl : '/clients_users/caja/finance.html'
        })
        .otherwise({
            redirectTo : '/'
        })
})

app.controller("UserValues", function($scope, $http, $timeout){
    $http.defaults.headers.common['x-access-token']=token;
    $scope.usuario = {};
    $scope.addmoneyvar = {}
    $scope.removemoneyvar = {}

    $scope.$on('load', function(){$scope.loading = true})
    $scope.$on('unload', function(){$scope.loading = false})

    $scope.$on('loadasc', function(){$scope.loadinasc = true})
    $scope.$on('unloadasc', function(){$scope.loadinasc = false})
    
    $scope.$on('loadvalues', function(){
        $scope.loadinasc = true
        $http.get('/api/users/values')
        .success(function(data) {
            $scope.usuario = data;
            $scope.usuario.passwordtmp = $scope.usuario.password
        })
        .error(function(data) {
            console.log('Error: ' + data);
        })
        .finally (function (){
            $scope.loadinasc = false
        })
    })

    $scope.fileReaderSupported = window.FileReader != null;
    $scope.photoChanged = function(files){
        if (files != null) {
            var file = files[0];
        if ($scope.fileReaderSupported && file.type.indexOf('image') > -1) {
            $timeout(function() {
                var fileReader = new FileReader();
                fileReader.readAsDataURL(file);
                fileReader.onload = function(e) {
                    $timeout(function(){
                        $scope.usuario.img = e.target.result;
                    });
                }
            }
            );
        }
    }
    };

    $scope.cut_z_user = function(){
        $scope.$emit('loadasc')
        $http.post('/api/public/cut_z')
        .success (function (msg){
            pushMessage('success','', msg, "checkmark")
        })
        .error (function (msg){
            pushMessage('alert','ERROR', msg, "cross")
        })
        .finally (function (){
            $scope.$emit('unloadasc')
        })
    }

    $scope.cut_z_admin = function(){
        $scope.$emit('loadasc')
        $http.post('/api/account/cut_z')
        .success (function (msg){
            pushMessage('success','', msg, "checkmark")
        })
        .error (function (msg){
            pushMessage('alert','ERROR', msg, "cross")
        })
        .finally (function (){
            $scope.$emit('unloadasc')
        })
    }

    loadasc = function (){
        $scope.loadinasc = true
        $http.get('/api/users/values')
        .success(function(data) {
            $scope.usuario = data;
            $scope.usuario.passwordtmp = $scope.usuario.password
        })
        .error(function(data) {
            console.log('Error: ' + data);
        })
        .finally (function (){
            $scope.loadinasc = false
        })
    }
    $scope.$emit('loadvalues')

    $scope.updateuser = function (){
        if ($scope.usuario.password == $scope.usuario.passwordtmp)
        {
            $scope.$emit('loadasc')
            $http.post('/api/users/update', $scope.usuario)
            .success (function (msg){
                loadasc()
            })
            .error (function (msg){
                pushMessage('alert','ERROR', msg, "cross")
            })
            .finally (function (){
                $scope.$emit('unloadasc')
            })
        }else
        {
            pushMessage('alert','ERROR', 'Contraseña son iguales', "cross")
        }
    }

    $scope.updateuser_preferencias = function (){
        $scope.$emit('loadasc')
        $http.post('/api/users/update_preferencias', $scope.usuario)
        .success (function (msg){
                loadasc()
        })
        .error (function (msg){
            pushMessage('alert','ERROR', msg, "cross")
        })
        .finally (function (){
            $scope.$emit('unloadasc')
        })
    }

    $scope.addmoney = function (){
        $scope.$emit('loadasc')
        $http.post('/api/public/add_sale', $scope.addmoneyvar)
        .success (function (msg){
            pushMessage('success', 'HECHO', msg, "checkmark")
        })
        .error (function (msg){
            pushMessage('alert','ERROR', msg, "cross")
        })
        .finally (function (){
            $scope.$emit('unloadasc')
        })
    }

    $scope.removemoney = function (){
        $scope.$emit('loadasc')
        $scope.removemoneyvar.monto = '-'+$scope.removemoneyvar.monto
        $http.post('/api/public/add_sale', $scope.removemoneyvar)
        .success (function (msg){
            pushMessage('success', 'HECHO', msg, "checkmark")
        })
        .error (function (msg){
            pushMessage('alert','ERROR', msg, "cross")
        })
        .finally (function (){
            $scope.$emit('unloadasc')
        })
    }
});

app.controller("users_administrator", ['$scope', '$http','$timeout', function ($scope, $http, $timeout) {
    
    $http.defaults.headers.common['x-access-token']=token;
    
    $scope.currentPage = 0;
    $scope.pageSize = 5;
    $scope.pages = [];
    $scope.pageSizetmp = {}

    $scope.users = {}
    $scope.user = {}
    $scope.account = {}
    $scope.movements = {}
    $scope.tmp = {}
    $scope.loadmovements = false


    $scope.user.img = '/images/no-imagen.jpg'

    $scope.fileReaderSupported = window.FileReader != null;
    $scope.photoChanged = function(files){
        if (files != null) {
            var file = files[0];
        if ($scope.fileReaderSupported && file.type.indexOf('image') > -1) {
            $timeout(function() {
                var fileReader = new FileReader();
                fileReader.readAsDataURL(file);
                fileReader.onload = function(e) {
                    $timeout(function(){
                        $scope.user.img = e.target.result;
                    });
                }
            }
            );
        }
    }
    };

    $scope.photoChangedupdate = function(files){
        if (files != null) {
            var file = files[0];
        if ($scope.fileReaderSupported && file.type.indexOf('image') > -1) {
            $timeout(function() {
                var fileReader = new FileReader();
                fileReader.readAsDataURL(file);
                fileReader.onload = function(e) {
                    $timeout(function(){
                        $scope.tmp.img = e.target.result;
                    });
                }
            }
            );
        }
    }
    };

    $scope.updateAccount = function (){
        $scope.$emit('loadasc')
        $http.post('/api/account/update', $scope.account)
        .success (function (msg){
            pushMessage('success', 'HECHO', msg, "checkmark")
            GetAcccountAsc()
        })
        .error (function (msg){
            pushMessage('alert','ERROR', msg, "cross")
        })
        .finally (function (){
            $scope.$emit('unloadasc')
            $scope.$emit('loadvalues')
        })
    }

    GetAcccount = function (){
        $scope.$emit('load')
        $http.get('/api/account')
        .success(function(data){
            $scope.account = data
        })
        .error (function (msg){
            pushMessage('alert','ERROR', msg, "cross")
        })
    }

    GetAcccountAsc = function (){
        $http.get('/api/account')
        .success(function(data){
            $scope.account = data
        })
    }

    GetUsers = function (){
        $http.get('/api/account/users')
        .success(function(data){
            $scope.users = data
        })
        .error (function (msg){
            pushMessage('alert','ERROR', msg, "cross")
        })
    }

    GetUsersAsc = function (){
        $http.get('/api/account/users')
        .success(function(data){
            $scope.users = data
        })
    }

    GetMovements = function (){
        $http.get('/api/account/movements')
        .success(function(data){
            $scope.movements = data
            $scope.LoadPages()
        })
        .error (function (msg){
            pushMessage('alert','ERROR', msg, "cross")
        })
        .finally (function (){
            $scope.$emit('unload')
        })
    }

    GetAcccount()
    GetUsers()
    GetMovements()

    $scope.load = function (item)
    {
        $scope.tmp = item
        $scope.tmp.passwordtmp = item.password
    }

    $scope.delete = function ()
    {
        $scope.$emit('loadasc')

        $http.post('/api/account/users/delete', $scope.tmp)
        .success (function (msg){
            pushMessage('success', 'HECHO', msg, "checkmark")
            GetUsersAsc()
        })
        .error (function (msg){
            pushMessage('alert','ERROR', msg, "cross")
        })
        .finally (function (){
            $scope.$emit('unloadasc')
        })
    }

    $scope.update = function ()
    {
        if ($scope.tmp.password == $scope.tmp.passwordtmp)
        {
            $scope.$emit('loadasc')

            $http.post('/api/users/update_preferencias', $scope.tmp)
            .success (function (msg){
                $http.post('/api/account/users/update', $scope.tmp)
                GetUsersAsc()
                pushMessage('success', 'HECHO', msg, "checkmark")
            })
            .error (function (msg){
                pushMessage('alert','ERROR', msg, "cross")
            })
            .finally (function (){
                $scope.$emit('unloadasc')
                $scope.$emit('loadvalues')
            })
        }else
        {
            pushMessage('alert','ERROR', 'Contraseñas no son iguales', "cross")
        }
        
    }

    $scope.create = function (){
        if ($scope.user.password == $scope.user.passwordtmp)
        {
            $scope.$emit('loadasc')
            $http.post('/api/account/users/add', $scope.user)
            .success (function (msg){
                pushMessage('success', 'HECHO', msg, "checkmark")
                $scope.user = {}
                $scope.user.img = '/images/no-imagen.jpg'
            })
            .error (function (msg){
                pushMessage('alert','ERROR', msg, "cross")
            })
            .finally (function (){
                GetUsersAsc()
                $scope.$emit('unloadasc')
            })
        }else
        {
            pushMessage('alert','ERROR', 'Contraseñas no son iguales', "cross")
        }
    }
    
    $scope.ChangePageItems = function() {
        if ($scope.pageSizetmp.items == 'todos')
        {
            $scope.pageSize = $scope.movements.length
        }else {
            $scope.pageSize = $scope.pageSizetmp.items    
        }
        $scope.LoadPages()
    };

    $scope.LoadPages = function ()
    {
        $scope.pages.length = 0;
            var ini = $scope.currentPage - 4;
            var fin = $scope.currentPage + 5;
            if (ini < 1) {
              ini = 1;
              if (Math.ceil($scope.movements.length / $scope.pageSize) > 10)
                fin = 10;
              else
                fin = Math.ceil($scope.movements.length / $scope.pageSize);
            } else {
              if (ini >= Math.ceil($scope.movements.length / $scope.pageSize) - 10) {
                ini = Math.ceil($scope.movements.length / $scope.pageSize) - 10;
                fin = Math.ceil($scope.movements.length / $scope.pageSize);
              }
            }
            if (ini < 1) ini = 1;
            for (var i = ini; i <= fin; i++) {
              $scope.pages.push({
                no: i
              });
            }

            if ($scope.currentPage >= $scope.pages.length)
            $scope.currentPage = $scope.pages.length - 1;
    }
    
      
    $scope.setPage = function(index) {
        $scope.currentPage = index - 1;
    };

    $scope.ViewMovementsUser = function () {
        $scope.loadmovements = true
        $http.get('/api/account/movements/' + $scope.tmp.user)
        .success(function(data){
            $scope.movements = data
            $scope.LoadPages()
        })
        .error (function (msg){
            pushMessage('alert','ERROR', msg, "cross")
        })
        .finally (function (){
            $scope.loadmovements = false
        })
    }
    
}
  ]).filter('startFromGrid', function() {
    return function(input, start) 
    {
        if (!input || !input.length) { return; }
        start = +start; 
        return input.slice(start);   
    }       
})


app.controller("clients", ['$scope','$http','$window', function ($scope, $http, $window) {
    $http.defaults.headers.common['x-access-token']=token;
    
    $scope.currentPage = 0;
    $scope.pageSize = 5;
    $scope.pages = [];
    
    $scope.all = {};
    $scope.Client = {};
    $scope.tmp = {};
 
    $scope.update = function()
    {
        $scope.$emit('loadasc')
        $http.post('/api/clients/update', $scope.tmp)
        .success(function(err) 
        {
            pushMessage('success', 'HECHO', 'Cliente actualizado con exito', "checkmark")
            $scope.tmp = {};
        })
        .error(function(msg) 
        {
            pushMessage('alert','ERROR', msg, "cross")
        })
        .finally (function (){
            $scope.GetClientsasc()
            $scope.$emit('unloadasc')
        })
    }  
    
    $scope.delete = function()
    {
        $scope.$emit('loadasc')
        $http.post('/api/clients/delete', $scope.tmp)
        .success(function(msg) 
        {
            pushMessage('success', 'HECHO', msg, "checkmark")
            $scope.tmp = {};
        })
        .error(function(msg) 
        {
            pushMessage('alert','ERROR', msg, "cross")
        })
        .finally (function (){
            $scope.GetClientsasc()
            $scope.$emit('loadasc')
        })
    };  

    $scope.loadvalues = function (item){
        $scope.tmp = item
    }

    $scope.GetClients = function ()
    {
        $scope.$emit('load')
        $http.get('/api/clients/')
        .success(function(data) {
            $scope.all = data;
            $scope.LoadPages()
            $scope.$emit('unload')
        })
        .error(function(data) {
            console.log('Error: ' + data);
        })
        .finally (function(){
            $scope.$emit('unload')
        })

    }

    $scope.GetClientsasc = function ()
    {
        $scope.$emit('loadasc')
        $http.get('/api/clients/')
        .success(function(data) {
            $scope.all = data;
            $scope.LoadPages()
        })
        .error(function(data) {
            console.log('Error: ' + data);
        })
        .finally (function(){
            $scope.$emit('unloadasc')
        })

    }
    $scope.GetClients()

    $scope.CreateClient = function(){
    $scope.$emit('loadasc')
    $http.post('/api/clients/add', $scope.Client)
    .success(function(msg) {
        $scope.Client = {}
        pushMessage('success', 'HECHO', msg, "checkmark")
    })
    .error(function(msg) {
        pushMessage('alert','ERROR',msg, "cross")
    })
    .finally (function (){
        $scope.$emit('unloadasc')
        $scope.GetClientsasc()
    })
    };  

    $scope.SearchClient = function(){
        $scope.$emit('loadasc')
        $scope.inputbox
        $http.post('/api/clients/search', $scope.inputbox)
        .success(function(data) {
            pushMessage('success','FOUNT',"Cliente's encontrados", "checkmark")
            $scope.all = data;
            $scope.LoadPages()
        })
        .error(function(msg) {
            pushMessage('info','NOT FOUND',msg, "question")
        })
        .finally(function (){
            $scope.$emit('unloadasc')
        })
    };  


    $scope.LoadPages = function ()
    {
        $scope.pages.length = 0;
            var ini = $scope.currentPage - 4;
            var fin = $scope.currentPage + 5;
            if (ini < 1) {
              ini = 1;
              if (Math.ceil($scope.all.length / $scope.pageSize) > 10)
                fin = 10;
              else
                fin = Math.ceil($scope.all.length / $scope.pageSize);
            } else {
              if (ini >= Math.ceil($scope.all.length / $scope.pageSize) - 10) {
                ini = Math.ceil($scope.all.length / $scope.pageSize) - 10;
                fin = Math.ceil($scope.all.length / $scope.pageSize);
              }
            }
            if (ini < 1) ini = 1;
            for (var i = ini; i <= fin; i++) {
              $scope.pages.push({
                no: i
              });
            }

            if ($scope.currentPage >= $scope.pages.length)
            $scope.currentPage = $scope.pages.length - 1;
    }
    
    $scope.setPage = function(index) {
        $scope.currentPage = index - 1;
    };
    
    $scope.ChangePageItems = function() {
        if ($scope.pageSizetmp.items == 'todos')
        {
            $scope.pageSize = $scope.all.length
        }
        else {
            $scope.pageSize = $scope.pageSizetmp.items    
        }

        $scope.LoadPages();
    };


    }
  ]).filter('startFromGrid', function() {
    return function(input, start) 
    {
        if (!input || !input.length) { return; }
        start = +start; 
        return input.slice(start);   
    }       
})    

app.controller ("c_direcciones", function ($scope, $http, $routeParams){
    $http.defaults.headers.common['x-access-token']=token;


    $scope.direcciones = {};
    $scope.direccion = {};
    $scope.direccion.cliente = $routeParams.id

    $scope.GetDirecciones = function ()
    {
        $scope.$emit('load')
        $http.get('/api/clients/direcciones/' + $routeParams.id)
        .success(function(data) {
            $scope.direcciones = data;
        })
        .error(function(msg) {
            pushMessage('success', 'HECHO', msg, "checkmark")
        })
        .finally (function(){
            $scope.$emit('unload')
        })

    }

    $scope.GetDireccionesAsc = function ()
    {
        $scope.$emit('loadasc')
        $http.get('/api/clients/direcciones/' + $routeParams.id)
        .success(function(data) {
            $scope.direcciones = data;
        })
        .error(function(msg) {
            pushMessage('success', 'HECHO', msg, "checkmark")
        })
        .finally (function(){
            $scope.$emit('unloadasc')
        })

    }
    $scope.GetDirecciones()
    
    $scope.LoadValuesEdit = function(item){
        $scope.tmp = item
    };

    $scope.create = function(){
        $scope.$emit('loadasc')
        $http.post('/api/clients/direcciones/add', $scope.direccion)
        .success(function(msg) {
            $scope.direccion = {}
            pushMessage('success', 'HECHO', msg, "checkmark")
        })
        .error(function(msg) {
            pushMessage('alert','ERROR',msg, "cross")
        })
        .finally (function (){
            $scope.GetDireccionesAsc()
            $scope.$emit('unloadasc')
        })
    };

    $scope.update = function (){
        $scope.$emit('loadasc')
        $http.post('/api/clients/direcciones/update', $scope.tmp)
        .success(function (msg){
            pushMessage('success', 'HECHO', msg, "checkmark")
        })
        .error (function (msg){
            pushMessage('alert','ERROR',msg, "cross")
        })
        .finally (function (){
            $scope.GetDireccionesAsc()
            $scope.$emit('unloadasc')
        })
    }

    $scope.delete = function (){
        $scope.$emit('loadasc')
        $http.post('/api/clients/direcciones/delete', $scope.tmp)
        .success(function (msg){
            pushMessage('success', 'HECHO', msg, "checkmark")
        })
        .error (function (msg){
            pushMessage('alert','ERROR',msg, "cross")
        })
        .finally (function (){
            $scope.GetDireccionesAsc()
            $scope.$emit('unloadasc')
        })
    }

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
    $scope.pageSizetmp = {}

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

app.controller("catproducts", ['$scope', '$http', function ($scope, $http) {
    $http.defaults.headers.common['x-access-token']=token;
    $scope.currentPage = 0;
    $scope.pageSize = 5;
    $scope.pages = [];
    $scope.pageSizetmp = {}
        
    $scope.productstmp = {};

    $scope.GetCategoryes = function ()
    {
        $scope.$emit('load')
        $http.get('/api/catproducts/')
        .success(function(data) {
            $scope.productstmp = data;
            $scope.LoadPages();
        })
        .error(function(data) {
            pushMessage('alert','ERROR',data, "cross")
        })
        .finally (function (){
            $scope.$emit('unload')
        })
    }

    $scope.GetCategoryesasc = function ()
    {
        $scope.$emit('loadasc')
        $http.get('/api/catproducts/')
        .success(function(data) {
            $scope.productstmp = data;
            $scope.LoadPages();
            $scope.ChangePageItems()
        })
        .error(function(data) {
            pushMessage('alert','ERROR',data, "cross")
        })
        .finally (function (){
            $scope.$emit('unloadasc')
        })
    }

    $scope.GetCategoryes()


    $scope.CreateCatProduct = function(){

        $scope.$emit('loadasc')
        $http.post('api/catproducts/add', $scope.Newproduct)
        .success(function(msg) {
            pushMessage('success', 'HECHO', msg, "checkmark")
            $scope.Newproduct = {}
        })
        .error(function(msg) {
            pushMessage('alert','ERROR',msg, "cross")
        })
        .finally(function (){
            $scope.$emit('unloadasc')
            $scope.GetCategoryesasc()
        })
    }; 

    $scope.SearchCatProduct = function(){
        $scope.$emit('load')
        $scope.inputbox
        $http.post('/api/catproducts/search', $scope.inputbox)
        .success(function(data) {
            pushMessage('success','FOUNT',"Categoria encontrada", "checkmark")
            $scope.productstmp = data;
            $scope.LoadPages();
            $scope.ChangePageItems()
        })
        .error(function(msg) {
            pushMessage('alert','NOT FOUND',msg, "question")
        })
        .finally (function (){
            $scope.$emit('unload')
        })
    };  

        $scope.ChangePageItems = function() {
            if ($scope.pageSizetmp.items == 'todos')
            {
                $scope.pageSize = $scope.productstmp.length
            }else {
                $scope.pageSize = $scope.pageSizetmp.items    
            }
            $scope.LoadPages();
        };

        $scope.LoadPages = function ()
        {
            $scope.pages.length = 0;
                var ini = $scope.currentPage - 4;
                var fin = $scope.currentPage + 5;
                if (ini < 1) {
                  ini = 1;
                  if (Math.ceil($scope.productstmp.length / $scope.pageSize) > 10)
                    fin = 10;
                  else
                    fin = Math.ceil($scope.productstmp.length / $scope.pageSize);
                } else {
                  if (ini >= Math.ceil($scope.productstmp.length / $scope.pageSize) - 10) {
                    ini = Math.ceil($scope.productstmp.length / $scope.pageSize) - 10;
                    fin = Math.ceil($scope.productstmp.length / $scope.pageSize);
                  }
                }
                if (ini < 1) ini = 1;
                for (var i = ini; i <= fin; i++) {
                  $scope.pages.push({
                    no: i
                  });
                }

                if ($scope.currentPage >= $scope.pages.length)
                $scope.currentPage = $scope.pages.length - 1;
        }
        
          
        $scope.setPage = function(index) {
            $scope.currentPage = index - 1;
        };
        
        
    }
  ]).filter('startFromGrid', function() {
    return function(input, start) 
    {
        if (!input || !input.length) { return; }
        start = +start; 
        return input.slice(start);   
    }       
})  

app.controller('products', ['$scope', '$http','$timeout', function ($scope, $http, $timeout) {
    
    $http.defaults.headers.common['x-access-token']=token;
    
    $scope.currentPage = 0;
    $scope.pageSize = 5;
    $scope.pages = [];
    $scope.pageSizetmp = {}

    $scope.product = {};
    $scope.products = {};
    $scope.recetas = {};
    $scope.ingredientes = {};
    $scope.categories = {};
    $scope.select = {}
    $scope.show = {}
    $scope.use_receta = {}
    $scope.use_receta_load = false
    $scope.use_receta_create = false

    $scope.product.img = '/images/no-imagen.jpg'

    
    function GenerarCodeBar()
    {
      var caracteres = "abcdefghijkmnlopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
      var contraseña = "";
      for (i=0; i <6; i++) contraseña += caracteres.charAt(Math.floor(Math.random()*caracteres.length));
      return contraseña;
    }
    

    $scope.product.codebar = GenerarCodeBar()

    $scope.fileReaderSupported = window.FileReader != null;
    $scope.photoChanged = function(files){
        $scope.product.img_load = true
        if (files != null) {
            var file = files[0];
        if ($scope.fileReaderSupported && file.type.indexOf('image') > -1) {
            $timeout(function() {
                var fileReader = new FileReader();
                fileReader.readAsDataURL(file);
                fileReader.onload = function(e) {
                    $timeout(function(){
                        $scope.product.img = e.target.result;
                        $scope.product.img_load = false
                    });
                }
            }
            );
        }
    }
    };

    $scope.calulate = function (receta){
        var r = [];
        
        for (var i = 0; i < $scope.ingredientes.length; i++)
        {
            
            if ($scope.ingredientes[i].receta == receta)
            {
                r.push(Math.round($scope.ingredientes[i].ingrediente.stock / $scope.ingredientes[i].porcion));
            }
        }
        
        return Math.min.apply(null, r);
    }

    $scope.loadreceta = function (){
        if ($scope.use_receta.status)
        {
            $scope.use_receta_load = true
            $http.get('/api/products/recipes/')
            .success(function(data) {
                $scope.use_receta_create = true
                $scope.recetas = data;
            })
            .error(function(data) {
                pushMessage('alert','ERROR',$scope.use_receta, "cross")
            })
            .finally (function (){
                $scope.use_receta_load = false
            })
        }else
        {
            $scope.use_receta_create = false
        }
    }

    $scope.GetIngredientes = function ()
    {
        $scope.$emit('load')
        $http.get('/api/products/use_recetas/')
        .success(function(data0) {
            $scope.ingredientes = data0;
        })
    }

    $scope.Getcatproducts = function (){
        $http.get('/api/catproducts/')
        .success(function(data) {
            $scope.categories = data;
        })
        .error(function(data) {
            pushMessage('alert','ERROR',data, "cross")
        })

    }
    
    $scope.Getproducts = function (){
        $http.get('/api/products/')
        .success(function(data) {
            $scope.products = data;
            $scope.LoadPages()
        })
        .error(function(data) {
            pushMessage('alert','ERROR',data, "cross")
        })
        .finally (function (){
            $scope.$emit('unload')
        })
    }

    $scope.GetIngredientes()
    $scope.Getcatproducts()
    $scope.Getproducts()
    
    $scope.create = function(){
        $scope.$emit('load')
        $http.post('/api/products/add', $scope.product)
        .success(function(data) {
            pushMessage('success', 'HECHO', 'Producto agregado', "checkmark")
            $scope.products = data
            $scope.product = {}
            $scope.product.codebar = GenerarCodeBar()
            $scope.product.img = '/images/no-imagen.jpg'
        })
        .error(function(msg) {
            pushMessage('alert','ERROR',msg, "cross")
        })
        .finally (function (){
            $scope.$emit('unload')
        })
    }; 

    $scope.search = function(){
        $scope.$emit('loadasc')
        $http.post('/api/products/search', $scope.inputbox)
        .success(function(data) {
            pushMessage('success','FOUNT',"Productos encontrados", "checkmark")
            $scope.products = data;
            $scope.LoadPages();
            $scope.ChangePageItems()
        })
        .error(function(msg) {
            pushMessage('alert','NOT FOUND',msg, "question")
        })
        .finally (function (){
            $scope.$emit('unloadasc')
        })
    };

    $scope.ChangePageItems = function() {
        if ($scope.pageSizetmp.items == 'todos')
        {
            $scope.pageSize = $scope.products.length
        }else {
            $scope.pageSize = $scope.pageSizetmp.items    
        }
        $scope.LoadPages();
    };

    $scope.LoadPages = function ()
    {
        $scope.pages.length = 0;
        var ini = $scope.currentPage - 4;
        var fin = $scope.currentPage + 5;
        if (ini < 1) {
          ini = 1;
          if (Math.ceil($scope.products.length / $scope.pageSize) > 10)
            fin = 10;
          else
            fin = Math.ceil($scope.products.length / $scope.pageSize);
        } else {
          if (ini >= Math.ceil($scope.products.length / $scope.pageSize) - 10) {
            ini = Math.ceil($scope.products.length / $scope.pageSize) - 10;
            fin = Math.ceil($scope.products.length / $scope.pageSize);
          }
        }
        if (ini < 1) ini = 1;
        for (var i = ini; i <= fin; i++) {
          $scope.pages.push({
            no: i
          });
        }

        if ($scope.currentPage >= $scope.pages.length)
        $scope.currentPage = $scope.pages.length - 1;
    }
    
      
    $scope.setPage = function(index) {
        $scope.currentPage = index - 1;
    };
    
}
  ]).filter('startFromGrid', function() {
    return function(input, start) 
    {
        if (!input || !input.length) { return; }
        start = +start; 
        return input.slice(start);   
    }       
})

app.controller("ingredients", ['$scope', '$http', function ($scope, $http) {
        $http.defaults.headers.common['x-access-token']=token;

        $scope.ingredient = {};
        $scope.ingredients = {};
        $scope.select = {}
        $scope.show = {}
        $scope.IngredientUpdate = {}
        $scope.measuremeants = {}

        $scope.currentPage = 0;
        $scope.pageSize = 8;
        $scope.pages = [];
      
        $http.get('/api/get_measurements/')
        .success(function(data) {
            $scope.measuremeants = data
        })
        .error(function(data) {
            pushMessage('alert','ERROR',data, "cross")
        }); 

      
        $scope.GetIngredients = function ()
        {
            $scope.$emit('load')
            $http.get('/api/ingredients/')
                .success(function(data) {
                    $scope.ingredients = data
                    $scope.IngredientUpdate = data
                    $scope.LoadPages();
                    
                })
                .error(function(data) {
                    pushMessage('alert','ERROR',data, "cross")
            })
            .finally (function (){
                $scope.$emit('unload')
            })
        }

        $scope.GetIngredientsasc = function ()
        {
            $scope.$emit('loadasc')
            $http.get('/api/ingredients/')
                .success(function(data) {
                    $scope.ingredients = data
                    $scope.IngredientUpdate = data
                    $scope.LoadPages();
                    
                })
                .error(function(data) {
                    pushMessage('alert','ERROR',data, "cross")
            })
            .finally (function (){
                $scope.$emit('unloadasc')
            })
        }
        
        $scope.GetIngredients()

        $scope.LoadPages = function ()
        {
            $scope.pages.length = 0;
                var ini = $scope.currentPage - 4;
                var fin = $scope.currentPage + 5;
                if (ini < 1) {
                  ini = 1;
                  if (Math.ceil($scope.ingredients.length / $scope.pageSize) > 10)
                    fin = 10;
                  else
                    fin = Math.ceil($scope.ingredients.length / $scope.pageSize);
                } else {
                  if (ini >= Math.ceil($scope.ingredients.length / $scope.pageSize) - 10) {
                    ini = Math.ceil($scope.ingredients.length / $scope.pageSize) - 10;
                    fin = Math.ceil($scope.ingredients.length / $scope.pageSize);
                  }
                }
                if (ini < 1) ini = 1;
                for (var i = ini; i <= fin; i++) {
                  $scope.pages.push({
                    no: i
                  });
                }

                if ($scope.currentPage >= $scope.pages.length)
                $scope.currentPage = $scope.pages.length - 1;
        }
        $scope.LoadValuesEdit = function(){

        $scope.$emit('loadasc')
        $http.get('/api/ingredients/' + $scope.select.select)
            .success(function(data) {
                $scope.select = data
                pushMessage('warning', 'HECHO', 'Ingrediente encontrado', "checkmark")
            })
            .error(function(msg) {
                pushMessage('alert','ERROR',msg, "cross")
            })
            .finally (function(){
                $scope.$emit('unloadasc')
            })
        };

        $scope.create = function(){
            $scope.$emit('loadasc')
            $http.post('/api/ingredients/add', $scope.ingredient)
            .success(function(msg) {
                $scope.ingredient = {}
                pushMessage('success', 'HECHO', msg, "checkmark")
            })
            .error(function(msg) {
                pushMessage('alert','ERROR',msg, "cross")
            })
            .finally (function (){
                $scope.$emit('unloadasc')
                $scope.GetIngredientsasc()
            })
        }; 

        $scope.update = function(){
            $scope.$emit('loadasc')
            $http.post('/api/ingredients/update', $scope.select)
            .success(function(msg){
                $scope.select = {}
                pushMessage('success', 'HECHO', msg, "checkmark")
            })
            .error(function(msg) {
                pushMessage('alert','ERROR',msg, "cross")
            })
            .finally (function (){
                $scope.$emit('unloadasc')
                $scope.GetIngredientsasc()
            })
        };

        $scope.delete = function(){
        $scope.$emit('loadasc')
        $http.post('/api/ingredient/delete', $scope.select)
            .success(function(msg) {
                $scope.select = {}
                pushMessage('success', 'HECHO', msg, "checkmark")
            })
            .error(function(msg) {
                pushMessage('alert','ERROR',msg, "cross")
            })
            .finally (function (){
                $scope.$emit('unloadasc')
                $scope.GetIngredientsasc()
            })
        };

        $scope.search = function(){
        $scope.$emit('loadasc')
        $scope.inputbox
        $http.post('/api/ingredients/search', $scope.inputbox)
            .success(function(data) {
                $scope.inputbox = {}
                $scope.ingredients = data;
                $scope.LoadPages();
                pushMessage('success','FOUNT',"ingredientes encontrados", "checkmark")
            })
            .error(function(msg) {
                pushMessage('danger','NOT FOUND',msg, "question")
            })
            .finally (function (){
                $scope.$emit('unloadasc')
            })
        };
          
        $scope.setPage = function(index) {
            $scope.currentPage = index - 1;
        };
    }
  ]).filter('startFromGrid', function() {
    return function(input, start) 
    {
        if (!input || !input.length) { return; }
        start = +start; 
        return input.slice(start);   
    }       
})

app.controller("ingredientes_shopping", ['$scope', '$http', function ($scope, $http) {
        $http.defaults.headers.common['x-access-token']=token;

        $scope.ingredients = {};
        $scope.IngredientUpdate = {}
        $scope.measuremeants = {}

        $scope.currentPage = 0;
        $scope.pageSize = 5;
        $scope.pages = [];
        $scope.pageSizetmp = {}

        $scope.GetIngredients = function (){
            $scope.$emit('load')
            $http.get('/api/ingredients/')
            .success(function(data) {
                $scope.ingredients = data
                $scope.IngredientUpdate = data
                $scope.LoadPages();
            })
            .error(function(data) {
                pushMessage('alert','ERROR',data, "cross")
            })
            .finally (function (){
                $scope.$emit('unload')
            })
        }
        $scope.GetIngredients()

        $http.get('/api/get_measurements/')
        .success(function(data) {
            $scope.measuremeants = data
        })
        .error(function(data) {
            pushMessage('alert','ERROR',data, "cross")
        });

        $scope.LoadPages = function ()
        {
            $scope.pages.length = 0;
                var ini = $scope.currentPage - 4;
                var fin = $scope.currentPage + 5;
                if (ini < 1) {
                  ini = 1;
                  if (Math.ceil($scope.ingredients.length / $scope.pageSize) > 10)
                    fin = 10;
                  else
                    fin = Math.ceil($scope.ingredients.length / $scope.pageSize);
                } else {
                  if (ini >= Math.ceil($scope.ingredients.length / $scope.pageSize) - 10) {
                    ini = Math.ceil($scope.ingredients.length / $scope.pageSize) - 10;
                    fin = Math.ceil($scope.ingredients.length / $scope.pageSize);
                  }
                }
                if (ini < 1) ini = 1;
                for (var i = ini; i <= fin; i++) {
                  $scope.pages.push({
                    no: i
                  });
                }

                if ($scope.currentPage >= $scope.pages.length)
                $scope.currentPage = $scope.pages.length - 1;
        }
        
        $scope.update = function(item){
            $scope.$emit('loadasc')
            $http.post('/api/ingredients/update', item)
            .success(function(data) {
                pushMessage('success', 'HECHO', 'Producto actualizado', "checkmark")
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
        $http.post('/api/ingredients/search', $scope.inputbox)
            .success(function(data) {
                $scope.inputbox = {}
                $scope.ingredients = data;
                $scope.ChangePageItems();
                pushMessage('success','FOUNT',"ingredientes encontrados", "checkmark")
            })
            .error(function(msg) {
                pushMessage('danger','NOT FOUND',msg, "question")
            })
            .finally (function (){
                $scope.$emit('unloadasc')
            })
        };
          
        $scope.setPage = function(index) {
            $scope.currentPage = index - 1;
        };
        
        
        $scope.ChangePageItems = function() {
            if ($scope.pageSizetmp.items == 'todos')
            {
                $scope.pageSize = $scope.ingredients.length
            }else {
                $scope.pageSize = $scope.pageSizetmp.items    
            }
            $scope.LoadPages();
        };


    }
  ]).filter('startFromGrid', function() {
    return function(input, start) 
    {
        if (!input || !input.length) { return; }
        start = +start; 
        return input.slice(start);   
    }       
})

app.controller("add_recetas", ['$scope', '$http', function ($scope, $http) {
        $http.defaults.headers.common['x-access-token']=token;
        $scope.currentPage = 0;
        $scope.pageSize = 5;
        $scope.pages = [];
        $scope.pageSizetmp = {}

        $scope.ingredients = {};
        $scope.receta = {};
        $scope.arr = [];
        $scope.arrtmp = [];
        
        
        $scope.GetIngredients = function ()
        {
            $scope.$emit('load')
            $http.post('/api/recipes/ingredients/search')
            .success(function(data) {
                $scope.ingredients = data
                $scope.LoadPages()
            })
            .error(function(data) {
                pushMessage('alert','ERROR',data, "cross")
            })
            .finally (function (){
                $scope.$emit('unload')
            })
        }

        $scope.GetIngredients()


        $scope.search = function(){
        $scope.$emit('loadasc')
        $scope.inputbox
        $http.post('/api/recipes/ingredients/search', $scope.inputbox)
            .success(function(data) {
                pushMessage('success','FOUNT',"ingredientes encontrados", "checkmark")
                $scope.inputbox = {}
                $scope.ingredients = data;
                $scope.LoadPages()
                $scope.ChangePageItems()
            })
            .error(function(msg) {
                pushMessage('danger','NOT FOUND',msg, "question")
            })
            .finally (function (){
                $scope.$emit('unloadasc')
            })
        };

        $scope.insert = function(item){
            if (item.stocktmp != null && item.stocktmp > 0)
            {
                $scope.arr.push(
                {
                    id: item._id, 
                    porcion: item.stocktmp, 
                    name: item.name, 
                    namefast: item.measurements.namefast,
                    namefasts: item.measurements.namefasts,
                    update_ingredients: true
                })
                item.stocktmp = ''
                pushMessage('success','HECHO','Agregado a la lista', "checkmark")
            }else {
                pushMessage('alert','NEGADO','Verifique su porcion', "checkmark")
            }
        };

        $scope.remove = function (item)
        {
            $scope.arr.splice($scope.arr.indexOf(item),1);
            $scope.arrtmp.splice($scope.arrtmp.indexOf(item),1);
        }

        $scope.clean = function ()
        {
            $scope.receta = {};
            $scope.arr = []
        }

        $scope.create = function(){
            $scope.$emit('loadasc')
            $scope.receta.arr = $scope.arr

            $http.post('/api/recipes/add', $scope.receta)
            .success(function(msg) {
                pushMessage('success', 'HECHO', msg, "checkmark")
                $scope.clean()
            })
            .error(function(msg) {
                pushMessage('alert','ERROR',msg, "cross")
            })
            .finally (function (){
                $scope.$emit('unloadasc')
            })
        }; 

        $scope.LoadPages = function ()
        {
            $scope.pages.length = 0;
                var ini = $scope.currentPage - 4;
                var fin = $scope.currentPage + 5;
                if (ini < 1) {
                  ini = 1;
                  if (Math.ceil($scope.ingredients.length / $scope.pageSize) > 10)
                    fin = 10;
                  else
                    fin = Math.ceil($scope.ingredients.length / $scope.pageSize);
                } else {
                  if (ini >= Math.ceil($scope.ingredients.length / $scope.pageSize) - 10) {
                    ini = Math.ceil($scope.ingredients.length / $scope.pageSize) - 10;
                    fin = Math.ceil($scope.ingredients.length / $scope.pageSize);
                  }
                }
                if (ini < 1) ini = 1;
                for (var i = ini; i <= fin; i++) {
                  $scope.pages.push({
                    no: i
                  });
                }

                if ($scope.currentPage >= $scope.pages.length)
                $scope.currentPage = $scope.pages.length - 1;
        }
        
        $scope.setPage = function(index) {
            $scope.currentPage = index - 1;
        };
        
        
        $scope.ChangePageItems = function() {
            if ($scope.pageSizetmp.items == 'todos')
            {
                $scope.pageSize = $scope.ingredients.length
            }
            else {
                $scope.pageSize = $scope.pageSizetmp.items    
            }

            $scope.LoadPages();
        };


    }
  ]).filter('startFromGrid', function() {
    return function(input, start) 
    {
        if (!input || !input.length) { return; }
        start = +start; 
        return input.slice(start);   
    }       
})

app.controller("recetas", ['$scope', '$http', function ($scope, $http) {
        $http.defaults.headers.common['x-access-token']=token;
        
        $scope.currentPage = 0;
        $scope.pageSize = 5;
        $scope.pages = [];
        $scope.pageSizetmp = {}

        $scope.recetas = {};
        $scope.receta = {};
        
        
        $scope.GetReceta = function ()
        {
            $scope.$emit('load')
            $http.get('/api/recipes/')
            .success(function(data) {
                $scope.recetas = data
                $scope.LoadPages()
            })
            .error(function(data) {
                pushMessage('alert','ERROR',data, "cross")
            })
            .finally (function (){
                $scope.$emit('unload')
            })
        }

        $scope.GetRecetaasc = function ()
        {
            $scope.$emit('loadasc')
            $http.get('/api/recipes/')
            .success(function(data) {
                $scope.recetas = data
                $scope.LoadPages()
            })
            .error(function(data) {
                pushMessage('alert','ERROR',data, "cross")
            })
            .finally (function (){
                $scope.$emit('unloadasc')
            })
        }

        $scope.GetReceta()

        $scope.loadvalues = function (item)
        {
            $scope.receta = item
        }

        $scope.delete = function ()
        {
            $scope.$emit('loadasc')
            $http.post('/api/recipes/delete', $scope.receta)
            .success(function(msg) {
                pushMessage('success', 'HECHO', msg, "checkmark")
            })
            .error(function(msg) {
                pushMessage('alert','ERROR',msg, "cross")
            })
            .finally (function (){
                $scope.$emit('unloadasc')
                $scope.GetRecetaasc()
            })
        }
        $scope.search = function(){
            $scope.$emit('loadasc')
            $scope.inputbox
            $http.post('/api/recipes/search', $scope.inputbox)
            .success(function(data) {
                pushMessage('success','FOUNT',"ingredientes encontrados", "checkmark")
                $scope.inputbox = {}
                $scope.recetas = data
                $scope.LoadPages()
                $scope.ChangePageItems()
            })
            .error(function(msg) {
                pushMessage('danger','NOT FOUND',msg, "question")
            })
            .finally (function (){
                $scope.$emit('unloadasc')
            })
        };

        $scope.print = function (item)
        {
            pushMessage('danger','NOT FOUND',item.name, "question")
        }

        $scope.LoadPages = function ()
        {
            $scope.pages.length = 0;
                var ini = $scope.currentPage - 4;
                var fin = $scope.currentPage + 5;
                if (ini < 1) {
                  ini = 1;
                  if (Math.ceil($scope.recetas.length / $scope.pageSize) > 10)
                    fin = 10;
                  else
                    fin = Math.ceil($scope.recetas.length / $scope.pageSize);
                } else {
                  if (ini >= Math.ceil($scope.recetas.length / $scope.pageSize) - 10) {
                    ini = Math.ceil($scope.recetas.length / $scope.pageSize) - 10;
                    fin = Math.ceil($scope.recetas.length / $scope.pageSize);
                  }
                }
                if (ini < 1) ini = 1;
                for (var i = ini; i <= fin; i++) {
                  $scope.pages.push({
                    no: i
                  });
                }

                if ($scope.currentPage >= $scope.pages.length)
                $scope.currentPage = $scope.pages.length - 1;
        }
        
        $scope.setPage = function(index) {
            $scope.currentPage = index - 1;
        };
        
        
        $scope.ChangePageItems = function() {
            if ($scope.pageSizetmp.items == 'todos')
            {
                $scope.pageSize = $scope.recetas.length
            }
            else {
                $scope.pageSize = $scope.pageSizetmp.items    
            }

            $scope.LoadPages();
        };


    }
  ]).filter('startFromGrid', function() {
    return function(input, start) 
    {
        if (!input || !input.length) { return; }
        start = +start; 
        return input.slice(start);   
    }       
})

app.controller("update_recetas", ['$scope', '$routeParams','$http','$window', function ($scope, $routeParams, $http, $window) {
        $http.defaults.headers.common['x-access-token']=token;
        
        
        $scope.currentPage = 0;
        $scope.pageSize = 5;
        $scope.pages = [];
        $scope.pageSizetmp = {}

        $scope.receta = {};
        $scope.ingredientes = {};
        $scope.measurements = [];
        $scope.arr = [];
        
        
        $http.get('/api/get_measurements/')
        .success(function(data) {
            $scope.measurements = data
        })

        $http.get('/api/recipes/' + $routeParams.id)
            .success(function(data) {
                $scope.receta = data
            })
            .error(function(data) {
                pushMessage('alert','ERROR',data, "cross")
        });

        $http.get('/api/recipes/ingredientes/' + $routeParams.id )
            .success(function(data) {
                for (var i = 0; i < data.length; i++)
                {
                    $scope.insertfirst(data[i])
                }
            })
            .error(function(data) {
                pushMessage('alert','ERROR',data, "cross")
        });
        
        

        $scope.GetIngredients = function ()
        {
            $scope.$emit('load')
            $scope.inputbox
            $http.post('/api/recipes/ingredients/search', $scope.inputbox)
            .success(function(data) {
                $scope.ingredientes = data
                $scope.LoadPages()
            })
            .error(function(data) {
                pushMessage('alert','ERROR',data, "cross")
            })
            .finally (function(){
                $scope.$emit('unload')
            })
        }

        $scope.GetIngredients()
        


        $scope.update = function(){
            $scope.$emit('load')
            $scope.receta.arr = $scope.arr

            $http.post('/api/recipes/update', $scope.receta)
            .success(function(msg) {
                $window.location = "dashboard#/recetas"
                pushMessage('success', 'HECHO', msg, "checkmark")
            })
            .error(function(msg) {
                pushMessage('alert','ERROR',msg, "cross")
            })
            .finally (function (){
                $scope.$emit('unload')
            })
        };

        $scope.delete = function(_id){
            $scope.$emit('load')
            $http.post('/api/recipes/delete', $scope.receta)
            .success(function(msg) {
                $window.location = "dashboard#/recetas"
                pushMessage('success', 'HECHO', msg, "checkmark")
            })
            .error(function(msg) {
                pushMessage('alert','ERROR',msg, "cross")
            })
            .finally (function (){
                $scope.$emit('unload')
            })
        };

        $scope.search = function(){
        $scope.$emit('loadasc')
        $scope.inputbox
        $http.post('/api/recipes/ingredients/search', $scope.inputbox)
            .success(function(data) {
                pushMessage('success','FOUNT',"ingredientes encontrados", "checkmark")
                $scope.inputbox = {}
                $scope.ingredientes = data;
                $scope.LoadPages()
            })
            .error(function(msg) {
                pushMessage('danger','NOT FOUND',msg, "question")
            })
            .finally (function (){
                $scope.$emit('unloadasc')
            })
        };

        $scope.LoadPages = function ()
        {
            $scope.pages.length = 0;
                var ini = $scope.currentPage - 4;
                var fin = $scope.currentPage + 5;
                if (ini < 1) {
                  ini = 1;
                  if (Math.ceil($scope.ingredientes.length / $scope.pageSize) > 10)
                    fin = 10;
                  else
                    fin = Math.ceil($scope.ingredientes.length / $scope.pageSize);
                } else {
                  if (ini >= Math.ceil($scope.ingredientes.length / $scope.pageSize) - 10) {
                    ini = Math.ceil($scope.ingredientes.length / $scope.pageSize) - 10;
                    fin = Math.ceil($scope.ingredientes.length / $scope.pageSize);
                  }
                }
                if (ini < 1) ini = 1;
                for (var i = ini; i <= fin; i++) {
                  $scope.pages.push({
                    no: i
                  });
                }

                if ($scope.currentPage >= $scope.pages.length)
                $scope.currentPage = $scope.pages.length - 1;
        }
        
        $scope.setPage = function(index) {
            $scope.currentPage = index - 1;
        };
        
        
        $scope.insertfirst = function(item){
            
            for ($scope.i = 0; $scope.i < $scope.measurements.length; $scope.i = $scope.i + 1)
            {
                if ($scope.measurements[$scope.i]._id == item.ingrediente.measurements)
                {
                    $scope.namefast = $scope.measurements[$scope.i].namefast
                    $scope.namefasts = $scope.measurements[$scope.i].namefasts
                    break
                }
            }
            
            $scope.arr.push(
            {
                id: item.ingrediente._id, 
                porcion: item.porcion, 
                name: item.ingrediente.name,
                namefast: $scope.namefast,
                namefasts: $scope.namefasts,    
                update_ingredients: item.update_ingredients
            })
        };
        $scope.insert = function(item){
            if (item.stocktmp != null && item.stocktmp > 0)
            {
                $scope.arr.push(
                {
                    id: item._id, 
                    porcion: item.stocktmp, 
                    name: item.name, 
                    namefast: item.measurements.namefast,
                    namefasts: item.measurements.namefasts,
                    update_ingredients: true
                })
                item.stocktmp = ''
                pushMessage('success','HECHO','Agregado a la lista', "checkmark")
            }else {
                pushMessage('alert','NEGADO','Verifique su porcion', "checkmark")
            }
        };

        $scope.remove = function (item)
        {
            $scope.arr.splice($scope.arr.indexOf(item),1);
        }

        $scope.ChangePageItems = function() {
            if ($scope.pageSizetmp.items == 'todos')
            {
                $scope.pageSize = $scope.ingredientes.length
            }
            else {
                $scope.pageSize = $scope.pageSizetmp.items    
            }

            $scope.LoadPages();
        };


    }
  ]).filter('startFromGrid', function() {
    return function(input, start) 
    {
        if (!input || !input.length) { return; }
        start = +start; 
        return input.slice(start);   
    }       
})


app.controller("view_receta", function($scope, $http, $routeParams, $window)
{
    $http.defaults.headers.common['x-access-token']=token;
    
    $scope.receta = {};
    $scope.ingredientes = {};  
    
    $scope.GetReceta = function (){
        $scope.$emit('load')
        $http.get('/api/recipes/' + $routeParams.id)
        .success(function(data) 
        {
            $scope.receta = data;
        })
        .error(function(data) 
        {
            pushMessage('alert','ERROR', 'Receta no encontrada.','cross')
        })
        .finally (function (){
            $scope.$emit('unload')
        })
    }

    $scope.GetIngredientes = function (){
        $scope.$emit('load')
        $http.get('/api/recipes/ingredientes/' + $routeParams.id)
        .success(function(data) 
        {
            $scope.ingredientes = data;
        })
        .finally (function (){
            $scope.$emit('unload')
        })
    }

    $scope.print = function ()
    {
        pushMessage('danger','NOT FOUND',$scope.receta.name, "question")
    }

    $scope.GetReceta()
    $scope.GetIngredientes()

})


app.controller("update_products", function ($scope, $http, $timeout, $routeParams, $window) {
    
    $http.defaults.headers.common['x-access-token']=token;
    
    $scope.product = {};
    $scope.recetas = {};
    $scope.categories = {}
    $scope.use_receta_create = false
    
    $scope.update = function()
    {
        $scope.$emit('loadasc')
        $http.post('/api/products/update', $scope.product)
        .success(function(err) 
        {
            pushMessage('success', 'HECHO', 'Producto actualizado con exito', "checkmark")
            $scope.DateClient = {};
            $window.location = "dashboard#/products";
        })
        .error(function(msg) 
        {
            pushMessage('alert','ERROR', msg, "cross")
        })
        .finally (function (){
            $scope.$emit('unloadasc')
        })
    }

    $scope.delete = function()
    {
        $scope.$emit('loadasc')
        $http.post('/api/products/delete', $scope.product)
        .success(function(err) 
        {
            pushMessage('success', 'HECHO', err, "checkmark")
            $window.location = "dashboard#/products";
        })
        .error(function(msg) 
        {
            pushMessage('alert','ERROR', msg, "cross")
        })
        .finally (function (){
            $scope.$emit('unloadasc')
        })
    }    
    $scope.changerecet = function ()
    {
        if (!$scope.use_receta_create)
        {
            $scope.product.receta = null
        }
    }

    $scope.loadvalues = function (){
        $scope.use_receta_load = true
        $http.get('/api/products/product/' + $routeParams.id)
        .success(function(data) {
            $scope.product = data;
            if ($scope.product.receta)
            {
                $scope.use_receta_create = true
            }
        })
        .error(function(data) {
            pushMessage('alert','ERROR',$scope.use_receta, "cross")
        })
        .finally (function (){
            $scope.use_receta_load = false
        })
    }

    $scope.GetReceta = function (){
        $scope.$emit('load')
        $http.get('/api/products/recipes/')
        .success(function(data) 
        {
            $scope.recetas = data;
        })
        .error(function(data) 
        {
            pushMessage('alert','ERROR', 'Receta no encontrada.','cross')
        })
        .finally (function (){
            $scope.$emit('unload')
        })
    }

    $scope.GetCategoryes = function ()
    {
        $scope.$emit('load')
        $http.get('/api/catproducts/')
        .success(function(data) {
            $scope.categories = data;
        })
        .error(function(data) {
            pushMessage('alert','ERROR',data, "cross")
        })
        .finally (function (){
            $scope.$emit('unload')
        })
    }

    $scope.loadvalues()
    $scope.GetReceta()
    $scope.GetCategoryes()
    
    $scope.fileReaderSupported = window.FileReader != null;
    $scope.photoChanged = function(files){
        $scope.product.img_load = true
        if (files != null) {
            var file = files[0];
        if ($scope.fileReaderSupported && file.type.indexOf('image') > -1) {
            $timeout(function() {
                var fileReader = new FileReader();
                fileReader.readAsDataURL(file);
                fileReader.onload = function(e) {
                    $timeout(function(){
                        $scope.product.img = e.target.result;
                        $scope.product.img_load = false
                    });
                }
            }
            );
        }
    }
    };    
})

app.controller('surtir_recetea', function ($scope, $http, $routeParams){
    
    $http.defaults.headers.common['x-access-token']=token;

    $scope.receta = {}
    $scope.ingredients = {}
    $scope.measuremeants = {}


    $scope.GetReceta = function (){
        $scope.$emit('load')
        $http.get('/api/recipes/'+ $routeParams.id)
        .success(function(data){
            $scope.receta = data
        })
        .error (function (msg){
            pushMessage('alert','ERROR',msg, "cross")
        })
        .finally (function (){
            $scope.$emit('unload')
        })
    }

    $scope.GetIngredientes = function (){
        $scope.$emit('load')
        $http.get('/api/recipes/ingredientes/'+ $routeParams.id)
        .success (function (data){
            $scope.ingredients = data
        })
        .error (function (msg){
            pushMessage('alert','ERROR',msg, "cross")
        })
        .finally (function (){
            $scope.$emit('unload')
        })
    }

    $scope.GetMeasurements = function (){
        $scope.$emit('load')
        $http.get('/api/get_measurements/')
        .success(function(data) {
            $scope.measuremeants = data
        })
        .error (function (msg){
            pushMessage('alert','ERROR',msg, "cross")
        })
        .finally (function (){
            $scope.$emit('unload')
        })
    }

    $scope.GetReceta()
    $scope.GetIngredientes()
    $scope.GetMeasurements()

    $scope.update = function(item){
        item = item.ingrediente
        $scope.$emit('loadasc')
        $http.post('/api/recipes/ingredients/update', item)
        .success(function(data) {
            pushMessage('success', 'HECHO', 'Producto actualizado', "checkmark")
        })
        .error(function(msg) {
            pushMessage('alert','ERROR',msg, "cross")
        })
        .finally (function (){
            $scope.$emit('unloadasc')
        })
        
    };
})

app.controller("products_shopping", ['$scope', '$http', function ($scope, $http) {
    
    $http.defaults.headers.common['x-access-token']=token;
    
    $scope.currentPage = 0;
    $scope.pageSize = 5;
    $scope.pages = [];
    $scope.pageSizetmp = {}

    $scope.products = {};
    $scope.use_receta = {}
    $scope.use_receta_load = false
    $scope.use_receta_create = false


    $scope.update = function(item){
        $scope.$emit('loadasc')
        $http.post('/api/products/update', item)
        .success(function(data) {
            pushMessage('success', 'HECHO', 'Producto actualizado', "checkmark")
        })
        .error(function(msg) {
            pushMessage('alert','ERROR',msg, "cross")
        })
        .finally (function (){
            $scope.$emit('unloadasc')
        })
        
    };

    $scope.Getproducts = function (){
        $scope.$emit('load')
        $http.get('/api/products/stock')
        .success(function(data) {
            $scope.products = data;
            $scope.LoadPages()
        })
        .error(function(data) {
            pushMessage('alert','ERROR',data, "cross")
        })
        .finally (function (){
            $scope.$emit('unload')
        })
    }

    
    $scope.Getproducts()
    
    $scope.search = function(){
        $scope.$emit('loadasc')
        $http.post('/api/products/search_stock', $scope.inputbox)
        .success(function(data) {
            pushMessage('success','FOUNT',"Productos encontrados", "checkmark")
            $scope.products = data;
            $scope.LoadPages();
            $scope.ChangePageItems()
        })
        .error(function(msg) {
            pushMessage('alert','NOT FOUND',msg, "question")
        })
        .finally (function (){
            $scope.$emit('unloadasc')
        })
    };

    $scope.ChangePageItems = function() {
        if ($scope.pageSizetmp.items == 'todos')
        {
            $scope.pageSize = $scope.products.length
        }else {
            $scope.pageSize = $scope.pageSizetmp.items    
        }
        $scope.LoadPages();
    };

    $scope.LoadPages = function ()
    {
        $scope.pages.length = 0;
        var ini = $scope.currentPage - 4;
        var fin = $scope.currentPage + 5;
        if (ini < 1) {
          ini = 1;
          if (Math.ceil($scope.products.length / $scope.pageSize) > 10)
            fin = 10;
          else
            fin = Math.ceil($scope.products.length / $scope.pageSize);
        } else {
          if (ini >= Math.ceil($scope.products.length / $scope.pageSize) - 10) {
            ini = Math.ceil($scope.products.length / $scope.pageSize) - 10;
            fin = Math.ceil($scope.products.length / $scope.pageSize);
          }
        }
        if (ini < 1) ini = 1;
        for (var i = ini; i <= fin; i++) {
          $scope.pages.push({
            no: i
          });
        }

        if ($scope.currentPage >= $scope.pages.length)
        $scope.currentPage = $scope.pages.length - 1;
    }
    
      
    $scope.setPage = function(index) {
        $scope.currentPage = index - 1;
    };
    
}
  ]).filter('startFromGrid', function() {
    return function(input, start) 
    {
        if (!input || !input.length) { return; }
        start = +start; 
        return input.slice(start);   
    }       
})

app.controller("sales_vtd", ['$scope', '$http', function ($scope, $http) {
    
    $http.defaults.headers.common['x-access-token']=token;
    
    $scope.currentPage = 0;
    $scope.pageSize = 5;
    $scope.pages = [];
    $scope.pageSizetmp = {}

    $scope.products = {};
    $scope.categories = {};
    $scope.products_hold = {};
    $scope.comanda = [];
    $scope.ingredientes = {}
    $scope.inputbox = {}
    
    $scope.vtd = function (){
        $scope.$emit('loadasc')
        $http.post('/api/sales/vtd/', $scope.comanda)
        .success(function(msg){
            pushMessage('success','', msg, "checkmark")
            $scope.clean()
        })
        .error (function (msg){
            pushMessage('alert','', msg, "cross")
        })
        .finally (function (){
            $scope.$emit('unloadasc')
        })
    }

    $scope.show_categories = function ()
    {
        $scope.inputbox.txt = null
        if ($scope.categories.select == null || $scope.categories.select == '')
        {
            $scope.products = $scope.products_hold
        }else
        {
            $scope.products =[]    
            for (var i = 0; i < $scope.products_hold.length; i++)
            {
                if ($scope.products_hold[i].category._id == $scope.categories.select)
                {
                    $scope.products.push($scope.products_hold[i])
                }
            }
        }
        $scope.LoadPages()
        document.getElementById('input_search').focus();
    }

    GetCategories = function ()
    {
        $http.get('/api/catproducts/')
        .success(function(data) {
            $scope.categories = data;
        })
        .error(function(data) {
            pushMessage('alert','ERROR',data, "cross")
        })
    }

    GetTotal_Comanda = function ()
    {
        $scope.comanda.total = 0
        for (var i = 0; i < $scope.comanda.length; i++)
        {
            $scope.comanda.total += $scope.comanda[i].total
        }
        $scope.comanda.total = $scope.comanda.total.toFixed(2)
    }

    $scope.addonelist = function (){
        $scope.inputbox.txt = null
        var exist = false

        for (var i = 0; i < $scope.comanda.length; i++)
        {
            if ($scope.comanda[i]._id == $scope.products[0]._id)
            {
                $scope.comanda[i].unidades ++
                if ($scope.products[0].receta)
                {
                    $scope.products[0].stockc --
                }else
                {
                    $scope.products[0].stock --
                }
                $scope.comanda[i].total = $scope.comanda[i].unidades * $scope.comanda[i].price
                exist = true
            }
        }

        if (!exist)
        {
            $scope.products[0].unidades = 1;
            $scope.products[0].total = $scope.products[0].price;
            if ($scope.products[0].receta)
            {
                $scope.products[0].stockc --
            }else
            {
                $scope.products[0].stock --
            }
            $scope.comanda.push ($scope.products[0])
        }
        pushMessage('success','',$scope.products[0].unidades + ' ' + $scope.products[0].name, "checkmark")
        GetTotal_Comanda()
        document.getElementById('input_search').focus();
    }

    $scope.add = function (item){
        $scope.inputbox.txt = null
        var exist = false

        for (var i = 0; i < $scope.comanda.length; i++)
        {
            if ($scope.comanda[i]._id == item._id)
            {
                $scope.comanda[i].unidades ++
                if (item.receta)
                {
                    item.stockc --
                }else
                {
                    item.stock --
                }
                $scope.comanda[i].total = $scope.comanda[i].unidades * $scope.comanda[i].price
                exist = true
            }
        }

        if (!exist)
        {
            item.unidades = 1;
            item.total = item.price;
            if (item.receta)
            {
                item.stockc --
            }else
            {
                item.stock --
            }
            $scope.comanda.push (item)
        }
        pushMessage('success','',item.unidades + ' ' + item.name, "checkmark")
        GetTotal_Comanda()
        document.getElementById('input_search').focus();
    }

    $scope.remove = function (item){
        $scope.inputbox.txt = null
        for (var i = 0; i < $scope.comanda.length; i++)
        {
            if ($scope.comanda[i]._id == item._id && $scope.comanda[i].unidades == 1)
            {
                $scope.comanda.splice($scope.comanda.indexOf(item),1);
                if (item.receta)
                {
                    item.stockc ++
                }else
                {
                    item.stock ++
                }
                GetTotal_Comanda()
            }
            if ($scope.comanda[i]._id == item._id && $scope.comanda[i].unidades > 1)
            {
                $scope.comanda[i].unidades --
                $scope.comanda[i].total = $scope.comanda[i].unidades * $scope.comanda[i].price
                if (item.receta)
                {
                    item.stockc ++
                }else
                {
                    item.stock ++
                }
            }
        }
        GetTotal_Comanda()
        document.getElementById('input_search').focus();
        pushMessage('warning','',item.unidades + ' ' + item.name, "checkmark")
    }

    $scope.show_all = function (){
        $scope.categories.select = null
        $scope.inputbox.txt = null
        $scope.products = $scope.products_hold
        $scope.LoadPages()
        document.getElementById('input_search').focus();
    }


    $scope.cleanbtn = function (){
        $scope.categories.select = null
        $scope.inputbox.txt = null
        $scope.products = $scope.products_hold
        $scope.comanda = []
        $scope.LoadPages()
        GetIngredientes()
        GetCategories()
        Getproducts()
        document.getElementById('input_search').focus();
    }

    $scope.clean = function (){
        $scope.categories.select = null
        $scope.inputbox.txt = null
        $scope.products = $scope.products_hold
        $scope.comanda = []
        $scope.LoadPages()
        document.getElementById('input_search').focus();
    }

    $scope.search = function (){
        $scope.categories.select = null
        if ($scope.inputbox.txt == null || $scope.inputbox.txt == '')
        {
            $scope.products = $scope.products_hold
        }else
        {
            $scope.products =[]    
            for (var i = 0; i < $scope.products_hold.length; i++)
            {
                if ($scope.products_hold[i].name.includes($scope.inputbox.txt.toUpperCase()) || $scope.products_hold[i].codebar.includes($scope.inputbox.txt.toUpperCase()))
                {
                    $scope.products.push($scope.products_hold[i])
                }
            }
        }
        $scope.LoadPages()
    }

    GetIngredientes = function ()
    {
        $scope.$emit('load')
        $http.get('/api/sales/ingredientes/')
        .success(function(data) {
            $scope.ingredientes = data;
        })
    }

    Getproducts = function (){
        $http.get('/api/sales/products')
        .success(function(data) {
            $scope.products = data;
            $scope.products_hold = data;
            $scope.LoadPages()
        })
        .error(function(data) {
            pushMessage('alert','ERROR',data, "cross")
        })
        .finally (function (){
            $scope.$emit('unload')
        })
    }

    GetIngredientes()
    GetCategories()
    Getproducts()

    $scope.calulate = function (product){
        var r = [];
        
        for (var i = 0; i < $scope.ingredientes.length; i++)
        {
            
            if ($scope.ingredientes[i].receta == product.receta._id)
            {
                r.push(Math.round($scope.ingredientes[i].ingrediente.stock / $scope.ingredientes[i].porcion));
            }
        }

        for (var i = 0; i < $scope.products.length; i++)
        {
            
            if ($scope.products[i]._id == product._id)
            {
                $scope.products[i].stockc = Math.min.apply(null, r);
            }
        }
    }

    $scope.ChangePageItems = function() {
        if ($scope.pageSizetmp.items == 'todos')
        {
            $scope.pageSize = $scope.products.length
        }else {
            $scope.pageSize = $scope.pageSizetmp.items    
        }
        $scope.LoadPages();
    };

    $scope.LoadPages = function ()
    {
        $scope.pages.length = 0;
        var ini = $scope.currentPage - 4;
        var fin = $scope.currentPage + 5;
        if (ini < 1) {
          ini = 1;
          if (Math.ceil($scope.products.length / $scope.pageSize) > 10)
            fin = 10;
          else
            fin = Math.ceil($scope.products.length / $scope.pageSize);
        } else {
          if (ini >= Math.ceil($scope.products.length / $scope.pageSize) - 10) {
            ini = Math.ceil($scope.products.length / $scope.pageSize) - 10;
            fin = Math.ceil($scope.products.length / $scope.pageSize);
          }
        }
        if (ini < 1) ini = 1;
        for (var i = ini; i <= fin; i++) {
          $scope.pages.push({
            no: i
          });
        }

        if ($scope.currentPage >= $scope.pages.length)
        $scope.currentPage = $scope.pages.length - 1;
    }
    
      
    $scope.setPage = function(index) {
        $scope.currentPage = index - 1;
    };
    
}
  ]).filter('startFromGrid', function() {
    return function(input, start) 
    {
        if (!input || !input.length) { return; }
        start = +start; 
        return input.slice(start);   
    }       
})

app.controller("sales_user", ['$scope', '$http', function ($scope, $http) {
    
    $http.defaults.headers.common['x-access-token']=token;
    
    $scope.currentPage = 0;
    $scope.pageSize = 5;
    $scope.pages = [];
    $scope.pageSizetmp = {}

    $scope.sales = {};
    $scope.total = 0;

    get_sales = function (){
        $scope.$emit('load')
        $http.get('/api/public/cut_x')
        .success(function(data) {
            $scope.sales = data;
            for (var a = 0; a < $scope.sales.length; a ++){
                if ($scope.sales[a].monto){
                    $scope.total += $scope.sales[a].monto
                }
            }
            $scope.total = $scope.total.toFixed(2)
            $scope.LoadPages()
        })
        .error(function(data) {
            pushMessage('alert','ERROR',data, "cross")
        })
        .finally (function (){
            $scope.$emit('unload')
        })
    }

    get_sales()


    $scope.ChangePageItems = function() {
        if ($scope.pageSizetmp.items == 'todos')
        {
            $scope.pageSize = $scope.sales.length
        }else {
            $scope.pageSize = $scope.pageSizetmp.items    
        }
        $scope.LoadPages();
    };

    $scope.LoadPages = function ()
    {
        $scope.pages.length = 0;
        var ini = $scope.currentPage - 4;
        var fin = $scope.currentPage + 5;
        if (ini < 1) {
          ini = 1;
          if (Math.ceil($scope.sales.length / $scope.pageSize) > 10)
            fin = 10;
          else
            fin = Math.ceil($scope.sales.length / $scope.pageSize);
        } else {
          if (ini >= Math.ceil($scope.sales.length / $scope.pageSize) - 10) {
            ini = Math.ceil($scope.sales.length / $scope.pageSize) - 10;
            fin = Math.ceil($scope.sales.length / $scope.pageSize);
          }
        }
        if (ini < 1) ini = 1;
        for (var i = ini; i <= fin; i++) {
          $scope.pages.push({
            no: i
          });
        }

        if ($scope.currentPage >= $scope.pages.length)
        $scope.currentPage = $scope.pages.length - 1;
    }
    
      
    $scope.setPage = function(index) {
        $scope.currentPage = index - 1;
    };
    
}
  ]).filter('startFromGrid', function() {
    return function(input, start) 
    {
        if (!input || !input.length) { return; }
        start = +start; 
        return input.slice(start);   
    }       
})

app.controller("sales_admin", ['$scope', '$http', function ($scope, $http) {
    
    $http.defaults.headers.common['x-access-token']=token;
    
    $scope.currentPage = 0;
    $scope.pageSize = 5;
    $scope.pages = [];
    $scope.pageSizetmp = {}

    $scope.sales = {};
    $scope.sales_hold = {};
    $scope.users = {};
    $scope.total = 0;

    get_sales = function (){
        $scope.$emit('load')
        $http.get('/api/account/cut_x')
        .success(function(data) {
            $scope.sales = data;
            $scope.sales_hold = data;

            for (var a = 0; a < $scope.sales.length; a ++){
                if ($scope.sales[a].monto){
                    $scope.total += $scope.sales[a].monto
                }
            }
            $scope.total = $scope.total.toFixed(2)
            $scope.LoadPages()
        })
        .error(function(data) {
            pushMessage('alert','ERROR',data, "cross")
        })
    }

    get_users = function (){
        $http.get('/api/account/users')
        .success(function(data) {
            $scope.users = data
        })
        .error(function(data) {
            pushMessage('alert','ERROR',data, "cross")
        })
        .finally (function (){
            $scope.$emit('unload')
        })
    }

    get_sales()
    get_users()


    $scope.select_user = function() {
        if (!$scope.pageSizetmp.user || $scope.pageSizetmp.user == 'todos')
        {
            $scope.sales = $scope.sales_hold
        }else
        {
            $scope.sales = []
            for (var a = 0; a < $scope.sales_hold.length; a ++){
                if ($scope.sales_hold[a].user._id == $scope.pageSizetmp.user){
                    $scope.sales.push($scope.sales_hold[a])
                }
            }
        }
        $scope.total = 0
        for (var a = 0; a < $scope.sales.length; a ++){
            if ($scope.sales[a].monto){
                $scope.total += $scope.sales[a].monto
            }
        }
        $scope.total = $scope.total.toFixed(2)
        $scope.LoadPages()
    };

    $scope.ChangePageItems = function() {
        if ($scope.pageSizetmp.items == 'todos' || !$scope.pageSizetmp.items)
        {
            $scope.pageSize = $scope.sales.length
        }else {
            $scope.pageSize = $scope.pageSizetmp.items    
        }
        $scope.LoadPages();
    };

    $scope.LoadPages = function ()
    {
        $scope.pages.length = 0;
        var ini = $scope.currentPage - 4;
        var fin = $scope.currentPage + 5;
        if (ini < 1) {
          ini = 1;
          if (Math.ceil($scope.sales.length / $scope.pageSize) > 10)
            fin = 10;
          else
            fin = Math.ceil($scope.sales.length / $scope.pageSize);
        } else {
          if (ini >= Math.ceil($scope.sales.length / $scope.pageSize) - 10) {
            ini = Math.ceil($scope.sales.length / $scope.pageSize) - 10;
            fin = Math.ceil($scope.sales.length / $scope.pageSize);
          }
        }
        if (ini < 1) ini = 1;
        for (var i = ini; i <= fin; i++) {
          $scope.pages.push({
            no: i
          });
        }

        if ($scope.currentPage >= $scope.pages.length)
        $scope.currentPage = $scope.pages.length - 1;
    }
    
      
    $scope.setPage = function(index) {
        $scope.currentPage = index - 1;
    };
    
}
  ]).filter('startFromGrid', function() {
    return function(input, start) 
    {
        if (!input || !input.length) { return; }
        start = +start; 
        return input.slice(start);   
    }       
})
