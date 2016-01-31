
//NOTE: Code is not ready for use!!!
//TODO: Create unit test, implement saveMap, deleteMap and listMaps,
//handle scenario where concept with relationships is deleted by deleting all related relationships

(function () {
    'use strict';

    var apiAdress = '', //the address of the API server
        currnetMap = {}; // object holding current loaded map

    //generates and returns unuqie id for concept/relationship
    //objectlist should be either currentMap.concepts or currentMap.relationships 
    function generateID(objectList) {
        var maxId = 0,
            item;
        for (item in objectList) {
            if (objectList.hasOwnProperty(item)) {
                if (maxId < item.id) {
                    maxId = item.id;
                }
            }
        }
        return maxId + 1;
    }

    function loadMap(mapID) {
        YUI().use("io-base", function (Y) {
            var uri = apiAdress + '/maps/' + mapID;

            // Define a function to handle the response data.
            function complete(id, o, args) {

                var data = o.responseText; // Response data.
                currnetMap = data;
            }

            Y.on('io:complete', complete, Y, ['lorem', 'noMap']);
            var request = Y.io(uri);
        });
    }

    function addConcept(label, posx, posy) {
        var id = generateID(currnetMap.concepts);

        currnetMap.concepts.push({
            "label": label,
            "posx": posx,
            "posy": posy,
            "id": id
        });
    }

    function addRelationship(label, source, target) {
        var id = generateID(currnetMap.relationships);

        currnetMap.relationships.push({
            "label": label,
            "source": source,
            "target": target
        });
    }

    function updateConcept(id, label, posx, posy) {
        var i;
        for (i in currnetMap.concepts) {
            if (i.id == id) {
                i.label = label;
                i.posx = posx;
                i.posy = posy;
            }
        }
        
    }

    function updateRelationshp(id, label, source, target) {
        var i;
        for (i in currnetMap.relationships) {
            if (i.id == id) {
                i.label = label;
                i.source = source;
                i.target = target;
            }
        }
        
    }

    function deleteConcept(id) {
        var i,
            length = currnetMap.concepts.length;
        for (i = 0; i < length; i += 1) {
            if (currnetMap.concepts[i].id == id) {
                currnetMap.concepts.splice(i, 1);
                break;
            }
        }
    }

    function deleteRelationship(id) {
        var i,
            length = currnetMap.relationships.length;
        for (i = 0; i < length; i += 1) {
            if (currnetMap.relationships[i].id == id) {
                currnetMap.relationships.splice(i, 1);
                break;
            }
        }
    }

    function createMap(title) {
        var requestResponse;
        YUI().use('io-base', function (Y) {
            var uri = apiAdress + "maps",
                json = {
                    "title": title
                },
                cfg = {
                    method: 'POST',
                    data: Y.JSON.stringify(json),
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    on: {

                        success: function (id, response) {
                            requestResponse = response.responseText;
                        }
                    }
                };
            var request = Y.io(uri, cfg);
        });
        
        currnetMap = JSON.parse(requestResponse).map;
    }

    function saveMap(id) {
        console.log(id);
    }

    window.Map = {
        save: saveMap
    };

}());