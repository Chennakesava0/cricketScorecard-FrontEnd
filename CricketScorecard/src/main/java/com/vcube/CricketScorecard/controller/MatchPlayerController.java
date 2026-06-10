package com.vcube.CricketScorecard.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.vcube.CricketScorecard.dto.MatchPlayerDTO;
import com.vcube.CricketScorecard.model.MatchPlayer;
import com.vcube.CricketScorecard.service.MatchPlayerService;

@RestController
@CrossOrigin("*")
public class MatchPlayerController {

	@Autowired
	MatchPlayerService matchPlayerService;
	
	@PostMapping("/save-playing11")
	public List<MatchPlayer> savePlayer11(@RequestBody MatchPlayerDTO dto){
		return matchPlayerService.savePlayers11(dto);
	}
	
	@GetMapping("/playing11{matchId}")
	public List<MatchPlayer> getPlayers11(@PathVariable Integer matchId){
		return matchPlayerService.getPlayers11(matchId);
	}
}
