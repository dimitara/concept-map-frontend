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
    var line = s.line(20, 20, 100, 20);

    group.x1 = 20;
    group.y1 = 20;
    group.x2 = 100;
    group.y2 = 20;

    var circleOne = s.circle(20, 20, 5);
    circleOne.attr('data-item', 'one');

    var circleTwo = s.circle(100, 20, 5);
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

    console.log(group);
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
                moveLine.call(rels[i].el.selectAll('circle')[0], dx, dy);

                /*
                rels[i].el.select('line').attr('x1', x); 
                rels[i].el.select('line').attr('y1', y); 
                rels[i].el.selectAll('circle')[0].attr('cx', x);
                rels[i].el.selectAll('circle')[0].attr('cy', y);
                */
            }

            if(rels[i].type === 'two'){
                moveLine.call(rels[i].el.selectAll('circle')[1], dx, dy);
                /*
                rels[i].el.select('line').attr('x2', x); 
                rels[i].el.select('line').attr('y2', y); 

                rels[i].el.selectAll('circle')[1].attr('cx', x);
                rels[i].el.selectAll('circle')[1].attr('cy', y);
                */
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
    
    var x1 = parseFloat(this.parent().x1);
    var y1 = parseFloat(this.parent().y1);
    var x2 = parseFloat(this.parent().x2);
    var y2 = parseFloat(this.parent().y2);

    if(end === 'one'){
        line.attr('x1', x1 + dx);
        line.attr('y1', y1 + dy);
        this.attr('cx', x1 + dx);
        this.attr('cy', y1 + dy);
        
        selectNode(x1 + dx, y1 + dy);
    }

    if(end === 'two'){
        line.attr('x2', x2 + dx);
        line.attr('y2', y2 + dy);
        this.attr('cx', x2 + dx);
        this.attr('cy', y2 + dy);
        console.log('w', x2, y2, dx, dy);
        selectNode(x2 + dx, y2 + dy);
    }
}

var selectNode = function(linex, liney){
    var posx = linex;
    var posy = liney;

    var resultNode = null;
    for(var i = 0; i < nodes.length; i++){
        var width = parseFloat(nodes[i].attr('width')) + nodeDefaultX1;
        var height = parseFloat(nodes[i].attr('height')) + nodeDefaultY1;
        var x = parseFloat(nodes[i].attr('x')) + nodeDefaultX1;
        var y = parseFloat(nodes[i].attr('y')) + nodeDefaultY1;
        console.log(posx, posy, x, y);
        if(posx > x && posx < x + width && posy > y && posy < y + height){
            //the line is dragged over a node
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