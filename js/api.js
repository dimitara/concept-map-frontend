//TODO: modify documentation about mapsList,
//handle scenario where concept with relationships is deleted by deleting all related relationships
//mapsList response Example:
//{
//    mapsList: [
//        {
//            title:"ababa",
//            id: 1
//        },
//        {
//            title:"second",
//            id: 2
//        }
//    ]
//}

(function () {
    'use strict';

    var apiAdress = 'http://demo4500991.mockable.io/', //the address of the API server
        currnetMap = {}, // object holding current loaded map
        list = [];
    //generates and returns unuqie id for concept/relationship
    //objectlist should be either currentMap.concepts or currentMap.relationships 
    function generateID(objectList) {
        var maxId = 0,
            item;
        for (var i = 0, length = objectList.length; i < length; i += 1) {

            if (maxId < objectList[i].id) {
                maxId = objectList[i].id;
            }
        }
        return maxId + 1;
    }

    function loadMap(mapID) {
        YUI().use("io-base", function (Y) {
            var uri = apiAdress + 'maps/' + mapID;

            // Define a function to handle the response data.
            function complete(id, o, args) {

                var data = o.responseText; // Response data.
                currnetMap = JSON.parse(data).map;
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
        var i = 0,
            length = currnetMap.concepts.length;
        for (; i < length; i += 1) {
            if (currnetMap.concepts[i].id == id) {
                currnetMap.concepts[i].label = label;
                currnetMap.concepts[i].posx = posx;
                currnetMap.concepts[i].posy = posy;
            }
        }

    }

    function updateRelationship(id, label, source, target) {
        var i = 0,
            length = currnetMap.relationships.length;
        for (; i < length; i += 1) {
            if (currnetMap.relationships[i].id == id) {
                currnetMap.relationships[i].label = label;
                currnetMap.relationships[i].source = source;
                currnetMap.relationships[i].target = target;
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

    function saveMap() {
        var requestResponse;
        YUI().use('io-base', function (Y) {
            var uri = apiAdress + "maps/" + currnetMap.id,
                json = {
                    "concepts": currnetMap.concepts,
                    "relationships": currnetMap.relationships
                },
                cfg = {
                    method: 'PUT',
                    data: JSON.stringify(json),
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
    }

    function deleteMap(id) {
        var requestResponse;
        YUI().use('io-base', function (Y) {
            var uri = apiAdress + "maps/" + id,
                cfg = {
                    method: 'DELETE',
                    on: {

                        success: function (id, response) {
                            requestResponse = response.responseText;
                        }
                    }
                };
            var request = Y.io(uri, cfg);
        });
    }

    function mapsList() {
        YUI().use("io-base", function (Y) {
            var uri = apiAdress + '/maps';

            // Define a function to handle the response data.
            function complete(id, o, args) {

                var data = o.responseText; // Response data.
                list = JSON.parse(data).mapsList;

            }

            function success(id, o, args) {
                return mapsList;
            }
            Y.on('io:complete', complete, Y, ['lorem', 'noList']);
            Y.on('io:success', success, Y, ['lorem', 'noList']);
            var request = Y.io(uri);
        });
    }
    window.Map = {
        save: saveMap,
        loadMapList: mapsList,
        deleteMap: deleteMap,
        loadMap: loadMap,
        currentMap: function () {
            return currnetMap;
        },
        currnetList: function () {
            return list;
        },
        addRelationship: addRelationship,
        addConcept: addConcept,
        deleteConcept: deleteConcept,
        deleteRelationship: deleteRelationship,
        updateConcept: updateConcept,
        updateRelationship: updateRelationship

    };

}());