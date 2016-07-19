var app = angular.module("restweb", []);

app.controller("controller", function($scope){
    $scope.saludo1 = "Hola, ";
    $scope.saludo2 = ", te mando saludos desde angular.";
    $scope.nombre = "Francisco Eduardo"; 
});