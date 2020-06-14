// ==UserScript==
// @name         Status 6
// @version      1.1.0
// @author       DrTraxx
// @include      *://www.leitstellenspiel.de/
// @include      *://leitstellenspiel.de/
// @grant        none
// ==/UserScript==
/* global $ */

(function() {
    'use strict';

    $.getJSON('/api/vehicle_states').done(function(data){
        $('#menu_profile').parent().before('<li><a class="btn btn-dark" id="fms_6" data-toggle="modal" data-target="#tableStatus6" >' + data[6].toLocaleString() + '</a></li>');
    });

    var vehicleDatabase = {};

    $.getJSON('https://lss-manager.de/api/cars.php?lang=de_DE').done(function(data){
        vehicleDatabase = data;
    });

    $("body")
        .prepend(`<div class="modal fade"
                     id="tableStatus6"
                     tabindex="-1"
                     role="dialog"
                     aria-labelledby="exampleModalLabel"
                     aria-hidden="true"
                >
                    <div class="modal-dialog modal-lg" role="document">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title" id="tableStatus6Label">
                                    Fahrzeuge im Status 6
                                </h5>
                                <button type="button"
                                        class="close"
                                        data-dismiss="modal"
                                        aria-label="Close"
                                >
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div class="modal-body" id="tableStatus6Body"></div>
                            <div class="modal-footer">
                                v${GM_info.script.version}
                                <button type="button"
                                        id="tableStatus6CloseButton"
                                        class="btn btn-danger"
                                        data-dismiss="modal"
                                >
                                    Schließen
                                </button>
                            </div>
                        </div>
                    </div>
                </div>`);

    var buildingDatabase = [];
    var vehicleDatabaseFms6 = [];

    function loadApi(){

        $.getJSON('/api/vehicle_states').done(function(data){
            $('#fms_6').text(data[6].toLocaleString());
        });

        $.getJSON('/api/buildings').done(function(data){
            $.each(data, function(key, item){
                buildingDatabase.push({"id": item.id, "name": item.caption});
            });
        });

        $.getJSON('/api/vehicles').done(function(data){
            $.each(data, function(key, item){
            switch(item.fms_real){
                case 1:
                    break;
                case 2:
                    break;
                case 3:
                    break;
                case 4:
                    break;
                case 5:
                    break;
                case 6: vehicleDatabaseFms6.push({"status": item.fms_real, "id": item.id, "name": item.caption, "typeId": item.vehicle_type, "buildingId": item.building_id})
                    break;
                case 7:
                    break;
            }
            });
        });
    }

    loadApi();

    function createTable(vehicles, buildings) {
        $('#tableStatus6Body').html('');

        let intoTable =
                `<table class="table">
                 <thead>
                 <tr>
                 <th class="col">Kennung</th>
                 <th class="col">Fahrzeugtyp</th>
                 <th class="col">ID</th>
                 <th class="col">Wache</th>
                 </tr>
                 </thead>
                 <tbody>`;

        for(let i = 0; i < vehicles.length; i++){
            intoTable +=
                `<tr>
                 <td class="col"><a class="lightbox-open" href="/vehicles/${vehicles[i].id}">${vehicles[i].name}</a></td>
                 <td class="col">${vehicleDatabase[vehicles[i].typeId].name}</td>
                 <td class="col"><a class="lightbox-open" href="/vehicles/${vehicles[i].id}/zuweisung">${vehicles[i].id}</a></td>
                 <td class="col"><a class="lightbox-open" href="/buildings/${vehicles[i].buildingId}">${buildingDatabase.filter(e => e.id == vehicles[i].buildingId)[0].name}</a></td>
                 </tr>`;
        }

        intoTable += `</tbody>
                      </table>`;

        $('#tableStatus6Body').html(intoTable);
    }

    $("body").on("click", "#fms_6", function(){
        loadApi();
        createTable(vehicleDatabaseFms6, buildingDatabase);
    });

})();
