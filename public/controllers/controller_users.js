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
        .when('/editclient/:id', {
            templateUrl : '/clients_users/clients/UpdateClient.html'
        })
        .when('/catproducts', {
            templateUrl: '/clients_users/catproducts/catproducts.html'
        })
        .when('/products', {
            templateUrl : '/clients_users/products/index.html'
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
        .when('/view_recetas/:id', {
            templateUrl : '/clients_users/recetas/view.html'
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
    
    $scope.load = function (){
        $scope.loadinasc = true
        $http.get('/api/users/values')
        .success(function(data) {
            $scope.usuario = data;
        })
        .error(function(data) {
            console.log('Error: ' + data);
        })
        .finally (function (){
            $scope.loadinasc = false
        })
    }
    $scope.load()
});

app.controller("clients", ['$scope','$http','$window', function ($scope, $http, $window) {
        $http.defaults.headers.common['x-access-token']=token;
        
        $scope.currentPage = 0;
        $scope.pageSize = 5;
        $scope.pages = [];
        
        $scope.all = {};
        $scope.Client = {};
     
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
            $http.post('/api/client/search', $scope.inputbox)
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


app.controller("UpdateClient", function($scope, $http, $routeParams, $window)
{
    $http.defaults.headers.common['x-access-token']=token;
    $scope.DateClient = {};  

    $scope.id = $routeParams.id
    

    $scope.GetClient = function (){
        $scope.$emit('load')
        $http.get('/api/clientedit/' + $scope.id)
        .success(function(data) 
        {
            $scope.DateClient = data;
        })
        .error(function(data) 
        {
            $window.location = "dashboard#clients";
            pushMessage('alert','ERROR', 'ID no encontrado.','cross')
        })
        .finally (function (){
            $scope.$emit('unload')
        })
    }
    $scope.GetClient()

    $scope.Update = function()
    {
        $scope.$emit('load')
        $http.post('/api/client/update/clients', $scope.DateClient)
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
        .finally (function (){
            $scope.$emit('unload')
        })
    }  

    
    $scope.Delete = function()
    {
        $scope.$emit('load')
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
        .finally (function (){
            $scope.$emit('load')
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

app.controller("catproducts", ['$scope', '$http', function ($scope, $http) {
    $http.defaults.headers.common['x-access-token']=token;
    $scope.currentPage = 0;
    $scope.pageSize = 5;
    $scope.pages = [];

        
    $scope.productstmp = {};

    $scope.GetCategoryes = function ()
    {
        $scope.$emit('load')
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


app.controller("products", function($scope, $http){
    
    $http.defaults.headers.common['x-access-token']=token;
    
    $scope.product = {};
    $scope.products = {};
    $scope.categories = {};
    $scope.select = {}
    $scope.show = {}

    $scope.Getcatproducts = function (){
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
    
    $scope.Getproducts = function (){
        $scope.$emit('load')
        $http.get('/api/getproducts/')
        .success(function(data) {
            $scope.products = data;
        })
        .error(function(data) {
            pushMessage('alert','ERROR',data, "cross")
        })
        .finally (function (){
            $scope.$emit('unload')
        })
    }

    $scope.Getcatproducts()
    $scope.Getproducts()
        
    $scope.ok = function ()
    {
        $scope.show = {}
    }

    $scope.LoadValuesEdit = function(){
        $scope.$emit('loadasc')
        $http.get('/api/getproducts/' + $scope.select.select)
        .success(function(data) {
            $scope.select = data
            pushMessage('warning', 'HECHO', 'Producto encontrado', "checkmark")
        })
        .error(function(msg) {
            pushMessage('alert','ERROR',msg, "cross")
        })
        .finally (function (){
            $scope.$emit('unloadasc')
        })
    };

    $scope.create = function(){
        $scope.$emit('loadasc')
        $http.post('/api/products/add', $scope.product)
        .success(function(data) {
            $scope.products = data
            $scope.product = {}
            pushMessage('success', 'HECHO', 'Categoria agregada', "checkmark")
        })
        .error(function(msg) {
            pushMessage('alert','ERROR',msg, "cross")
        })
        .finally (function (){
            $scope.$emit('unloadasc')
        })
    }; 

    $scope.update = function(){
        $scope.$emit('loadasc')
        $http.post('/api/updateproducts', $scope.select)
        .success(function(data) {
            $scope.products = data;
            $scope.select = {}
            pushMessage('success', 'HECHO', 'Producto actualizado', "checkmark")
        })
        .error(function(msg) {
            pushMessage('alert','ERROR',msg, "cross")
        })
        .finally (function (){
            $scope.$emit('unloadasc')
        })
    };

    $scope.delete = function(){
        $scope.$emit('loadasc')
        $http.post('/api/deleteproducts', $scope.select)
        .success(function(data) {
            $scope.products = data
            $scope.select = {}
            pushMessage('success', 'HECHO', 'Producto eliminado', "checkmark")
        })
        .error(function(msg) {
            pushMessage('alert','ERROR',msg, "cross")
        })
        .finally (function (){
        $scope.$emit('unloadasc')
        })
    };

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
            $http.get('/api/getingredients/')
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
            $http.get('/api/getingredients/')
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
        $http.get('/api/getingredients/' + $scope.select.select)
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
            $http.post('/api/add_ingredient', $scope.ingredient)
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
            $http.post('/api/update_ingredient', $scope.select)
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
        $scope.$emit('load')
        $scope.inputbox
        $http.post('/api/ingredient/search', $scope.inputbox)
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
                $scope.$emit('unload')
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
      
        $scope.GetIngredients = function (){
            $scope.$emit('load')
            $http.get('/api/getingredients/')
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
            $http.post('/api/update_ingredient', item)
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
        $http.post('/api/ingredient/search', $scope.inputbox)
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

        $scope.ingredients = {};
        $scope.receta = {};
        $scope.arr = [];
        $scope.arrtmp = [];
        
        
        $scope.GetIngredients = function ()
        {
            $scope.$emit('load')
            $http.get('/api/getingredients/')
            .success(function(data) {
                $scope.ingredients = data
                $scope.LoadPages()
                $scope.ChangePageItems()
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
        $scope.$emit('load')
        $scope.inputbox
        $http.post('/api/ingredient/search', $scope.inputbox)
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
                $scope.$emit('unload')
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

            $http.post('/api/receta/add', $scope.receta)
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

        $scope.recetas = {};
        $scope.receta = {};
        
        
        $scope.GetReceta = function ()
        {
            $scope.$emit('load')
            $http.get('/api/get_receta/')
            .success(function(data) {
                $scope.recetas = data
                $scope.LoadPages()
                $scope.ChangePageItems()
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
            $http.get('/api/get_receta/')
            .success(function(data) {
                $scope.recetas = data
                $scope.LoadPages()
                $scope.ChangePageItems()
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
            $http.post('/api/receta/delete', $scope.receta)
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
            $http.post('/api/receta/search', $scope.inputbox)
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

        $scope.receta = {};
        $scope.ingredientes = {};
        $scope.measurements = [];
        $scope.arr = [];
        
        
        $http.get('/api/get_measurements/')
        .success(function(data) {
            $scope.measurements = data
        })

        $http.get('/api/get_receta/' + $routeParams.id)
            .success(function(data) {
                $scope.receta = data
            })
            .error(function(data) {
                pushMessage('alert','ERROR',data, "cross")
        });

        $http.get('/api/get_use_recetas/' + $routeParams.id )
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
            $http.get('/api/getingredients/')
            .success(function(data) {
                $scope.ingredientes = data
                $scope.LoadPages()
                $scope.ChangePageItems()
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

            $http.post('/api/receta/update', $scope.receta)
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
            $http.post('/api/receta/delete', $scope.receta)
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
        $http.get('/api/get_receta/' + $routeParams.id)
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
        $http.get('/api/get_use_recetas/' + $routeParams.id)
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