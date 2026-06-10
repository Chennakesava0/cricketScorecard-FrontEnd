package com.vcube.CricketScorecard.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.vcube.CricketScorecard.model.Team;
import com.vcube.CricketScorecard.service.TeamService;

@RestController
@CrossOrigin("*")
public class TeamController {

	@Autowired
	TeamService teamService;
	
	@PostMapping("/saveTeam")
	public Team saveTeam(@RequestBody Team team) {
		return teamService.saveTeam(team);
	}
	
	@GetMapping("/getAllTeams")
	public List<Team> getAllTeams(){
		return teamService.getAllTeams();
	}
}
