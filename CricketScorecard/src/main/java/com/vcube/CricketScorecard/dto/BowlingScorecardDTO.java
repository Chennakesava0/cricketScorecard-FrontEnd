package com.vcube.CricketScorecard.dto;

import lombok.Data;

@Data
public class BowlingScorecardDTO {

	private Integer playerId;
	
	private String playerName;
	
	private String overs;
	
	private Integer runsConceded;
	
	private Integer wickets;
	
	private Double economyRate;
	
}
