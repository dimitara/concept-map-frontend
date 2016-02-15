var paper = Snap("#canvas");

var id = '';
var LINE_WIDTH = 3;
var NODE_BACKGROUND = "#2c3e50";
var NODE_STROKE_SELECTED = "#0F9923";
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

function concept(posX, posY, labelText, conceptId) {
    this.posX = posX;
    this.posY = posY;
    this.labelText = labelText;
    this.conceptId = conceptId;
    //DRAG FUNCTIONS

    var move = function(dx, dy) {
		var nodeBBox = this.parent().getBBox();
		
		if(nodeBBox.x + dx > 0 && nodeBBox.x + dx < canvasWidth && nodeBBox.y + dy > 0 && nodeBBox.y + dy < canvasHeight){
			this.parent().attr({
				transform: this.parent().data('origTransform') + (this.parent().data('origTransform') ? "T" : "t") + [dx, dy]
			});

			var originBBox = this.getBBox();
			var ox = this.parent().getBBox().x + originBBox.width / 2;
			var oy = this.parent().getBBox().y + originBBox.height / 2;

			for (var i = 0; i < relationArr.length; i++) {
				if (relationArr[i].origin === conceptId) {
					relationArr[i].line.attr({
						x1: ox,
						y1: oy
					});

					
					lineBBox = relationArr[i].line.getBBox();
					labelBBox = relationArr[i].label.getBBox();
					relationArr[i].label.attr({
						x: lineBBox.cx - labelBBox.w/2,
						y: lineBBox.cy - 4
					});
					
				}
			}

			for (var i = 0; i < relationArr.length; i++) {
				if (relationArr[i].target == conceptId) {
					relationArr[i].line.attr({
						x2: ox,
						y2: oy
					});
					
					lineBBox = relationArr[i].line.getBBox();
					labelBBox = relationArr[i].label.getBBox();
					relationArr[i].label.attr({
						x: lineBBox.cx - labelBBox.w/2,
						y: lineBBox.cy - 4
					});
					
				}
			}
		}
    }

    var start = function() {
        this.parent().data('origTransform', this.parent().transform().local);
    }

    //DOUBLE CLICK FUNCTIONS
    function dblclickNode() {
        if (selConOne == undefined && selConTwo != conceptId) {
            setSelectionOne(conceptId);
            this.attr({
                fill: NODE_BACKGROUND,
                stroke: NODE_STROKE_SELECTED
            });
        } else if (selConTwo == undefined && selConOne != conceptId) {
            setSelectionTwo(conceptId);
            this.attr({
                fill: NODE_BACKGROUND
            });
            this.attr({
                stroke: NODE_STROKE_SELECTED
            });
        } else if (selConOne == conceptId) {
            setSelectionOne(undefined);
            this.attr({
                stroke: NODE_BACKGROUND,
            });
        } else if (selConTwo == conceptId) {
            setSelectionTwo(undefined);
            this.attr({
                stroke: NODE_BACKGROUND
            });
        }
    };

    function dblclicklabelText() {
        var node = conceptArr.filter(function(concept){
            return concept.conceptId === conceptId;
        })[0];

        var newText = prompt("Enter Node name", node.label.attr('text'));

        if (newText) {
            node.label.attr({
                text: newText
            });

            var labelBBox = node.label.getBBox();

            node.node.attr({
                'width': labelBBox.width + 50
            });
        }
    };
	
	function nodeHoverIn(){
        var node = conceptArr.filter(function(concept){
            return concept.conceptId === conceptId;
        })[0];		
		node.node.attr({
			"fill-opacity": 0.7,
			"stroke-opacity": 0.7
		});
	};
	
	function nodeHoverOut(){
        var node = conceptArr.filter(function(concept){
            return concept.conceptId === conceptId;
        })[0];
		node.node.attr({
			"fill-opacity": 1,
			"stroke-opacity": 1
		});
	};

    this.group = groupNodes.group();
    this.group.attr({
        x: 0,
        y: 0
    });

    //NODE OBJECT
    this.node = this.group.rect(posX, posY, 135, 50, 10).attr({
        'fill': NODE_BACKGROUND,
        'stroke': NODE_BACKGROUND,
        'stroke-width': LINE_WIDTH
    }).drag(move, start).dblclick(dblclickNode).hover(nodeHoverIn,nodeHoverOut);

    //LABEL OBJECT
    this.label = this.group.text(posX + 25, posY + 28, labelText).attr({
        fill: "#ecf0f1"
    }).dblclick(dblclicklabelText);

    var labelBBox = this.label.getBBox();

    this.node.attr({
        'width': labelBBox.width + 50
    });
}

function relation(origin, target, relationLabel, relationId) {
    this.origin = origin;
    this.target = target;
    this.relationId = relationId;
    this.relationLabel = relationLabel;
    
    var originConcept = conceptArr.filter(function(concept){
        return concept.conceptId === origin;
    })[0];

    var targetConcept = conceptArr.filter(function(concept){
        return concept.conceptId === target;
    })[0];

    var originBBox = originConcept.node.node.getBBox();
    var ox = originConcept.group.getBBox().x + originBBox.width / 2;
    var oy = originConcept.group.getBBox().y + originBBox.height / 2;

    var targetBBox = targetConcept.node.node.getBBox();
    var tx = targetConcept.group.getBBox().x + targetBBox.width / 2;
    var ty = targetConcept.group.getBBox().y + targetBBox.height / 2;

    this.line = groupRelationships.line(ox, oy, tx, ty).attr({
        stroke: "#34495e",
        strokeWidth: LINE_WIDTH
    }).dblclick(dblclickRelation).hover(relHoverIn,relHoverOut);

    var lineBBox = this.line.getBBox();
    this.label = groupRelationships.text(lineBBox.cx + 4, lineBBox.cy - 4, relationLabel ? relationLabel : "new relation").dblclick(dblclicklabelText);
    var labelBBox = this.label.getBBox();
	this.label.attr({x: lineBBox.cx - labelBBox.w/2});
    function dblclicklabelText() {
        var relation = relationArr.filter(function(rel){
                return rel.relationId === relationId;
            })[0];
		var newText = prompt("Enter labelText name", relation.label.attr('text'));
        if (newText) {
           

            relation.label.attr({
                text: newText
            })
        }
    };
	
	function dblclickRelation (){
		var relation = relationArr.filter(function(rel){
			return rel.relationId === relationId;
        })[0];
		if (selRelation === undefined){
			setRelSelection(relationId);
			relation.line.attr({
				stroke: NODE_STROKE_SELECTED
			})
		}
		else if (selRelation === relationId){
			setRelSelection(undefined);
			relation.line.attr({
				stroke: NODE_BACKGROUND
			});				
		}

	};
	
	function relHoverIn (){
		var relation = relationArr.filter(function(rel){
			return rel.relationId === relationId;
        })[0];
		relation.line.attr({
			strokeWidth: 6,
			"stroke-opacity": 0.7
		});
	};
	function relHoverOut (){
		var relation = relationArr.filter(function(rel){
			return rel.relationId === relationId;
        })[0];
		this.attr({
			strokeWidth: LINE_WIDTH,
			"stroke-opacity": 1
		});
	};
}

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

function addRelation(origin, target, labelText) {
    if (origin == undefined || target == undefined)
        console.log("You need to select two elements");
    else {
        relationArr[relationArr.length] = new relation(origin, target, labelText, ++globalRelationId);
		for (var i = 0; i < conceptArr.length; i++){
			if (conceptArr[i].conceptId === origin){
				conceptArr[i].node.attr({
					stroke: NODE_BACKGROUND
				});
				selConOne = undefined;
			}
			else if(conceptArr[i].conceptId === target){}{
				conceptArr[i].node.attr({
					stroke: NODE_BACKGROUND
					
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
    });

    json.relationships.forEach(function(r){
        relationArr.push(new relation(r.origin, r.target, r.label, r.id));
    });
}

deserialize({"id":"1","concepts":[{"id":1,"label":"Activities","posx":337,"posy":247},{"id":2,"label":"Implementation","posx":446,"posy":24},{"id":3,"label":"Quality Assurance","posx":167,"posy":33},{"id":4,"label":"Project management","posx":525,"posy":397},{"id":5,"label":"Business analysis","posx":32,"posy":250},{"id":6,"label":"Requirements specification","posx":10,"posy":370},{"id":7,"label":"Deployment","posx":3,"posy":99}],"relationships":[{"id":1,"label":"construction","origin":1,"target":2},{"id":2,"label":"all","origin":4,"target":1},{"id":3,"label":"construction","origin":3,"target":1},{"id":4,"label":"elaboration","origin":5,"target":1},{"id":5,"label":"elaboration","origin":6,"target":1},{"id":6,"label":"construction","origin":7,"target":1}]});