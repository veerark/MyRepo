package com.wdpr.ee.loggingapi.annotation;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;
/**
 * This annotation will be used
 * by different class methods to log
 * the perfromance boundary logging for
 * that particular method.
 * @author kannv004
 *
 */
@Retention(RetentionPolicy.RUNTIME)
@Target(value = { ElementType.METHOD})
public @interface WdprMethodLog {

	 boolean entry() default true;
	 boolean exit() default true;
}
