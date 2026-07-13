package com.vcube.CricketScorecard.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.vcube.CricketScorecard.dto.MatchResultDTO;
import com.vcube.CricketScorecard.enums.MatchStatus;
import com.vcube.CricketScorecard.model.Match;
import com.vcube.CricketScorecard.repository.MatchRepository;
import com.vcube.CricketScorecard.repository.MatchStateRepository;

@Service
public class MatchService {

	@Autowired
	MatchRepository matchRepository;
	
	@Autowired
	MatchStateRepository matchStateRepository;
	
	@Autowired
	private ScoreCardService scoreCardService;

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
		match.setMatchTime(updateMatch.getMatchTime());
		match.setVenue(updateMatch.getVenue());
		match.setTotalOvers(updateMatch.getTotalOvers()); 
		match.setStatus(updateMatch.getStatus());
		match.setTossWinner(updateMatch.getTossWinner());
		match.setElectedTo(updateMatch.getElectedTo());
		match.setWinner(updateMatch.getWinner());

		return matchRepository.save(match);

	}

	public void deleteMatchById(Integer id) {
		matchRepository.deleteById(id);
	}
	
	
	public long getTotalMatches() {
	    return matchRepository.count();
	}
	
	public List<Match> getUpcomingMatches() {
	    return matchRepository.findByStatus(MatchStatus.UPCOMING);
	}

	public List<Match> getLiveMatches() {
	    return matchRepository.findByStatus(MatchStatus.LIVE);
	}

	public List<MatchResultDTO> getCompletedMatches() {

	    List<Match> matches =
	            matchRepository.findByStatus(MatchStatus.COMPLETED);

	    List<MatchResultDTO> result = new ArrayList<>();

	    for (Match match : matches) {

	    	MatchResultDTO dto = scoreCardService.getMatchResult(match.getMatchId());

	        result.add(dto);
	    }

	    return result;
	}
}
