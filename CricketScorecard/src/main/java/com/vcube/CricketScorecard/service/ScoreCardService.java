package com.vcube.CricketScorecard.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.vcube.CricketScorecard.dto.BattingscorecardDTO;
import com.vcube.CricketScorecard.dto.BowlingScorecardDTO;
import com.vcube.CricketScorecard.dto.LiveScoreDTO;
import com.vcube.CricketScorecard.dto.MatchResultDTO;
import com.vcube.CricketScorecard.model.BallScore;
import com.vcube.CricketScorecard.model.Match;
import com.vcube.CricketScorecard.repository.BallScoreRepository;
import com.vcube.CricketScorecard.repository.MatchRepository;

@Service
public class ScoreCardService {

	@Autowired
	BallScoreRepository ballScoreRepository;
	
	@Autowired
	MatchRepository matchRepository;
	
	public LiveScoreDTO getLiveScore(Integer matchId,
			                         Integer target,
			                         Integer totalOvers) {
		List<BallScore> ballss = 
				ballScoreRepository.findByMatch_MatchIdOrderByOverNoAscBallNoAsc(matchId);
		
		LiveScoreDTO dto = new LiveScoreDTO();
		
		int totalRuns = 0;
		int wickets = 0;
		int legalBalls = 0;
		
		for(BallScore ball : ballss) {
			
			totalRuns += ball.getRuns();
			totalRuns += ball.getExtras();
			
			if(ball.getWicketType() !=null
					&& ! ball.getWicketType().name().equals("NOT_OUT")) {
				
				wickets++;
			}
			
			if(ball.getBallType().name().equals("NORMAL")
					|| ball.getBallType().name().equals("BYE")
					|| ball.getBallType().name().equals("LEG_BYE")) {
				
				legalBalls++;
			}
		}
		
		int overs = legalBalls / 6;
		int balls = legalBalls % 6;
		
		double currentRunRate =
				legalBalls == 0 ? 0:(totalRuns * 6.0)/legalBalls;
		
		dto.setTotalRuns(totalRuns);
		dto.setTotalWickets(wickets);
		dto.setOvers(overs + "." + balls);
		dto.setCurrentRunRate(
				Math.round(currentRunRate * 100.0)/100.0);
		
		// requiredRunRate Calucaltion 
		
		if(target != null) {
			int totalBalls = totalOvers *6;
			int ballsRemaining = totalBalls - legalBalls;
			int runsRequired = target - totalRuns;
			
			double requiredRunRate = 0;
			
			if(ballsRemaining > 0) {
				requiredRunRate = (runsRequired * 6.0)/ballsRemaining;
			}
			
			dto.setTarget(target);
			dto.setRunsRequired(Math.max(runsRequired, 0));
			dto.setBallsRemaining(Math.max(ballsRemaining, 0));
			dto.setRequiredRunRate(
					Math.round(requiredRunRate *100.0)/100.0);
		}
		
		return dto;
			
	}
	
	 public MatchResultDTO getMatchResult(Integer matchId) {

	        Match match =
	                matchRepository.findById(matchId)
	                               .orElseThrow();

	        MatchResultDTO dto = new MatchResultDTO();

	        dto.setWinnerTeam(match.getWinner());

	        if (match.getWinner() != null) {

	            if (match.getWinner()
	                    .equals(match.getTeam1().getTeamName())) {

	                dto.setLoserTeam(
	                        match.getTeam2().getTeamName());

	            } else {

	                dto.setLoserTeam(
	                        match.getTeam1().getTeamName());
	            }

	            dto.setResult(
	                    match.getWinner() + " Won The Match");
	        }

	        dto.setWinningMargin(0);
	        dto.setMarginType("RUNS");

	        dto.setMatchStatus(match.getStatus().name());
	        return dto;
	    }
	 
	 public List<BattingscorecardDTO> getBattingScorecard(Integer matchId) {

		    List<BallScore> balls =
		            ballScoreRepository.findByMatch_MatchIdOrderByOverNoAscBallNoAsc(matchId);

		    Map<Integer, BattingscorecardDTO> battingMap = new HashMap<>();

		    for (BallScore ball : balls) {

		        Integer playerId = ball.getBatsman().getId();

		        BattingscorecardDTO dto =
		                battingMap.getOrDefault(playerId,
		                        new BattingscorecardDTO());

		        dto.setPlayerId(playerId);
		        dto.setPlayerName(ball.getBatsman().getPlayerName());

		        // Runs
		        dto.setRuns(
		                (dto.getRuns() == null ? 0 : dto.getRuns())
		                        + ball.getRuns());

		        // Balls Faced
		        if (ball.getBallType().name().equals("NORMAL")
		                || ball.getBallType().name().equals("BYE")
		                || ball.getBallType().name().equals("LEG_BYE")) {

		            dto.setBalls(
		                    (dto.getBalls() == null ? 0 : dto.getBalls()) + 1);
		        }

		        // Sixes
		        if (ball.getRuns() == 6) {

		            dto.setSixes(
		                    (dto.getSixes() == null ? 0 : dto.getSixes()) + 1);
		        }

		        // Strike Rate
		        int runs = dto.getRuns() == null ? 0 : dto.getRuns();
		        int ballsFaced = dto.getBalls() == null ? 0 : dto.getBalls();

		        double strikeRate =
		                ballsFaced == 0 ? 0 :
		                        (runs * 100.0) / ballsFaced;

		        dto.setStrikeRate(
		                Math.round(strikeRate * 100.0) / 100.0);

		        // Dismissal Type
		        if (ball.getWicketType() != null
		                && !ball.getWicketType().name().equals("NOT_OUT")) {

		            dto.setDismissalType(
		                    ball.getWicketType().name());
		        }

		        battingMap.put(playerId, dto);
		    }

		    // Players still batting
		    battingMap.values().forEach(dto -> {
		        if (dto.getDismissalType() == null) {
		            dto.setDismissalType("NOT OUT");
		                
		        }
		    });

		    return new ArrayList<>(battingMap.values());
		}
	 
	 public List<BowlingScorecardDTO> getBowlingScorecard(Integer matchId) {

		    List<BallScore> balls =
		            ballScoreRepository.findByMatch_MatchIdOrderByOverNoAscBallNoAsc(matchId);

		    Map<Integer, BowlingScorecardDTO> bowlingMap = new HashMap<>();

		    Map<Integer, Integer> legalBallsMap = new HashMap<>();

		    for (BallScore ball : balls) {

		        Integer bowlerId = ball.getBowler().getId();

		        BowlingScorecardDTO dto =
		                bowlingMap.getOrDefault(bowlerId,
		                        new BowlingScorecardDTO());

		        dto.setPlayerId(bowlerId);
		        dto.setPlayerName(ball.getBowler().getPlayerName());

		        // Runs Conceded
		        dto.setRunsConceded(
		                (dto.getRunsConceded() == null ? 0 : dto.getRunsConceded())
		                        + ball.getRuns()
		                        + ball.getExtras());

		        // Wickets
		        if (ball.getWicketType() != null
		                && !ball.getWicketType().name().equals("NOT_OUT")) {

		            dto.setWickets(
		                    (dto.getWickets() == null ? 0 : dto.getWickets()) + 1);
		        }

		        // Legal Balls
		        if (ball.getBallType().name().equals("NORMAL")
		                || ball.getBallType().name().equals("BYE")
		                || ball.getBallType().name().equals("LEG_BYE")) {

		            legalBallsMap.put(
		                    bowlerId,
		                    legalBallsMap.getOrDefault(bowlerId, 0) + 1);
		        }

		        int legalBalls = legalBallsMap.getOrDefault(bowlerId, 0);

		        int overs = legalBalls / 6;
		        int ballsRemaining = legalBalls % 6;

		        dto.setOvers(overs + "." + ballsRemaining);

		        // Economy Rate
		        double economy =
		                legalBalls == 0 ? 0 :
		                        (dto.getRunsConceded() * 6.0) / legalBalls;

		        dto.setEconomyRate(
		                Math.round(economy * 100.0) / 100.0);

		        bowlingMap.put(bowlerId, dto);
		    }

		    return new ArrayList<>(bowlingMap.values());
		}
	
}
