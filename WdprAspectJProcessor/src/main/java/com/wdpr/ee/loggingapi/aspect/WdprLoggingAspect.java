package com.wdpr.ee.loggingapi.aspect;


import java.util.Iterator;
import java.util.LinkedList;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.apache.logging.log4j.ThreadContext;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.After;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Pointcut;
import org.aspectj.lang.annotation.SuppressAjWarnings;
import org.codehaus.jackson.annotate.JsonAutoDetect.Visibility;
import org.codehaus.jackson.annotate.JsonMethod;
import org.codehaus.jackson.map.ObjectMapper;

import com.wdpr.ee.loggingapi.annotation.WdprFieldAuditLog;
import com.wdpr.ee.loggingapi.annotation.WdprMethodLog;
import com.wdpr.ee.loggingapi.perf.PerformanceFlowInfo;

@Aspect
public class WdprLoggingAspect{	
	private static final Logger logger = LogManager	.getLogger(WdprLoggingAspect.class);
	
	private ObjectMapper  mapper= new ObjectMapper();

	
	@Pointcut("execution( * *(..))")
	public void logPointcut(){}	
	
	@Pointcut("set(* *) && args(newValue)")
	public void fieldAudit(Object newValue){}
	
	/**
	 * This method will used @around Advice to inject the time taken
	 * for executing the method flow based on the
	 * defined Pointcut.
	 * @param joinPoint
	 * @return
	 * @throws Throwable
	 */
	@Around("logPointcut() && @annotation(methodLogging)")
	@SuppressAjWarnings({"adviceDidNotMatch"})
	public Object logTime(ProceedingJoinPoint  joinPoint, WdprMethodLog methodLogging) throws Throwable{  
		 LinkedList<String> methodTime = new LinkedList<String>();
		long start = System.currentTimeMillis();
		Object result =  joinPoint.proceed();
		LinkedList<String> perfTime = perfLoggingTime(joinPoint, (System.currentTimeMillis() - start),methodTime);
		Iterator<String> methodPointCut = perfTime.descendingIterator();
		mapper.setVisibility(JsonMethod.ALL, Visibility.ANY);
		if(methodPointCut.hasNext()){
			String str = methodPointCut.next();
			int idx = str.indexOf(",");
			PerformanceFlowInfo perfFlow = new PerformanceFlowInfo(str.substring(0, idx), Integer.valueOf(str.substring(idx+1, str.length())));
			while (methodPointCut.hasNext()) {
		         str = methodPointCut.next();
		         idx = str.indexOf(",");
		         perfFlow.addSignificantMethod(new PerformanceFlowInfo(str.substring(0, idx), Integer.valueOf(str.substring(idx+1, str.length()))));
		         
			}
			if (ThreadContext.get("totalTime") != null) {
				ThreadContext.put("totalTime", ThreadContext.get("totalTime")
						+ mapper.writeValueAsString(perfFlow));
			} else {
				ThreadContext.put("totalTime",
						mapper.writeValueAsString(perfFlow));
			}
		}
		
		
		
        return result;
    }
	
	/**
	 * Method will add the time taken by each Join Point's
	 * execution and placed into a collection object.
	 * @param joinPoint
	 * @param timeTaken
	 * @param methodTime 
	 * @return
	 */
	private LinkedList<String> perfLoggingTime(ProceedingJoinPoint joinPoint, long timeTaken, LinkedList<String> methodTime){
		methodTime.add(joinPoint.getSignature().getDeclaringTypeName()+" "+joinPoint.getSignature().getName()+","+timeTaken);
		return methodTime;
	}
	
	/**
	 * Method will log the field change value
	 * 
	 */
	@After("fieldAudit(newValue) && @annotation(fieldLog)")
	@SuppressAjWarnings({"adviceDidNotMatch"})
	public void fieldAuditLog(JoinPoint joinPoint, WdprFieldAuditLog fieldLog, Object newValue){
		logger.info("The value of "+joinPoint.getSignature().getName()+" field is:="+newValue);
	}
}
