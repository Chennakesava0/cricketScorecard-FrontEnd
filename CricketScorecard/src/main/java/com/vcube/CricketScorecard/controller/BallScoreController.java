package com.vcube.CricketScorecard.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.vcube.CricketScorecard.model.BallScore;
import com.vcube.CricketScorecard.service.BallScoreService;

@RestController
@CrossOrigin("*")
public class BallScoreController {

	@Autowired
	BallScoreService ballScoreService;
	
	@PostMapping("/scoreBall")
	public BallScore saveBallScore(@RequestBody BallScore ballScore) {
		return ballScoreService.saveBallScore(ballScore);
	}
	
	@GetMapping("/getAllBallScores")
	public List<BallScore> getAllBallScores(){
		return ballScoreService.getAllBallScores();
	}
	
	@GetMapping("/getBallScoreById/{id}")
	public BallScore getBallScoreById(@PathVariable Integer id) {
		return ballScoreService.getBallScoreById(id);
	}
	
	@GetMapping("/getBallScoreByMatch/{matchId}")
	public List<BallScore> getBallScoreByMatch(@PathVariable Integer matchId){
		return ballScoreService.getBallScoreByMatch(matchId);
	}
	
	@GetMapping("/getBallScoreByMatchSorted/{matchId}")
	public List<BallScore> getBallScoreByMatchSorted(
	        @PathVariable Integer matchId) {

	    return ballScoreService
	            .getBallScoreByMatchSorted(matchId);
	}
	
	@PutMapping("/updateBallScore/{id}")
	public BallScore updateBallScore(@PathVariable Integer id,
			                         @RequestBody BallScore ballScore) {
		return ballScoreService.updateBallScore(id, ballScore);
	}
	
	@DeleteMapping("/deleteBallScoreById/{id}")
	public String deleteBallScoreById(@PathVariable Integer id) {
		ballScoreService.deleteBallScoreById(id);
		
		return "BallScore Was Deleted Successfully";
	}
}
