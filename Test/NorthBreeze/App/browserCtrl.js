﻿app.controller('BrowserCtrl', function ($scope, $window, $location) {

    function getUrlParameter(sParam) {
        var sPageURL = window.location.search.substring(1);
        var sURLVariables = sPageURL.split('&');
        for (var i = 0; i < sURLVariables.length; i++) {
            var sParameterName = sURLVariables[i].split('=');
            if (sParameterName[0] == sParam) {
                return sParameterName[1];
            }
        }
        return null;
    };

    var idx = 0;
    var itemCount = !!getUrlParameter('itemcount') ? parseInt(getUrlParameter('itemcount')) : 100;
    var getNewItem = function () {
        var item = {
            "engine": "Trident" + idx,
            "browser": "Internet Explorer 4.0" + idx,
            "platform": "Win 95+" + idx,
            "version": "4" + idx,
            "grade": "X" + idx
        };
        idx++;
        return item;
    };

    $scope.addItem = function () {
        $scope.data.push(getNewItem());
    };

    $scope.addItemViaDt = function() {
        $scope.dtTable.row.add(getNewItem());
    };

    $scope.removeItem = function (rowIndex) {
        $scope.data.splice(rowIndex, 1);
    };

    $scope.removeItemViaDt = function (rowIndex) {
        $scope.dtTable.row(rowIndex).remove();
    };

    $scope.canRemoveItem = function () {
        return angular.isNumber($scope.$selectedRowIndex);
    }

    var data = [];
    for (var i = 0; i < itemCount; i++) {

        var subItems = [];

        for (var j = 0; j < i; j++) {
            subItems.push({
                prop1: "test" + j
            });
        }
        data.push({
            "engine": "Trident" + i,
            "browser": "Internet Explorer 4.0" + i,
            "platform": "Win 95+" + i,
            "version": "4" + i,
            "grade": "X" + i,
            "subItems": subItems
        });


    }
    $scope.data = data;

    $scope.subItemOptions = {}

    $scope.options = {
        stateSave: false,
        paging: true,
        lengthChange: true,
        searching: true,
        info: true,
        autoWidth: true,
        deferRender: true,
        order: [],
        lengthMenu: [
            [10, 25, 50, 100, 200, -1],
            [10, 25, 50, 100, 200, "All"]
        ],
        columns: [
            { iconColumn: true },
            { data: "engine", title: "Engine" },
            { data: "browser", title: "Browser" },
            { data: "platform", title: "Platform" },
            { data: "version", title: "Version" },
            { data: "grade", title: "Grade" },
            { template: "#options-tpl" }
        ],
        rowDetails: {
            icon: {
                openHtml: '<span class="glyphicon glyphicon-plus row-detail-icon"></span>',
                closeHtml: '<span class="glyphicon glyphicon-minus row-detail-icon"></span>',
                'class': 'row-detail-icon',
            }
        },
        dom: "<'row'<'col-xs-6'l><'col-xs-6'f>r>" +
        "D" + //RowDetails
        "C" + //ColVis
        "t" +
		"<'row'<'col-xs-6'i><'col-xs-6'p>>R"

    };
});