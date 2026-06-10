package com.vcube.CricketScorecard.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.vcube.CricketScorecard.model.Player;

@Repository
public interface PlayerRepository extends JpaRepository<Player,Integer> {

	List<Player> findByTeamId(Integer teamId);
	
	//long countByStatus(String status);
	
	 List<Player> findByTeam_Id(Integer teamId);
	
}
