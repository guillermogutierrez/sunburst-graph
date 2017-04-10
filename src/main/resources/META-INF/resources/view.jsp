<%@ include file="./init.jsp" %>

<script src="http://d3js.org/d3.v3.min.js"></script>

<script>
	var colors = {};
  
	$(document).ready(function(){
	
		var options = {
			jsonURL: "<%=serviceURL%>",
			breadcrumb: <%=breadcrumbEnabled%>,
			colors: <%=colors%>,
			width: <%= width%>,
			height: <%= height%>,
			leyend: <%=leyendEnabled%>,
			colorSelector: "<%= autoColors ? "auto" : "provided" %>",
			filterValue: <%= filterValue %>,
			showText: <%= showText %>
		};
	
		$('#sunburst').sunburst(options);
  	});
</script>

<div class="sunburst">
	<div class="row">
		<div class="title col-md-12">
			<h1>
				<%= graphName %>
			</h1>
		</div>
	</div>	  
	
	<div class="row">
		<div id="sequence" class="col-md-12"></div>
	</div>
	
	<div class="row">
		<div id="explanation" style="visibility: hidden;">
		      <span id="percentage"></span>
		       <span> <%= explanation %> </span>
	    </div>
	</div>
	
	<div class="row">
		<div id="main" class="col-md-8">		
		  <div id="sunburst"></div>
		</div>
		
		<div id="sidebar" class="col-md-4">
			<div id="leyend-container" style="visibility: hidden;">
			  <input type="checkbox" id="togglelegend"> Legend<br/>
			  <div id="legend" style="visibility: hidden;"></div>
			</div>
		</div>
	</div>
</div>