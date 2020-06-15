    $("body").on("click", "#fms_6", function(){
        loadApi();
        setTimeout(function(){
            createTable(vehicleDatabaseFms6, buildingDatabase);
        }, 2000);
    });
