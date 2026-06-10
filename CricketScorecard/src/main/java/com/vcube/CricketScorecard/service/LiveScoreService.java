package com.vcube.CricketScorecard.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.vcube.CricketScorecard.dto.LiveScoreDTO;
import com.vcube.CricketScorecard.enums.MatchStatus;
import com.vcube.CricketScorecard.enums.WicketType;
import com.vcube.CricketScorecard.model.BallScore;
import com.vcube.CricketScorecard.model.Match;
import com.vcube.CricketScorecard.repository.BallScoreRepository;
import com.vcube.CricketScorecard.repository.MatchRepository;

@Service
public class LiveScoreService {

    @Autowired
    private MatchRepository matchRepository;

    @Autowired
    private BallScoreRepository ballScoreRepository;

    public LiveScoreDTO getLiveScore(Integer matchId) {

        Match match = matchRepository.findById(matchId)
                .orElseThrow(() -> new RuntimeException("Match not found"));

        LiveScoreDTO dto = new LiveScoreDTO();

        // ✅ FIXED ENUM CHECK
        if (match.getStatus() == MatchStatus.UPCOMING) {

            dto.setTotalRuns(0);
            dto.setTotalWickets(0);
            dto.setOvers("0.0");
            dto.setCurrentRunRate(0.0);
            dto.setRequiredRunRate(0.0);
            dto.setTarget(0);
            dto.setRunsRequired(0);
            dto.setBallsRemaining(0);

            return dto;
        }

        List<BallScore> balls =
                ballScoreRepository.findByMatch_MatchIdOrderByOverNoAscBallNoAsc(matchId);

        int totalRuns = balls.stream()
                .mapToInt(b -> {
                    int runs = b.getRuns() != null ? b.getRuns() : 0;
                    int extras = b.getExtras() != null ? b.getExtras() : 0;
                    return runs + extras;
                })
                .sum();

        int totalWickets = (int) balls.stream()
                .filter(b -> b.getWicketType() != null
                        && b.getWicketType() != WicketType.NOT_OUT)
                .count();

        int ballsBowled = balls.size();

        int overs = ballsBowled / 6;
        int ball = ballsBowled % 6;

        dto.setTotalRuns(totalRuns);
        dto.setTotalWickets(totalWickets);
        dto.setOvers(overs + "." + ball);

        double crr = ballsBowled > 0
                ? (totalRuns * 6.0) / ballsBowled
                : 0.0;

        dto.setCurrentRunRate(round(crr));

        int target = match.getTarget() != null ? match.getTarget() : 0;
        dto.setTarget(target);

        int runsRequired = Math.max(target - totalRuns, 0);
        dto.setRunsRequired(runsRequired);

        int totalBalls = 120;
        int ballsRemaining = Math.max(totalBalls - ballsBowled, 0);

        dto.setBallsRemaining(ballsRemaining);

        if (ballsRemaining > 0 && runsRequired > 0) {

            double rrr = (runsRequired * 6.0) / ballsRemaining;
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