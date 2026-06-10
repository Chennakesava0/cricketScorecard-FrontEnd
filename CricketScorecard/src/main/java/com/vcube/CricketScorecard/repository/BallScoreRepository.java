package com.vcube.CricketScorecard.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.vcube.CricketScorecard.model.BallScore;

@Repository
public interface BallScoreRepository extends JpaRepository<BallScore, Integer>{

	 List<BallScore> findByMatch_MatchId(Integer matchId);
	 
	 List<BallScore> findByMatch_MatchIdOrderByOverNoAscBallNoAsc(Integer matchId);}
