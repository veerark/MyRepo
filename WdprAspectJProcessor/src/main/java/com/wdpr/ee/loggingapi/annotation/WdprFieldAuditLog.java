package com.wdpr.ee.loggingapi.annotation;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * This annotation will be used
 * by different variable instances to log
 * the changed value of the varaible.
 * @author kannv004
 *
 */

@Retention(RetentionPolicy.RUNTIME)
@Target({ElementType.FIELD})
public @interface WdprFieldAuditLog {

}
