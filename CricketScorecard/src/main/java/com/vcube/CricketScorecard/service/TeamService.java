package com.vcube.CricketScorecard.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.vcube.CricketScorecard.model.Team;
import com.vcube.CricketScorecard.repository.TeamRepository;

@Service
public class TeamService {

	@Autowired
	TeamRepository teamRepository;
	
	public Team saveTeam(Team team) {
		return teamRepository.save(team);
	}
	
	public List<Team> getAllTeams(){
		return teamRepository.findAll();
	}
}
