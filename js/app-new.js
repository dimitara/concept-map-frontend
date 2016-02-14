var paper = Snap("#canvas");

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
                this.attr({fill: "#2c3e50"});
                console.log(selConOne);
                console.log(selConTwo);
            }
            else if (selConTwo == undefined && selConOne != conceptId) {
                setSelectionTwo(conceptId);
                this.attr({fill: "#2c3e50"});
                console.log(selConOne);
                console.log(selConTwo);
            }
            else if (selConOne == conceptId){
                setSelectionOne(undefined);
                this.attr({fill: "#34495e",
                });
            }
            else if (selConTwo == conceptId){
                setSelectionTwo(undefined);
                this.attr({fill: "#34495e"
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
            fill: "#34495e"
            //"fill-opacity": 0.9
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
    this.line = paper.line(conceptArr[origin].node.getBBox().cx, conceptArr[origin].node.getBBox().cy, conceptArr[target].node.getBBox().cx, conceptArr[target].node.getBBox().cy).attr({
        stroke: "#34495e",
        strokeWidth: "5"
    });
    this.label = paper.text(this.line.getBBox().cx, this.line.getBBox().cy, "Hello").dblclick(dblclicklabelText);
    
    function dblclicklabelText() {
        relationArr[relationId].label.attr({
            text: prompt("Enter labelText name", "labelText")
        })
    };
}
function setSelectionOne(value){
    selConOne = value;
};
function setSelectionTwo(value){
    selConTwo = value;
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
        console.log("success");
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