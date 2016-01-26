(function(){
    "use strict";

    //todo: put api config address

    var currnetMap = {};

    function loadMap(map) {
        currnetMap = map;
    }

    function addConcept(label, posx, posy) {
        currnetMap.concepts.push({
           "label":label,
           "posx":posx,
           "posy":posy
        });
    }

    function addRelationship(label, source, target) {
        currnetMap.relationships.push({
            "label":label,
            "source":source,
            "target":target
            });
    }

    function updateConcept(id, label, posx, posy) {
        //code
    }

    function updateRelationshp(id, label, posx, posy) {
        //code
    }    

    function deleteConcept(id) {
        //code
    }

    function deleteRelationship(id) {
        //code
    }

    function createMap(title) {
        var requestResponse;
        YUI().use('io-base',function(Y){
            var uri = "maps",
             json = {"title":title},
             cfg = {
                method: 'POST',
                data: Y.JSON.stringify(jData),
                 headers: {
                    'Content-Type': 'application/json',
                 },
                 on:{
                    
                    success: function (id, response) {
                     requestResponse =  response.responseText; 
                    }
                 }
                };
            });
        //do something with response
    }

    function saveMap(id) {
       console.log(id);
    }

    window.Map = {
        save: saveMap
    };

}());