package com.vcube.CricketScorecard.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.vcube.CricketScorecard.model.Player;
import com.vcube.CricketScorecard.service.PlayerService;

@RestController
@CrossOrigin("*")
public class PlayerController {

	@Autowired
	PlayerService playerService;
	
	@PostMapping("/savePlayer")
	public Player savePlayer(@RequestBody Player player) {
		return playerService.savePlayer(player);
	}
	
	@GetMapping("/getAllPlayers")
	public List<Player> getAllPlayers(){
		return playerService.getAllPlayers();
	}
	
	@GetMapping("/getPlayerById/{id}")
	public Player getPlayerById(@PathVariable Integer id) {
		return playerService.getPlayerById(id);
	}
	
	@GetMapping("/getPlayerByTeam/{id}")
	public List<Player> getPlayerByTeam(@PathVariable Integer id){
		return playerService.getPlayerByTeam(id);
	}
	
	@PutMapping("/updatePlayer/{id}")
	public Player updatePlayer(@PathVariable Integer id,
			                    @RequestBody Player player) {
		return playerService.updatePlayer(id, player);
	}
	
	public String deleteById(@PathVariable Integer id) {
		playerService.deleteById(id);
		
		return "Player Deleted Successfully";
	}
	
	@PutMapping("/assignLeadership")
	public String assignLeadership(
	        @RequestParam Integer teamId,
	        @RequestParam Integer captainId,
	        @RequestParam Integer viceCaptainId) {

	    playerService.assignLeadership(
	            teamId,
	            captainId,
	            viceCaptainId);

	    return "Captain and Vice Captain Updated";
	}
}
