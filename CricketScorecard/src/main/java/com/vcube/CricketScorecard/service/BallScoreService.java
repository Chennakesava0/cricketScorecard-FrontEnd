package com.vcube.CricketScorecard.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.vcube.CricketScorecard.enums.BallType;
import com.vcube.CricketScorecard.enums.MatchStatus;
import com.vcube.CricketScorecard.enums.WicketType;
import com.vcube.CricketScorecard.model.BallScore;
import com.vcube.CricketScorecard.model.Match;
import com.vcube.CricketScorecard.model.MatchState;
import com.vcube.CricketScorecard.repository.BallScoreRepository;
import com.vcube.CricketScorecard.repository.MatchRepository;
import com.vcube.CricketScorecard.repository.MatchStateRepository;

@Service
public class BallScoreService {

    @Autowired
    private BallScoreRepository ballScoreRepository;

    @Autowired
    private MatchStateRepository matchStateRepository;

    @Autowired
    private MatchRepository matchRepository;
    
    private boolean isLegalBall(BallScore ball) {
	    return ball.getBallType() != BallType.WIDE
	            && ball.getBallType() != BallType.NO_BALL;
	}

    	public BallScore saveBallScore(BallScore ballScore) {
    		
    		 
    		
    	    MatchState state = matchStateRepository
    	            .findByMatchMatchId(
    	                    ballScore.getMatch().getMatchId())
    	            .orElseThrow(() ->
    	                    new RuntimeException("Match State Not Found"));
    	    
    	    
    	    ballScore.setInnings(state.getInnings());

    	    int totalBalls = state.getTotalBalls() == null
    	            ? 0
    	            : state.getTotalBalls();

    	    
    	    ballScore.setOverNo(totalBalls / 6);
    	    ballScore.setBallNo((totalBalls % 6) + 1);

    	    BallScore savedBall =
    	            ballScoreRepository.save(ballScore);

    	    updateMatchState(savedBall, state);

    	    return savedBall;
    	}
    private void updateMatchState(
            BallScore ball,
            MatchState state) {
    	

    	int runs = state.getTotalRuns() == null ? 0 : state.getTotalRuns();
    	int wickets = state.getWickets() == null ? 0 : state.getWickets();
    	int balls = state.getTotalBalls() == null ? 0 : state.getTotalBalls();
    	
    	if (ball.getBallType() == BallType.WIDE) {

    	    // Only extras count
    	    runs += ball.getExtras();

    	}
    	else if (ball.getBallType() == BallType.NO_BALL) {

    	    // No-ball = batsman runs + 1 extra
    	    runs += ball.getRuns();
    	    runs += ball.getExtras();

    	}
    	else if (ball.getBallType() == BallType.LEG_BYE) {

    	    // Only leg-bye extras
    	    runs += ball.getExtras();

    	}
    	else {

    	    // Normal delivery
    	    runs += ball.getRuns();

    	}

    	if (ball.getWicketType() != null
    	        && ball.getWicketType() != WicketType.NOT_OUT) {
    	    wickets++;
    	}

        boolean legalBall = isLegalBall(ball);
        if (legalBall) {
            balls++;
        }

        state.setTotalRuns(runs);
        state.setWickets(wickets);
        state.setTotalBalls(balls);
        
        
        if (state.getInnings() == 2) {

            state.setSecondInningsRuns(runs);
            state.setSecondInningsWickets(wickets);
            state.setSecondInningsBalls(balls);
        }
        
        System.err.println("SECOND INNINGS RUNS = " + state.getSecondInningsRuns());
        
        if (ball.getWicketType() != WicketType.RUN_OUT_NON_STRIKER) {
            swapStrike(ball, state);
        }

        endOverLogic(ball, state);

        secondInningsLogic(state);

        matchResultLogic(state);
        
        matchStateRepository.save(state);
        
        Match match = state.getMatch();

        int totalBallsLimit = match.getTotalOvers() * 6;

        boolean matchEnded =
                state.getWickets() >= 10 ||
                state.getTotalBalls() >= totalBallsLimit ||
                (state.getInnings() == 2 && state.getTotalRuns() >= state.getTarget());

        if (matchEnded) {

            state.setMatchCompleted(true);

            match.setStatus(MatchStatus.COMPLETED);

            matchRepository.save(match);
            
            matchStateRepository.save(state);
        }

        
    }

    private void swapStrike(BallScore ball, MatchState state) {

        int strikeRuns = 0;

        // NORMAL BALL
        if (ball.getBallType() == BallType.NORMAL) {

            strikeRuns = ball.getRuns() == null
                    ? 0
                    : ball.getRuns();
        }

        // LEG BYE
        else if (ball.getBallType() == BallType.LEG_BYE) {

            strikeRuns = ball.getExtras() == null
                    ? 0
                    : ball.getExtras();
        }

        // NO BALL
        else if (ball.getBallType() == BallType.NO_BALL) {

            // Strike depends only on batsman's runs
            strikeRuns = ball.getRuns() == null
                    ? 0
                    : ball.getRuns();
        }

        // WIDE
        else if (ball.getBallType() == BallType.WIDE) {

            // extras = 1 compulsory wide + running runs
            int extras = ball.getExtras() == null ? 0 : ball.getExtras();

            strikeRuns = Math.max(0, extras - 1);
        }

        else {
            return;
        }

        // Odd running runs -> change strike
        if (strikeRuns % 2 == 1) {

            Integer striker = state.getStrikerId();

            state.setStrikerId(state.getNonStrikerId());
            state.setNonStrikerId(striker);
        }
    }
    
    private void endOverLogic(BallScore ball, MatchState state) {

        if (state.getTotalBalls() > 0 &&
            state.getTotalBalls() % 6 == 0) {

            boolean strikerOut =
                    ball.getWicketType() != null &&
                    ball.getWicketType() != WicketType.NOT_OUT &&
                    ball.getWicketType() != WicketType.RUN_OUT_NON_STRIKER;

            if (strikerOut) {

                // Existing non-striker starts next over
                state.setStrikerId(state.getNonStrikerId());

                // New batsman will be selected later
                state.setNonStrikerId(-1);

            } else {

                Integer striker = state.getStrikerId();

                state.setStrikerId(state.getNonStrikerId());
                state.setNonStrikerId(striker);
            }

            // Force new bowler
            state.setCurrentBowlerId(-1);
        }
    }
    
    private void secondInningsLogic(
            MatchState state) {

        if (state.getInnings() != 1) {
            return;
        }

        Match match = state.getMatch();

        int totalMatchBalls =
                match.getTotalOvers() * 6;

        boolean inningsFinished =
                state.getWickets() >= 10
                || state.getTotalBalls()
                >= totalMatchBalls;

                if (inningsFinished) {

                    // 🔥 TAKE SNAPSHOT BEFORE RESET
                	int firstInningsScore = state.getTotalRuns();

                	state.setFirstInningsRuns(firstInningsScore);
                	state.setFirstInningsWickets(state.getWickets());
                	state.setFirstInningsBalls(state.getTotalBalls());

                	// target = first innings + 1
                	state.setTarget(firstInningsScore + 1);

                    state.setInnings(2);

                    state.setTotalRuns(0);
                    state.setWickets(0);
                    state.setTotalBalls(0);

                    state.setStrikerId(-1);
                    state.setNonStrikerId(-1);
                    state.setCurrentBowlerId(-1);
                }
    }

    private void matchResultLogic(
            MatchState state) {
    	
    	 

        if (state.getInnings() != 2) {
            return;
        }

        Match match = state.getMatch();
        
        String chasingTeam;

        if (match.getTossWinner().equals(match.getTeam1().getTeamName())) {

            if (match.getElectedTo().equalsIgnoreCase("BAT")) {
                chasingTeam = match.getTeam2().getTeamName();
            } else {
                chasingTeam = match.getTeam1().getTeamName();
            }

        } else {

            if (match.getElectedTo().equalsIgnoreCase("BAT")) {
                chasingTeam = match.getTeam1().getTeamName();
            } else {
                chasingTeam = match.getTeam2().getTeamName();
            }
        }
        

        int totalMatchBalls =
                match.getTotalOvers() * 6;

        if (state.getTarget() != null
                && state.getTotalRuns() != null
                && state.getTotalRuns() >= state.getTarget()) {
        	
        	state.setSecondInningsRuns(state.getTotalRuns());
            state.setSecondInningsWickets(state.getWickets());
            state.setSecondInningsBalls(state.getTotalBalls());

            match.setWinner(chasingTeam);
            match.setStatus(MatchStatus.COMPLETED);
            state.setMatchCompleted(true);
            
            
            matchRepository.save(match);
            
            matchStateRepository.save(state);
            return;
        }

        boolean inningsFinished =
                state.getWickets() >= 10
                || state.getTotalBalls()
                >= totalMatchBalls;

                if (inningsFinished) {

                    state.setSecondInningsRuns(state.getTotalRuns());
                    state.setSecondInningsWickets(state.getWickets());
                    state.setSecondInningsBalls(state.getTotalBalls());

                    String firstBattingTeam;

                    if (chasingTeam.equals(match.getTeam1().getTeamName())) {
                        firstBattingTeam = match.getTeam2().getTeamName();
                    } else {
                        firstBattingTeam = match.getTeam1().getTeamName();
                    }

                    if (state.getTotalRuns() >= state.getTarget()) {
                        match.setWinner(chasingTeam);
                    }
                    else if (state.getTotalRuns() < state.getTarget()) {
                        match.setWinner(firstBattingTeam);
                    }
                    
                    match.setStatus(MatchStatus.COMPLETED);
                    state.setMatchCompleted(true);

                    matchRepository.save(match);
                    matchStateRepository.save(state);
                }
    }

    public List<BallScore> getAllBallScores() {
        return ballScoreRepository.findAll();
    }

    public BallScore getBallScoreById(Integer id) {
        return ballScoreRepository.findById(id)
                .orElseThrow();
    }

    public List<BallScore> getBallScoreByMatch(
            Integer matchId) {

        return ballScoreRepository
                .findByMatch_MatchId(matchId);
    }

    public List<BallScore> getBallScoreByMatchSorted(
            Integer matchId) {

        return ballScoreRepository
                .findByMatch_MatchIdOrderByOverNoAscBallNoAsc(matchId);
    }
    
    public List<BallScore> getBallScoreByMatchAndInnings(
            Integer matchId,
            Integer innings) {

        return ballScoreRepository
                .findByMatch_MatchIdAndInningsOrderByOverNoAscBallNoAsc(
                        matchId,
                        innings
                );
    }

    public BallScore updateBallScore(
            Integer id,
            BallScore updatedBallScore) {

        BallScore ballScore =
                ballScoreRepository.findById(id)
                        .orElseThrow();

        ballScore.setMatch(
                updatedBallScore.getMatch());

        ballScore.setBatsman(
                updatedBallScore.getBatsman());

        ballScore.setBowler(
                updatedBallScore.getBowler());

        ballScore.setOverNo(
                updatedBallScore.getOverNo());

        ballScore.setBallNo(
                updatedBallScore.getBallNo());

        ballScore.setRuns(
                updatedBallScore.getRuns());

        ballScore.setExtras(
                updatedBallScore.getExtras());

        ballScore.setBallType(
                updatedBallScore.getBallType());

        ballScore.setWicketType(
                updatedBallScore.getWicketType());

        return ballScoreRepository.save(ballScore);
    }

    public void deleteBallScoreById(Integer id) {
        ballScoreRepository.deleteById(id);
    }
    
    public String getBallLabel(BallScore ball) {

        if (ball.getWicketType() != null
                && ball.getWicketType() != WicketType.NOT_OUT) {
            return "W";
        }

        switch (ball.getBallType()) {

            case NORMAL:
                return String.valueOf(ball.getRuns());

            case WIDE:

                switch (ball.getExtras()) {
                    case 1: return "WD";
                    case 2: return "WD1";
                    case 3: return "WD2";
                    case 5: return "WD4";
                    default: return "WD";
                }

            

            case NO_BALL:

                switch (ball.getExtras()) {
                    case 0: return "NB";
                    case 1: return "NB1";
                    case 2: return "NB2";
                    case 3: return "NB3";
                    case 4: return "NB4";
                    case 6: return "NB6";
                    default: return "NB";
                }

            

            case LEG_BYE:

                switch (ball.getExtras()) {
                    case 0: return "LB";
                    case 1: return "LB1";
                    case 2: return "LB2";
                    case 3: return "LB3";
                    case 4: return "LB4";
                    default: return "LB";
                }

            default:
                return "";
        }
    }
    
    public List<Integer> getOutPlayers(Integer matchId, Integer innings) {

        List<BallScore> balls =
                ballScoreRepository
                    .findByMatch_MatchIdAndInningsOrderByOverNoAscBallNoAsc(
                            matchId,
                            innings);

        List<Integer> outPlayers = new ArrayList<>();

        for (BallScore ball : balls) {

            if (ball.getWicketType() != null
                    && ball.getWicketType() != WicketType.NOT_OUT) {

                Integer playerId = ball.getBatsman().getId();

                if (!outPlayers.contains(playerId)) {
                    outPlayers.add(playerId);
                }
            }
        }

        return outPlayers;
    }
}