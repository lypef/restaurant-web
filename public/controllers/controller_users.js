var app = angular.module('restweb', ['ngRoute', 'googlechart'])

//var urlsocket = "restweb-lypef.c9users.io"
var urlsocket = "http://localhost:8080/"

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
        .when('/kitchen_cocina', {
            templateUrl : '/clients_users/preparar_products/kitchen_cocina.html'
        })
        .when('/kitchen_barr', {
            templateUrl : '/clients_users/preparar_products/kitchen_barr.html'
        })
        .when('/my_comands', {
            templateUrl : '/clients_users/preparar_products/my_comands.html'
        })
        .when('/tables', {
            templateUrl : '/clients_users/sales/tables.html'
        })
        .when('/caja', {
            templateUrl : '/clients_users/sales/caja.html'
        })
        .otherwise({
            redirectTo : '/'
        })
})

app.factory('socket', ['$rootScope', function($rootScope) {

  socket = io.connect(urlsocket, { 'forceNew': true })

  return {
    on: function (eventName, callback) {
        socket.on(eventName, function () {
            var args = arguments;
            $rootScope.$apply(function () {
                callback.apply(socket, args);
            });
        });
    },
    emit: function (eventName, data, callback) {
        socket.emit(eventName, data, function () {
            var args = arguments;
            $rootScope.$apply(function () {
                if (callback) {
                    callback.apply(socket, args);
                }
            });
        })
    }
  };
}]);

app.controller("UserValues", function($scope, $http, $timeout, $rootScope, socket){
    $scope.usuario = {};
    $scope.addmoneyvar = {}
    $scope.removemoneyvar = {}
    $scope.noti = {}


    $scope.$on('load', function(){$scope.loading = true})
    $scope.$on('unload', function(){$scope.loading = false})

    $scope.$on('loadasc', function(){$scope.loadinasc = true})
    $scope.$on('unloadasc', function(){$scope.loadinasc = false})

    $scope.$on('loadvalues', function(){
        $scope.loadinasc = true
        $http.get('/api/users/values')
        .success(function(data) {
            $scope.usuario = data;
            $rootScope.user = data
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

    $http.get('/api/public/socket_notifications')
    .success (function (){
        socket = io.connect()
        socket = io.connect(urlsocket, { 'forceNew': true })

        socket.on('disconnect', function ()
        {
            pushMessage('warning','', 'Sistema Desconectado', "cross")
        });

        socket.on('get_notifications'+$rootScope.user.admin._id, function ()
        {
            $scope.$apply(
                $http.get('/api/public/get_notifications')
                .success (function (data){
                    $scope.noti = data
                })
            )
        });
        
    })
    .error (function (){
        $scope.$emit('unload')
    })  

    $scope.asist = function (item){
        $scope.$emit('loadasc')
        $http.post('/api/public/set_status_notifications', item)
        .success (function (msg){
            $scope.noti.splice($scope.noti.indexOf(item),1);
            pushMessage('success','', msg, "checkmark")
        })
        .error (function (msg){
            $scope.$emit('unloadasc')
            pushMessage('alert','', msg, "cross")
        })
        .finally (function (){
            $scope.$emit('unloadasc')
        })
    }
});

app.controller("users_administrator", ['$scope', '$http','$timeout','socket','$rootScope', function ($scope, $http, $timeout, socket,$rootScope) {
    $scope.currentPage = 0;
    $scope.pageSize = 5;
    $scope.pages = [];
    $scope.pageSizetmp = {}

    $scope.users = {}
    $scope.sales_products = {}
    $scope.user = {}
    $scope.account = {}
    $scope.movements = {}
    $scope.tmp = {}
    $scope.loadmovements = false
    $scope.loadview = false
    $scope.lugar = {}
    $scope.places = {}
    $scope.table_add = {}
    $scope.tables = {}
    $scope.tmp_table = {}

    $scope.user.img = '/images/no-imagen.jpg'

    $scope.edit_table = function ()
    {
        $scope.$emit('loadasc')
        $http.post('/api/account/edit_table', $scope.tmp_table)
        .success (function (msg){
            GetTablesASC()
            socket.emit('UpdateTables'+$rootScope.user.admin._id)
            pushMessage('success', 'HECHO', msg, "checkmark")
        })
        .error (function (msg){
            $scope.$emit('unloadasc')
            pushMessage('alert', 'HECHO', msg, "checkmark")
        })
        .finally (function (){
            $scope.$emit('unloadasc')
        })
    }

    $scope.delete_table = function ()
    {
        $scope.$emit('loadasc')
        $http.post('/api/account/delete_table', $scope.tmp_table)
        .success (function (msg){
            GetTablesASC()
            socket.emit('UpdateTables'+$rootScope.user.admin._id)
            pushMessage('success', 'HECHO', msg, "checkmark")
        })
        .error (function (msg){
            $scope.$emit('unloadasc')
            pushMessage('alert', 'HECHO', msg, "checkmark")
        })
        .finally (function (){
            $scope.$emit('unloadasc')
        })
    }

    $scope.add_table = function ()
    {
        $scope.$emit('loadasc')
        $http.post('/api/account/add_table', $scope.table_add)
        .success (function(msg){
            $scope.table_add = {}
            GetTablesASC()
            socket.emit('UpdateTables'+$rootScope.user.admin._id)
            pushMessage('success', 'HECHO', msg, "checkmark")
        })
        .error (function (msg){
            $scope.$emit('unloadasc')
            pushMessage('alert', 'ERROR', msg, "cross")
        })
        .finally (function (){
            $scope.$emit('unloadasc')
        })
    }

    $scope.edit_place = function ()
    {
        $scope.$emit('loadasc')
        $http.post('/api/account/edit_place', $scope.tmp_place)
        .success (function (msg){
            GetPlacesASC()
            pushMessage('success', 'HECHO', msg, "checkmark")
        })
        .error (function (msg){
            $scope.$emit('unloadasc')
            pushMessage('alert', 'HECHO', msg, "checkmark")
        })
        .finally (function (){
            $scope.$emit('unloadasc')
        })
    }

    $scope.delete_place = function ()
    {
        $scope.$emit('loadasc')
        $http.post('/api/account/delete_place', $scope.tmp_place)
        .success (function (msg){
            GetPlacesASC()
            pushMessage('success', 'HECHO', msg, "checkmark")
        })
        .error (function (msg){
            $scope.$emit('unloadasc')
            pushMessage('alert', 'HECHO', msg, "checkmark")
        })
        .finally (function (){
            $scope.$emit('unloadasc')
        })
    }

    $scope.set_place = function (item)
    {
        $scope.tmp_place = item
    }

    $scope.set_table = function (item)
    {
        $scope.tmp_table = item
    }

    $scope.addlugar = function (){
        $scope.$emit('loadasc')
        $scope.lugar.img = $scope.user.img
        $http.post('/api/account/add_place', $scope.lugar)
        .success (function(msg){
            GetPlacesASC()
            $scope.lugar = {}
            $scope.user.img = '/images/no-imagen.jpg'
            pushMessage('success', 'HECHO', msg, "checkmark")
        })
        .error (function (msg){
            $scope.$emit('unloadasc')
            pushMessage('alert', 'ERROR', msg, "cross")
        })
        .finally (function (){
            $scope.$emit('unloadasc')
        })
    }

    $scope.fileReaderSupported = window.FileReader != null;
    $scope.photoChanged_tmp_place = function(files){
        if (files != null) {
            var file = files[0];
        if ($scope.fileReaderSupported && file.type.indexOf('image') > -1) {
            $timeout(function() {
                var fileReader = new FileReader();
                fileReader.readAsDataURL(file);
                fileReader.onload = function(e) {
                    $timeout(function(){
                        $scope.tmp_place.img = e.target.result;
                    });
                }
            }
            );
        }
    }
    };

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

    $scope.showventa = function (item){
        $scope.sale = item
        $scope.sale.products = []
        for (var i = 0 ; i < $scope.sales_products.length; i++)
        {
            if ($scope.sales_products[i].sale == item.sale)
            {
                $scope.sale.products.push($scope.sales_products[i])
            }
        }

    }


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
        $scope.$emit('loadasc')
        $http.get('/api/account')
        .success(function(data){
            $scope.account = data
        })
        .finally (function (){
            $scope.$emit('unloadasc')
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

    Getproducts = function (){
        $http.get('/api/account/product_sale')
        .success(function(data){
            $scope.sales_products = data
        })
        .error (function (msg){
            pushMessage('alert','ERROR', msg, "cross")
        })
    }

    GetPlaces = function (){
        $http.get('/api/account/places')
        .success(function(data){
            $scope.places = data
        })
        .error (function (msg){
            pushMessage('alert','ERROR', msg, "cross")
        })
    }

    GetTables = function (){
        $http.get('/api/account/tables')
        .success(function(data){
            $scope.tables = data
        })
        .error (function (msg){
            pushMessage('alert','ERROR', msg, "cross")
        })
    }

    GetTablesASC = function (){
        $scope.$emit('loadasc')
        $http.get('/api/account/tables')
        .success(function(data){
            $scope.tables = data
        })
        .error (function (msg){
            $scope.$emit('unloadasc')
            pushMessage('alert','ERROR', msg, "cross")
        })
        .finally (function(){
            $scope.$emit('unloadasc')
        })
    }

    GetPlacesASC = function (){
        $scope.$emit('loadasc')
        $http.get('/api/account/places')
        .success(function(data){
            $scope.places = data
        })
        .error (function (msg){
            $scope.$emit('unloadasc')
            pushMessage('alert','ERROR', msg, "cross")
        })
        .finally (function (){
            $scope.$emit('unloadasc')
        })
    }

    GetUsersAsc = function (){
        $scope.$emit('loadasc')
        $http.get('/api/account/users')
        .success(function(data){
            $scope.users = data
        })
        .finally (function (){
            $scope.$emit('unloadasc')
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
    Getproducts()
    GetPlaces()
    GetTables()
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


    $scope.currentPage = 0;
    $scope.pageSize = 5;
    $scope.pages = [];

    $scope.all = {};
    $scope.all_hold = {};
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
            $scope.all_hold = data;
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
            $scope.all_hold = data;
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
        if ($scope.inputbox.text == null || $scope.inputbox.text == '')
        {
            $scope.all = $scope.all_hold
        }else
        {
            $scope.all = []
            for (var i = 0; i < $scope.all_hold.length; i++)
            {
                if ($scope.all_hold[i].nombre.includes($scope.inputbox.text.toUpperCase()) )
                {
                    $scope.all.push($scope.all_hold[i])
                }
            }
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

    $scope.currentPage = 0;
    $scope.pageSize = 5;
    $scope.pages = [];
    $scope.pageSizetmp = {}

    $scope.productstmp = {};
    $scope.productstmp_hold = {}

    $scope.GetCategoryes = function ()
    {
        $scope.$emit('load')
        $http.get('/api/catproducts/')
        .success(function(data) {
            $scope.productstmp = data;
            $scope.productstmp_hold = data;
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
            $scope.productstmp_hold = data;
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
        if ($scope.inputbox.text == null || $scope.inputbox.text == '')
        {
            $scope.productstmp = $scope.productstmp_hold
        }else
        {
            $scope.productstmp = []
            for (var i = 0; i < $scope.productstmp_hold.length; i++)
            {
                if ($scope.productstmp_hold[i].categoria.includes($scope.inputbox.text.toUpperCase()) || $scope.productstmp_hold[i].descripcion.includes($scope.inputbox.text.toUpperCase()) )
                {
                    $scope.productstmp.push($scope.productstmp_hold[i])
                }
            }
        }
        $scope.LoadPages()
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



    $scope.currentPage = 0;
    $scope.pageSize = 5;
    $scope.pages = [];
    $scope.pageSizetmp = {}

    $scope.product = {};
    $scope.products = {};
    $scope.products_hold = {};
    $scope.recetas = {};
    $scope.ingredientes = {};
    $scope.categories = {};
    $scope.select = {}
    $scope.show = {}
    $scope.use_receta = {}
    $scope.use_receta_load = false
    $scope.use_receta_create = false

    $scope.product.img = '/images/no-imagen.jpg'

    $scope.setbarra = function (){
        if ($scope.product.barra)
        {
            $scope.product.cocina = false
        }
    }

    $scope.setcocina = function (){
        if ($scope.product.cocina)
        {
            $scope.product.barra = false
        }
    }

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

    if ($scope.inputbox.text == null || $scope.inputbox.text == '')
        {
            $scope.products = $scope.products_hold
        }else
        {
            $scope.products = []
            for (var i = 0; i < $scope.products_hold.length; i++)
            {
                if ($scope.products_hold[i].name.includes($scope.inputbox.text.toUpperCase()) || $scope.products_hold[i].description.includes($scope.inputbox.text.toUpperCase()) || $scope.products_hold[i].codebar.includes($scope.inputbox.text.toUpperCase()) )
                {
                    $scope.products.push($scope.products_hold[i])
                }
            }
        }
        $scope.LoadPages()
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


        $scope.ingredient = {};
        $scope.ingredients = {};
        $scope.ingredients_hold = {};
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
                    $scope.ingredients_hold = data
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
                    $scope.ingredients_hold = data
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
            if ($scope.inputbox.txt == null || $scope.inputbox.txt == '')
            {
                $scope.ingredients = $scope.ingredients_hold
            }else
            {
                $scope.ingredients = []
                for (var i = 0; i < $scope.ingredients_hold.length; i++)
                {
                    if ($scope.ingredients_hold[i].name.includes($scope.inputbox.txt.toUpperCase())  )
                    {
                        $scope.ingredients.push($scope.ingredients_hold[i])
                    }
                }
            }
            $scope.LoadPages()
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


        $scope.ingredients = {};
        $scope.ingredients_hold = {};
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
                $scope.ingredients_hold = data
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
        if ($scope.inputbox.txt == null || $scope.inputbox.txt == '')
        {
            $scope.ingredients = $scope.ingredients_hold
        }else
        {
            $scope.ingredients = []
            for (var i = 0; i < $scope.ingredients_hold.length; i++)
            {
                if ($scope.ingredients_hold[i].name.includes($scope.inputbox.txt.toUpperCase()) )
                {
                    $scope.ingredients.push($scope.ingredients_hold[i])
                }
            }
        }
        $scope.LoadPages()

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

        $scope.currentPage = 0;
        $scope.pageSize = 5;
        $scope.pages = [];
        $scope.pageSizetmp = {}

        $scope.ingredients = {};
        $scope.ingredients_hold = {};
        $scope.receta = {};
        $scope.arr = [];
        $scope.arrtmp = [];


        $scope.GetIngredients = function ()
        {
            $scope.$emit('load')
            $http.post('/api/recipes/ingredients/search')
            .success(function(data) {
                $scope.ingredients = data
                $scope.ingredients_hold = data
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
            if ($scope.inputbox.txt == null || $scope.inputbox.txt == '')
            {
                $scope.ingredients = $scope.ingredients_hold
            }else
            {
                $scope.ingredients = []
                for (var i = 0; i < $scope.ingredients_hold.length; i++)
                {
                    if ($scope.ingredients_hold[i].name.includes($scope.inputbox.txt.toUpperCase()))
                    {
                        $scope.ingredients.push($scope.ingredients_hold[i])
                    }
                }
            }
            $scope.LoadPages()
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


        $scope.currentPage = 0;
        $scope.pageSize = 5;
        $scope.pages = [];
        $scope.pageSizetmp = {}

        $scope.recetas = {};
        $scope.recetas_hold = {};
        $scope.receta = {};


        $scope.GetReceta = function ()
        {
            $scope.$emit('load')
            $http.get('/api/recipes/')
            .success(function(data) {
                $scope.recetas = data
                $scope.recetas_hold = data
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
            if ($scope.inputbox == null || $scope.inputbox == '')
            {
                $scope.recetas = $scope.recetas_hold
            }else
            {
                $scope.recetas = []
                for (var i = 0; i < $scope.recetas_hold.length; i++)
                {
                    if ($scope.recetas_hold[i].name.includes($scope.inputbox.txt.toUpperCase()) || $scope.recetas_hold[i].description.includes($scope.inputbox.txt.toUpperCase()))
                    {
                        $scope.recetas.push($scope.recetas_hold[i])
                    }
                }
            }
            $scope.LoadPages()
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



        $scope.currentPage = 0;
        $scope.pageSize = 5;
        $scope.pages = [];
        $scope.pageSizetmp = {}

        $scope.receta = {};
        $scope.ingredientes = {};
        $scope.ingredientes_hold = {};
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
                $scope.ingredientes_hold = data
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
            if ($scope.inputbox.txt == null || $scope.inputbox.txt == '')
            {
                $scope.ingredientes = $scope.ingredientes_hold
            }else
            {
                $scope.ingredientes = []
                for (var i = 0; i < $scope.ingredientes_hold.length; i++)
                {
                    if ($scope.ingredientes_hold[i].name.includes($scope.inputbox.txt.toUpperCase()))
                    {
                        $scope.ingredientes.push($scope.ingredientes_hold[i])
                    }
                }
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


app.controller('update_products', function ($scope, $http, $timeout, $routeParams, $window, socket, $rootScope) {

    $scope.product = {};
    $scope.recetas = {};
    $scope.categories = {}
    $scope.use_receta_create = false

    $scope.setbarra = function (){
        if ($scope.product.barra)
        {
            $scope.product.cocina = false
        }
    }

    $scope.setcocina = function (){
        if ($scope.product.cocina)
        {
            $scope.product.barra = false
        }
    }

    $scope.update = function()
    {
        $scope.$emit('loadasc')
        $http.post('/api/products/update', $scope.product)
        .success(function(err)
        {
            pushMessage('success', 'HECHO', 'Producto actualizado con exito', "checkmark")
            $scope.DateClient = {};
            socket.emit('update_products'+$rootScope.user.admin._id)
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



    $scope.currentPage = 0;
    $scope.pageSize = 5;
    $scope.pages = [];
    $scope.pageSizetmp = {}

    $scope.products = {};
    $scope.products_hold = {};
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


    $scope.Getproducts()

    $scope.search = function(){
        if ($scope.inputbox.txt == null || $scope.inputbox.txt == '')
        {
            $scope.products = $scope.products_hold
        }else
        {
            $scope.products = []
            for (var i = 0; i < $scope.products_hold.length; i++)
            {
                if ($scope.products_hold[i].name.includes($scope.inputbox.txt.toUpperCase()) || $scope.products_hold[i].codebar.includes($scope.inputbox.txt.toUpperCase()) )
                {
                    $scope.products.push($scope.products_hold[i])
                }
            }
        }
        $scope.LoadPages()
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

app.controller("sales_vtd", ['$scope', '$http', 'socket', '$rootScope','$window', function ($scope, $http, socket, $rootScope, $window) {

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
        $scope.$emit('load')
        $http.post('/api/sales/vtd/', $scope.comanda)
        .success(function(ticket){
          socket.emit('UpdateComanda'+$rootScope.user.admin._id);
          $scope.clean()
          window.open('/dashboard/ticket/'+ticket, '_blank');
          pushMessage('success','', 'Venta realizada con exito', "checkmark")
        })
        .error (function (msg){
            pushMessage('alert','', msg, "cross")
            $scope.$emit('unload')
        })
        .finally (function (){
            $scope.$emit('unload')
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
            $scope.products[0].delivery = true
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
            item.delivery = true
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



    $scope.currentPage = 0;
    $scope.pageSize = 5;
    $scope.pages = [];
    $scope.pageSizetmp = {}

    $scope.sales = {};
    $scope.sale = {};
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

app.controller("finance_administrator", ['$scope', '$http','$timeout', function ($scope, $http, $timeout) {



    $scope.currentPage = 0;
    $scope.pageSize = 5;
    $scope.pages = [];
    $scope.pageSizetmp = {}

    $scope.sales = {}
    $scope.sales_products = {}
    $scope.sales_hold = {}
    $scope.users = {}
    $scope.date = {}
    $scope.tmp = {}
    $scope.tmp.user = 'all'
    $scope.tmp.title = 'GRAFICA DE MOVIMIENTOS'

    var f = new Date();

    $scope.date.desde = f.getDate() + "/" + (f.getMonth() +1) + "/" + f.getFullYear()
    $scope.date.hasta = f.getDate() + "/" + (f.getMonth() +1) + "/" + f.getFullYear()

    $scope.showventa = function (item){
        $scope.tmp.products = []
        for (var i = 0; i < $scope.sales_products.length; i++)
        {
            if ($scope.sales_products[i].sale == item._id)
            {
                $scope.tmp.products.push($scope.sales_products[i])
            }
        }
    }

    $scope.changeDate = function (){
    $scope.sales = []
        for (var i = 0 ; i < $scope.sales_hold.length; i++)
        {
            var tmp = $scope.sales_hold[i].fecha.split('T')
            var tmp0 = tmp[0].split('-')
            var fecha = new Date(tmp0[0],tmp0[1]-1, tmp0[2])

            var tmpdesde = $scope.date.desde.split('/')
            var desde = new Date(tmpdesde[2], tmpdesde[1]-1, tmpdesde[0]);

            var tmphasta = $scope.date.hasta.split('/')
            var hasta = new Date(tmphasta[2], tmphasta[1]-1, tmphasta[0]);

            if (fecha.getTime() >= desde.getTime() && fecha.getTime() <= hasta.getTime())
            {
                if ($scope.tmp.user == null || $scope.tmp.user == 'all' || $scope.tmp.user == '')
                {
                    $scope.sales.push($scope.sales_hold[i])
                }
                else
                {
                    if ($scope.sales_hold[i].user._id == $scope.tmp.user)
                    {
                        $scope.sales.push($scope.sales_hold[i])
                    }
                }
            }
        }
        $scope.LoadPages()
        LoadChart()
    }

    GetSales = function (){
        $scope.$emit('load')
        $http.get('/api/finance/sales')
        .success(function(data){
            $scope.sales_hold = data
            var hoy = new Date(f.getFullYear(),f.getMonth(), f.getDate())
            $scope.sales = []
            for (var i = 0 ; i < $scope.sales_hold.length; i++)
            {
                var tmp = $scope.sales_hold[i].fecha.split('T')
                var tmp0 = tmp[0].split('-')
                var fecha = new Date(tmp0[0],tmp0[1]-1, tmp0[2])

                if (fecha.getTime() == hoy.getTime())
                {
                    $scope.sales.push($scope.sales_hold[i])
                }
            }
            $scope.LoadPages()
        })
        .error (function (msg){
            pushMessage('alert','ERROR', msg, "cross")
        })
    }

    GetUsers = function (){
        $http.get('/api/finance/users')
        .success(function(data){
            $scope.users = data
        })
        .error (function (msg){
            pushMessage('alert','ERROR', msg, "cross")
        })
    }

    Getproducts = function (){
        $http.get('/api/finance/products')
        .success(function(data){
            $scope.sales_products = data
        })
        .error (function (msg){
            pushMessage('alert','ERROR', msg, "cross")
        })
        .finally (function (){
            $scope.$emit('unload')
            LoadChart()
        })
    }

    LoadChart = function (){
        $scope.myChartObject = {};

        $scope.myChartObject.type = 'ColumnChart';

        $scope.onions = [
            {v: "Onions"},
            {v: 3},
        ];

        $scope.myChartObject.data = {"cols": [
            {id: "t", label: "Topping", type: "string"},
            {id: "s", label: "Monto cobrado", type: "number"}
        ], "rows": []};

        var data_calculate = []
        if ($scope.tmp.user == null || $scope.tmp.user == 'all' || $scope.tmp.user == '')
        {
            for (var i = 0 ; i < $scope.users.length; i++)
            {
                var total = 0
                for (var b = 0 ; b < $scope.sales.length; b++)
                {
                    if ($scope.users[i]._id == $scope.sales[b].user._id)
                    {
                        total += $scope.sales[b].monto
                    }
                }
                var tmp = $scope.users[i].nombre.split(" ")
                var tmp0
                if (tmp.length > 1)
                {
                    tmp0 = tmp[0] + ' ' + tmp[1]
                }else
                {
                    tmp0 = tmp[0]
                }
                data_calculate.push({
                    name: tmp0,
                    total: total
                })
                total = 0
            }

            var totalglobal = 0
            for (var b = 0 ; b < $scope.sales.length; b++)
            {
                totalglobal += $scope.sales[b].monto
            }

            $scope.tmp.title = 'GRAFICA DE MOVIMIENTOS TOTAL RECAUDADO $ '+ totalglobal.toFixed(2)
        }else
        {
            var datatmp = []
            for (var b = 0 ; b < $scope.sales.length; b++)
            {
                if ($scope.sales[b].user._id == $scope.tmp.user)
                {
                    datatmp.push($scope.sales[b])
                }
            }

            var exist = []
            for (var i = 0 ; i < datatmp.length; i++)
            {
                var agregar = true

                for (var a = 0; a < exist.length; a++)
                {
                    var tmp = exist[a].split('T')
                    var tmp0 = tmp[0].split('-')
                    var fecha = new Date(tmp0[0],tmp0[1]-1, tmp0[2])

                    var tmp1 = datatmp[i].fecha.split('T')
                    var tmp2 = tmp1[0].split('-')
                    var fechadb = new Date(tmp2[0],tmp2[1]-1, tmp2[2])



                    if (fecha.getTime() == fechadb.getTime())
                    {
                        agregar = false
                    }
                }

                if (agregar)
                {
                    var total = 0
                    for (var b = 0 ; b < datatmp.length; b++)
                    {
                        var tmp = datatmp[b].fecha.split('T')
                        var tmp0 = tmp[0].split('-')
                        var fecha = new Date(tmp0[0],tmp0[1]-1, tmp0[2])

                        var tmp1 = datatmp[i].fecha.split('T')
                        var tmp2 = tmp1[0].split('-')
                        var fechadb = new Date(tmp2[0],tmp2[1]-1, tmp2[2])


                        if (fecha.getTime() == fechadb.getTime())
                        {
                            total += datatmp[b].monto
                        }
                    }
                    var tmp = datatmp[i].fecha.split('T')
                    var tmp0 = tmp[0].split('-')
                    data_calculate.push({
                        name: tmp0[2] +'-'+ tmp0[1] +'-'+ tmp0[0],
                        total: total
                    })
                    exist.push(datatmp[i].fecha)
                    total = 0
                }

            }
            data_calculate.reverse()
            var totalglobal = 0
            for (var b = 0 ; b < data_calculate.length; b++)
            {
                totalglobal += data_calculate[b].total
            }

            $scope.tmp.title = 'GRAFICA DE MOVIMIENTOS, ' + datatmp[0].user.nombre + '. TOTAL RECAUDADO $ ' + totalglobal.toFixed(2)
        }


        for (var i = 0 ; i < data_calculate.length; i++)
        {
            $scope.myChartObject.data.rows.push({c: [
                {v: data_calculate[i].name},
                {v: data_calculate[i].total}
            ]})
        }

        $scope.myChartObject.options = {
            'title': $scope.tmp.title
        };
    }

    GetSales()
    GetUsers()
    Getproducts()



    $scope.ChangePageItems = function() {
        if ($scope.pageSizetmp.items == 'todos')
        {
            $scope.pageSize = $scope.sales.length
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

app.controller("users_movements", ['$scope', '$http','$timeout', function ($scope, $http, $timeout) {
    $scope.currentPage = 0;
    $scope.pageSize = 5;
    $scope.pages = [];
    $scope.pageSizetmp = {}

    $scope.users = {}
    $scope.movements = {}
    $scope.movements_hold = {}
    $scope.sales_products = {}

    $scope.ViewMovementsUser = function () {
        if ($scope.tmp.user == 'all')
        {
            $scope.movements = $scope.movements_hold
        }else
        {
            $scope.movements = []
            for (var i = 0 ; i < $scope.movements_hold.length; i++)
            {
                if ($scope.movements_hold[i].user._id == $scope.tmp.user)
                {
                    $scope.movements.push($scope.movements_hold[i])
                }
            }

        }
        $scope.LoadPages()
    }

    $scope.showventa = function (item){
        $scope.sale = item
        $scope.sale.products = []
        for (var i = 0 ; i < $scope.sales_products.length; i++)
        {
            if ($scope.sales_products[i].sale == item.sale)
            {
                $scope.sale.products.push($scope.sales_products[i])
            }
        }

    }

    GetUsers = function (){
        $scope.$emit('load')
        $http.get('/api/finance/users')
        .success(function(data){
            $scope.users = data
        })
        .error (function (msg){
            pushMessage('alert','ERROR', msg, "cross")
        })
    }

    GetMovements = function (){
        $http.get('/api/finance/movements')
        .success(function(data){
            $scope.movements = data
            $scope.movements_hold = data
            $scope.LoadPages()
        })
        .error (function (msg){
            pushMessage('alert','ERROR', msg, "cross")
        })
    }


    Getproducts = function (){
        $http.get('/api/finance/products')
        .success(function(data){
            $scope.sales_products = data
        })
        .error (function (msg){
            pushMessage('alert','ERROR', msg, "cross")
        })
        .finally (function (){
            $scope.$emit('unload')
        })
    }
    GetUsers()
    GetMovements()
    Getproducts()

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
}
  ]).filter('startFromGrid', function() {
    return function(input, start)
    {
        if (!input || !input.length) { return; }
        start = +start;
        return input.slice(start);
    }
})

app.controller('procuts_kitchen_cocina',  function ($scope, $http, $timeout, $rootScope, socket, $window) {
    $scope.$emit('load')
    $http.get('/api/socket/cocina')
    .success (function (){

    $scope.cook_products = []
    $scope.cook_products_hold = []
    $scope.msg = {}
    $scope.msgnew = {}
    $scope.tmp = {}
    $scope.users_activos = []
    $scope.platillos = []

    socket = io.connect()
    socket = io.connect(urlsocket, { 'forceNew': true })

    $scope.$emit('load')


    socket.on('disconnect', function ()
    {
        pushMessage('warning','', 'Sistema Desconectado', "cross")
    });

    socket.on('GetComandas'+$rootScope.user.admin._id, function(data0) {
        $rootScope.$apply(function () {
        $http.get('/api/kitchen/cook_products')
        .success (function (data){
            var existente = $scope.cook_products.length
            $scope.cook_products = []

            for (var i = 0; i < data.length; i++)
            {
                if (data[i].admin._id == $rootScope.user.admin._id && data[i].cocina)
                {
                    $scope.cook_products.push(data[i])
                    $scope.cook_products_hold.push(data[i])
                }
            }
            if ($scope.cook_products.length > existente)
            {
                pushMessage('info','COCINA', 'Nuevas ordenes', "checkmark")
            }

            $scope.$emit('unload')
            loadvaluestatus()
        });  
        })
    });

    $scope.search = function(){
        if ($scope.inputbox.txt == null || $scope.inputbox.txt == '')
        {
            $scope.cook_products = $scope.cook_products_hold
        }else
        {
            $scope.cook_products = []
            for (var i = 0; i < $scope.cook_products_hold.length; i++)
            {
                if ($scope.cook_products_hold[i].product.name.includes($scope.inputbox.txt.toUpperCase()) || $scope.cook_products_hold[i].product.codebar.includes($scope.inputbox.txt.toUpperCase()) )
                {
                    $scope.cook_products.push($scope.cook_products_hold[i])
                }
            }
        }
        var tmp = $scope.cook_products
        $scope.cook_products = []
        
        for(var i = 0 ; i < tmp.length ; i++)
        {
            var add = true
            for(var b = 0 ; b < $scope.cook_products.length ; b++)
            {
                if (tmp[i]._id == $scope.cook_products[b]._id)
                {
                    add = false
                }
            }
            if (add)
            {
                $scope.cook_products.push(tmp[i])
            }
        }
    };

    $scope.ActionAll = function ()
    {
        $scope.tmp.occupied = true
        $scope.$emit('loadasc')
        var tmp = []

        for (var i = 0; i < $scope.cook_products.length; i++)
        {
            if ($scope.cook_products[i].check)
            {
                tmp.push($scope.cook_products[i])
            }
        }

        $http.post('/api/socket/action_all', tmp)
        .success(function(msg){
            $http.get('/api/kitchen/cook_products')
            .success(function (data){
                socket.emit('UpdateComanda'+$rootScope.user.admin._id);
                for (var i = 0; i < tmp.length; i++)
                {
                    for (var b = 0; b < $scope.cook_products.length; b++)
                    {
                        if ($scope.cook_products[b]._id == tmp[i]._id)
                        {
                            if ($scope.cook_products[b].preparando)
                            {
                                $scope.cook_products.splice($scope.cook_products.indexOf(tmp[i]),1);
                            }else
                            {
                                $scope.cook_products[b].preparando = true
                                $scope.cook_products[b].status = 'En preparacion'
                                $scope.cook_products[b].check = false
                            }

                        }
                    }
                }
                loadvaluestatus()
                pushMessage('success','', msg, "checkmark")
            })
            .error(function (msg){
               pushMessage('alert','ERROR', msg, "checkmark")
            })
            .finally (function (){
              $scope.$emit('unloadasc')
              $scope.tmp.occupied = false
            })
        })
        .error(function(msg){
            pushMessage('alert','ERROR', msg, "checkmark")
        })
    }

    $scope.SelectAll = function ()
    {
        for(var i = 0; i < $scope.cook_products.length; i++)
        {
            $scope.cook_products[i].check = true
        }
    }

    $scope.SelectAny = function ()
    {
        for(var i = 0; i < $scope.cook_products.length; i++)
        {
            $scope.cook_products[i].check = false
        }
    }

    $scope.PrepararAll = function ()
    {
        $scope.tmp.occupied = true
        $scope.$emit('loadasc')
        var tmp = []

        for (var i = 0; i < $scope.cook_products.length; i++)
        {
            tmp.push($scope.cook_products[i])
        }

        $http.post('/api/socket/preparar_all', tmp)
        .success(function(msg){
            $http.get('/api/kitchen/cook_products')
            .success(function (data){
                socket.emit('UpdateComanda'+$rootScope.user.admin._id);
                for (var i = 0; i < tmp.length; i++)
                {
                    for (var b = 0; b < $scope.cook_products.length; b++)
                    {
                        if ($scope.cook_products[b]._id == tmp[i]._id)
                        {
                            $scope.cook_products[b].preparando = true
                            $scope.cook_products[b].status = 'En preparacion'
                        }
                    }
                }
                loadvaluestatus()
                pushMessage('success','', msg, "checkmark")
            })
            .error(function (msg){
               pushMessage('alert','ERROR', msg, "checkmark")
            })
            .finally (function (){
              $scope.$emit('unloadasc')
              $scope.tmp.occupied = false
            })
        })
        .error(function(msg){
            pushMessage('alert','ERROR', msg, "checkmark")
        })
    }

    $scope.FinalizarAll = function ()
    {
        $scope.tmp.occupied = true
        $scope.$emit('loadasc')
        var tmp = []

        for (var i = 0; i < $scope.cook_products.length; i++)
        {
            tmp.push($scope.cook_products[i])
        }

        $http.post('/api/socket/finalizar_all', tmp)
        .success(function(msg){
            $http.get('/api/kitchen/cook_products')
            .success(function (data){
                socket.emit('UpdateComanda'+$rootScope.user.admin._id);
                for (var i = 0; i < tmp.length; i++)
                {
                    $scope.cook_products.splice($scope.cook_products.indexOf(tmp[i]),1);
                }
                loadvaluestatus()
                pushMessage('success','', msg, "checkmark")
            })
            .error(function (msg){
               pushMessage('alert','ERROR', msg, "checkmark")
            })
            .finally (function (){
              $scope.$emit('unloadasc')
              $scope.tmp.occupied = false
            })
        })
        .error(function(msg){
            pushMessage('alert','ERROR', msg, "checkmark")
        })
    }

    $scope.select = function (item)
    {
        var TotalComandaTmp = $scope.tmp.totalComanda
        var PreparacionTmp = $scope.tmp.preparacion
        $scope.tmp = item
        $scope.tmp.totalComanda = TotalComandaTmp
        $scope.tmp.preparacion = PreparacionTmp
    }

    $scope.preparar = function (item)
    {
        $scope.tmp.occupied = true
        $scope.$emit('loadasc')
        $http.post('/api/kitchen/product_update_preparacion', item)
        .success (function (msg){
            $http.get('/api/kitchen/cook_products')
            .success(function (data){
                socket.emit('UpdateComanda'+$rootScope.user.admin._id);
                item.status = 'En preparacion'
                item.preparando = true
                item.check = false
                pushMessage('success','', msg + ' ' + item.product.name, "checkmark")
                loadvaluestatus()
            })
            .error(function (msg){
               pushMessage('alert','ERROR', msg, "checkmark")
            })
            .finally (function (){
              $scope.$emit('unloadasc')
              $scope.tmp.occupied = false
            })
        })
    }

    $scope.finalizar = function (item)
    {
        $scope.tmp.occupied = true
        $scope.$emit('loadasc')
        $http.post('/api/kitchen/product_update_finalizacion', item)
        .success (function (msg){
            $http.get('/api/kitchen/cook_products')
            .success(function (data){
                socket.emit('UpdateComanda'+$rootScope.user.admin._id);
                $scope.cook_products.splice($scope.cook_products.indexOf(item),1);
                pushMessage('success','', msg + ' ' + item.product.name, "checkmark")
                loadvaluestatus()
            })
            .error(function (msg){
               pushMessage('alert','ERROR', msg, "checkmark")
            })
            .finally (function (){
              $scope.tmp.occupied = false
              $scope.$emit('unloadasc')
              if ($scope.cook_products.length == 0)
              {
                pushMessage('success','BIEN', 'Parece que todo esta preparado, servido o entregado.', "checkmark")
              }
            })
        })
    }

    $scope.call = function (item)
    {
        $http.post('/api/kitchen/add_notifications', item)
        .success (function (msg){
            socket.emit('update_notifications'+$rootScope.user.admin._id);
            pushMessage('warning','', msg, "checkmark")    
        })
        .error(function (msg){
            pushMessage('alert','', 'msg', "cross")    
        })
    }

    loadvaluestatus = function (){
        $scope.tmp.totalComanda = 0
        $scope.tmp.preparacion = 0
        $scope.users_activos = []
        $scope.platillos = []

        for (var i = 0; i < $scope.cook_products.length; i++)
        {
            $scope.tmp.totalComanda ++
            if ($scope.cook_products[i].preparando)
            {
                $scope.tmp.preparacion ++
            }

            var agregar = true

            for (var ii = 0; ii < $scope.users_activos.length; ii++)
            {
                if ($scope.users_activos[ii].user._id == $scope.cook_products[i].user._id)
                {
                    agregar = false
                }
            }

            if (agregar)
            {
                $scope.users_activos.push($scope.cook_products[i])
            }

            var agregar_platillos = true

            for (var ii = 0; ii < $scope.platillos.length; ii++)
            {
                if ($scope.platillos[ii].product._id == $scope.cook_products[i].product._id)
                {
                    agregar_platillos = false
                    $scope.platillos[ii].product.total += $scope.cook_products[i].unidades
                }
            }

            if (agregar_platillos)
            {
                $scope.cook_products[i].product.total = $scope.cook_products[i].unidades
                $scope.platillos.push($scope.cook_products[i])
            }
        }

        for (var i = 0; i < $scope.users_activos.length; i++)
        {
            $scope.users_activos[i].user.comandas = 0

            for (var b = 0; b < $scope.cook_products.length; b++)
            {
                if ($scope.cook_products[b].user._id == $scope.users_activos[i].user._id)
                {
                    $scope.users_activos[i].user.comandas ++
                }
            }
        }
    }

    })
    .error (function(){
        pushMessage('alert','ERROR', 'No autorizado', "cross")
        $window.location = "dashboard#"
    })
})

app.controller('procuts_kitchen_barr', function ($scope, $http, $timeout, $rootScope, socket, $window) {
    $scope.$emit('load')
    $http.get('/api/socket/barra')
    .success(function(){

    $scope.currentPage = 0;
    $scope.pageSize = 5;
    $scope.pages = [];
    $scope.pageSizetmp = []

    $scope.cook_products = []
    $scope.cook_products_hold = []

    $scope.msg = {}
    $scope.msgnew = {}
    $scope.tmp = {}
    $scope.users_activos = []
    $scope.platillos = []

    socket = io.connect()
    socket = io.connect(urlsocket, { 'forceNew': true })

    $scope.$emit('load')

    socket.on('disconnect', function ()
    {
        pushMessage('warning','', 'Sistema Desconectado', "cross")
    });

    socket.on('GetComandas'+$rootScope.user.admin._id, function(data0) {
        $rootScope.$apply(function () {
        $http.get('/api/kitchen/cook_products')
        .success (function (data){
            var existente = $scope.cook_products.length
            $scope.cook_products = []
  
            for (var i = 0; i < data.length; i++)
            {
                if (data[i].admin._id == $rootScope.user.admin._id && data[i].barra)
                {
                    $scope.cook_products.push(data[i])
                    $scope.cook_products_hold.push(data[i])
                }
            }
            if ($scope.cook_products.length > existente)
            {
                pushMessage('info','BARRA', 'Nuevas ordenes', "checkmark")
            }
  
            $scope.$emit('unload')
            loadvaluestatus()
        })
    })
    });

    $scope.search = function(){
        if ($scope.inputbox.txt == null || $scope.inputbox.txt == '')
        {
            $scope.cook_products = $scope.cook_products_hold
        }else
        {
            $scope.cook_products = []
            for (var i = 0; i < $scope.cook_products_hold.length; i++)
            {
                if ($scope.cook_products_hold[i].product.name.includes($scope.inputbox.txt.toUpperCase()) || $scope.cook_products_hold[i].product.codebar.includes($scope.inputbox.txt.toUpperCase()) )
                {
                    $scope.cook_products.push($scope.cook_products_hold[i])
                }
            }
        }
        var tmp = $scope.cook_products
        $scope.cook_products = []
        
        for(var i = 0 ; i < tmp.length ; i++)
        {
            var add = true
            for(var b = 0 ; b < $scope.cook_products.length ; b++)
            {
                if (tmp[i]._id == $scope.cook_products[b]._id)
                {
                    add = false
                }
            }
            if (add)
            {
                $scope.cook_products.push(tmp[i])
            }
        }
    };

    $scope.ActionAll = function ()
    {
        $scope.tmp.occupied = true
        $scope.$emit('loadasc')
        var tmp = []

        for (var i = 0; i < $scope.cook_products.length; i++)
        {
            if ($scope.cook_products[i].check)
            {
                tmp.push($scope.cook_products[i])
            }
        }

        $http.post('/api/socket/action_all', tmp)
        .success(function(msg){
            $http.get('/api/kitchen/cook_products')
            .success(function (data){
                socket.emit('UpdateComanda'+$rootScope.user.admin._id);
                for (var i = 0; i < tmp.length; i++)
                {
                    for (var b = 0; b < $scope.cook_products.length; b++)
                    {
                        if ($scope.cook_products[b]._id == tmp[i]._id)
                        {
                            if ($scope.cook_products[b].preparando)
                            {
                                $scope.cook_products.splice($scope.cook_products.indexOf(tmp[i]),1);
                            }else
                            {
                                $scope.cook_products[b].preparando = true
                                $scope.cook_products[b].status = 'En preparacion'
                                $scope.cook_products[b].check = false
                            }

                        }
                    }
                }
                loadvaluestatus()
                pushMessage('success','', msg, "checkmark")
            })
            .error(function (msg){
               pushMessage('alert','ERROR', msg, "checkmark")
            })
            .finally (function (){
              $scope.$emit('unloadasc')
              $scope.tmp.occupied = false
            })
        })
        .error(function(msg){
            pushMessage('alert','ERROR', msg, "checkmark")
        })
    }

    $scope.SelectAll = function ()
    {
        for(var i = 0; i < $scope.cook_products.length; i++)
        {
            $scope.cook_products[i].check = true
        }
    }

    $scope.SelectAny = function ()
    {
        for(var i = 0; i < $scope.cook_products.length; i++)
        {
            $scope.cook_products[i].check = false
        }
    }

    $scope.PrepararAll = function ()
    {
        $scope.tmp.occupied = true
        $scope.$emit('loadasc')
        var tmp = []

        for (var i = 0; i < $scope.cook_products.length; i++)
        {
            tmp.push($scope.cook_products[i])
        }

        $http.post('/api/socket/preparar_all', tmp)
        .success(function(msg){
            $http.get('/api/kitchen/cook_products')
            .success(function (data){
                socket.emit('UpdateComanda'+$rootScope.user.admin._id);
                for (var i = 0; i < tmp.length; i++)
                {
                    for (var b = 0; b < $scope.cook_products.length; b++)
                    {
                        if ($scope.cook_products[b]._id == tmp[i]._id)
                        {
                            $scope.cook_products[b].preparando = true
                            $scope.cook_products[b].status = 'En preparacion'
                        }
                    }
                }
                loadvaluestatus()
                pushMessage('success','', msg, "checkmark")
            })
            .error(function (msg){
               pushMessage('alert','ERROR', msg, "checkmark")
            })
            .finally (function (){
              $scope.$emit('unloadasc')
              $scope.tmp.occupied = false
            })
        })
        .error(function(msg){
            pushMessage('alert','ERROR', msg, "checkmark")
        })
    }

    $scope.FinalizarAll = function ()
    {
        $scope.tmp.occupied = true
        $scope.$emit('loadasc')
        var tmp = []

        for (var i = 0; i < $scope.cook_products.length; i++)
        {
            tmp.push($scope.cook_products[i])
        }

        $http.post('/api/socket/finalizar_all', tmp)
        .success(function(msg){
            $http.get('/api/kitchen/cook_products')
            .success(function (data){
                socket.emit('UpdateComanda'+$rootScope.user.admin._id);
                for (var i = 0; i < tmp.length; i++)
                {
                    $scope.cook_products.splice($scope.cook_products.indexOf(tmp[i]),1);
                }
                loadvaluestatus()
                pushMessage('success','', msg, "checkmark")
            })
            .error(function (msg){
               pushMessage('alert','ERROR', msg, "checkmark")
            })
            .finally (function (){
              $scope.$emit('unloadasc')
              $scope.tmp.occupied = false
            })
        })
        .error(function(msg){
            pushMessage('alert','ERROR', msg, "checkmark")
        })
    }

    $scope.select = function (item)
    {
        var TotalComandaTmp = $scope.tmp.totalComanda
        var PreparacionTmp = $scope.tmp.preparacion
        $scope.tmp = item
        $scope.tmp.totalComanda = TotalComandaTmp
        $scope.tmp.preparacion = PreparacionTmp
    }

    $scope.preparar = function (item)
    {
        $scope.tmp.occupied = true
        $scope.$emit('loadasc')
        $http.post('/api/kitchen/product_update_preparacion', item)
        .success (function (msg){
            $http.get('/api/kitchen/cook_products')
            .success(function (data){
                socket.emit('UpdateComanda'+$rootScope.user.admin._id);
                item.status = 'En preparacion'
                item.preparando = true
                item.check = false
                pushMessage('success','', msg + ' ' + item.product.name, "checkmark")
                loadvaluestatus()
            })
            .error(function (msg){
               pushMessage('alert','ERROR', msg, "checkmark")
            })
            .finally (function (){
              $scope.$emit('unloadasc')
              $scope.tmp.occupied = false
            })
        })
    }

    $scope.finalizar = function (item)
    {
        $scope.tmp.occupied = true
        $scope.$emit('loadasc')
        $http.post('/api/kitchen/product_update_finalizacion', item)
        .success (function (msg){
            $http.get('/api/kitchen/cook_products')
            .success(function (data){
                socket.emit('UpdateComanda'+$rootScope.user.admin._id);
                $scope.cook_products.splice($scope.cook_products.indexOf(item),1);
                pushMessage('success','', msg + ' ' + item.product.name, "checkmark")
                loadvaluestatus()
            })
            .error(function (msg){
               pushMessage('alert','ERROR', msg, "checkmark")
            })
            .finally (function (){
              $scope.tmp.occupied = false
              $scope.$emit('unloadasc')
              if ($scope.cook_products.length == 0)
              {
                pushMessage('success','BIEN', 'Parece que todo esta preparado, servido o entregado.', "checkmark")
              }
            })
        })
    }

    $scope.call = function (item)
    {
        $http.post('/api/kitchen/add_notifications', item)
        .success (function (msg){
            socket.emit('update_notifications'+$rootScope.user.admin._id);
            pushMessage('warning','', msg, "checkmark")    
        })
        .error(function (msg){
            pushMessage('alert','', 'msg', "cross")    
        })
    }

    loadvaluestatus = function (){
        $scope.tmp.totalComanda = 0
        $scope.tmp.preparacion = 0
        $scope.users_activos = []
        $scope.platillos = []

        for (var i = 0; i < $scope.cook_products.length; i++)
        {
            $scope.tmp.totalComanda ++
            if ($scope.cook_products[i].preparando)
            {
                $scope.tmp.preparacion ++
            }

            var agregar = true

            for (var ii = 0; ii < $scope.users_activos.length; ii++)
            {
                if ($scope.users_activos[ii].user._id == $scope.cook_products[i].user._id)
                {
                    agregar = false
                }
            }

            if (agregar)
            {
                $scope.users_activos.push($scope.cook_products[i])
            }

            var agregar_platillos = true

            for (var ii = 0; ii < $scope.platillos.length; ii++)
            {
                if ($scope.platillos[ii].product._id == $scope.cook_products[i].product._id)
                {
                    agregar_platillos = false
                    $scope.platillos[ii].product.total += $scope.cook_products[i].unidades
                }
            }

            if (agregar_platillos)
            {
                $scope.cook_products[i].product.total = $scope.cook_products[i].unidades
                $scope.platillos.push($scope.cook_products[i])
            }
        }

        for (var i = 0; i < $scope.users_activos.length; i++)
        {
            $scope.users_activos[i].user.comandas = 0

            for (var b = 0; b < $scope.cook_products.length; b++)
            {
                if ($scope.cook_products[b].user._id == $scope.users_activos[i].user._id)
                {
                    $scope.users_activos[i].user.comandas ++
                }
            }
        }
    }

    }).error (function(){
        pushMessage('alert','ERROR', 'No autorizado', "cross")
        $window.location = "dashboard#"
    })
})

app.controller('my_comands', function ($scope, $http, $timeout, $rootScope, socket, $window){

    $scope.$emit('load')
    
    $scope.tmp = {}
    $scope.tmp.occupied = false

    $http.get('/api/socket/my_comands')
    .success (function(){
        $scope.cook_products = []
        $scope.cook_products_hold = []
        socket = io.connect()
        socket = io.connect(urlsocket, { 'forceNew': true })

        socket.on('disconnect', function ()
        {
            pushMessage('warning','', 'Sistema Desconectado', "cross")
        });

        socket.on('GetComandas'+$rootScope.user.admin._id, function() {
            $rootScope.$apply(function () {
            $http.get('/api/kitchen/cook_products')
            .success (function (data){
                var existente = $scope.cook_products.length
                $scope.cook_products = []
      
                for (var i = 0; i < data.length; i++)
                {
                    if (data[i].user._id == $rootScope.user._id)
                    {
                        $scope.cook_products.push(data[i])
                        $scope.cook_products_hold.push(data[i])
                    }
                }
                if ($scope.cook_products.length > existente)
                {
                    pushMessage('info','BARRA', 'Mis ordenes', "checkmark")
                }
            })
            .finally (function (){
                $scope.$emit('unload')
            })
        })
        });
        
    })

    $scope.change_coment = function (item){
        $scope.tmp.occupied = true
        $scope.$emit('loadasc')
        $http.post('/api/kitchen/change_coment', item)
        .success(function (msg){
            item.comentario = item.comentario.toUpperCase()
            pushMessage('success','Mys comands', msg, "checkmark")
        })
        .finally (function(){
            socket.emit('UpdateComanda'+$rootScope.user.admin._id);
            $scope.tmp.occupied = false
            $scope.$emit('unloadasc')
        })
    }

    $scope.cancelar = function (item){
        $scope.$emit('loadasc')
        $scope.tmp.occupied = true
        $http.post('/api/kitchen/cancel_comand', item)
        .success(function (msg){
            socket.emit('UpdateComanda'+$rootScope.user.admin._id);
            socket.emit('UpdateCaja'+$rootScope.user.admin._id);
            if (item.unidades <= 1)
            {
                $scope.cook_products.splice($scope.cook_products.indexOf(item),1);
                pushMessage('success','Mys comands', 'Producto cancelado', "checkmark")
            }else
            {
                item.unidades --
                pushMessage('success','Mys comands', 'Producto actualizado', "checkmark")
            }
        })
        .error (function(msg){
            pushMessage('alert','Mys comands', msg, "cross")  
        })
        .finally (function(){
            $scope.tmp.occupied = false
            $scope.$emit('unloadasc')
        })
    }

    $scope.select = function (item){
      $scope.tmp = item
    }

    $scope.search = function(){
        if ($scope.inputbox.txt == null || $scope.inputbox.txt == '')
        {
            $scope.cook_products = $scope.cook_products_hold
        }else
        {
            $scope.cook_products = []
            for (var i = 0; i < $scope.cook_products_hold.length; i++)
            {
                if ($scope.cook_products_hold[i].product.name.includes($scope.inputbox.txt.toUpperCase()) || $scope.cook_products_hold[i].product.codebar.includes($scope.inputbox.txt.toUpperCase()) )
                {
                    $scope.cook_products.push($scope.cook_products_hold[i])
                }
            }
        }
        var tmp = $scope.cook_products
        $scope.cook_products = []
        
        for(var i = 0 ; i < tmp.length ; i++)
        {
            var add = true
            for(var b = 0 ; b < $scope.cook_products.length ; b++)
            {
                if (tmp[i]._id == $scope.cook_products[b]._id)
                {
                    add = false
                }
            }
            if (add)
            {
                $scope.cook_products.push(tmp[i])
            }
        }
    };
})

app.controller('tables', function ($http, $scope, socket, $rootScope){
    $scope.$emit('load')
    
    $scope.currentPage = 0;
    $scope.pageSize = 5;
    $scope.pages = [];
    $scope.pageSizetmp = {}

    $scope.tables = {}
    $scope.products = {}
    $scope.products_hold = {}
    $scope.places = []
    $scope.places_hold = []
    $scope.inputbox = {}
    $scope.table_select = 'all'
    $scope.category = {}
    $scope.comanda = []

    $scope.send_cocina = function (){
        $scope.$emit('load')

        for (var i = 0 ; i < $scope.comanda.length; i ++)
        {
            $scope.comanda[i].table = $scope.table_select._id
            $scope.comanda[i].delivery = false
        }
        
        $http.post('/api/sales/vtd_tables/', $scope.comanda)
        .success(function(msg){
          socket.emit('UpdateComanda'+$rootScope.user.admin._id);
          socket.emit('UpdateCaja'+$rootScope.user.admin._id);
          clean()
          pushMessage('success','', msg, "checkmark")
        })
        .error (function (msg){
            pushMessage('alert','', msg, "cross")
            $scope.$emit('unload')
        })
        .finally (function (){
            $scope.$emit('unload')
        })
    }

    $scope.cleanbtn = function (){
        $scope.category.select = null
        $scope.inputbox.txt = null
        $scope.products = $scope.products_hold
        $scope.comanda = []
        LoadPages()
        document.getElementById('input_search').focus();
    }

    clean = function (){
        $scope.inputbox.txt = null
        $scope.products = $scope.products_hold
        $scope.comanda = []
        LoadPages()
        document.getElementById('input_search').focus();
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
        $scope.inputbox.txt0 = null
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
            $scope.products[0].delivery = true
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
            item.delivery = true
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

    $scope.search_product = function ()
    {
        $scope.category.select = null

        if ($scope.inputbox.txt0 == null || $scope.inputbox.txt0 == '')
        {
            $scope.products = $scope.products_hold
        }else
        {
            $scope.products =[]
            for (var i = 0; i < $scope.products_hold.length; i++)
            {
                if ($scope.products_hold[i].name.includes($scope.inputbox.txt0.toUpperCase()) || $scope.products_hold[i].codebar.includes($scope.inputbox.txt0.toUpperCase()))
                {
                    $scope.products.push($scope.products_hold[i])
                }
            }
        }
        LoadPages()
    }
    
    $scope.show_categories = function () {
        if (!$scope.category.select)
        {
            $scope.products = $scope.products_hold
        }else
        {
            $scope.products = []
            for (var i = 0; i < $scope.products_hold.length; i ++)
            {
                if ($scope.products_hold[i].category._id == $scope.category.select)
                {
                    $scope.products.push($scope.products_hold[i])
                }
            }
        }
        LoadPages()
    }

    $scope.action = function (item)
    {
        DeselectAllTables()
        item.select = true
        $scope.table_select = item
    }

    $scope.close = function ()
    {
        $scope.$emit('loadasc')
        $http.post('/api/tables/close', $scope.table_select)
        .success (function (msg){
            $scope.table_select.open = false
            DeselectAllTables()
            socket.emit('UpdateTables'+$rootScope.user.admin._id)
            pushMessage('success','MESA', msg, "checkmark")
        })
        .error (function (msg){
          pushMessage('alert','MESA', msg, "cross")  
        })
        .finally (function (){
            $scope.$emit('unloadasc')
        })
    }

    $scope.open = function ()
    {
        $scope.$emit('loadasc')
        $http.post('/api/tables/open', $scope.table_select)
        .success (function (msg){
            $scope.table_select.open = true
            DeselectAllTables()
            socket.emit('UpdateTables'+$rootScope.user.admin._id)
            pushMessage('success','MESA', msg, "checkmark")
        })
        .error (function (msg){
          pushMessage('alert','MESA', msg, "cross")  
        })
        .finally (function (){
            $scope.$emit('unloadasc')
        })
    }

    DeselectAllTables = function (){
        for (var i = 0; i < $scope.tables.length; i++)
        {
            $scope.tables[i].select = false
        }
    }

    $http.get('/api/tables/socket_tables')
    .success (function (){
        socket = io.connect()
        socket = io.connect(urlsocket, { 'forceNew': true })

        socket.on('disconnect', function ()
        {
            pushMessage('warning','', 'Sistema Desconectado', "cross")
        });


        socket.on('GetTables'+$rootScope.user.admin._id, function() {
            $rootScope.$apply(function () {
                $http.get('/api/tables/get_tables')
                .success (function (data){
                    $scope.tables = data
                    $scope.tables_hold = data
                    loadPlaces()
                })
                .error(function (){
                    $scope.$emit('unload')
                })    
            }) 
        });

        socket.on('GetProducts'+$rootScope.user.admin._id, function() {
            $rootScope.$apply(function (){
                $http.get('/api/sales/products')
                .success (function (data){
                    $scope.products = data
                    $scope.products_hold = data
                    LoadPages()
                })
                .finally (function (){
                    $scope.$emit('unload')
                })
            })
        })

        $http.get('/api/catproducts/')
        .success(function(data) {
            $scope.category = data;
        })
        .error(function(data) {
            pushMessage('alert','ERROR',data, "cross")
        })
    })
    .error (function (){
        $scope.$emit('unload')
    })

    loadPlaces = function (){
        for (var i = 0; i < $scope.tables.length; i++)
        {   
            var add = true

            for (var b = 0; b < $scope.places.length; b++)
            {
                
                if ($scope.tables[i].place._id == $scope.places[b]._id)
                {
                    add = false
                }
            }

            if (add)
            {
                $scope.places.push($scope.tables[i].place)
            }
        }
    }


    $scope.select_place = function (){
        DeselectAllTables()
        if ($scope.places.select == 'all')
        {
            $scope.tables = $scope.tables_hold
        }else
        {

            $scope.tables = []
            for (var i = 0; i < $scope.tables_hold.length; i++)
            {
                if ($scope.tables_hold[i].place._id == $scope.places.select)
                {
                    $scope.tables.push($scope.tables_hold[i])
                }
            }
        }
    }

    $scope.search = function ()
    {
        if (!$scope.inputbox.txt)
        {
            $scope.tables = $scope.tables_hold
        }
        else
        {
            $scope.tables = []
            for (var i = 0; i < $scope.tables_hold.length; i ++)
            {
                if ($scope.tables_hold[i].numero == $scope.inputbox.txt)
                {
                    $scope.tables.push($scope.tables_hold[i])
                }
            }
        }
        LoadPages()
    }

    LoadPages = function ()
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

})

app.controller('caja', function ($http, $scope, socket, $rootScope, $window){
    $scope.$emit('load')
    
    $scope.currentPage = 0;
    $scope.pageSize = 5;
    $scope.pages = [];
    $scope.pageSizetmp = {}

    $scope.tables = {}
    $scope.comandas = {}
    $scope.comandas_hold = {}
    $scope.inputbox = {}
    $scope.table_select = 'all'
    $scope.category = {}
    $scope.comanda = []
    $scope.tables = []
    $scope.money = {}
    $scope.money.select = 0
    $scope.money.totalp = 0
    $scope.money.occupied = false

    $scope.payselect = function (){
        $scope.money.occupied = true
        $scope.$emit('loadasc')
        var items = []
        
        for (var i = 0; i < $scope.comandas.length; i++)
        {
            if ($scope.comandas[i].check)
            {
                items.push($scope.comandas[i])
            }
        }
        $http.post('/api/sales/pay_comands', items)
        .success (function (ticket){
            window.open('/dashboard/ticket/'+ticket, '_blank');
            $http.get('/api/sales/getComandsPay')
                .success (function (data){
                    $scope.comandas = data
                    $scope.comandas_hold = data
                    LoadTables()
                    $scope.calculatetotalselect_all()
                    $scope.SelectAny()
                    socket.emit('UpdateCaja'+$rootScope.user.admin._id);
                    pushMessage('success','Correcto', 'Productos cobrados con exito', "checkmark")
                })
                .error(function (){
                    $scope.$emit('unload')
                    $scope.money.occupied = false
                })    
                .finally (function (){
                    $scope.$emit('unloadasc')
                    $scope.money.occupied = false        
                })
        })
        .error (function (){
            $scope.$emit('unloadasc')
            $scope.money.occupied = false
        })
    }        

    $scope.payall = function (){
        $scope.money.occupied = true
        $scope.$emit('loadasc')
        
        $http.post('/api/sales/pay_comands', $scope.comandas)
        .success (function (ticket){
            window.open('/dashboard/ticket/'+ticket, '_blank');
            $http.get('/api/sales/getComandsPay')
                .success (function (data){
                    $scope.comandas = data
                    $scope.comandas_hold = data
                    LoadTables()
                    $scope.calculatetotalselect_all()
                    $scope.SelectAny()
                    socket.emit('UpdateCaja'+$rootScope.user.admin._id);
                    pushMessage('success','Correcto', 'Productos cobrados con exito', "checkmark")
                })
                .error(function (){
                    $scope.$emit('unload')
                    $scope.money.occupied = false
                })    
                .finally (function (){
                    $scope.$emit('unloadasc')
                    $scope.money.occupied = false        
                })
        })
        .error (function (){
            $scope.$emit('unloadasc')
            $scope.money.occupied = false
        })
    }

    $scope.search = function (){
        $scope.comandas = []
        for (var i = 0; i < $scope.comandas_hold.length; i++)
        {
            if ($scope.comandas_hold[i].product.name.includes($scope.inputbox.txt.toUpperCase()) || $scope.comandas_hold[i].product.codebar.includes($scope.inputbox.txt.toUpperCase()) || $scope.comandas_hold[i].status.toUpperCase().includes($scope.inputbox.txt.toUpperCase()) )
            {
                $scope.comandas.push($scope.comandas_hold[i])
            }
        }
        $scope.SelectAny()
        $scope.calculatetotalselect_all()
    }

    $scope.select_table = function (){
        $scope.comandas = []
        $scope.inputbox.txt = null
        if ($scope.tables.select == 'all')
        {
            $scope.comandas = $scope.comandas_hold
        }else
        {
            for(var i = 0; i < $scope.comandas_hold.length; i++)
            {
                if ($scope.comandas_hold[i].mesa._id == $scope.tables.select)
                {
                    $scope.comandas.push($scope.comandas_hold[i])    
                }   
            }
        }
        $scope.SelectAny()
        $scope.calculatetotalselect_all()
    }

    $scope.calculatetotalselect = function ()
    {
        $scope.money.select = 0
        $scope.money.totalp = 0
        $scope.comandasselect = []
        for(var i = 0; i < $scope.comandas.length; i++)
        {
            if ($scope.comandas[i].check)
            {
                $scope.money.select += $scope.comandas[i].unidades * $scope.comandas[i].product.price
                $scope.money.totalp += $scope.comandas[i].unidades
                $scope.comandasselect.push($scope.comandas[i])
            }
        }
    }

    $scope.calculatetotalselect_all = function ()
    {
        $scope.money.select_all = 0
        $scope.money.select_allp = 0
        for(var i = 0; i < $scope.comandas.length; i++)
        {
            $scope.money.select_all += $scope.comandas[i].unidades * $scope.comandas[i].product.price
            $scope.money.select_allp += $scope.comandas[i].unidades 
        }
    }

    $scope.SelectAll = function ()
    {
        for(var i = 0; i < $scope.comandas.length; i++)
        {
            $scope.comandas[i].check = true
        }
        $scope.calculatetotalselect()
        $scope.calculatetotalselect_all()
    }

    $scope.SelectAny = function ()
    {
        for(var i = 0; i < $scope.comandas.length; i++)
        {
            $scope.comandas[i].check = false
        }
        $scope.calculatetotalselect()
    }

    LoadTables = function (){
        for(var i = 0; i < $scope.comandas_hold.length; i++)
        {
            var add = true
            for(var b = 0; b < $scope.tables.length; b++)
            {
                if ($scope.comandas_hold[i].mesa._id == $scope.tables[b]._id)
                {
                    add = false
                }
            }

            if (add)
            {
                $scope.tables.push($scope.comandas_hold[i].mesa)
            }   
        }
    }

    $http.get('/api/sales/socket_caja')
    .success (function (){
        socket = io.connect()
        socket = io.connect(urlsocket, { 'forceNew': true })

        socket.on('disconnect', function ()
        {
            pushMessage('warning','', 'Sistema Desconectado', "cross")
        });


        socket.on('GetCaja'+$rootScope.user.admin._id, function() {
            $rootScope.$apply(function () {
                $scope.money.occupied = true
                $http.get('/api/sales/getComandsPay')
                .success (function (data){
                    $scope.comandas = data
                    $scope.comandas_hold = data
                    LoadTables()
                    $scope.calculatetotalselect_all()
                    $scope.SelectAny()
                })
                .error(function (){
                    $scope.$emit('unload')
                })    
                .finally (function (){
                    $scope.$emit('unload')
                    $scope.money.occupied = false
                })
            }) 
        });
    })
    .error (function (){
        $scope.$emit('unload')
    })  
})

app.controller('reports_ticket', function ($scope, $http, $window, $rootScope){
    $scope.load = true
    $scope.ticket = []
    $http.get('/api/public/get_ticket/' + window.location.pathname.split('/')[3])
    .success(function (data){
        var arr = data.split('/')

        for(var i = 0 ; i < arr.length; i ++)
        {
            $scope.ticket.push({a:arr[i]})
        }
    })
    .finally (function (){
        $scope.load = false
    })
})