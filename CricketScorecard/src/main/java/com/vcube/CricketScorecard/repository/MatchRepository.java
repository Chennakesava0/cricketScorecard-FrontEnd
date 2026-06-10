package com.vcube.CricketScorecard.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.vcube.CricketScorecard.enums.MatchStatus;
import com.vcube.CricketScorecard.model.Match;
import com.vcube.CricketScorecard.model.MatchState;

@Repository
public interface MatchRepository extends JpaRepository<Match, Integer> {

	long countByStatus(MatchStatus status);

	 //Optional<MatchState> findByMatchMatchId(Integer matchId);
	 
	 List<Match> findByStatus(MatchStatus status);
	 
}
