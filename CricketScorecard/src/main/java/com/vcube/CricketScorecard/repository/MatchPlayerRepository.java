package com.vcube.CricketScorecard.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.stereotype.Repository;

import com.vcube.CricketScorecard.model.Match;
import com.vcube.CricketScorecard.model.MatchPlayer;
import com.vcube.CricketScorecard.model.Player;

import jakarta.transaction.Transactional;

@Repository
public interface MatchPlayerRepository extends JpaRepository<MatchPlayer, Integer> {
	
	List<MatchPlayer> findByMatchMatchId(Integer matchId);
	
	List<MatchPlayer> findByMatchMatchIdAndPlayerTeamId(Integer matchId, Integer teamId);

	boolean existsByMatchAndPlayer(Match match, Player player);
	
	
}
