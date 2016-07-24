var app = angular.module("restweb", [])

app.controller("clients", function($scope, $http)
{
    $scope.NewClient = {};

    $http.get('/api/clients/')
        .success(function(data) {
            $scope.all = data;
            console.log(data)
        })
        .error(function(data) {
            console.log('Error: ' + data);
    });

    $scope.CreateClient = function(){
        $http.post('/api/clients', $scope.NewClient)
            .success(function(data) {
                $scope.NewClient = {};
                $scope.all = data;
                console.log(data);
            })
            .error(function(data) {
                console.log('Error:' + data);
            });
    };  
})

