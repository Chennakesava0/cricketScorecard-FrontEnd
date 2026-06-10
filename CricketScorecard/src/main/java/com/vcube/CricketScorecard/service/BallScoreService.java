package com.vcube.CricketScorecard.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.vcube.CricketScorecard.enums.BallType;
import com.vcube.CricketScorecard.enums.MatchStatus;
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

    public BallScore saveBallScore(BallScore ballScore) {

        BallScore savedBall = ballScoreRepository.save(ballScore);

        MatchState state = matchStateRepository
                .findByMatchMatchId(
                        ballScore.getMatch().getMatchId())
                .orElseThrow(() ->
                        new RuntimeException("Match State Not Found"));

        updateMatchState(savedBall, state);

        return savedBall;
    }

    private void updateMatchState(
            BallScore ball,
            MatchState state) {

    	int runs = state.getTotalRuns() == null ? 0 : state.getTotalRuns();
    	int wickets = state.getWickets() == null ? 0 : state.getWickets();
    	int balls = state.getTotalBalls() == null ? 0 : state.getTotalBalls();
    	
        runs += ball.getRuns();

        if (ball.getExtras() != null) {
            runs += ball.getExtras();
        }

        if (ball.getWicketType() != null) {
            wickets++;
        }

        boolean legalBall =
                ball.getBallType() != BallType.WIDE
                && ball.getBallType() != BallType.NO_BALL;

        if (legalBall) {
            balls++;
        }

        state.setTotalRuns(runs);
        state.setWickets(wickets);
        state.setTotalBalls(balls);

        swapStrike(ball, state);

        endOverLogic(state);

        secondInningsLogic(state);

        matchResultLogic(state);

        matchStateRepository.save(state);
    }

    private void swapStrike(
            BallScore ball,
            MatchState state) {

        if (ball.getRuns() % 2 == 1) {

            Integer striker = state.getStrikerId();

            state.setStrikerId(
                    state.getNonStrikerId());

            state.setNonStrikerId(striker);
        }
    }

    private void endOverLogic(
            MatchState state) {

        if (state.getTotalBalls() > 0
                && state.getTotalBalls() % 6 == 0) {

            Integer striker = state.getStrikerId();

            state.setStrikerId(
                    state.getNonStrikerId());

            state.setNonStrikerId(striker);
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

            state.setFirstInningsRuns(
                    state.getTotalRuns());

            state.setTarget(
                    state.getTotalRuns() + 1);

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
                && state.getTotalRuns()
                >= state.getTarget()) {

            match.setStatus(
                    MatchStatus.COMPLETED);

            matchRepository.save(match);

            return;
        }

        boolean inningsFinished =
                state.getWickets() >= 10
                || state.getTotalBalls()
                >= totalMatchBalls;

        if (inningsFinished) {

            match.setStatus(
                    MatchStatus.COMPLETED);

            matchRepository.save(match);
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