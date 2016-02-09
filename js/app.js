var paper = Snap("#snap");

function concept (posX, posY, labelText, conceptId){
		this.posX = posX;
		this.posY = posY;
		this.labelText = labelText;
		this.relationSource = [];
		this.relationTarget = [];
		//DRAG FUNCTIONS
		var move = function(dx,dy) {
				this.attr({
							transform: this.data('origTransform') + (this.data('origTransform') ? "T" : "t") + [dx, dy]

						});
				nodeBBox = node.getBBox();
				label.attr({
					x: nodeBBox.x+25,
					y: nodeBBox.y+28
				});
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
				tempBBox1 = node.getBBox();
				console.log(selConOne);
				console.log(selConTwo);
			}
			else if (selConTwo == undefined && selConOne != conceptId) {
				setSelectionTwo(conceptId);
				tempBBox2 = node.getBBox();
				console.log(selConOne);
				console.log(selConTwo);
			}
			else if (selConOne == conceptId){
				setSelectionOne(undefined);
				tempBBox1 = undefined;
			}
			else if (selConTwo == conceptId){
				setSelectionTwo(undefined);
				tempBBox2 = undefined;
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
		.click(dblclickNode);
		
		
		//LABEL OBJECT
		var label = paper.text (posX+25, posY+28, labelText).attr({
			fill: "#ecf0f1"
		})
		.dblclick(dblclicklabelText);
		
		this.v = function (){
			this.mmm = 55;
		}
}

function relation (origin, target, relationLabel) {
	this.origin = origin;
	this.target = target;
	this.relationLabel = relationLabel;
}


function setSelectionOne(value){
	selConOne = value;
};
function setSelectionTwo(value){
	selConTwo = value;
};
var selConOne;
var selConTwo;
var tempBBox1;
var tempBBox2;

var conceptArr = [];
var relationArr = [];

function addNode (posX, posY, labelText){
	conceptArr[conceptArr.length] = new concept (posX, posY, labelText, conceptArr.length);
}
function addRelation (origin, target, labelText){
	if (origin == undefined || target == undefined)
		console.log("You need to select two elements");
	else {
		console.log("success");
		relationArr[relationArr.length] = new relation(origin, target, labelText);
		conceptArr[origin].relationSource = relationArr.length-1;
		conceptArr[target].relationTarget = relationArr.length-1;
		paper.line(tempBBox1.cx, tempBBox1.y, tempBBox2.cx, tempBBox2.cy).attr({
			stroke: "#000"
		})
	}
}
addNode(100,100, "testing");

