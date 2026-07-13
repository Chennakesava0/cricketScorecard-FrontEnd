package com.vcube.CricketScorecard.dto;

import lombok.Data;

@Data
public class MatchResultDTO {

    private Integer matchId;

    private String venue;

    private String team1Name;
    private String team2Name;

    private Integer firstInningsRuns;
    private Integer firstInningsWickets;
    private String firstInningsOvers;

    private Integer secondInningsRuns;
    private Integer secondInningsWickets;
    private String secondInningsOvers;

    private String winnerTeam;
    private String loserTeam;

    private String result;

    private Integer winningMargin;

    private String marginType;

    private String matchStatus;
}
