// ==UserScript==
// @name         Status 6
// @version      2.3.0
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

    var filterFwVehicles = true; //buildingTypeIds: 0, 18
    var filterRdVehicles = true; //buildingTypeIds: 2, 20
    var filterThwVehicles = true; //buildingTypeIds: 9
    var filterPolVehicles = true; //buildingTypeIds: 6, 19
    var filterWrVehicles = true; //buildingTypeIds: 15
    var filterHeliVehicles = true; //buildingTypeIds: 5, 13
    var filterBpVehicles = true; //buildingTypeIds: 11, 17
    var filterSegVehicles = true; //buildingTypeIds: 12, 21
    var filterAction = false;
    var vehicleDatabase = {};
    var getBuildingTypeId = {};
    var getBuildingName = {};
    var vehicleDatabaseFms = {};

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
                               <button type="button"
                                        class="close"
                                        data-dismiss="modal"
                                        aria-label="Close"
                                >
                                    <span aria-hidden="true">&times;</span>
                                </button>
                             <div class="pull-left">
                              <select class="custom-select" id="tableSort">
                               <option selected>Sortierung wählen</option>
                              </select>
                             </div><br><br>
                             <div class="pull-left">
                              <a id="filterFw" class="label label-success">Feuerwehr</a>
                              <a id="filterRd" class="label label-success">Rettungsdienst</a>
                              <a id="filterThw" class="label label-success">THW</a>
                              <a id="filterPol" class="label label-success">Polizei</a>
                              <a id="filterWr" class="label label-success">Wasserrettung</a>
                              <a id="filterHeli" class="label label-success">Hubschrauber</a>
                              <a id="filterBp" class="label label-success">BePo/Pol-Sonder</a>
                              <a id="filterSeg" class="label label-success">SEG/RHS</a>
                             </div>
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

    var sortOptions = ['Name-aufsteigend','Name-absteigend','Wache-aufsteigend','Wache-absteigend','Typ-aufsteigend','Typ-absteigend'];
    for(var i = 0; i < sortOptions.length; i++){
        $('#tableSort').append(`<option value="${sortOptions[i]}">${sortOptions[i]}</option>`);
    }

    function loadApi(){

        $.getJSON('/api/vehicle_states').done(function(data){
            $('#fms_6').text('Status 6: ' + data[6].toLocaleString());
        });

        $.getJSON('/api/buildings').done(function(data){
            $.each(data, function(key, item){
                getBuildingTypeId[item.id] = item.building_type;
                getBuildingName[item.id] = item.caption;
            });
        });

        $.getJSON('/api/vehicles').done(function(data){
            vehicleDatabaseFms = data;
        });
    }

    function createTable() {

        var vehicles = [];

        $.each(vehicleDatabaseFms, function(key, item){
            var databaseContent = {"status": item.fms_real, "id": item.id, "name": item.caption, "typeId": item.vehicle_type, "buildingId": item.building_id, "ownClass": item.vehicle_type_caption};
            if(item.fms_real == 6) vehicles.push(databaseContent);
        });

        switch($('#tableSort').val()){
                case "":
                    break;
                case "Status":
                    vehicles.sort((a, b) => a.status > b.status);
                    break;
                case "Name-aufsteigend":
                    vehicles.sort((a, b) => a.name.toUpperCase() > b.name.toUpperCase());
                    break;
                case "Name-absteigend":
                    vehicles.sort((a, b) => a.name.toUpperCase() < b.name.toUpperCase());
                    break;
                case "Wache-aufsteigend":
                    vehicles.sort((a, b) => getBuildingName[a.buildingId].toUpperCase() > getBuildingName[b.buildingId].toUpperCase());
                    break;
                case "Wache-absteigend":
                    vehicles.sort((a, b) => getBuildingName[a.buildingId].toUpperCase() < getBuildingName[b.buildingId].toUpperCase());
                    break;
                case "Typ-aufsteigend":
                    vehicles.sort((a, b) => vehicleDatabase[a.typeId].name.toUpperCase() > vehicleDatabase[b.typeId].name.toUpperCase());
                    break;
                case "Typ-absteigend":
                    vehicles.sort((a, b) => vehicleDatabase[a.typeId].name.toUpperCase() < vehicleDatabase[b.typeId].name.toUpperCase());
                    break;
        }

        if(!filterFwVehicles){
            for(var fw = vehicles.length - 1; fw >= 0; fw--){
                if(getBuildingTypeId[vehicles[fw].buildingId] == "0" || getBuildingTypeId[vehicles[fw].buildingId] == "18") vehicles.splice(fw,1);
            }
        }
        if(!filterRdVehicles){
            for(var rd = vehicles.length - 1; rd >= 0; rd--){
                if(getBuildingTypeId[vehicles[rd].buildingId] == "2" || getBuildingTypeId[vehicles[rd].buildingId] == "20") vehicles.splice(rd,1);
            }
        }
        if(!filterThwVehicles){
            for(var thw = vehicles.length - 1; thw >= 0; thw--){
                if(getBuildingTypeId[vehicles[thw].buildingId] == "9") vehicles.splice(thw,1);
            }
        }
        if(!filterPolVehicles){
            for(var pol = vehicles.length - 1; pol >= 0; pol--){
                if(getBuildingTypeId[vehicles[pol].buildingId] == "6" || getBuildingTypeId[vehicles[pol].buildingId] == "19") vehicles.splice(pol,1);
            }
        }
        if(!filterWrVehicles){
            for(var wr = vehicles.length - 1; wr >= 0; wr--){
                if(getBuildingTypeId[vehicles[wr].buildingId] == "15") vehicles.splice(wr,1);
            }
        }
        if(!filterHeliVehicles){
            for(var heli = vehicles.length - 1; heli >= 0; heli--){
                if(getBuildingTypeId[vehicles[heli].buildingId] == "5" || getBuildingTypeId[vehicles[heli].buildingId] == "13") vehicles.splice(heli,1);
            }
        }
        if(!filterBpVehicles){
            for(var bp = vehicles.length - 1; bp >= 0; bp--){
                if(getBuildingTypeId[vehicles[bp].buildingId] == "11" || getBuildingTypeId[vehicles[bp].buildingId] == "17") vehicles.splice(bp,1);
            }
        }
        if(!filterSegVehicles){
            for(var seg = vehicles.length - 1; seg >= 0; seg--){
                if(getBuildingTypeId[vehicles[seg].buildingId] == "12" || getBuildingTypeId[vehicles[seg].buildingId] == "21") vehicles.splice(seg,1);
            }
        }

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
                 <td class="col"><a class="lightbox-open" href="/buildings/${vehicles[i].buildingId}">${getBuildingName[vehicles[i].buildingId]}</a></td>
                 </tr>`;
        }

        intoTable += `</tbody>
                      </table>`;

        $('#tableStatus6Label').html(intoLabel);
        $('#tableStatus6Body').html(intoTable);
        vehicles.length = 0;
    }

    $("body").on("click", "#fms_6", function(){
        $('#tableStatus6Label').html('<center><h5>Status-6-Manager</h5></center>');
        $('#tableStatus6Body').html('');
        filterAction = false;
        getBuildingTypeId.length = 0;
        getBuildingName.length = 0;
        vehicleDatabaseFms.length = 0;
        loadApi();
    });

    $("body").on("click", "#tableStatus6Body span", function(){
        if($(this)[0].className == "building_list_fms building_list_fms_6"){
            $.get('/vehicles/' + $(this)[0].id.replace('tableFms_','') + '/set_fms/2');
            $(this).toggleClass('building_list_fms_6 building_list_fms_2');
            $(this).text('2');
        } else {
            $.get('/vehicles/' + $(this)[0].id.replace('tableFms_','') + '/set_fms/6');
            $(this).toggleClass('building_list_fms_6 building_list_fms_2');
            $(this).text('6');
        }
    });

    $("body").on("click", "#tableSort", function(){
        filterAction = true;
        createTable();
    });

    $("body").on("click", "#filterFw", function(){
        if(filterFwVehicles) {
            if(filterAction){
                filterFwVehicles = false;
                createTable();
            }
            else filterFwVehicles = false;
        }
        else {
            if(filterAction) {
                filterFwVehicles = true;
                createTable();
            }
            else filterFwVehicles = true;
        }

        $('#filterFw').toggleClass("label-success label-danger");
    });

    $("body").on("click", "#filterRd", function(){
        if(filterRdVehicles) {
            if(filterAction){
                filterRdVehicles = false;
                createTable();
            }
            else filterRdVehicles = false;
        }
        else {
            if(filterAction) {
                filterRdVehicles = true;
                createTable();
            }
            else filterRdVehicles = true;
        }

        $('#filterRd').toggleClass("label-success label-danger");
    });

    $("body").on("click", "#filterThw", function(){
        if(filterThwVehicles) {
            if(filterAction){
                filterThwVehicles = false;
                createTable();
            }
            else filterThwVehicles = false;
        }
        else {
            if(filterAction) {
                filterThwVehicles = true;
                createTable();
            }
            else filterThwVehicles = true;
        }

        $('#filterThw').toggleClass("label-success label-danger");
    });

    $("body").on("click", "#filterPol", function(){
        if(filterPolVehicles) {
            if(filterAction){
                filterPolVehicles = false;
                createTable();
            }
            else filterPolVehicles = false;
        }
        else {
            if(filterAction) {
                filterPolVehicles = true;
                createTable();
            }
            else filterPolVehicles = true;
        }

        $('#filterPol').toggleClass("label-success label-danger");
    });

    $("body").on("click", "#filterWr", function(){
        if(filterWrVehicles) {
            if(filterAction){
                filterWrVehicles = false;
                createTable();
            }
            else filterWrVehicles = false;
        }
        else {
            if(filterAction) {
                filterWrVehicles = true;
                createTable();
            }
            else filterWrVehicles = true;
        }

        $('#filterWr').toggleClass("label-success label-danger");
    });

    $("body").on("click", "#filterHeli", function(){
        if(filterHeliVehicles) {
            if(filterAction){
                filterHeliVehicles = false;
                createTable();
            }
            else filterHeliVehicles = false;
        }
        else {
            if(filterAction) {
                filterHeliVehicles = true;
                createTable();
            }
            else filterHeliVehicles = true;
        }

        $('#filterHeli').toggleClass("label-success label-danger");
    });

    $("body").on("click", "#filterBp", function(){
        if(filterBpVehicles) {
            if(filterAction){
                filterBpVehicles = false;
                createTable();
            }
            else filterBpVehicles = false;
        }
        else {
            if(filterAction) {
                filterBpVehicles = true;
                createTable();
            }
            else filterBpVehicles = true;
        }

        $('#filterBp').toggleClass("label-success label-danger");
    });

    $("body").on("click", "#filterSeg", function(){
        if(filterSegVehicles) {
            if(filterAction){
                filterSegVehicles = false;
                createTable();
            }
            else filterSegVehicles = false;
        }
        else {
            if(filterAction) {
                filterSegVehicles = true;
                createTable();
            }
            else filterSegVehicles = true;
        }

        $('#filterSeg').toggleClass("label-success label-danger");
    });

})();
