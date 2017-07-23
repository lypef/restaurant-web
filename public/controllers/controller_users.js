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
            pushMessage('alert','ERROR', 'ID no encontrado.','cross')
        });

    $scope.Update = function()
    {
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

app.controller("catproducts", function($scope, $http){
    
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

app.controller("products", function($scope, $http){
    
    $http.defaults.headers.common['x-access-token']=token;
    
    $scope.product = {};
    $scope.products = {};
    $scope.categories = {};
    $scope.select = {}
    $scope.show = {}

    $http.get('/api/catproducts/')
        .success(function(data) {
            $scope.categories = data;
        })
        .error(function(data) {
            pushMessage('alert','ERROR',data, "cross")
    });
    
    $http.get('/api/getproducts/')
        .success(function(data) {
            $scope.products = data;
        })
        .error(function(data) {
            pushMessage('alert','ERROR',data, "cross")
    });

    $scope.ok = function ()
    {
        $scope.show = {}
    }

    $scope.LoadValuesEdit = function(){

        $http.get('/api/getproducts/' + $scope.select.select)
            .success(function(data) {
                $scope.select = data
                pushMessage('warning', 'HECHO', 'Producto encontrado', "checkmark")
            })
            .error(function(msg) {
                pushMessage('alert','ERROR',msg, "cross")
            });
    };

    $scope.LoadValuesShow = function(){

        $http.get('/api/getproducts/' + $scope.show.select)
            .success(function(data) {
                $scope.show = data
                pushMessage('info', 'HECHO', 'Producto encontrado', "checkmark")
            })
            .error(function(msg) {
                pushMessage('alert','ERROR',msg, "cross")
            });
    };

    $scope.create = function(){

        $http.post('/api/products/add', $scope.product)
            .success(function(data) {
                $scope.products = data
                $scope.product = {}
                pushMessage('success', 'HECHO', 'Categoria agregada', "checkmark")
            })
            .error(function(msg) {
                pushMessage('alert','ERROR',msg, "cross")
            });
    }; 

    $scope.update = function(){
        $http.post('/api/updateproducts', $scope.select)
            .success(function(data) {
                $scope.products = data;
                $scope.select = {}
                pushMessage('success', 'HECHO', 'Producto actualizado', "checkmark")
            })
            .error(function(msg) {
                pushMessage('alert','ERROR',msg, "cross")
            });
    };

    $scope.delete = function(){

        $http.post('/api/deleteproducts', $scope.select)
            .success(function(data) {
                $scope.products = data
                $scope.select = {}
                pushMessage('success', 'HECHO', 'Producto eliminado', "checkmark")
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
            $http.get('/api/getingredients/')
                .success(function(data) {
                    $scope.ingredients = data
                    $scope.IngredientUpdate = data
                    $scope.LoadPages();
                    
                })
                .error(function(data) {
                    pushMessage('alert','ERROR',data, "cross")
            });
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

        $http.get('/api/getingredients/' + $scope.select.select)
            .success(function(data) {
                $scope.select = data
                pushMessage('warning', 'HECHO', 'Ingrediente encontrado', "checkmark")
            })
            .error(function(msg) {
                pushMessage('alert','ERROR',msg, "cross")
            });
        };

        $scope.create = function(){

        $http.post('/api/add_ingredient', $scope.ingredient)
            .success(function(msg) {
                $scope.GetIngredients()
                $scope.ingredient = {}
                pushMessage('success', 'HECHO', msg, "checkmark")
            })
            .error(function(msg) {
                pushMessage('alert','ERROR',msg, "cross")
            });
        }; 

        $scope.update = function(){
        $http.post('/api/update_ingredient', $scope.select)
            .success(function(msg){
                $scope.GetIngredients()
                $scope.select = {}
                pushMessage('success', 'HECHO', msg, "checkmark")
            })
            .error(function(msg) {
                pushMessage('alert','ERROR',msg, "cross")
            });
        };

        $scope.delete = function(){

        $http.post('/api/ingredient/delete', $scope.select)
            .success(function(msg) {
                $scope.GetIngredients()
                $scope.select = {}
                pushMessage('success', 'HECHO', msg, "checkmark")
            })
            .error(function(msg) {
                pushMessage('alert','ERROR',msg, "cross")
            });
        };

        $scope.search = function(){
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
            });
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
      
        $http.get('/api/getingredients/')
            .success(function(data) {
                $scope.ingredients = data
                $scope.IngredientUpdate = data
                $scope.LoadPages();
            })
            .error(function(data) {
                pushMessage('alert','ERROR',data, "cross")
        });

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
            
            $http.post('/api/update_ingredient', item)
            .success(function(data) {
                pushMessage('success', 'HECHO', 'Producto actualizado', "checkmark")
            })
            .error(function(msg) {
                pushMessage('alert','ERROR',msg, "cross")
            });
            
        };

        $scope.search = function(){
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
            });
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

