package com.vcube.CricketScorecard.model;

import java.time.LocalDate;

import com.vcube.CricketScorecard.enums.MatchStatus;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Data
@Table(name = "matches")
public class Match {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer matchId;
	
	@Enumerated(EnumType.STRING)
	@Column(nullable = false)
	private MatchStatus status;


	@ManyToOne
	@JoinColumn(name = "team1_id")
	private Team team1;

	@ManyToOne
	@JoinColumn(name = "team2_id")
	private Team team2;
	
	private LocalDate matchDate;
	
	private String matchTime;
	
	private String venue;
	
	private Integer totalOvers;
	
	private Integer target;
	
    private String tossWinner;

    private String electedTo;
    // BAT
    // BOWL

    private String winner;
}
