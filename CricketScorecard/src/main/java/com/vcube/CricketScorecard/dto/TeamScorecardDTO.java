package com.vcube.CricketScorecard.dto;

import java.util.List;

import lombok.Data;

@Data
public class TeamScorecardDTO {

	 private Integer teamId;
	    private String teamName;

	    private Integer totalRuns;
	    private Integer wickets;
	    private String overs;
	    private Integer extras;

	    private List<BattingscorecardDTO> batting;

	    private List<BowlingScorecardDTO> bowling;
}
