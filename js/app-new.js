var s = Snap('#snap');
var nodes = [];
var rels = [];

function addNode(){
    var group = s.group();
    group.attr('height', 50);
    group.attr('width', 100);
    group.attr('x', 100);
    group.attr('y', 100);
    group.rels = [];

    var node = s.rect(100, 100, 100, 50, 5, 5);
    node.attr('stroke', '#000');
    node.attr('fill', '#fff');
    var nodeText = s.text(100, 100+25, 'Concept Node');
    nodeText.attr('fill', '#000');
    
    group.add(node);
    group.add(nodeText);

    nodeText.click(function(){
        var newLabel = prompt('', this.attr('text'));
        this.attr({text: newLabel});
        node.attr('width', this.getBBox().width + 20);

        node.parent().attr('width', this.getBBox().width + 20);

        //todo: reposition the text inside the rectangle
    });

    node.drag(moveNode,
        function() {
            console.log("Move started");
        },
        function() {
            console.log("Move stopped");
        }
    );

    nodes.push(group);
}

function addRelation(){
    var group = s.group();
    var line = s.line(100, 80, 200, 80);
    var circleOne = s.circle(100, 80, 3);
    circleOne.attr('data-item', 'one');

    var circleTwo = s.circle(200, 80, 3);
    circleTwo.attr('data-item', 'two');

    line.attr('stroke', '#000');
    group.add(line);
    group.add(circleOne);

    circleOne.drag(moveLine, function(){}, function(){
        moveOutLine.call(this, parseFloat(line.attr('x1')), parseFloat(line.attr('y1')), 'one', group);
    });
    circleTwo.drag(moveLine, function(){}, function(){
        moveOutLine.call(this, parseFloat(line.attr('x2')), parseFloat(line.attr('y2')), 'two', group);
    });
}

var moveNode = function(dx, dy, posx, posy) {
    this.parent().attr('x', dx);
    this.parent().attr('y', dy);
    this.parent().attr('transform', 'translate(' + dx + ',' + dy + ')');

    if(this.parent().rels){
        var rels = this.parent().rels;
        for(var i=0; i<rels.length; i++){
            if(rels[i].type === 'one'){
                rels[i].el.select('line').attr('x1', dx); 
                rels[i].el.select('line').attr('y1', dy); 
            }

            if(rels[i].type === 'two'){
                rels[i].el.select('line').attr('x2', dx); 
                rels[i].el.select('line').attr('y2', dy); 
            }
        }
    }
}

var moveOutLine = function(posx, posy, type, el){
    var resultNode = selectNode(posx, posy);

    if(resultNode){
        resultNode.rels.push({
            el: el,
            type: type
        });
    }
}

var moveLine = function(dx, dy, posx, posy){
    var end = this.attr('data-item');
    var line = this.parent().select('line');

    selectNode(posx, posy);

    if(end === 'one'){
        line.attr('x1', posx);
        line.attr('y1', posy);
        this.attr('cx', posx);
        this.attr('cy', posy);
    }

    if(end === 'two'){
        line.attr('x2', posx);
        line.attr('y2', posy);

        this.attr('cx', posx);
        this.attr('cy', posy);
    }
}

var selectNode = function(posx, posy){
    var resultNode = null;
    for(var i = 0; i < nodes.length; i++){
        var width = parseFloat(nodes[i].attr('width'));
        var height = parseFloat(nodes[i].attr('height'));
        var x = parseFloat(nodes[i].attr('x'));
        var y = parseFloat(nodes[i].attr('y'));

        if(posx > x && posx < x + width && posy > y && posy < y + height){
            //the line is dragged over a node
            //console.log(dx, dy, posx, posy, x, y, width, height);
            nodes[i].select('rect').attr('fill', '#eee');
            resultNode = nodes[i];
        }
        else{
            nodes[i].select('rect').attr('fill', '#fff');
        }
    }

    return resultNode;
}

//addNode();