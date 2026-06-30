package com.vcube.CricketScorecard.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.vcube.CricketScorecard.dto.LiveScoreDTO;
import com.vcube.CricketScorecard.enums.BallType;
import com.vcube.CricketScorecard.enums.MatchStatus;
import com.vcube.CricketScorecard.enums.WicketType;
import com.vcube.CricketScorecard.model.BallScore;
import com.vcube.CricketScorecard.model.Match;
import com.vcube.CricketScorecard.model.MatchState;
import com.vcube.CricketScorecard.model.Player;
import com.vcube.CricketScorecard.repository.BallScoreRepository;
import com.vcube.CricketScorecard.repository.MatchRepository;
import com.vcube.CricketScorecard.repository.MatchStateRepository;
import com.vcube.CricketScorecard.repository.PlayerRepository;

@Service
public class LiveScoreService {

    @Autowired
    private MatchRepository matchRepository;

    @Autowired
    private MatchStateRepository matchStateRepository;

    @Autowired
    private PlayerRepository playerRepository;

    @Autowired
    private BallScoreRepository ballScoreRepository;

    public LiveScoreDTO getLiveScore(Integer matchId) {

        Match match = matchRepository.findById(matchId)
                .orElseThrow(() -> new RuntimeException("Match not found"));

        LiveScoreDTO dto = new LiveScoreDTO();
        
        dto.setTossWinner(match.getTossWinner());
        dto.setElectedTo(match.getElectedTo());

        MatchState matchState =
                matchStateRepository.findByMatchMatchId(matchId).orElse(null);
        
        List<BallScore> balls =
                ballScoreRepository.findByMatch_MatchIdOrderByOverNoAscBallNoAsc(matchId);
        
        
        if (matchState != null) {
        	
        	dto.setStrikerId(matchState.getStrikerId());
        	dto.setNonStrikerId(matchState.getNonStrikerId());
        	dto.setCurrentBowlerId(matchState.getCurrentBowlerId());

        	Player striker = null;
        	Player bowler = null;
        	Player nonStriker = null;

        	if (matchState.getStrikerId() != null) {
        	    striker = playerRepository.findById(matchState.getStrikerId()).orElse(null);
        	}

        	if (matchState.getNonStrikerId() != null) {
        	    nonStriker = playerRepository.findById(matchState.getNonStrikerId()).orElse(null);
        	}

        	if (matchState.getCurrentBowlerId() != null) {
        	    bowler = playerRepository.findById(matchState.getCurrentBowlerId()).orElse(null);
        	}

            dto.setStrikerName(
                    striker != null ? striker.getPlayerName() : ""
            );

            dto.setNonStrikerName(
                    nonStriker != null ? nonStriker.getPlayerName() : ""
            );
            
            dto.setBowlerName(
                    bowler != null ? bowler.getPlayerName() : ""
            );
            
            if (striker != null) {

                int strikerRuns = 0;
                int strikerBalls = 0;

                for (BallScore ball : balls) {

                    if (ball.getBatsman() != null &&
                        ball.getBatsman().getId().equals(striker.getId())) {

                        // Add runs scored by striker
                        strikerRuns += ball.getRuns() == null ? 0 : ball.getRuns();

                        // Count only legal balls faced
                        if (ball.getBallType() == BallType.NORMAL ||
                            ball.getBallType() == BallType.BYE ||
                            ball.getBallType() == BallType.LEG_BYE) {

                            strikerBalls++;
                        }
                    }
                }

                dto.setStrikerRuns(strikerRuns);
                dto.setStrikerBalls(strikerBalls);
            }
            
            if (nonStriker != null) {

                int nonStrikerRuns = 0;
                int nonStrikerBalls = 0;

                for (BallScore ball : balls) {

                    if (ball.getBatsman() != null &&
                        ball.getBatsman().getId().equals(nonStriker.getId())) {

                        nonStrikerRuns += ball.getRuns() == null ? 0 : ball.getRuns();

                        if (ball.getBallType() == BallType.NORMAL ||
                            ball.getBallType() == BallType.BYE ||
                            ball.getBallType() == BallType.LEG_BYE) {

                            nonStrikerBalls++;
                        }
                    }
                }

                dto.setNonStrikerRuns(nonStrikerRuns);
                dto.setNonStrikerBalls(nonStrikerBalls);
            }
            
            if (bowler != null) {

                int bowlerRuns = 0;
                int bowlerBalls = 0;
                int bowlerWickets = 0;

                for (BallScore ball : balls) {

                    if (ball.getBowler() != null &&
                        ball.getBowler().getId().equals(bowler.getId())) {

                        // Runs conceded
                        bowlerRuns +=
                                (ball.getRuns() == null ? 0 : ball.getRuns()) +
                                (ball.getExtras() == null ? 0 : ball.getExtras());

                        // Legal deliveries
                        if (ball.getBallType() == BallType.NORMAL ||
                            ball.getBallType() == BallType.BYE ||
                            ball.getBallType() == BallType.LEG_BYE) {

                            bowlerBalls++;
                        }

                        // Wickets
                        if (ball.getWicketType() != null &&
                            ball.getWicketType() != WicketType.NOT_OUT &&
                            ball.getWicketType() != WicketType.RUN_OUT &&
                            ball.getWicketType() != WicketType.RUN_OUT_NON_STRIKER) {

                            bowlerWickets++;
                        }
                    }
                }

                dto.setBowlerRuns(bowlerRuns);

                dto.setBowlerWickets(bowlerWickets);

                dto.setBowlerOvers((bowlerBalls / 6) + "." + (bowlerBalls % 6));
            }
            
            dto.setInnings(matchState.getInnings());
            

            Integer innings = (matchState != null) ? matchState.getInnings() : null;

            if (innings != null && innings == 1) {
                dto.setBattingTeam(match.getTeam1().getTeamName());
                dto.setBowlingTeam(match.getTeam2().getTeamName());
            } else {
                dto.setBattingTeam(match.getTeam2().getTeamName());
                dto.setBowlingTeam(match.getTeam1().getTeamName());
            }
        }

        if (match.getStatus() == MatchStatus.UPCOMING) {

            dto.setTotalRuns(0);
            dto.setTotalWickets(0);
            dto.setOvers("0.0");
            dto.setCurrentRunRate(0.0);
            dto.setRequiredRunRate(0.0);
            dto.setTarget(0);
            dto.setRunsRequired(0);
            dto.setBallsRemaining(0);
            dto.setTossWinner(match.getTossWinner());
            dto.setElectedTo(match.getElectedTo());
            if(matchState != null){
                dto.setInnings(matchState.getInnings());
            }

            return dto;
        }
        
        if (matchState == null) {
            return dto;
        }

//        List<BallScore> balls =
//                ballScoreRepository.findByMatch_MatchIdOrderByOverNoAscBallNoAsc(matchId);
        
        
        int totalRuns;
        int totalWickets;
        int ballsBowled;

        if (matchState.getInnings() == 1) {

            totalRuns = matchState.getTotalRuns() == null ? 0 : matchState.getTotalRuns();
            totalWickets = matchState.getWickets() == null ? 0 : matchState.getWickets();
            ballsBowled = matchState.getTotalBalls() == null ? 0 : matchState.getTotalBalls();

        } else {

            totalRuns = matchState.getSecondInningsRuns() == null ? 0 : matchState.getSecondInningsRuns();
            totalWickets = matchState.getSecondInningsWickets() == null ? 0 : matchState.getSecondInningsWickets();
            ballsBowled = matchState.getSecondInningsBalls() == null ? 0 : matchState.getSecondInningsBalls();

            dto.setFirstInningsRuns(matchState.getFirstInningsRuns());
            dto.setFirstInningsWickets(matchState.getFirstInningsWickets());

            int firstBalls = matchState.getFirstInningsBalls() == null
                    ? 0
                    : matchState.getFirstInningsBalls();

            dto.setFirstInningsOvers((firstBalls / 6) + "." + (firstBalls % 6));
            dto.setSecondInningsOvers((ballsBowled / 6) + "." + (ballsBowled % 6));
        }

        dto.setTotalRuns(totalRuns);
        dto.setTotalWickets(totalWickets);
        dto.setOvers((ballsBowled / 6) + "." + (ballsBowled % 6));
        
        double crr = ballsBowled > 0
                ? (totalRuns * 6.0) / ballsBowled
                : 0.0;

        dto.setCurrentRunRate(round(crr));

        int target = matchState.getTarget() == null
                ? 0
                : matchState.getTarget();

        dto.setTarget(target);

        int runsRequired = Math.max(target - totalRuns, 0);

        dto.setRunsRequired(runsRequired);

        int totalBalls = match.getTotalOvers() * 6;

        int ballsRemaining =
                Math.max(totalBalls - ballsBowled, 0);

        dto.setBallsRemaining(ballsRemaining);

        if (ballsRemaining > 0 && runsRequired > 0) {

            double rrr =
                    (runsRequired * 6.0) / ballsRemaining;

            dto.setRequiredRunRate(round(rrr));

        } else {

            dto.setRequiredRunRate(0.0);
        }

        return dto;
    }

    private double round(double value) {
        return Math.round(value * 100.0) / 100.0;
    }
}