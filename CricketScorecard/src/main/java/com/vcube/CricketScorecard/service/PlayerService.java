package com.vcube.CricketScorecard.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.vcube.CricketScorecard.model.Player;
import com.vcube.CricketScorecard.repository.PlayerRepository;

@Service
public class PlayerService {

	@Autowired
	PlayerRepository playerRepository;

	public Player savePlayer(Player player) {
		return playerRepository.save(player);
	}

	public List<Player> getAllPlayers() {
		return playerRepository.findAll();
	}

	public Player getPlayerById(Integer id) {
		return playerRepository.findById(id).orElseThrow();
	}

	public List<Player> getPlayerByTeam(Integer teamId) {
		return playerRepository.findByTeamId(teamId);
	}

	public void deleteById(Integer id) {
		playerRepository.deleteById(id);
	}

	public Player updatePlayer(Integer id, Player updatePlayer) {

		Player player = playerRepository.findById(id).orElseThrow();

		player.setPlayerName(updatePlayer.getPlayerName());
		player.setRole(updatePlayer.getRole());
		player.setCaptain(updatePlayer.getCaptain());
		player.setViceCaptain(updatePlayer.getViceCaptain());
		player.setTeam(updatePlayer.getTeam());

		return playerRepository.save(player);

	}

	public void assignLeadership(Integer teamId, Integer captainId, Integer viceCaptainId) {

		List<Player> players = playerRepository.findByTeam_Id(teamId);

		for (Player player : players) {

			player.setCaptain(false);
			player.setViceCaptain(false);

			if (player.getId().equals(captainId)) {
				player.setCaptain(true);
			}

			if (player.getId().equals(viceCaptainId)) {
				player.setViceCaptain(true);
			}
		}

		playerRepository.saveAll(players);
	}
}
