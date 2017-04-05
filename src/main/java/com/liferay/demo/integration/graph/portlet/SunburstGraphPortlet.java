package com.liferay.demo.integration.graph.portlet;

import com.liferay.portal.kernel.portlet.bridges.mvc.MVCPortlet;

import javax.portlet.Portlet;

import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.ConfigurationPolicy;

@Component(
		configurationPid = "com.liferay.demo.integration.graph.portlet.configuration.SunburstConfiguration", configurationPolicy = ConfigurationPolicy.OPTIONAL,
	immediate = true,
	property = {
		"com.liferay.portlet.display-category=category.sample",
		"com.liferay.portlet.instanceable=true",
				"javax.portlet.name=" + SunburstPortletKeys.SUNBURST,
				"javax.portlet.display-name=Sunburst Graph Portlet",
		"javax.portlet.init-param.template-path=/",
		"javax.portlet.init-param.view-template=/view.jsp",
		"javax.portlet.resource-bundle=content.Language",
				"javax.portlet.security-role-ref=power-user,user",
				"com.liferay.portlet.footer-portlet-javascript=/js/sunburst.js"
	},
	service = Portlet.class
)
public class SunburstGraphPortlet extends MVCPortlet {
}