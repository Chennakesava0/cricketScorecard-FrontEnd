package com.vcube.CricketScorecard.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.vcube.CricketScorecard.enums.MatchStatus;
import com.vcube.CricketScorecard.model.Match;
import com.vcube.CricketScorecard.repository.MatchRepository;

@Service
public class MatchService {

	@Autowired
	MatchRepository matchRepository;

	public Match saveMatch(Match match) {
		return matchRepository.save(match);
	}

	public List<Match> getAllMatches() {
		return matchRepository.findAll();
	}

	public Match getMatchById(Integer id) {
		return matchRepository.findById(id).orElseThrow();
	}

	public Match updateMatch(Integer id, Match updateMatch) {

		Match match = matchRepository.findById(id).orElseThrow();

		match.setTeam1(updateMatch.getTeam1());
		match.setTeam2(updateMatch.getTeam2());
		match.setMatchDate(updateMatch.getMatchDate());
		match.setVenue(updateMatch.getVenue());
		match.setTotalOvers(updateMatch.getTotalOvers());
		 match.setTarget(updateMatch.getTarget()); 
		match.setStatus(updateMatch.getStatus());
		match.setTossWinner(updateMatch.getTossWinner());
		match.setElectedTo(updateMatch.getElectedTo());
		match.setWinner(updateMatch.getWinner());

		return matchRepository.save(match);

	}

	public void deleteMatchById(Integer id) {
		matchRepository.deleteById(id);
	}
	
	public List<Match> getCompletedMatches() {
	    return matchRepository.findByStatus(MatchStatus.COMPLETED);
	}
}
