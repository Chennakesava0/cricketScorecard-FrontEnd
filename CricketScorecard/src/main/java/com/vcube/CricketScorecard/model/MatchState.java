package com.vcube.CricketScorecard.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import lombok.Data;

@Entity
@Data
public class MatchState {

	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @OneToOne
    @JoinColumn(name = "match_id")
    private Match match;
    
    private Integer strikerId;
    
    private Integer nonStrikerId;
    
    private Integer currentBowlerId;
    
    private Integer wickets;
    
    private Integer totalRuns;
    
    //private Integer totalOvers;
    
    private Integer totalBalls;
    
    private Integer innings;
    
    private Integer firstInningsRuns;
    
    private Integer firstInningsWickets;
    
    private Integer firstInningsBalls;

    private Integer secondInningsRuns;
    
    private Integer secondInningsWickets;
    
    private Integer secondInningsBalls;
    
    private Boolean matchCompleted= false;;

    private Integer target;
}
