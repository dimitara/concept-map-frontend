var paper = Snap("#canvas");

var LINE_WIDTH = 3;
var NODE_BACKGROUND = "#2c3e50";
var NODE_STROKE_SELECTED = "#0F9923";

function concept (posX, posY, labelText, conceptId){
        this.posX = posX;
        this.posY = posY;
        this.labelText = labelText;
        this.conceptId = conceptId;
        //DRAG FUNCTIONS
        var move = function(dx,dy) {
                this.attr({
                            transform: this.data('origTransform') + (this.data('origTransform') ? "T" : "t") + [dx, dy]
                        });
                conceptArr[conceptId].label.attr({
                    x: conceptArr[conceptId].node.getBBox().x+25,
                    y: conceptArr[conceptId].node.getBBox().y+28
                });
                
                for (var i = 0; i < relationArr.length; i++) {
                    if (relationArr[i].origin == conceptId){
                        relationArr[i].line.attr({
                            x1: conceptArr[conceptId].node.getBBox().cx,
                            y1: conceptArr[conceptId].node.getBBox().cy
                        });
                        relationArr[i].label.attr({
                            x: relationArr[i].line.getBBox().cx,
                            y: relationArr[i].line.getBBox().cy     
                        });
                    }
                }
                
                for (var i = 0; i < relationArr.length; i++) {
                    if (relationArr[i].target == conceptId){
                        relationArr[i].line.attr({
                            x2: conceptArr[conceptId].node.getBBox().cx,
                            y2: conceptArr[conceptId].node.getBBox().cy
                        });
                        relationArr[i].label.attr({
                            x: relationArr[i].line.getBBox().cx,
                            y: relationArr[i].line.getBBox().cy
                        });
                    }
                }
        }

        var start = function() {
                this.data('origTransform', this.transform().local );
                
        }
        stop = function() {
                console.log('finished dragging');
                console.log(this.node.getBBox());
        }
        //DOUBLE CLICK FUNCTIONS
        function dblclickNode() {
            if (selConOne == undefined && selConTwo != conceptId){
                setSelectionOne(conceptId);
                this.attr({fill: NODE_BACKGROUND});
                this.attr({stroke: NODE_STROKE_SELECTED});
            }
            else if (selConTwo == undefined && selConOne != conceptId) {
                setSelectionTwo(conceptId);
                this.attr({fill: NODE_BACKGROUND});
                this.attr({stroke: NODE_STROKE_SELECTED});
            }
            else if (selConOne == conceptId){
                setSelectionOne(undefined);
                this.attr({stroke: NODE_STROKE_SELECTED,
                });
            }
            else if (selConTwo == conceptId){
                setSelectionTwo(undefined);
                this.attr({stroke: NODE_STROKE_SELECTED
                });
            }
        };
        
        function dblclicklabelText() {
        conceptArr[conceptId].label.attr({
                text: prompt("Enter labelText name", "labelText")
            })
        };
        
        //NODE OBJECT
        this.node = paper.rect(posX, posY, 125, 50, 10).attr({
            'fill': NODE_BACKGROUND,
            'stroke': NODE_BACKGROUND,
            'stroke-width': LINE_WIDTH
        })
        .drag(move, start, stop)
        .dblclick(dblclickNode);

        
        //LABEL OBJECT
        this.label = paper.text (posX+25, posY+28, labelText).attr({
            fill: "#ecf0f1"
        })
        .dblclick(dblclicklabelText);
        
}

function relation (origin, target, relationLabel, relationId) {
    this.origin = origin;
    this.target = target;
    this.relationId = relationId;
    this.relationLabel = relationLabel;
    var fcx = conceptArr[origin] ? conceptArr[origin].node.getBBox().cx : 100;
    var fcy = conceptArr[origin] ? conceptArr[origin].node.getBBox().cy : 100;
    var scx = conceptArr[target] ? conceptArr[target].node.getBBox().cx : 300;
    var scy = conceptArr[target] ? conceptArr[target].node.getBBox().cy : 100;


    this.line = paper.line(fcx, fcy, scx, scy).attr({
        stroke: "#34495e",
        strokeWidth: LINE_WIDTH
    }).dblclick(dblclicklabelText);

    var lineBBox = this.line.getBBox();
    this.label = paper.text(lineBBox.cx, lineBBox.cy - 4, "new relation").dblclick(dblclicklabelText);
    var labelBBox = this.label.getBBox();
    //console.log(lineBBox..width - labelBBox.width);
    
    function dblclicklabelText() {
        relationArr[relationId].label.attr({
            text: prompt("Enter labelText name", "labelText")
        })
    };
}
function setSelectionOne(value){
    selConOne = value;
    console.log('xs', selConOne, selConTwo);
};
function setSelectionTwo(value){
    selConTwo = value;
    console.log('we', selConOne, selConTwo);
};
var selConOne;
var selConTwo;
var conceptArr = [];
var relationArr = [];

function addNode (posX, posY, labelText){
    if (labelText == undefined) labelText = "New Concept";
    if (posX == undefined) posX = 100;
    if (posY == undefined) posY = 100;
    conceptArr[conceptArr.length] = new concept (posX, posY, labelText, conceptArr.length);
}
function addRelation (origin, target, labelText){
    if (origin == undefined || target == undefined)
        console.log("You need to select two elements");
    else {
        relationArr[relationArr.length] = new relation(origin, target, labelText, relationArr.length);
    }
}

function deleteConcept (conceptId){
    conceptArr[conceptId].node.remove();
    conceptArr[conceptId].label.remove();
    conceptArr.splice(conceptId, 1);
    for (var i = 0; i < relationArr.length; i++){
        if(relationArr[i].origin == conceptId || relationArr[i].target == conceptId){
            relationArr[i].line.remove();
            relationArr[i].label.remove();
            relationArr.splice(i,1);
            console.log("Concept Deleted");
            i--;
        }
    }       
};