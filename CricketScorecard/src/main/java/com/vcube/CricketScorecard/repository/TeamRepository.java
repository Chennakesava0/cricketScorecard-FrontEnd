package com.vcube.CricketScorecard.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.vcube.CricketScorecard.model.Team;

@Repository
public interface TeamRepository extends JpaRepository<Team,Integer> {

	//long countByStatus(String status);
}
