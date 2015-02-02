package com.wdpr.ee.loggingapi.appender;

import java.io.IOException;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.logging.log4j.Logger;
import org.apache.logging.log4j.core.LogEvent;
import org.apache.logging.log4j.core.appender.rewrite.RewritePolicy;
import org.apache.logging.log4j.core.config.Configuration;
import org.apache.logging.log4j.core.config.Property;
import org.apache.logging.log4j.core.config.plugins.Plugin;
import org.apache.logging.log4j.core.config.plugins.PluginConfiguration;
import org.apache.logging.log4j.core.config.plugins.PluginElement;
import org.apache.logging.log4j.core.config.plugins.PluginFactory;
import org.apache.logging.log4j.core.impl.Log4jLogEvent;
import org.apache.logging.log4j.status.StatusLogger;

import com.wdpr.ee.loggingapi.util.FileConstants;
import com.wdpr.ee.loggingapi.util.LoggingUtil;

/**
 * This policy modifies events by replacing or possibly adding
 * keys and values to the log message
 * @author KANNV004
 *
 */

@Plugin(name="WdprPropertiesRewritePolicy",
category="Core",
elementType="rewritePolicy",
printObject=true)
@SuppressWarnings("unused")
public final class WdprPropertiesRewritePolicy implements RewritePolicy{

	 protected static final Logger LOGGER = StatusLogger.getLogger();
	 private  Configuration config;
	 private Map<String, String> properties;
	
	 /**
	  * Constructor
	  * @param config
	  * @param props
	  */
	public WdprPropertiesRewritePolicy(Configuration config, List<Property> props) {
		this.config = config;
		this.properties = new HashMap<String, String>(props.size());
		for (final Property property : props) {
			final Boolean interpolate = Boolean.valueOf(property.getValue().contains("${"));
			if(interpolate.booleanValue()){
				properties.put(property.getName(), FileConstants.EMPTY_STRING);
			} else{
			  properties.put(property.getName(), property.getValue());
			}  
		}
	}

	public WdprPropertiesRewritePolicy() {
		// TODO Auto-generated constructor stub		
	}

	/**
	 * This method will add the extra logging
	 * message attributes which will be displayed
	 * as part of the log message and new logging
	 * event will be created to rewrite the log event
	 */
	@Override
	public LogEvent rewrite(final LogEvent event) {
		try {
			properties = LoggingUtil.getLoggingProperties(properties);
		} catch (IOException ioe) {
			LOGGER.error("IO Exception occured while fetching the logging attributes",ioe);
		}
		return new Log4jLogEvent(event.getLoggerName(), event.getMarker(), event.getFQCN(), event.getLevel(),
				event.getMessage(), event.getThrown(), properties, event.getContextStack(), event.getThreadName(),
				event.getSource(), event.getMillis());
	}
	
	/**
	 * The factory method to create the WdprPropertiesRewritePolicy
	 * @param config
	 * @param props
	 * @return
	 */
	 @PluginFactory
	 public static WdprPropertiesRewritePolicy createPolicy(@PluginConfiguration final Configuration config,
	                                                        @PluginElement("Properties") final Property[] props) {
	 if (props == null || props.length == 0) {
	     LOGGER.error("Properties must be specified for the WdprPropertiesRewritePolicy");
	     return null;
	 }
	   final List<Property> properties = Arrays.asList(props);
	   return new WdprPropertiesRewritePolicy(config, properties);
	 }

	 @Override
	 public String toString() {
	   final StringBuilder sb = new StringBuilder();
	   sb.append(" {");
	   boolean first = true;
	   for (final Map.Entry<String, String> entry : properties.entrySet()) {
		   if (!first) {
			   sb.append(", ");
		   }
		   sb.append(entry.getKey()).append('=').append(entry.getValue());
		   first = false;
	   }
	   sb.append('}');
	   return sb.toString();
	 }
}
