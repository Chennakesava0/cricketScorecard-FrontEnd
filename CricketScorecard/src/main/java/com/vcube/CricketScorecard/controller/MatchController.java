package com.vcube.CricketScorecard.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.vcube.CricketScorecard.model.Match;
import com.vcube.CricketScorecard.service.MatchService;

@RestController
@CrossOrigin("*")
public class MatchController {

	@Autowired
	MatchService matchService;

	@PostMapping("/saveMatch")
	public Match saveMatch(@RequestBody Match match) {
		return matchService.saveMatch(match);
	}

	@GetMapping("/getAllMatches")
	public List<Match> getAllMatches() {
		return matchService.getAllMatches();
	}

	@GetMapping("/getMatchById/{id}")
	public Match getMatchById(@PathVariable Integer id) {
		return matchService.getMatchById(id);
	}

	@PutMapping("/updateMatch/{id}")
	public Match updateMatch(@PathVariable Integer id, @RequestBody Match match) {
		return matchService.updateMatch(id, match);
	}

	@DeleteMapping("/deleteMatchById/{id}")
	public String deleteMatchById(@PathVariable Integer id) {
		matchService.deleteMatchById(id);

		return "Match Deleted Successfully";

	}

	@GetMapping("/getCompletedMatches")
	public List<Match> getCompletedMatches() {
		return matchService.getCompletedMatches();
	}

}
