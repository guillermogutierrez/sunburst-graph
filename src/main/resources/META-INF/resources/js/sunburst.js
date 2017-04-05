(function ( $ ) {
    var svgCanvas = null;
     
    var EventController = null; 
    
    var transformation =null; 
    
    var Container = this.Container = function(settings){
        this.graph = new Graph(settings);
        this.breadcrumb = new Breadcrumb(settings);
        this.leyend = new Leyend();
        this.explanation = d3.select("#explanation");
        this.percentaje =  d3.select("#percentage");
        this.area = d3.select("#container");
        this.settings = settings;  
        this.colors = settings.colors;
        this.color = d3.scale.category20c();
    };
    Container.prototype = {
          start: function(){
             if (this.settings.breadcrumb) {
                 this.breadcrumb.build();
             }
             
             if (this.settings.leyend) {
                 this.leyend.drawLegend();
             }
             
             d3.json(this.settings.jsonURL, function(error, root) {
                 svgCanvas.addNodes(root);    
                 totalSize = svgCanvas.graph.size();
                 EventController = new EventController();
                 EventController.initialize();
             });
             
          },
          addNodes: function(root){
              this.graph.addNodes(root);
          },
          size: function(){
              return this.graph.size();
          }, 
          path: function(){
              return this.graph.path;
          },
          arc: function(d){
              return this.graph.arc(d);
          },
          ancestors: function(d){
              return this.graph.ancestors(d);
          },
          updateBreadcrumb: function(sequenceArray, percentageString){
              return this.breadcrumb.update(sequenceArray, percentageString);
          },
          nodesBySegment:function(sequenceArray){
              return this.graph.path.filter(function(node) {
                  return (sequenceArray.indexOf(node) >= 0);
                });
          }, 
          getText: function(){
            return this.graph.text;  
          }, 
          getExplanationContainer: function (){
              return this.explanation;
          },
          getGraphRadius: function(){
              return this.graph.radius;
          },
          getColors: function(){
              return this.colors;
          },
          getColor: function(key){
              return this.colors[key];
          },
          getColorNode: function(d){
              return this.color((d.children ? d : d.parent).name);
          }
    };
    
    var Breadcrumb = this.Breadcrumb = function (settings){
        this.enabled= settings.breadcrumb;
        dimensions= { w: 200, h: 30, s: 3, t: 10 };
        this.width=settings.width;
        this.trail = null;
    }; 
    
    Breadcrumb.prototype={
        build: function(){
            // Add the svg area.
            this.trail = d3.select("#sequence").append("svg:svg").attr("width", this.width).attr("height", 50).attr("id", "trail");
            // Add the label at the end, for the percentage.
            this.trail.append("svg:text").attr("id", "endlabel").style("fill", "#000");
        },
        update: function (nodeArray, percentageString) {
           // Data join; key function combines name and depth (= position in sequence).
           var g = this.trail.selectAll("g").data(nodeArray, function(d) { return d.name + d.depth; });
   
           // Add breadcrumb and label for entering nodes.
           var entering = g.enter().append("svg:g");
   
           entering.append("svg:polygon").attr("points", this.breadcrumbPoints).style("fill", function(d) { return d.depth ? svgCanvas.getColorNode(d) : "transparent" });
   
           entering.append("svg:text")
               .attr("x", (dimensions.w + dimensions.t) / 2)
               .attr("y", dimensions.h / 2)
               .attr("dy", "0.35em")
               .attr("text-anchor", "middle")
               .text(function(d) { return d.name; });
   
           // Set position for entering and updating nodes.
           g.attr("transform", this.translate);
   
           // Remove exiting nodes.
           g.exit().remove();
   
           // Now move and update the percentage at the end.
           this.trail.select("#endlabel")
               .attr("x", (nodeArray.length + 0.5) * (dimensions.w + dimensions.s))
               .attr("y", dimensions.h / 2)
               .attr("dy", "0.35em")
               .attr("text-anchor", "middle")
               .text(percentageString);
   
           // Make the breadcrumb trail visible, if it's hidden.
           this.trail.style("visibility", "");                
        },
        breadcrumbPoints: function (d, i) {
            var points = [];
            points.push("0,0");
            points.push(dimensions.w + ",0");
            points.push(dimensions.w + dimensions.t + "," + (dimensions.h / 2));
            points.push(dimensions.w + "," + dimensions.h);
            points.push("0," + dimensions.h);
            if (i > 0) { // Leftmost breadcrumb; don't include 6th vertex.
                points.push(dimensions.t + "," + (dimensions.h / 2));
            }
            return points.join(" ");
        },
        translate: function (d, i) {
            return "translate(" + i * (dimensions.w + dimensions.s) + ", 0)";
        }
    };
    
    var Leyend = this.Leyend = function(){
        this.container = d3.select("#legend");
    };
    
    Leyend.prototype = {
        drawLegend: function (EventController) {
            
            d3.select("#leyend-container").style("visibility", "");
            
            // Dimensions of legend item: width, height, spacing, radius of rounded rect.
            var li = {
              w: 200, h: 30, s: 3, r: 3
            };
    
            var legend = this.container.append("svg:svg")
                .attr("width", li.w)
                .attr("height", d3.keys(svgCanvas.getColors()).length * (li.h + li.s));
    
            var g = legend.selectAll("g")
                .data(d3.entries(svgCanvas.getColors()))
                .enter().append("svg:g")
                .attr("transform", function(d, i) {
                        return "translate(0," + i * (li.h + li.s) + ")";
                     });
    
            g.append("svg:rect")
                .attr("rx", li.r)
                .attr("ry", li.r)
                .attr("width", li.w)
                .attr("height", li.h)
                .style("fill", function(d) { return d.value; });
    
            g.append("svg:text")
                .attr("x", li.w / 2)
                .attr("y", li.h / 2)
                .attr("dy", "0.35em")
                .attr("text-anchor", "middle")
                .text(function(d) { return d.key; });
    
        }    
    };   
    
    var Graph = this.Graph = function(settings){
        
        // TODO: Add radius configuration
        this.radius = Math.min(settings.width, settings.height) / 2;
        // Total size of all segments; we set this later, after loading the data.
        this.totalSize = 0; 
        this.x = d3.scale.linear().range([0, 2 * Math.PI]);
        this.y = d3.scale.linear().range([0, this.radius]);
        this.color = d3.scale.category20c();
        
        this.chart = d3.select("#sunburst").append("svg")
            .attr("width", settings.width)
            .attr("height", settings.height)
            .attr("id", "container")
            .append("g")
            .attr("transform", "translate(" + settings.width / 2 + "," + (settings.height / 2 + 10) + ")");
        
        this.showText = true;
        
        this.text = null;
        
        this.path = null;
        
        this.partition = d3.layout.partition().value(function(d) { return d.size; });
        
        this.arc = d3.svg.arc()
            .startAngle(function(d) {return Math.max(0, Math.min(2 * Math.PI, svgCanvas.graph.x(d.x))); })
            .endAngle(function(d) {return Math.max(0, Math.min(2 * Math.PI, svgCanvas.graph.x(d.x + d.dx))); })
            .innerRadius(function(d) {return Math.max(0, svgCanvas.graph.y(d.y)); })
            .outerRadius(function(d) {return Math.max(0, svgCanvas.graph.y(d.y + d.dy)); });
    };
    Graph.prototype={
        addNodes: function(root){
            this.chart.append("svg:circle").attr("r", this.radius).style("opacity", 0);
            
            var g = this.chart.selectAll("g").data(this.partition.nodes(root).filter(function(d) {return (d.dx > 0.005); })).enter().append("g");
            
            this.path = g.append("path").attr("d", this.arc).attr("fill-rule", "evenodd").style("fill", function(d) { return d.depth ? svgCanvas.getColorNode(d) : "transparent" });
            
            if (this.showText){
                this.text = g.append("text")
                .attr("transform", transformation.transformText)
                .attr("x", transformation.positionText)
                .attr("dx", "0") // margin
                .attr("dy", "0") // vertical-align
                .attr("font-size", this.radius/20)
                .text(function(d) { return d.name; });
            }               
        },                
        size: function(){
            return this.path.node().__data__.value;
        },
        ancestors: function(node) {
            var path = [];
            var current = node;
            while (current.parent) {
                path.unshift(current);
                current = current.parent;
            }
            return path;
        }
    };
    
    var Transformation = this.Transformation = function(){};
    
    Transformation.prototype = {
        arcTween: function (d){
            var xd = d3.interpolate(svgCanvas.graph.x.domain(), [d.x, d.x + d.dx]),
                yd = d3.interpolate(svgCanvas.graph.y.domain(), [d.y, 1]),
                yr = d3.interpolate(svgCanvas.graph.y.range(), [d.y ? 20 : 0, svgCanvas.graph.radius]);
            return function(d, i) {
              return i
                  ? function(t) { return svgCanvas.arc(d); }
                  : function(t) { svgCanvas.graph.x.domain(xd(t)); svgCanvas.graph.y.domain(yd(t)).range(yr(t)); return svgCanvas.arc(d); };
            };
        },
        transformText: function(d) { 
            return "rotate(" + TransformationEngine.computeTextRotation(d) + ")"; 
        },
        positionText: function(d) { 
            return TransformationEngine.computeTextPosition(d); 
        },
    };

    var TransformationEngine = function(){};
    
    TransformationEngine.computeTextRotation = function (d) {
        rotation =  (svgCanvas.graph.x(d.x + d.dx / 2) - Math.PI / 2) / Math.PI * 180;
        if (rotation > 90)
            return rotation - 180;
        
        if (rotation == 90)
            return 0;
            
        return rotation;
    }
    
    TransformationEngine.computeTextPosition= function (d) {        
        rotation = (svgCanvas.graph.x(d.x + d.dx / 2) - Math.PI / 2) / Math.PI * 180;

        if (rotation > 90){
            return -(svgCanvas.graph.y(d.y) + ((svgCanvas.graph.y(d.y) / d.depth)));
        }
    
        return svgCanvas.graph.y(d.y);
    } 
    
    var EventController = function(){};
    EventController.prototype = {
        // Fade all but the current sequence, and show it in the breadcrumb trail.
        nodeMouseover: function (d) {
        
            var percentage = (100 * d.value / totalSize).toPrecision(3);
            var percentageString = percentage + "%";
            
            if (percentage < 0.1) {
                percentageString = "< 0.1%";
            }
            
            d3.select("#percentage").text(percentageString);
            
            d3.select("#explanation").style("visibility", "");
            
            var sequenceArray = svgCanvas.ancestors(d);
            
            svgCanvas.updateBreadcrumb(sequenceArray, percentageString);
            
            // Fade all the segments.
            svgCanvas.path().style("opacity", 0.3);
            
            // Then highlight only those that are an ancestor of the current segment.
            svgCanvas.nodesBySegment(sequenceArray).style("opacity", 1);
        },
        canvasMouseleave: function (d) {
            // Hide the breadcrumb trail
            d3.select("#trail")
                .style("visibility", "hidden");
            // Deactivate all segments during transition.
            svgCanvas.path().on("mouseover", null);
    
            // Transition each segment to full opacity and then reactivate it.
            svgCanvas.path().transition()
                .duration(1000)
                .style("opacity", 1)
                .each("end", function() {
                    svgCanvas.path().on("mouseover", EventController.nodeMouseover);
                      });
            
            svgCanvas.getExplanationContainer().style("visibility", "hidden");
        },
        nodeClick: function (d) {
            svgCanvas.getText().transition().attr("opacity", 0);
            svgCanvas.path().transition()
                .duration(750)
                .attrTween("d", transformation.arcTween(d))
                .each("end", function(e, i) {
                // check if the animated element's data e lies within the visible angle span given in d
                if (e.x >= d.x && e.x < (d.x + d.dx)) {
                      // get a selection of the associated text element
                      var arcText = d3.select(this.parentNode).select("text");
                      // fade in the text element and recalculate positions
                      arcText.transition().duration(750)
                        .attr("opacity", 1)
                        .attr("transform", transformation.transformText)
                        .attr("x", transformation.positionText);
                }
            });
        },
        clickLeyend: function(d){
            var isHidden = d3.select("#legend").style('visibility') == 'hidden';
            d3.select("#legend").style('visibility', isHidden ? 'inherit' : 'hidden');
        },
        toggle: function(node) {  
            var isHidden = node.style('visibility') == 'hidden';
            return node.style('visibility', isHidden ? 'inherit' : 'hidden');
        },
        initialize: function(){
            svgCanvas.area.on("mouseleave", this.canvasMouseleave);
            svgCanvas.graph.path.on("mouseover", this.nodeMouseover).on('click', this.nodeClick);
            d3.select("#togglelegend").on("click",  this.clickLeyend);
        }
    }
    
    $.fn.sunburst = function( options ) {
 
        var settings = $.extend({
            // These are the defaults.
            jsonURL: "http://localhost:8080/documents/20147/0/flare.json/a0e0a563-7ace-fcdc-6511-13f74f6d90a0?download=true",
            color: {},
            width: 750,
            height: 600,
            breadcrumb: true,
            leyend: true
        }, options );
        
	  	svgCanvas = new Container(settings);    
	  
	  	transformation = new Transformation();	  	
  
		svgCanvas.start();

	  	d3.select(self.frameElement).style("height", settings.height + "px");

        return this; 
    };
 
}( jQuery ));