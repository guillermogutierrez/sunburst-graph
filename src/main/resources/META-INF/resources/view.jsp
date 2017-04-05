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
			leyend: <%=leyendEnabled%>
		};
	
		$('#sunburst').sunburst(options);
  	});
</script>

<div id="main">
	<div class="title">
		<h1>
			<%= graphName %>
		</h1>
	</div>
  <div id="sequence"></div>
  <div id="sunburst">        
    <div id="explanation" style="visibility: hidden;">
      <span id="percentage"></span><br/>
        <%= explanation %>
    </div>
  </div>
</div>

<div id="sidebar">
	<div id="leyend-container" style="visibility: hidden;">
	  <input type="checkbox" id="togglelegend"> Legend<br/>
	  <div id="legend" style="visibility: hidden;"></div>
	</div>
</div>