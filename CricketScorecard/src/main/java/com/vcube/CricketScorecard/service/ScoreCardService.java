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
import com.vcube.CricketScorecard.dto.TeamScorecardDTO;
import com.vcube.CricketScorecard.enums.BallType;
import com.vcube.CricketScorecard.model.BallScore;
import com.vcube.CricketScorecard.model.Match;
import com.vcube.CricketScorecard.model.MatchPlayer;
import com.vcube.CricketScorecard.model.MatchState;
import com.vcube.CricketScorecard.model.Player;
import com.vcube.CricketScorecard.repository.BallScoreRepository;
import com.vcube.CricketScorecard.repository.MatchPlayerRepository;
import com.vcube.CricketScorecard.repository.MatchRepository;
import com.vcube.CricketScorecard.repository.MatchStateRepository;

@Service
public class ScoreCardService {

	@Autowired
	BallScoreRepository ballScoreRepository;
	
	@Autowired
	private MatchStateRepository matchStateRepository;
	
	@Autowired
	MatchRepository matchRepository;
	
	@Autowired
	private MatchPlayerRepository matchPlayerRepository;
	
	public LiveScoreDTO getLiveScore(Integer matchId,
			                         Integer target,
			                         Integer totalOvers) {
		
		MatchState state =
			    matchStateRepository.findByMatchMatchId(matchId)
			        .orElseThrow();
		
		List<BallScore> ballss = 
				ballScoreRepository.findByMatch_MatchIdOrderByOverNoAscBallNoAsc(matchId);
		
		
		LiveScoreDTO dto = new LiveScoreDTO();
		
		int totalRuns = 0;
		int wickets = 0;
		int legalBalls = 0;
		
		for(BallScore ball : ballss) {
			
			int runs = ball.getRuns() == null ? 0 : ball.getRuns();
			int extras = ball.getExtras() == null ? 0 : ball.getExtras();

			totalRuns += runs + extras;
			
			if(ball.getWicketType() !=null
					&& ! ball.getWicketType().name().equals("NOT_OUT")) {
				
				wickets++;
			}
			
			if(ball.getBallType() == BallType.NORMAL
			        || ball.getBallType() == BallType.BYE
			        || ball.getBallType() == BallType.LEG_BYE) {

			    legalBalls++;
			}
		}
		
		int overs = legalBalls / 6;
		int balls = legalBalls % 6;
		
		double currentRunRate =
				legalBalls == 0 ? 0:(totalRuns * 6.0)/legalBalls;
		
		if(state.getInnings() == 2) {

		    dto.setInnings(2);

		    dto.setFirstInningsRuns(state.getFirstInningsRuns());
		    dto.setFirstInningsWickets(state.getFirstInningsWickets());

		    dto.setTotalRuns(state.getTotalRuns());
		    dto.setTotalWickets(state.getWickets());

		    dto.setTarget(state.getTarget());

		    // First innings overs
		    int firstBalls = state.getFirstInningsBalls() == null
		            ? 0
		            : state.getFirstInningsBalls();

		    dto.setFirstInningsOvers(
		            (firstBalls / 6) + "." + (firstBalls % 6)
		    );

		    // Second innings overs
		    int secondBalls = state.getTotalBalls() == null
		            ? 0
		            : state.getTotalBalls();

		    dto.setSecondInningsOvers(
		            (secondBalls / 6) + "." + (secondBalls % 6)
		    );

		    dto.setOvers(dto.getSecondInningsOvers());
		}
		
		dto.setCurrentRunRate(
				Math.round(currentRunRate * 100.0)/100.0);
		
		// requiredRunRate Calucaltion 
		
		if(target != null) {
			int totalBalls = totalOvers *6;
			int ballsRemaining = totalBalls - legalBalls;
			int runsRequired = Math.max(target - totalRuns, 0);
			
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

	    Match match = matchRepository.findById(matchId)
	            .orElseThrow(() -> new RuntimeException("Match not found"));

	    MatchState state = matchStateRepository.findByMatchMatchId(matchId)
	            .orElseThrow(() -> new RuntimeException("Match state not found"));

	    MatchResultDTO dto = new MatchResultDTO();

	    dto.setMatchId(match.getMatchId());

	    dto.setVenue(match.getVenue());

	    dto.setTeam1Name(match.getTeam1().getTeamName());
	    dto.setTeam2Name(match.getTeam2().getTeamName());

	    dto.setFirstInningsRuns(state.getFirstInningsRuns());
	    dto.setFirstInningsWickets(state.getFirstInningsWickets());
	    dto.setFirstInningsOvers(convertToOvers(state.getFirstInningsBalls()));

	    dto.setSecondInningsRuns(state.getSecondInningsRuns());
	    dto.setSecondInningsWickets(state.getSecondInningsWickets());
	    dto.setSecondInningsOvers(convertToOvers(state.getSecondInningsBalls()));

	    dto.setWinnerTeam(match.getWinner());

	    if (match.getWinner() != null) {

	        if (match.getWinner().equals(match.getTeam1().getTeamName())) {

	            dto.setLoserTeam(match.getTeam2().getTeamName());

	            int margin =
	                    state.getFirstInningsRuns()
	                  - state.getSecondInningsRuns();

	            dto.setWinningMargin(margin);
	            dto.setMarginType("RUNS");

	            dto.setResult(match.getWinner() + " won by " + margin + " runs");

	        } else {

	            dto.setLoserTeam(match.getTeam1().getTeamName());

	            int wicketsRemaining =
	                    10 - state.getSecondInningsWickets();

	            dto.setWinningMargin(wicketsRemaining);
	            dto.setMarginType("WICKETS");

	            dto.setResult(match.getWinner() + " won by "
	                    + wicketsRemaining + " wickets");
	        }
	    }

	    dto.setMatchStatus(match.getStatus().name());

	    return dto;
	}
	
	private String convertToOvers(Integer balls) {

	    if (balls == null) {
	        return "0.0";
	    }

	    int overs = balls / 6;
	    int remainingBalls = balls % 6;

	    return overs + "." + remainingBalls;
	}
	
	 
	 public List<BattingscorecardDTO> getBattingScorecard(Integer matchId,
                                                          Integer teamId,
                                                          Integer innings) {
		    List<BallScore> balls =
		            ballScoreRepository.findByMatch_MatchIdOrderByOverNoAscBallNoAsc(matchId);

		    Map<Integer, BattingscorecardDTO> battingMap = new HashMap<>();
		    
		    Map<Integer, Integer> battingOrder = new HashMap<>();

		    int order = 1;

		    for (BallScore ball : balls) {
		    	
		    	if (!ball.getBatsman().getTeam().getId().equals(teamId)
		    	        || !ball.getInnings().equals(innings)) {
		    	    continue;
		    	}

		        Integer playerId = ball.getBatsman().getId();
		        
		        if (!battingOrder.containsKey(playerId)) {
		            battingOrder.put(playerId, order++);
		        }

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
		        if ( ball.getBallType() == BallType.NORMAL
		                || ball.getBallType() == BallType.BYE
		                || ball.getBallType() == BallType.LEG_BYE ) {

		            dto.setBalls(
		                    (dto.getBalls() == null ? 0 : dto.getBalls()) + 1);
		        }
		        
		     // Fours
		        if (ball.getRuns() == 4) {

		            dto.setFours(
		                (dto.getFours() == null ? 0 : dto.getFours()) + 1);
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

		            switch (ball.getWicketType()) {

		            case CAUGHT:

		                if (ball.getFielder() != null) {
		                    dto.setDismissalType(
		                            "c " + ball.getFielder().getPlayerName()
		                            + " b " + ball.getBowler().getPlayerName());
		                } else {
		                    dto.setDismissalType(
		                            "c b " + ball.getBowler().getPlayerName());
		                }

		                break;

		                case BOWLED:
		                    dto.setDismissalType(
		                            "b " + ball.getBowler().getPlayerName());
		                    break;

		                case LBW:
		                    dto.setDismissalType(
		                            "lbw b " + ball.getBowler().getPlayerName());
		                    break;

		                case STUMPED:

		                    if (ball.getFielder() != null) {
		                        dto.setDismissalType(
		                                "st " + ball.getFielder().getPlayerName()
		                                + " b " + ball.getBowler().getPlayerName());
		                    } else {
		                        dto.setDismissalType(
		                                "st b " + ball.getBowler().getPlayerName());
		                    }

		                    break;

		                case RUN_OUT:

		                    if (ball.getFielder() != null) {
		                        dto.setDismissalType(
		                                "run out (" + ball.getFielder().getPlayerName() + ")");
		                    } else {
		                        dto.setDismissalType("run out");
		                    }

		                    break;

		                case RUN_OUT_NON_STRIKER:

		                    if (ball.getFielder() != null) {
		                        dto.setDismissalType(
		                                "run out (" + ball.getFielder().getPlayerName() + ")");
		                    } else {
		                        dto.setDismissalType("run out");
		                    }

		                    break;
		                    
		                default:
		                    dto.setDismissalType(
		                            ball.getWicketType().name());
		            }
		        }

		        battingMap.put(playerId, dto);
		    }

		    // Players still batting
		    battingMap.values().forEach(dto -> {
		        if (dto.getDismissalType() == null) {
		            dto.setDismissalType("NOT OUT");
		                
		        }
		    });

		    List<MatchPlayer> playing11 =
		            matchPlayerRepository.findByMatchMatchIdAndPlayerTeamId(matchId, teamId);

		    for (MatchPlayer matchPlayer : playing11) {

		        Player player = matchPlayer.getPlayer();

		        if (!battingMap.containsKey(player.getId())) {

		            BattingscorecardDTO dto = new BattingscorecardDTO();

		            dto.setPlayerId(player.getId());
		            dto.setPlayerName(player.getPlayerName());

		            dto.setRuns(0);
		            dto.setBalls(0);
		            dto.setFours(0);
		            dto.setSixes(0);
		            dto.setStrikeRate(0.0);

		            dto.setDismissalType("YET TO BAT");

		            battingMap.put(player.getId(), dto);
		        }
		    }
		    
		    List<BattingscorecardDTO> battingList = new ArrayList<>(battingMap.values());

		    battingList.sort((a, b) -> {

		        Integer order1 = battingOrder.get(a.getPlayerId());
		        Integer order2 = battingOrder.get(b.getPlayerId());

		        // Yet To Bat players go to the bottom
		        if (order1 == null && order2 == null) {
		            return 0;
		        }

		        if (order1 == null) {
		            return 1;
		        }

		        if (order2 == null) {
		            return -1;
		        }

		        return order1.compareTo(order2);
		    });

		    return battingList;
		}
	 
	 public List<BowlingScorecardDTO> getBowlingScorecard(Integer matchId,
                                                          Integer teamId,
                                                          Integer innings){
		    List<BallScore> balls =
		            ballScoreRepository.findByMatch_MatchIdOrderByOverNoAscBallNoAsc(matchId);

		    Map<Integer, BowlingScorecardDTO> bowlingMap = new HashMap<>();

		    Map<Integer, Integer> legalBallsMap = new HashMap<>();

		    for (BallScore ball : balls) {
		    	
		    	if (!ball.getBowler().getTeam().getId().equals(teamId)
		    	        || !ball.getInnings().equals(innings)) {
		    	    continue;
		    	}

		        Integer bowlerId = ball.getBowler().getId();

		        BowlingScorecardDTO dto =
		                bowlingMap.getOrDefault(bowlerId,
		                        new BowlingScorecardDTO());

		        dto.setPlayerId(bowlerId);
		        dto.setPlayerName(ball.getBowler().getPlayerName());

		        
		     // Runs Conceded

		        int runs = ball.getRuns() == null ? 0 : ball.getRuns();
		        int extras = ball.getExtras() == null ? 0 : ball.getExtras();

		        int conceded = 0;

		        if (ball.getBallType() == BallType.NORMAL) {

		            conceded = runs;

		        } else if (ball.getBallType() == BallType.WIDE) {

		            conceded = extras;

		        } else if (ball.getBallType() == BallType.NO_BALL) {

		            conceded = runs + extras;
		        }

		        // BYE and LEG_BYE do not count against the bowler

		        dto.setRunsConceded(
		            (dto.getRunsConceded() == null ? 0 : dto.getRunsConceded())
		            + conceded
		        );

		        
		     // Wickets (Run Out should NOT count for bowler)
		        if (ball.getWicketType() != null
		                && !ball.getWicketType().name().equals("NOT_OUT")
		                && !ball.getWicketType().name().equals("RUN_OUT")
		                && !ball.getWicketType().name().equals("RUN_OUT_NON_STRIKER")) {

		            dto.setWickets(
		                    (dto.getWickets() == null ? 0 : dto.getWickets()) + 1);
		        }
		        
		        // Legal Balls
		        if (ball.getBallType() == BallType.NORMAL
		                || ball.getBallType() == BallType.BYE
		                || ball.getBallType() == BallType.LEG_BYE) {

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
	
	 public TeamScorecardDTO getTeamScorecard(Integer matchId, Integer teamId) {

		    Match match = matchRepository.findById(matchId)
		            .orElseThrow(() -> new RuntimeException("Match not found"));

		    MatchState state = matchStateRepository.findByMatchMatchId(matchId)
		            .orElseThrow(() -> new RuntimeException("Match state not found"));

		    Integer firstBattingTeamId;
		    Integer secondBattingTeamId;

		    if (match.getElectedTo().equalsIgnoreCase("BAT")) {

		        if (match.getTossWinner().equals(match.getTeam1().getTeamName())) {

		            firstBattingTeamId = match.getTeam1().getId();
		            secondBattingTeamId = match.getTeam2().getId();

		        } else {

		            firstBattingTeamId = match.getTeam2().getId();
		            secondBattingTeamId = match.getTeam1().getId();
		        }

		    } else {

		        // Toss winner chose to bowl

		        if (match.getTossWinner().equals(match.getTeam1().getTeamName())) {

		            firstBattingTeamId = match.getTeam2().getId();
		            secondBattingTeamId = match.getTeam1().getId();

		        } else {

		            firstBattingTeamId = match.getTeam1().getId();
		            secondBattingTeamId = match.getTeam2().getId();
		        }
		    }
		    Integer innings;

		    if (teamId.equals(firstBattingTeamId)) {

		        innings = 1;

		    } else {

		        innings = 2;
		    }

		    Integer bowlingTeamId = match.getTeam1().getId().equals(teamId)
		            ? match.getTeam2().getId()
		            : match.getTeam1().getId();

		    List<BallScore> balls =
		            ballScoreRepository.findByMatch_MatchIdOrderByOverNoAscBallNoAsc(matchId);

		    TeamScorecardDTO dto = new TeamScorecardDTO();

		    // ✅ TEAM INFO
		    if (match.getTeam1().getId().equals(teamId)) {
		        dto.setTeamId(match.getTeam1().getId());
		        dto.setTeamName(match.getTeam1().getTeamName());
		    } else {
		        dto.setTeamId(match.getTeam2().getId());
		        dto.setTeamName(match.getTeam2().getTeamName());
		    }

		    int totalRuns = 0;
		    int wickets = 0;
		    int extras = 0;
		    int legalBalls = 0;

		    for (BallScore ball : balls) {

		        // ✅ NULL SAFETY
		        if (ball == null ||
		            ball.getBatsman() == null ||
		            ball.getBatsman().getTeam() == null ||
		            ball.getInnings() == null) {
		            continue;
		        }

		        // ✅ TEAM FILTER
		        if (!ball.getBatsman().getTeam().getId().equals(teamId)) {
		            continue;
		        }

		        // ✅ INNINGS FILTER (VERY IMPORTANT FIX)
		        if (!ball.getInnings().equals(innings)) {
		            continue;
		        }

		        int runs = ball.getRuns() == null ? 0 : ball.getRuns();
		        int ex = ball.getExtras() == null ? 0 : ball.getExtras();

		        totalRuns += runs;
		        extras += ex;

		        // Wickets
		        if (ball.getWicketType() != null &&
		            !ball.getWicketType().name().equals("NOT_OUT")) {
		            wickets++;
		        }

		        // Legal balls
		        if (ball.getBallType() == BallType.NORMAL ||
		            ball.getBallType() == BallType.BYE ||
		            ball.getBallType() == BallType.LEG_BYE) {
		            legalBalls++;
		        }
		    }

		    // ✅ FINAL CALCULATION
		    if (innings == 1 && state.getInnings() == 2) {

		        dto.setTotalRuns(
		                state.getFirstInningsRuns() == null ? 0 : state.getFirstInningsRuns());

		        dto.setWickets(
		                state.getFirstInningsWickets() == null ? 0 : state.getFirstInningsWickets());

		        int ball = state.getFirstInningsBalls() == null
		                ? 0
		                : state.getFirstInningsBalls();

		        dto.setOvers((ball / 6) + "." + (ball % 6));

		    } else {

		        dto.setTotalRuns(totalRuns + extras);
		        dto.setWickets(wickets);
		        dto.setOvers((legalBalls / 6) + "." + (legalBalls % 6));

		    }

		    dto.setExtras(extras);
		    
		    // ✅ Batting + Bowling
		    dto.setBatting(getBattingScorecard(matchId, teamId, innings));
		    dto.setBowling(getBowlingScorecard(matchId, bowlingTeamId, innings));

		    return dto;
		}
}
