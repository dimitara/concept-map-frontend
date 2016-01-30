var s = Snap('#snap');
var nodes = [];
var rels = [];

var nodeDefaultX1 = 100;
var nodeDefaultY1 = 100;
var nodeDefaultX2 = 100;
var nodeDefaultY2 = 50;
var rFactor = 5;


function addNode(){
    var group = s.group();
    group.attr('height', 50);
    group.attr('width', 100);
    group.attr('x', 0);
    group.attr('y', 0);
    group.rels = [];

    var node = s.rect(nodeDefaultX1, nodeDefaultY1, nodeDefaultX2, nodeDefaultY2, rFactor, rFactor);
    node.attr('stroke', '#000');
    node.attr('fill', '#fff');
    var nodeText = s.text(nodeDefaultX1 + 3, nodeDefaultY1+nodeDefaultY2/1.7, 'Concept Node');
    nodeText.attr('fill', '#000');
    
    group.add(node);
    group.add(nodeText);

    nodeText.click(function(){
        this.attr({text: 'Concept Node'});
        //node.attr('width', this.getBBox().width + 20);
        //node.parent().attr('width', this.getBBox().width + 20);

        //todo: reposition the text inside the rectangle
    });

    node.drag(moveNode,
        function() {
            
        },
        function() {
            moveOutNode.call(this);
        }
    );

    nodes.push(group);
}

function addRelation(){
    var group = s.group();
    var line = s.line(100, 80, 200, 80);

    group.x1 = 100;
    group.y1 = 80;
    group.x2 = 200;
    group.y2 = 80;

    var circleOne = s.circle(100, 80, 3);
    circleOne.attr('data-item', 'one');

    var circleTwo = s.circle(200, 80, 3);
    circleTwo.attr('data-item', 'two');

    line.attr('stroke', '#000');
    group.add(line);
    group.add(circleOne);
    group.add(circleTwo);

    circleOne.drag(moveLine, function(){}, function(){
        moveOutLine.call(this, parseFloat(line.attr('x1')), parseFloat(line.attr('y1')), 'one', group);
    });
    circleTwo.drag(moveLine, function(){}, function(){
        moveOutLine.call(this, parseFloat(line.attr('x2')), parseFloat(line.attr('y2')), 'two', group);
    });
}

var moveNode = function(dx, dy, posx, posy) {
    var x = parseFloat(this.parent().attr('x'));
    var y = parseFloat(this.parent().attr('y'));

    x += dx;
    y += dy;

    this.parent().tempX = x;
    this.parent().tempY = y;

    this.parent().attr('transform', 'translate(' + x + ',' + y + ')');

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

var moveOutNode = function(){
    this.parent().attr('x', this.parent().tempX);
    this.parent().attr('y', this.parent().tempY);
};

var moveOutLine = function(posx, posy, type, el){
    this.parent().x1 = this.parent().select('line').attr('x1');
    this.parent().y1 = this.parent().select('line').attr('y1');
    this.parent().x2 = this.parent().select('line').attr('x2');
    this.parent().y2 = this.parent().select('line').attr('y2');

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
    console.log(this);
    var x1 = parseFloat(this.parent().x1);
    var y1 = parseFloat(this.parent().y1);
    var x2 = parseFloat(this.parent().x2);
    var y2 = parseFloat(this.parent().y2);


    //selectNode(posx, posy);

    if(end === 'one'){
        line.attr('x1', x1 + dx);
        line.attr('y1', y1 + dy);
        this.attr('cx', x1 + dx);
        this.attr('cy', y1 + dy);
    }

    if(end === 'two'){
        line.attr('x2', x2 + dx);
        line.attr('y2', y2 + dy);
        this.attr('cx', x2 + dx);
        this.attr('cy', y2 + dy);
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