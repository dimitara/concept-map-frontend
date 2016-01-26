var paper = Raphael(0,0,"100%","100%");
            
            
var nodes = [];

/* var move = function (dx, dy) {
    var att = {x: this.ox + dx, y: this.oy + dy};
    this.attr(att);
};

var dragger = function () {
    this.ox = this.attr("x")
    this.oy = this.attr("y")
}; */
            

function concept (){
    var shape = paper.rect(300,300,150,50).attr("fill", "#f00");
    var label = paper.text(370,325, "Label Text")

    var move = function (dx, dy) {
        var att = {x: shape.ox + dx, y: shape.oy + dy};
        shape.attr(att);

        var att = {x: label.ox + dx, y: label.oy + dy};
        label.attr(att);
    };

    var dragger = function () {
        shape.ox = this.attr("x")
        shape.oy = this.attr("y")
        
        label.ox = label.attr("x")
        label.oy = label.attr("y")
    };
    
    label.click(function(){
        
        var newLabel = prompt("New Label", "Label1");
        this.attr({text: newLabel});
        
        
    });
    
    function conceptX (){
        return shape.attrs.x;
    }
    
    function conceptY (){
        return shape.attrs.y;
    }
    
    function conceptLabel (){
        return label.attrs.text;
    }
    
    shape.pair = label;
    shape.drag(move, dragger);
}

function addNode(){
    nodes[nodes.length] = new concept();
}

var buttonAdd = paper.path("M25.979,12.896 19.312,12.896 19.312,6.229 12.647,6.229 12.647,12.896 5.979,12.896 5.979,19.562 12.647,19.562 12.647,26.229 19.312,26.229 19.312,19.562 25.979,19.562z").attr("fill","white");
buttonAdd.click(function() {addNode()});