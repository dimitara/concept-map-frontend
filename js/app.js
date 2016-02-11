var paper = Snap("#canvas");

function concept (posX, posY, labelText, conceptId){
		this.posX = posX;
		this.posY = posY;
		this.labelText = labelText;
		this.relationSource = [];
		this.relationTarget = [];
		this.conceptId = conceptId;
		//DRAG FUNCTIONS
		var move = function(dx,dy) {
				this.attr({
							transform: this.data('origTransform') + (this.data('origTransform') ? "T" : "t") + [dx, dy]
						});
				nodeBBox[conceptId] = this.getBBox();
				label.attr({
					x: nodeBBox[conceptId].x+25,
					y: nodeBBox[conceptId].y+28
				});
				
				for (var i = 0; i < relationArr.length; i++) {
					if (relationArr[i].origin == conceptId){
						relationArr[i].line.attr({
							x1: nodeBBox[conceptId].cx,
							y1: nodeBBox[conceptId].cy
						});
						lineBBox[i] = relationArr[i].line.getBBox();
						relationArr[i].label.attr({
							x: lineBBox[i].cx,
							y: lineBBox[i].cy
							
						});
						console.log(nodeBBox[conceptId].cx);
						console.log(nodeBBox[conceptId].cy);
					}
				}
				
				for (var i = 0; i < relationArr.length; i++) {
					if (relationArr[i].target == conceptId){
						relationArr[i].line.attr({
							x2: nodeBBox[conceptId].cx,
							y2: nodeBBox[conceptId].cy
						});
						lineBBox[i] = relationArr[i].line.getBBox();
						relationArr[i].label.attr({
							x: lineBBox[i].cx,
							y: lineBBox[i].cy
							
						});
						console.log(nodeBBox[conceptId].cx);
						console.log(nodeBBox[conceptId].cy);
					}
				}
				
		}

		var start = function() {
				this.data('origTransform', this.transform().local );
				
		}
		stop = function() {
				console.log('finished dragging');
				console.log(node.getBBox());
		}
		//DOUBLE CLICK FUNCTIONS
		function dblclickNode() {
			if (selConOne == undefined && selConTwo != conceptId){
				setSelectionOne(conceptId);
				console.log(selConOne);
				console.log(selConTwo);
			}
			else if (selConTwo == undefined && selConOne != conceptId) {
				setSelectionTwo(conceptId);
				console.log(selConOne);
				console.log(selConTwo);
			}
			else if (selConOne == conceptId){
				setSelectionOne(undefined);
			}
			else if (selConTwo == conceptId){
				setSelectionTwo(undefined);
			}
		};
		
		function dblclicklabelText() {
			label.attr({
				text: prompt("Enter labelText name", "labelText")
			})
		};
		
		//NODE OBJECT
		var node = paper.rect(posX, posY, 125, 50).attr({
			fill: "#34495e"
		})
		.drag(move, start, stop)
		.dblclick(dblclickNode);
		nodeBBox[conceptId] = node.getBBox();

		
		//LABEL OBJECT
		var label = paper.text (posX+25, posY+28, labelText).attr({
			fill: "#ecf0f1"
		})
		.dblclick(dblclicklabelText);
		
}

function relation (origin, target, relationLabel, relationId) {
	this.origin = origin;
	this.target = target;
	this.relationId = relationId;
	this.relationLabel = relationLabel;
	this.line = paper.line(nodeBBox[origin].cx, nodeBBox[origin].cy, nodeBBox[target].cx, nodeBBox[target].cy).attr({
		stroke: "#000"
	});
	lineBBox[relationId] = this.line.getBBox();
	this.label = paper.text(lineBBox[relationId].cx, lineBBox[relationId].cy, "Hello").dblclick(dblclicklabelText);
	
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
var nodeBBox = [];
var lineBBox = [];
var conceptArr = [];
var relationArr = [];

function addNode (posX, posY, labelText){
	if (labelText == undefined)
		labelText = "New Concept";
	conceptArr[conceptArr.length] = new concept (posX, posY, labelText, conceptArr.length);
}
function addRelation (origin, target, labelText){
	if (origin == undefined || target == undefined)
		console.log("You need to select two elements");
	else {
		console.log("success");
		relationArr[relationArr.length] = new relation(origin, target, labelText, relationArr.length);
		conceptArr[origin].relationSource[conceptArr[origin].relationSource.length] = relationArr.length-1;
		conceptArr[target].relationTarget[conceptArr[target].relationTarget.length] = relationArr.length-1;
	}
}