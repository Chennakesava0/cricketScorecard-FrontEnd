package com.vcube.CricketScorecard.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.vcube.CricketScorecard.dto.MatchPlayerDTO;
import com.vcube.CricketScorecard.model.Match;
import com.vcube.CricketScorecard.model.MatchPlayer;
import com.vcube.CricketScorecard.model.Player;
import com.vcube.CricketScorecard.repository.MatchPlayerRepository;
import com.vcube.CricketScorecard.repository.MatchRepository;
import com.vcube.CricketScorecard.repository.PlayerRepository;

import jakarta.transaction.Transactional;

	
	@Service
	public class MatchPlayerService {

	    @Autowired
	    MatchRepository matchRepository;

	    @Autowired
	    MatchPlayerRepository matchPlayerRepository;

	    @Autowired
	    PlayerRepository playerRepository;

	    @Transactional
	    public List<MatchPlayer> savePlayers11(MatchPlayerDTO dto) {

	        Match match = matchRepository.findById(dto.getMatchId()).orElseThrow();

	        if (dto.getPlayerIds().stream().distinct().count() != 11) {
	            throw new RuntimeException("Duplicate players are not allowed");
	        }

	        List<MatchPlayer> players = new ArrayList<>();

	        for (Integer playerId : dto.getPlayerIds()) {

	            Player player = playerRepository.findById(playerId).orElseThrow();

	            MatchPlayer matchPlayer = new MatchPlayer();
	            matchPlayer.setMatch(match);
	            matchPlayer.setPlayer(player);

	            players.add(matchPlayer);
	        }

	        return matchPlayerRepository.saveAll(players);
	    }
	    
	    public List<MatchPlayer> getPlayers11(Integer matchId) {
	        return matchPlayerRepository.findByMatchMatchId(matchId);
	    }

	    public List<MatchPlayer> getPlaying11(Integer matchId, Integer teamId) {
	        return matchPlayerRepository
	                .findByMatchMatchIdAndPlayerTeamId(matchId, teamId);
	    }
	}

