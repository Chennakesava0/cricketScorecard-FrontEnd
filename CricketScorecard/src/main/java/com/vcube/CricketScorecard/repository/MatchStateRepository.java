package com.vcube.CricketScorecard.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.vcube.CricketScorecard.model.MatchState;

@Repository
public interface MatchStateRepository extends JpaRepository<MatchState, Integer>{
	
	Optional<MatchState> findByMatchMatchId(Integer matchId);

}
