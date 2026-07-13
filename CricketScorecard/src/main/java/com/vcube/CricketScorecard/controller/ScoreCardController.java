package com.vcube.CricketScorecard.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.vcube.CricketScorecard.dto.BattingscorecardDTO;
import com.vcube.CricketScorecard.dto.BowlingScorecardDTO;
import com.vcube.CricketScorecard.dto.LiveScoreDTO;
import com.vcube.CricketScorecard.dto.MatchResultDTO;
import com.vcube.CricketScorecard.dto.TeamScorecardDTO;
import com.vcube.CricketScorecard.service.LiveScoreService;
import com.vcube.CricketScorecard.service.ScoreCardService;

@RestController
@CrossOrigin("*")
public class ScoreCardController {

    @Autowired
    private ScoreCardService scoreCardService;
    
    @Autowired
    private LiveScoreService liveScoreService;

    @GetMapping("/liveScore/{matchId}")
    public LiveScoreDTO getLiveScore(@PathVariable Integer matchId) {

        return liveScoreService.getLiveScore(matchId);
    }

   @GetMapping("/battingScorecard/{matchId}")
    public List<BattingscorecardDTO> getBattingScorecard(
            @PathVariable Integer matchId,
            @RequestParam Integer teamId,
            @RequestParam Integer innings) {

        return scoreCardService.getBattingScorecard(matchId, teamId, innings);
    }

    @GetMapping("/bowlingScorecard/{matchId}")
    public List<BowlingScorecardDTO> getBowlingScorecard(
            @PathVariable Integer matchId,
            @RequestParam Integer teamId,
            @RequestParam Integer innings) {

        return scoreCardService.getBowlingScorecard(matchId, teamId, innings);
    }
    @GetMapping("/teamScorecard/{matchId}")
    public TeamScorecardDTO getTeamScorecard(
            @PathVariable Integer matchId,
            @RequestParam Integer teamId) {

        return scoreCardService.getTeamScorecard(matchId, teamId);
    }

    @GetMapping("/matchResult/{matchId}")
    public MatchResultDTO getMatchResult(
            @PathVariable Integer matchId) {

        return scoreCardService.getMatchResult(matchId);
    }
}