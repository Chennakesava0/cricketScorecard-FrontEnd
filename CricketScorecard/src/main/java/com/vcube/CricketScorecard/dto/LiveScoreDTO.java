package com.vcube.CricketScorecard.dto;

import lombok.Data;

@Data
public class LiveScoreDTO {

	private Integer totalRuns;
	
	private Integer totalWickets;
	
	private String overs;
	
	private Double currentRunRate;
	
	private Double requiredRunRate;
	
	private Integer target;
	
	private Integer runsRequired;
	
	private Integer ballsRemaining;
	
}
