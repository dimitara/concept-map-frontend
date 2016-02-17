#Map library reference

###Configuration:
var apiAdress - the address of the REST API

###List of methods:
 - saveMap();
 - currentMap();
 - deleteMap(id);
 - loadMap(id, successCallback(map));
 - addRelationship(label, source, target);
 - deleteRelationship(id);
 - updateRelationship(id, lable, source, target);
 - addConcept(label, posx, posy);
 - deleteConcept(label, posx, posy);
 - updateConcept(label, posx, posy);
 

####saveMap();

> Saves current state of the map. 

####currentMap();

> Returns current map.

####loadMap(id, successCallback(map));

> Loads a map
> id - the id of the map you want to load
> successCallback(map) - function that will be executed after successful map retrieving. Takes the map retrieved as an argument. 

####addRelationship(label, source, target);

> Adds a relationship to the map.
> lable - the label of the relationship
> source - id of the source concept
> target - id of the target concept

####deleteRelationship(id);

> Deletes a relationship
> id - the id of the relationship you want to delete

####updateRelationship(id, label, source, target);

> Updates a relationship
> id - The id of relationship you want to update.
> label - the new label of the relationship
> source - the new source of the relationship
> target - the new target of the relationship

####addConcept(label, posx, posy);

> Adds a concept to the map
> label - the label of the concept
> posx - the X coordinate of the position
> posy - the Y coordinate of the position

####deleteConcept(id);

> Deletes a concept from the map
> id - The id of the concept you want to delete.

####updateConcept(id, label, posx, posy);

> Updates a concept
> id - The id of the concept you want to update
> label - The new label of the concept
> posx - The new X coordinate of the concept
> posy - The new Y coordinate of the concept