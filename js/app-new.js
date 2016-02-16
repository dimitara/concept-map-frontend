var paper = Snap("#canvas");

var id = '';
var LINE_WIDTH = 3;
var NODE_BACKGROUND = "#fff";
var NODE_STROKE_SELECTED = "#60B2A4";
var STROKE_COLOR = "#15305D";
var HOVER_COLOR = "#CCD5D9";

var nodeDefaultX1 = 100;
var nodeDefaultY1 = 100;
var nodeDefaultX2 = 100;
var nodeDefaultY2 = 50;

var globalConceptId = 0;
var globalRelationId = 0;

var selConOne;
var selConTwo;
var selRelation
var conceptArr = [];
var relationArr = [];

var groupRelationships = paper.group({id: 'rels'});
var groupNodes = paper.group({id: 'nodes'});

var canvasWidth = document.getElementById("canvas").width.animVal.value;
var canvasHeight = document.getElementById("canvas").height.animVal.value;

function setSelectionOne(value) {
    selConOne = value;
};

function setSelectionTwo(value) {
    selConTwo = value;
};

function setRelSelection(value) {
	selRelation = value;
}
function addNode(posX, posY, labelText) {
    if (labelText == undefined) labelText = "New Concept";
    if (posX == undefined) posX = 100;
    if (posY == undefined) posY = 100;
    conceptArr[conceptArr.length] = new concept(posX, posY, labelText, ++globalConceptId);
}

function deleteSelected(){
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

function addRelation(origin, target, labelText) {
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
function deleteConcept(conceptId) {
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



function save(){
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

deserialize({"id":"1","concepts":[{"id":1,"label":"Activities","posx":337,"posy":247},{"id":2,"label":"Implementation","posx":446,"posy":24},{"id":3,"label":"Quality Assurance","posx":167,"posy":33},{"id":4,"label":"Project management","posx":525,"posy":397},{"id":5,"label":"Business analysis","posx":32,"posy":250},{"id":6,"label":"Requirements specification","posx":10,"posy":370},{"id":7,"label":"Deployment","posx":3,"posy":99}],"relationships":[{"id":1,"label":"construction","origin":1,"target":2},{"id":2,"label":"all","origin":4,"target":1},{"id":3,"label":"construction","origin":3,"target":1},{"id":4,"label":"elaboration","origin":5,"target":1},{"id":5,"label":"elaboration","origin":6,"target":1},{"id":6,"label":"construction","origin":7,"target":1}]});