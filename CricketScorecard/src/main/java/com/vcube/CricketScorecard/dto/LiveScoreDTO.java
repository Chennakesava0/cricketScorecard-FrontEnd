package com.vcube.CricketScorecard.dto;

import java.util.List;

import com.vcube.CricketScorecard.model.BallScore;

import lombok.Data;

@Data
public class LiveScoreDTO {

    private String battingTeam;

    private String bowlingTeam;

    private String bowlerName;

    private Integer totalRuns;

    private Integer totalWickets;

    private String overs;

    private Double currentRunRate;

    private Double requiredRunRate;

    private String tossWinner;
    private String electedTo;

    private Integer target;
    private Integer runsRequired;
    private Integer ballsRemaining;
    
    private Integer innings;
    
    private Integer firstInningsRuns;

    private Integer firstInningsWickets;
    
    private String firstInningsOvers;
    
    private String secondInningsOvers;
    
    private Integer strikerId;
    private Integer nonStrikerId;
    private Integer currentBowlerId;
    
    private String strikerName;
    private Integer strikerRuns;
    private Integer strikerBalls;

    private String nonStrikerName;
    private Integer nonStrikerRuns;
    private Integer nonStrikerBalls;

    private String bowlerOvers;
    private Integer bowlerRuns;
    private Integer bowlerWickets;
    
    private List<String> ballLog;
    private List<java.util.Map<String, Object>> overBallLog;
}