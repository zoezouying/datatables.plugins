﻿angular.module('app', ['dt']).controller('mainController', function ($scope) {
    $scope.options = {
        ajax: '../../../customers.txt',
        columns: [
            { title: 'Name' },
            { title: 'Position' },
            { title: 'Office' },
            { title: 'Age' },
            { title: 'Start date' },
            { title: 'Salary' },
            { title: 'Name + Age', expression: "data[0] + ' ' + data[3]" }
        ]
    };
});
//# sourceMappingURL=programmatic.js.map
