package com.vcube.CricketScorecard.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.vcube.CricketScorecard.model.MatchPlayer;

@Repository
public interface MatchPlayerRepository extends JpaRepository<MatchPlayer, Integer> {
	
	List<MatchPlayer> findByMatchMatchId(Integer matchId);
	
	List<MatchPlayer> findByPlayerTeamId(Integer teamId);

}
