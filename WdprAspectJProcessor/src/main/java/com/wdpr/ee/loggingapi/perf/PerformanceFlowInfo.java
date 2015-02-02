package com.wdpr.ee.loggingapi.perf;

import java.util.ArrayList;
import java.util.List;


public class PerformanceFlowInfo {

	private String entryMethodName;
	private Integer duration;
	private List<PerformanceFlowInfo> significantMethods = new ArrayList<PerformanceFlowInfo>();


	
	public PerformanceFlowInfo(String entryMethodName, Integer duration) {
		super();
		this.entryMethodName = entryMethodName;
		this.duration = duration;
	}
	
	public boolean addSignificantMethod(PerformanceFlowInfo pfi) {
		if(pfi != null) {
			return significantMethods.add(pfi);
		}
		return false;
	}
	
	
	@Override
	public String toString() {
		return "PerformanceFlowInfo [entryMethodName=" + entryMethodName
				+ ", duration=" + duration + ", significantMethods="
				+ significantMethods + "]";
	}
	
}
