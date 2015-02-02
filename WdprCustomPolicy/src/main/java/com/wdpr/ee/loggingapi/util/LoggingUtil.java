package com.wdpr.ee.loggingapi.util;

import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.HashMap;
import java.util.Map;
import java.util.Properties;
import java.util.Set;

import com.wdpr.ee.loggingapi.util.FileConstants;

/**
 * This class with add the extra logging
 * attributes which will be added to the 
 * logging statements 
 * @author KANNV004
 *
 */
public class LoggingUtil {
	private static Properties props;
	
	/**
	 * Method will get the logging
	 * attributes which needs to be logged
	 * along with the log message(s) from 
	 * the property file
	 * and added it to the Map.
	 * @param paramMap
	 * @return
	 * @throws IOException 
	 */
	public static Map<String, String> getLoggingProperties(Map<String, String> paramMap) throws IOException{
		String value = null;
		Properties props = loadPropertiesFile(FileConstants.WDPR_POLICY_REWRITE_PROPERTIES_FILE);
		if(paramMap!= null && !paramMap.isEmpty()){
		for(Map.Entry<String, String> mapEntry : paramMap.entrySet()){
		  if(mapEntry.getValue().equalsIgnoreCase(FileConstants.EMPTY_STRING)){
			value = props.getProperty(mapEntry.getKey());
			if(value != null && !value.equalsIgnoreCase(FileConstants.EMPTY_STRING)){
			  paramMap.put(mapEntry.getKey(), value);
			}
		  }
		 }
		}else{
			paramMap = new HashMap<String, String>();
			Set<String> propertyNames = props.stringPropertyNames();
			 for (String Property : propertyNames) {
				 paramMap.put(Property, props.getProperty(Property));
			 } 		 
		}
		return paramMap;
	}
	
	/**
	 * Method to read the Properties file
	 * @return
	 * @throws IOException
	 */
	private static Properties loadPropertiesFile(String filePath) throws IOException{
		if(props != null){
			return props;
		} else{
		   InputStream propFile;
		   filePath = System.getProperty(filePath);
		   if(filePath == null){
			   propFile = LoggingUtil.class.getClassLoader().getResourceAsStream(FileConstants.WDPR_CUSTOM_PROPERTY_FILE);
		   } else{
			   propFile = new FileInputStream(filePath);   
		   }
		  props = new Properties();
          props.load(propFile);
		}
          return props;
	}
	
	/**
	 * Method to read the value for a given key from
	 * System or environment or properties file.
	 * @param key
	 * @return
	 * @throws IOException 
	 */
	public static String getWdprPropertyValue(String key) throws IOException
	{
		if (System.getProperty(key) != null)
		{
			return System.getProperty(key);
		}
		else if (System.getenv().get(key) != null)
		{
			return System.getenv().get(key);
		}
		else
		{
			Properties properties = loadPropertiesFile(FileConstants.WDPR_PROPERTIES_LOOKUP_FILE);
			return properties.getProperty(key);
			
		}
	}

}
