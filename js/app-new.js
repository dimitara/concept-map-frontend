(function(){
    window.onload = function(){
        setTimeout(function(){
            load();
        }, 300);
    };

    function load(){
        window.paper = Snap("#canvas");

        window.id = '';
        window.LINE_WIDTH = 3;
        window.NODE_BACKGROUND = "#fff";
        window.NODE_STROKE_SELECTED = "#60B2A4";
        window.STROKE_COLOR = "#15305D";
        window.HOVER_COLOR = "#CCD5D9";

        window.nodeDefaultX1 = 100;
        window.nodeDefaultY1 = 100;
        window.nodeDefaultX2 = 100;
        window.nodeDefaultY2 = 50;

        window.globalConceptId = 0;
        window.globalRelationId = 0;

        window.selConOne;
        window.selConTwo;
        window.selRelation
        window.conceptArr = [];
        window.relationArr = [];

        window.groupRelationships = paper.group({id: 'rels'});
        window.groupNodes = paper.group({id: 'nodes'});

        window.canvasWidth = document.getElementById("canvas").width.animVal.value;
        window.canvasHeight = document.getElementById("canvas").height.animVal.value;
        window.canvasY = document.getElementById("canvas").y.animVal.value;

        window.setSelectionOne = function(value) {
            selConOne = value;
        };

        window.setSelectionTwo = function(value) {
            selConTwo = value;
        };

        window.setRelSelection = function(value) {
            selRelation = value;
        }
        window.addNode = function(posX, posY, labelText) {
            if (labelText == undefined) labelText = "New Concept";
            if (posX == undefined) posX = 100;
            if (posY == undefined) posY = 100;
            conceptArr[conceptArr.length] = new concept(posX, posY, labelText, ++globalConceptId);
        }

        window.deleteSelected = function(){
            if(selConOne){
                deleteConcept(selConOne);
            }

            if(selConTwo){
                deleteConcept(selConTwo);
            }

            if(selRelation){
                deleteRelation(selRelation);
            }
        }

        window.addRelation = function(origin, target, labelText) {
            if (origin == undefined || target == undefined)
                console.log("You need to select two elements");
            else {
                relationArr[relationArr.length] = new relation(origin, target, labelText, ++globalRelationId);
                for (var i = 0; i < conceptArr.length; i++){
                    if (conceptArr[i].conceptId === origin){
                        conceptArr[i].node.attr({
                            stroke: STROKE_COLOR
                        });
                        selConOne = undefined;
                    }
                    else if(conceptArr[i].conceptId === target){}{
                        conceptArr[i].node.attr({
                            stroke: STROKE_COLOR
                            
                        });
                        selConTwo = undefined;
                    }
                }
            }
        }
        window.deleteConcept = function(conceptId) {
            var index = -1;
            for (var i = 0; i < conceptArr.length; i++) {
                if (conceptArr[i].conceptId === conceptId) {
                    index = i;
                    break;
                }
            }

            if (index > -1) {
                conceptArr[index].group.remove();
                conceptArr.splice(index, 1);
                selConOne = undefined;

                for (var i = 0; i < relationArr.length; i++) {
                    if (relationArr[i].origin == conceptId || relationArr[i].target == conceptId) {
                        relationArr[i].line.remove();
                        relationArr[i].label.remove();
                        relationArr.splice(i, 1);
                        
                        i--;
                    }
                }
            }
        };

        function deleteRelation(relationId) {
            var index = -1;
            for (var i = 0; i < relationArr.length; i++) {
                if (relationArr[i].relationId === relationId) {
                    index = i;
                    break;
                }
            }

            if (index > -1) {
                relationArr[index].label.remove();
                relationArr[index].line.remove();
                relationArr.splice(index, 1);
                selRelation = undefined;
            }
        };



        window.save = function(){
            var concepts = [];
            var relationships = [];

            conceptArr.forEach(function(c){
                var bbox = c.group.getBBox();
                concepts.push({
                    id: c.conceptId,
                    label: c.label.node.innerHTML,
                    posx: bbox.x,
                    posy: bbox.y
                });
            });

            relationArr.forEach(function(r){
                relationships.push({
                    id: r.relationId,
                    label: r.label.node.innerHTML,
                    origin: r.origin,
                    target: r.target
                });
            });

            var currentMap = {
                id: id,
                concepts: concepts,
                relationships: relationships
            };

            console.log(JSON.stringify(currentMap));

            Map.saveMap(currentMap);
        }


        function deserialize(json){
            id = json.id;

            json.concepts.forEach(function(c){
                conceptArr.push(new concept(c.posx, c.posy, c.label, c.id));
                globalConceptId++;
            });

            json.relationships.forEach(function(r){
                relationArr.push(new relation(r.origin, r.target, r.label, r.id));
                globalRelationId++;
            });
        }

        deserialize({"id":"1","concepts":[{"id":1,"label":"Activities","posx":637,"posy":296},{"id":2,"label":"Implementation","posx":842,"posy":127},{"id":3,"label":"Quality Assurance","posx":349,"posy":82},{"id":4,"label":"Project management","posx":862,"posy":594},{"id":5,"label":"Business analysis","posx":145,"posy":502},{"id":6,"label":"Requirements specification","posx":439,"posy":642},{"id":7,"label":"Deployment","posx":140,"posy":349}],"relationships":[{"id":1,"label":"construction","origin":1,"target":2},{"id":2,"label":"all","origin":4,"target":1},{"id":3,"label":"construction","origin":3,"target":1},{"id":4,"label":"elaboration","origin":5,"target":1},{"id":5,"label":"elaboration","origin":6,"target":1},{"id":6,"label":"construction","origin":7,"target":1}]});
    }
}());