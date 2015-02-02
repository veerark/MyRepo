package com.wdpr.ee.loggingapi.appender;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;


public class TestClass {
	private static final Logger logger = LogManager.getLogger(TestClass.class.getName());
	public static void main(String[] a) throws Exception{
		logger.info("Testing rewrite policy");
		logger.debug("Testing rewrite policy");
	}

}
