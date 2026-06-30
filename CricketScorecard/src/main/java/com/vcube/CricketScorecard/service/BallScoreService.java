package com.vcube.CricketScorecard.service;

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
    		
    		 System.err.println(">>>>>>>> saveBallScore() CALLED <<<<<<<<");
    		
    	    MatchState state = matchStateRepository
    	            .findByMatchMatchId(
    	                    ballScore.getMatch().getMatchId())
    	            .orElseThrow(() ->
    	                    new RuntimeException("Match State Not Found"));

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
    	
    	if (ball.getBallType() == BallType.WIDE
    	        || ball.getBallType() == BallType.NO_BALL
    	        || ball.getBallType() == BallType.LEG_BYE) {

    	    runs += ball.getExtras() == null
    	            ? 0
    	            : ball.getExtras();

    	} else {

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

        endOverLogic(state);

        secondInningsLogic(state);

        matchResultLogic(state);

        matchStateRepository.save(state);
    }

    private void swapStrike(
            BallScore ball,
            MatchState state) {

        int strikeRuns = 0;

        if (ball.getBallType() == BallType.LEG_BYE) {
            strikeRuns = ball.getExtras() == null ? 0 : ball.getExtras();
        } else {
            strikeRuns = ball.getRuns() == null ? 0 : ball.getRuns();
        }

        if (strikeRuns % 2 == 1) {

            Integer striker = state.getStrikerId();

            state.setStrikerId(state.getNonStrikerId());
            state.setNonStrikerId(striker);
        }
    }
    private void endOverLogic(
            MatchState state) {

        if (state.getTotalBalls() > 0
                && state.getTotalBalls() % 6 == 0) {

            Integer striker = state.getStrikerId();

            state.setStrikerId(state.getNonStrikerId());
            state.setNonStrikerId(striker);

            // Force new bowler selection
            state.setCurrentBowlerId(null);
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

                    state.setStrikerId(null);
                    state.setNonStrikerId(null);
                    state.setCurrentBowlerId(null);
                }
    }

    private void matchResultLogic(
            MatchState state) {

        if (state.getInnings() != 2) {
            return;
        }

        Match match = state.getMatch();

        int totalMatchBalls =
                match.getTotalOvers() * 6;

        if (state.getTarget() != null
                && state.getTotalRuns() != null
                && state.getTotalRuns() >= state.getTarget()) {
        	
        	state.setSecondInningsRuns(state.getTotalRuns());
            state.setSecondInningsWickets(state.getWickets());
            state.setSecondInningsBalls(state.getTotalBalls());

            match.setStatus(MatchStatus.COMPLETED);
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

            match.setStatus(
                    MatchStatus.COMPLETED);

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
}