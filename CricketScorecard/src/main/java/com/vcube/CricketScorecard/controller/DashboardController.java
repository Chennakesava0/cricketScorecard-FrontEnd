package com.vcube.CricketScorecard.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import com.vcube.CricketScorecard.dto.DashboardDTO;
import com.vcube.CricketScorecard.service.DashboardService;

@RestController
@CrossOrigin("*")
public class DashboardController {

	@Autowired
	DashboardService dashboardService;
	
	@GetMapping("/dashboard")
	public DashboardDTO getDashboardData() {
		return dashboardService.getDashboardData();
	}
}
