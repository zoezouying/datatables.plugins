﻿//tableTools plugin
angular.module("dt")
    .config(["dtSettings", (dtSettings) => {
        //We have to remove the selected row/cell if the selected cell will be removed
        dtSettings.dtTableCreatingActions.push(($element, options, scope, attrs, $compile, $rootScope) => {
            if (options.dom == null || options.dom.indexOf("T") < 0) return;
            var tblScope: any = $element.scope();
            var selectedRows = {};
            var dtProps = {
                selectedRows: selectedRows,
                selectedRow: null

            };
            $element.data('DT_Properties', dtProps);

            if (!options.tableTools)
                options.tableTools = {};

            var settings = options.tableTools;
            var origPostSelected = settings.fnRowSelected;
            settings.fnRowSelected = function (nodes: Element[], src: any, e: any) {
                var api = this.s.dt.oInstance.api();
                var aoData = this.s.dt.aoData;
                var selectType = this.s.select.type;
                var dtRow, idx;

                if (angular.isArray(src)) { //Can be an array of indexes or nodes (only when multi)
                    /*
                    if (aoData == src) { //all rows will be selected so just empty the object
                        angular.forEach(selectedRows, (val, key) => {
                            delete selectedRows[key];
                        });
                    } else { //otherwise remove the rows that are gonna be reselected in order to have unique selectionOrders
                        angular.forEach(src, obj => {
                            dtRow = api.row(obj);
                            idx = dtRow.index();
                            if (selectedRows[idx] != null)
                                delete selectedRows[idx];
                        });
                    }*/

                    angular.forEach(src, (obj, i) => {
                        dtRow = aoData == src ? api.row(i) : api.row(obj); //src will be equal aoData on selectAll
                        idx = dtRow.index();
                        selectedRows[idx] = {
                            data: dtRow.data(),
                            node: dtRow.node()
                        };
                    });
                }
                else if (angular.isElement(src)) {
                    dtRow = api.row(src);
                    idx = dtRow.index();

                    if (selectType == "single") { //if single fill selectedRow otherwise selectedRows
                        dtProps.selectedRow = src._DT_Scope; //Scope will be always defined so we can use it
                    } else {
                        selectedRows[idx] = {
                            data: dtRow.data(),
                            node: dtRow.node(),
                            selectionOrder: Object.keys(selectedRows).length
                        };
                    }
                }

                //we have to digest the parent table scope in order to refresh bindings that are related to datatable instance
                if (!tblScope.$parent.$$phase)
                    tblScope.$parent.$digest();

                //Call the original fn
                if (angular.isFunction(origPostSelected))
                    origPostSelected(nodes, src);
            };

            var origPostDeselected = settings.fnRowDeselected;
            settings.fnRowDeselected = function (nodes: Element[], src: any, e: any) {
                var toRemove = [];
                var selectType = this.s.select.type;

                if (angular.isArray(src) && src.length > 0) { //Can be an array of indexes or nodes
                    if (angular.isElement(src[0])) {
                        angular.forEach(src, node => {
                            toRemove.push(node._DT_RowIndex);
                        });
                    } else 
                        toRemove = src.slice(); //Clone the array of indexes
                }
                else if (angular.isElement(src)) {
                    if (selectType == "single") {
                        dtProps.selectedRow = null;
                    }
                    else
                        toRemove.push(src._DT_RowIndex);
                }
                    
                while (toRemove.length > 0) {
                    var idx = toRemove.pop(); //get the row index that have to be removed
                    //We have to find the index of the row in $selectedRows and remove it
                    for (var sIdx in selectedRows) {
                        if (parseInt(sIdx) != idx) continue;
                        delete selectedRows[sIdx];
                        break;
                    }
                }

                if (!tblScope.$parent.$$phase)
                    tblScope.$parent.$digest();

                //Call the original fn
                if (angular.isFunction(origPostDeselected))
                    origPostDeselected(nodes, src);
            };

        });

        dtSettings.dtTableCreatedActions.push((dataTable, $element, options, scope, attrs, $compile) => {
            if (options.dom == null || options.dom.indexOf("T") < 0) return;
            var settings = options.tableTools || {};


            Object.defineProperty(dataTable, "selectedRows", {
                get: function() {
                    return angular.element(this.table().node()).data("DT_Properties").selectedRows;
                }
            });
            Object.defineProperty(dataTable, "selectedRow", {
                get: function () {
                    return angular.element(this.table().node()).data("DT_Properties").selectedRow;
                }
            });
        });

    }]); 