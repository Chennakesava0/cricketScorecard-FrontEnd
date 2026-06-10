package com.vcube.CricketScorecard.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.Data;

@Entity
@Data
public class Player {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer id;

	private String playerName;

	private String role;
	
	private Boolean captain;

    private Boolean viceCaptain;
    
	@JoinColumn(name = "team_id")
	@ManyToOne
	private Team team;
}
