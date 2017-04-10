<%@page import="com.liferay.portal.kernel.util.GetterUtil"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>

<%@ taglib uri="http://java.sun.com/portlet_2_0" prefix="portlet" %>

<%@ taglib uri="http://liferay.com/tld/aui" prefix="aui" %>
<%@ taglib uri="http://liferay.com/tld/portlet" prefix="liferay-portlet" %>
<%@ taglib uri="http://liferay.com/tld/theme" prefix="liferay-theme" %>
<%@ taglib uri="http://liferay.com/tld/ui" prefix="liferay-ui" %>
<%@ page import="com.liferay.portal.kernel.util.ParamUtil" %>
<%@ page import="com.liferay.portal.kernel.util.Constants" %>
<liferay-theme:defineObjects />

<portlet:defineObjects />

<%
String serviceURL = portletPreferences.getValue("serviceURL", "");
String graphName = portletPreferences.getValue("graphName", "");
String explanation = portletPreferences.getValue("explanation", "");
String colors = portletPreferences.getValue("colors", "");
String width = portletPreferences.getValue("width", "700");
String height = portletPreferences.getValue("height", "650");
Float filterValue = GetterUtil.getFloat(portletPreferences.getValue("filter", "0.005"));
Boolean breadcrumbEnabled = GetterUtil.getBoolean(portletPreferences.getValue("breadcrumbEnabled", ""), Boolean.FALSE);
Boolean leyendEnabled = GetterUtil.getBoolean(portletPreferences.getValue("leyendEnabled", ""), Boolean.FALSE);
Boolean autoColors = GetterUtil.getBoolean(portletPreferences.getValue("autoColors", ""), Boolean.FALSE);
Boolean showText = GetterUtil.getBoolean(portletPreferences.getValue("showText", ""), Boolean.FALSE);
%>
