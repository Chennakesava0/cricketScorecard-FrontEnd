package com.vcube.CricketScorecard.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.vcube.CricketScorecard.dto.StartMatchDTO;
import com.vcube.CricketScorecard.model.MatchState;
import com.vcube.CricketScorecard.service.MatchStateService;

@RestController
@CrossOrigin("*")
public class MatchStateController {

	@Autowired
	MatchStateService matchStateService;
	
	@PostMapping("/start")
	public MatchState startMatch(@RequestBody StartMatchDTO dto) {
		return matchStateService.startMatch(dto);
	}
	
	@GetMapping("/matchState/{matchId}")
	public MatchState getMatchState(@PathVariable Integer matchId) {
		return matchStateService.getMatchState(matchId);
	}
	
	@PutMapping("/updatePlayers/{matchId}")
	public MatchState updatePlayers(
	        @PathVariable Integer matchId,
	        @RequestBody MatchState state){

	    return matchStateService.updateCurrentPlayers(
	            matchId,
	            state.getStrikerId(),
	            state.getNonStrikerId(),
	            state.getCurrentBowlerId()
	    );
	}
}
