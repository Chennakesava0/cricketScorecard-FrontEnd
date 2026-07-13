package com.vcube.CricketScorecard.model;

import com.vcube.CricketScorecard.enums.BallType;
import com.vcube.CricketScorecard.enums.WicketType;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.Data;

@Entity
@Data
public class BallScore {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer id;
	
	@ManyToOne
    @JoinColumn(name = "match_id")
    private Match match;

	@ManyToOne
	@JoinColumn(name = "batsman_id")
	private Player batsman;

	@ManyToOne
	@JoinColumn(name = "bowler_id")
	private Player bowler;
	
	@ManyToOne
	@JoinColumn(name = "fielder_id")
	private Player fielder;
	
	private Integer innings;

	private Integer overNo;

	private Integer ballNo;

	private Integer runs;

	private Integer extras;

	@Enumerated(EnumType.STRING)
	private BallType ballType;

	@Enumerated(EnumType.STRING)
	private WicketType wicketType;
}
