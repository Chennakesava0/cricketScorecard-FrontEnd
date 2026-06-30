package com.vcube.CricketScorecard.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.vcube.CricketScorecard.dto.StartMatchDTO;
import com.vcube.CricketScorecard.enums.MatchStatus;
import com.vcube.CricketScorecard.model.Match;
import com.vcube.CricketScorecard.model.MatchState;
import com.vcube.CricketScorecard.repository.MatchRepository;
import com.vcube.CricketScorecard.repository.MatchStateRepository;

@Service
public class MatchStateService {

	@Autowired
	MatchRepository matchRepository;
	
	@Autowired
	MatchStateRepository matchStateRepository;
	
	public MatchState startMatch(StartMatchDTO dto) {

	    Match match = matchRepository.findById(dto.getMatchId())
	            .orElseThrow(() -> new RuntimeException("Match NOT Found"));

	    if(match.getStatus() == MatchStatus.LIVE) {
	        throw new RuntimeException("Match Already Started");
	    }

	    if(match.getStatus() == MatchStatus.COMPLETED) {
	        throw new RuntimeException("Match Already Completed");
	    }

	    MatchState state = new MatchState();

	    state.setMatch(match);
	    

	    state.setStrikerId(dto.getStrikerId());         
	    state.setNonStrikerId(dto.getNonStrikerId());   
	    state.setCurrentBowlerId(dto.getBowlerId());    
	    state.setTotalRuns(0);
	    state.setWickets(0);
	    state.setTotalBalls(0);
	    state.setInnings(1);
	    state.setFirstInningsRuns(0);
	    state.setFirstInningsWickets(0);
	    state.setTarget(0);
	    state.setMatchCompleted(false);

	    MatchState savedState = matchStateRepository.save(state);

	    match.setStatus(MatchStatus.LIVE);
	    matchRepository.save(match);

	    return savedState;
	}
	
	public MatchState getMatchState(Integer matchId) {
		
		return matchStateRepository.findByMatchMatchId(matchId)
				.orElseThrow(() -> new RuntimeException("Match State Not Found"));
	}
	
	public MatchState updateCurrentPlayers(
	        Integer matchId,
	        Integer strikerId,
	        Integer nonStrikerId,
	        Integer bowlerId) {

	    MatchState state = matchStateRepository
	            .findByMatchMatchId(matchId)
	            .orElseThrow(() -> new RuntimeException("Match State Not Found"));

	    state.setStrikerId(strikerId);
	    state.setNonStrikerId(nonStrikerId);
	    state.setCurrentBowlerId(bowlerId);

	    return matchStateRepository.save(state);
	}
}
