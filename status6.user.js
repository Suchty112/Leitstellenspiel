// ==UserScript==
// @name         Status 6
// @version      2.2.1
// @author       DrTraxx
// @include      *://www.leitstellenspiel.de/
// @include      *://leitstellenspiel.de/
// @grant        none
// ==/UserScript==
/* global $ */

(function() {
    'use strict';

    $.getJSON('/api/vehicle_states').done(function(data){
        $('#menu_profile').parent().before('<li><a class="btn btn-dark" id="fms_6" data-toggle="modal" data-target="#tableStatus6" >Status 6: ' + data[6].toLocaleString() + '</a></li>');
    });

    var vehicleDatabase = {};
    var buildingDatabase = [];
    var vehicleDatabaseFms6 = [];

    $.getJSON('https://lss-manager.de/api/cars.php?lang=de_DE').done(function(data){
        var mapObj = {"ï¿½": "Ö", "Ã¶": "ö", "Ã¼": "ü"};
        $.each(data, (k,v) => {
            v.name = v.name.replace(new RegExp(Object.keys(mapObj).join("|"),"gi"), matched => mapObj[matched])
        });
        vehicleDatabase = data;
    });

    $("head").append(`<style>
.modal {
display: none;
position: fixed; /* Stay in place front is invalid - may break your css so removed */
padding-top: 100px;
left: 0;
right:0;
top: 0;
bottom: 0;
overflow: auto;
background-color: rgb(0,0,0);
background-color: rgba(0,0,0,0.4);
z-index: 9999;
}
.modal-body{
height: 650px;
overflow-y: auto;
}
</style>`);

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
                             <div class="btn-group btn-group-sm">
                              <button type="button" id="sortNameUp" class="btn btn-success">Name aufsteigend</button>
                              <button type="button" id="sortNameDn" class="btn btn-success">Name absteigend</button>
                             </div>
                             <div class="btn-group btn-group-sm">
                              <button type="button" id="sortNameBdUp" class="btn btn-info">Wache aufsteigend</button>
                              <button type="button" id="sortNameBdDn" class="btn btn-info">Wache absteigend</button>
                             </div>
                             <div class="btn-group btn-group-sm">
                              <button type="button" id="sortNameTypeUp" class="btn btn-primary">Typ aufsteigend</button>
                              <button type="button" id="sortNameTypeDn" class="btn btn-primary">Typ absteigend</button>
                             </div>
                                <button type="button"
                                        class="close"
                                        data-dismiss="modal"
                                        aria-label="Close"
                                >
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            <br>
                                <h5 class="modal-title" id="tableStatus6Label">
                                </h5>
                            </div>
                            <div class="modal-body" id="tableStatus6Body"></div>
                            <div class="modal-footer">
                                v ${GM_info.script.version}
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

    function loadApi(){

        $.getJSON('/api/vehicle_states').done(function(data){
            $('#fms_6').text('Status 6: ' + data[6].toLocaleString());
        });

        $.getJSON('/api/buildings').done(function(data){
            $.each(data, function(key, item){
                buildingDatabase.push({"id": item.id, "name": item.caption});
            });
        });

        $.getJSON('/api/vehicles').done(function(data){
            $.each(data, function(key, item){
                var pushContent = {"status": item.fms_real, "id": item.id, "name": item.caption, "typeId": item.vehicle_type, "buildingId": item.building_id, "ownClass": item.vehicle_type_caption};
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
                    case 6: vehicleDatabaseFms6.push(pushContent)
                        break;
                    case 7:
                        break;
                    case 9:
                        break;
                }
            });
        });
    }

    function createTable(vehicles) {
        vehicles = vehicleDatabaseFms6;
        let intoLabel =
                `<div class="pull-left">Fahrzeuge im Status 6</div>
                 <div Class="pull-right">${vehicles.length.toLocaleString()} Fahrzeuge</div>`;
        let intoTable =
                `<table class="table">
                 <thead>
                 <tr>
                 <th class="col-1">FMS</th>
                 <th class="col">Kennung</th>
                 <th class="col">Fahrzeugtyp</th>
                 <th class="col">Personalzuweisung</th>
                 <th class="col">Wache</th>
                 </tr>
                 </thead>
                 <tbody>`;

        for(let i = 0; i < vehicles.length; i++){
            intoTable +=
                `<tr>
                 <td class="col-1"><span class="building_list_fms building_list_fms_6" id="tableFms_${vehicles[i].id}">${vehicles[i].status}</span>
                 <td class="col"><a class="lightbox-open" href="/vehicles/${vehicles[i].id}">${vehicles[i].name}</a></td>
                 <td class="col">${!vehicles[i].ownClass ? vehicleDatabase[vehicles[i].typeId].name : vehicles[i].ownClass}</td>
                 <td class="col"><a class="lightbox-open" href="/vehicles/${vehicles[i].id}/zuweisung"><button type="button" class="btn btn-default btn-xs">Personalzuweisung</button></a></td>
                 <td class="col"><a class="lightbox-open" href="/buildings/${vehicles[i].buildingId}">${buildingDatabase.filter(e => e.id == vehicles[i].buildingId)[0].name}</a></td>
                 </tr>`;
        }

        intoTable += `</tbody>
                      </table>`;

        $('#tableStatus6Label').html(intoLabel);
        $('#tableStatus6Body').html(intoTable);
    }

    $("body").on("click", "#fms_6", function(){
        $('#tableStatus6Label').html('<center><h5>Status-6-Manager</h5></center>');
        $('#tableStatus6Body').html('<center><h5>Bitte Sortierung wählen.</h5></center>');
        buildingDatabase.length = 0;
        vehicleDatabaseFms6.length = 0;
        loadApi();
    });

    $("body").on("click", "#tableStatus6Body span", function(){
        if($(this)[0].className == "building_list_fms building_list_fms_6"){
            $.get('/vehicles/' + $(this)[0].id.replace('tableFms_','') + '/set_fms/2');
            $(this).toggleClass('building_list_fms building_list_fms_6 building_list_fms building_list_fms_2');
            $(this).text('2');
        } else {
            $.get('/vehicles/' + $(this)[0].id.replace('tableFms_','') + '/set_fms/6');
            $(this).toggleClass('building_list_fms building_list_fms_6 building_list_fms building_list_fms_2');
            $(this).text('6');
        }
    });

    $("body").on("click", "#sortNameUp", function(){
        vehicleDatabaseFms6.sort((a, b) => a.name > b.name);
        createTable();
    });

    $("body").on("click", "#sortNameDn", function(){
        vehicleDatabaseFms6.sort((a, b) => a.name < b.name);
        createTable();
    });

    $("body").on("click", "#sortNameBdUp", function(){
        vehicleDatabaseFms6.sort((a, b) => a.buildingId > b.buildingId);
        createTable();
    });

    $("body").on("click", "#sortNameBdDn", function(){
        vehicleDatabaseFms6.sort((a, b) => a.buildingId < b.buildingId);
        createTable();
    });

    $("body").on("click", "#sortNameTypeUp", function(){
        vehicleDatabaseFms6.sort((a, b) => a.typeId > b.typeId);
        createTable();
    });

    $("body").on("click", "#sortNameTypeDn", function(){
        vehicleDatabaseFms6.sort((a, b) => a.typeId < b.typeId);
        createTable();
    });

})();
