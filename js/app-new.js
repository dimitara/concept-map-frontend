var paper = Snap("#canvas");

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
var conceptArr = [];
var relationArr = [];

var groupRelationships = paper.group({id: 'rels'});
var groupNodes = paper.group({id: 'nodes'});

function concept(posX, posY, labelText, conceptId) {
    this.posX = posX;
    this.posY = posY;
    this.labelText = labelText;
    this.conceptId = conceptId;
    //DRAG FUNCTIONS

    var move = function(dx, dy) {
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

                /*
                relationArr[i].label.attr({
                    x: tx,
                    y: ty
                });
                */
            }
        }

        for (var i = 0; i < relationArr.length; i++) {
            if (relationArr[i].target == conceptId) {
                relationArr[i].line.attr({
                    x2: ox,
                    y2: oy
                });

                /*
                relationArr[i].label.attr({
                    x: relationArr[i].line.getBBox().cx,
                    y: relationArr[i].line.getBBox().cy
                });
                */
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
    }).drag(move, start).dblclick(dblclickNode);

    //LABEL OBJECT
    this.label = this.group.text(posX + 25, posY + 28, labelText).attr({
        fill: "#ecf0f1"
    }).dblclick(dblclicklabelText);
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
    }).dblclick(dblclicklabelText);

    var lineBBox = this.line.getBBox();
    this.label = groupRelationships.text(lineBBox.cx, lineBBox.cy - 4, "new relation").dblclick(dblclicklabelText);
    var labelBBox = this.label.getBBox();
    //console.log(lineBBox..width - labelBBox.width);

    function dblclicklabelText() {
        var newText = prompt("Enter labelText name", "labelText");

        if (newText) {
            var relation = relationArr.filter(function(rel){
                return rel.relationId === relationId;
            })[0];

            relation.label.attr({
                text: newText
            })
        }
    };
}

function setSelectionOne(value) {
    selConOne = value;
};

function setSelectionTwo(value) {
    selConTwo = value;
};

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

        for (var i = 0; i < relationArr.length; i++) {
            if (relationArr[i].origin == conceptId || relationArr[i].target == conceptId) {
                relationArr[i].line.remove();
                relationArr[i].label.remove();
                relationArr.splice(i, 1);
                console.log("Concept Deleted");
                i--;
            }
        }
    }
};