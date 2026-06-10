package com.vcube.CricketScorecard.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.vcube.CricketScorecard.dto.DashboardDTO;
import com.vcube.CricketScorecard.enums.MatchStatus;
import com.vcube.CricketScorecard.repository.MatchRepository;
import com.vcube.CricketScorecard.repository.PlayerRepository;
import com.vcube.CricketScorecard.repository.TeamRepository;

@Service
public class DashboardService {

	@Autowired
	PlayerRepository playerRepository;
	
	@Autowired
	TeamRepository teamRepository;
	
	@Autowired
	MatchRepository matchRepository;
	
	public DashboardDTO getDashboardData() {
		
		DashboardDTO dto = new DashboardDTO();
		
		dto.setTotalTeams(teamRepository.count());
		dto.setTotalPlayers(playerRepository.count());
		dto.setTotalMatches(matchRepository.count());
		
		 dto.setUpcomingMatches(
	                matchRepository.countByStatus(MatchStatus.UPCOMING));

	        dto.setLiveMatches(
	                matchRepository.countByStatus(MatchStatus.LIVE));

	        dto.setCompletedMatches(
	                matchRepository.countByStatus(MatchStatus.COMPLETED));
		
		return dto;
	}
}
