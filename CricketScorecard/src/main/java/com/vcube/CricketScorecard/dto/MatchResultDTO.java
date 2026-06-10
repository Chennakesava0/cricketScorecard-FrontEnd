package com.vcube.CricketScorecard.dto;

import lombok.Data;

@Data
public class MatchResultDTO {

	private String winnerTeam;
	
	private String loserTeam;
	
	private String result;
	
	private Integer winningMargin;
	
    private String marginType; // RUNS or WICKETS
	
	private String matchStatus;
}
