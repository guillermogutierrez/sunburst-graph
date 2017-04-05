<%--
/**
 * Copyright (c) 2000-present Liferay, Inc. All rights reserved.
 *
 * This library is free software; you can redistribute it and/or modify it under
 * the terms of the GNU Lesser General Public License as published by the Free
 * Software Foundation; either version 2.1 of the License, or (at your option)
 * any later version.
 *
 * This library is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE. See the GNU Lesser General Public License for more
 * details.
 */
--%>

<%@ include file="./init.jsp" %>

<liferay-portlet:actionURL portletConfiguration="<%= true %>" var="configurationActionURL" />

<liferay-portlet:renderURL portletConfiguration="<%= true %>" var="configurationRenderURL" />

<aui:form action="<%= configurationActionURL %>" method="post" name="fm">
	<aui:input name="<%= Constants.CMD %>" type="hidden" value="<%= Constants.UPDATE %>" />
	<aui:input name="redirect" type="hidden" value="<%= configurationRenderURL %>" />

	<div class="portlet-configuration-body-content">
		<liferay-ui:tabs
			names="general"
			refresh="<%= false %>"
		>
			<liferay-ui:section>
				<div class="container-fluid-1280">
					<aui:fieldset>
						<aui:input cssClass="lfr-input-text-container" label="Service URL" name="preferences--serviceURL--" value="<%= serviceURL %>" />
						
						<aui:input cssClass="lfr-input-text-container" label="Graph Name" name="preferences--graphName--" value="<%= graphName %>" />
						
						<aui:input cssClass="lfr-input-text-container" label="Graph Explanation" name="preferences--explanation--" value="<%= explanation %>" />
						
						<aui:input cssClass="lfr-input-text-container" label="Colors" name="preferences--colors--" value="<%= colors %>" />
						
						<aui:input cssClass="lfr-input-text-container" label="Colors" name="preferences--width--" value="<%= width %>" />
						
						<aui:input cssClass="lfr-input-text-container" label="Colors" name="preferences--height--" value="<%= height %>" />
						
						<aui:input id="enableBreadcrumb" label="enable-chart-breadcrumb" name="preferences--breadcrumbEnabled--" type="toggle-switch" value="<%= breadcrumbEnabled %>" />
						
						<aui:input id="enableLeyend" label="enable-chart-leyend" name="preferences--leyendEnabled--" type="toggle-switch" value="<%= leyendEnabled %>" />
								
					</aui:fieldset>
				</div>
			</liferay-ui:section>
		</liferay-ui:tabs>
	</div>

	<aui:button-row>
		<aui:button cssClass="btn-lg" type="submit" />
	</aui:button-row>
</aui:form>

<aui:script sandbox="<%= true %>">
	Liferay.Util.toggleBoxes('<portlet:namespace />enableEmailSubscription', '<portlet:namespace />emailSubscriptionSettings');
</aui:script>