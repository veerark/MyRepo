package com.wdpr.ee.loggingapi.aspect;

import java.util.UUID;

import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpServletRequest;

import org.apache.http.HttpRequest;
import org.apache.logging.log4j.ThreadContext;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.Before;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Pointcut;
import org.aspectj.lang.annotation.SuppressAjWarnings;

@Aspect
public class WdprCorrelationAspect {
	public final static String HTTP_CORRELATION_ID = "X-CorrelationId";
	public final static String CORRELATION_ID = "Correlation-Id";	
	
	/**
	 * Pointcut for apache CXf and spring MVC
	 */
	@Pointcut("(execution(protected  void org.springframework.web.servlet.FrameworkServlet.do*(javax.servlet.http.HttpServletRequest, javax.servlet..http.HttpServletResponse)) && within(org.springframework.web.servlet.FrameworkServlet)) "
			+ " || execution(public void org.apache.cxf.transport.servlet.AbstractHTTPServlet.service(javax.servlet.ServletRequest , javax.servlet.ServletResponse ))")
	@SuppressAjWarnings({"invalidAbsoluteTypeName"})	
	public  void correlationPointcut()
	{
		
	}
	
	/**
	 * Advice code to inject correlationId for apache CXf and spring MVC
	 * @param jp
	 * @throws Throwable
	 */
	@Before("correlationPointcut()")
	@SuppressAjWarnings({"adviceDidNotMatch"})
	public void injectCorrelationId(JoinPoint jp) throws Throwable
	{
	   
		// Check for an existing correlation id in the incoming request header and use for the outgoing request header
		// If correlationId is not in the incoming request header, then check the local ThreadContext and use for outgoing request header
		// If correlationId is not foind in either, then generate a new one and use for the outgoing request header
		String correlationValue = ((HttpServletRequest)jp.getArgs()[0]).getHeader(HTTP_CORRELATION_ID);
		
		// Use the incoming value if present
		if (correlationValue == null) 
		{
			String currThreadCorrleationId = ThreadContext.get(CORRELATION_ID);
			correlationValue = (currThreadCorrleationId != null) ? currThreadCorrleationId : UUID.randomUUID().toString();
		}
				
		HttpServletResponse response = ((HttpServletResponse)jp.getArgs()[1]);
		response.setHeader(HTTP_CORRELATION_ID, correlationValue);
    }
	
	/**
	 * Pointcut for apache http client
	 */
	@Pointcut ("execution (*  org.apache.http.client.HttpClient.execute(org.apache.http.client.methods.HttpUriRequest))  ")
	public void correlationApachePointcut()
	{
		
	}
	
	/**
	 * Advice to inject correlationId for apache http client
	 * @param jp
	 * @throws Throwable
	 */
	@Before("correlationApachePointcut()")
	@SuppressAjWarnings({"adviceDidNotMatch"})
	public void injectCorrelationIdApache(JoinPoint jp) throws Throwable
	{
		//Use the current thread's value
	    String correlationValue = ThreadContext.get(CORRELATION_ID);
		
	    if (correlationValue == null) 
		{
			correlationValue = UUID.randomUUID().toString();
		}
		
		HttpRequest request = ((HttpRequest)jp.getArgs()[0]);
		if (request != null)
		{
		    request.addHeader(HTTP_CORRELATION_ID, correlationValue);
		}
    }
}
