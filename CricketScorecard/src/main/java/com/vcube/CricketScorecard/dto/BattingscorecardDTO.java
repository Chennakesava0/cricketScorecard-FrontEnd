package com.vcube.CricketScorecard.dto;

import lombok.Data;

@Data
public class BattingscorecardDTO {

	private Integer playerId;
	
	private String playerName;
	
	private Integer runs;
	
	private Integer balls;
	
	private Integer fours;
	
	private Integer sixes;
	
	private Double strikeRate;
	
	private String dismissalType;
}
