package com.vcube.CricketScorecard.dto;

import java.util.List;

import lombok.Data;

@Data
public class MatchPlayerDTO {

	private Integer matchId;
	
	private List<Integer> playerIds;
}
