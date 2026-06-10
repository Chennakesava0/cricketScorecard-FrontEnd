package com.vcube.CricketScorecard.dto;

import lombok.Data;

@Data
public class DashboardDTO {

	private Long totalTeams;
	
	private Long totalPlayers;
	
	private Long totalMatches;
	
	private Long UpcomingMatches;
	
	private Long liveMatches;
	
	private Long completedMatches;
}
