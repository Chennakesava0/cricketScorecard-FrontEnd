import axios from "axios";

const BASE_URL = "http://localhost:9090";

class ApiService {

    getDashboard() {
        return axios.get(`${BASE_URL}/dashboard`)
    }

    addTeams(team) {
        return axios.post(`${BASE_URL}/saveTeam`, team)
    }

    getTeams() {
        return axios.get(`${BASE_URL}/getAllTeams`)
    }

    addPlayers(player) {
        return axios.post(`${BASE_URL}/savePlayer`, player)
    }

    getPlayers() {
        return axios.get(`${BASE_URL}/getAllPlayers`)
    }

    getPlayersByTeam(teamId) {
        return axios.get(
            `${BASE_URL}/getPlayerByTeam/${teamId}`
        );
    }

    assignCaptainViceCaptain(
        teamId,
        captainId,
        viceCaptainId
    ) {
        return axios.put(
            `${BASE_URL}/assignLeadership?teamId=${teamId}&captainId=${captainId}&viceCaptainId=${viceCaptainId}`
        );
    }

    getMatches() {
        return axios.get(`${BASE_URL}/getAllMatches`)
    }

    addMatch(match) {
        return axios.post(`${BASE_URL}/saveMatch`, match)
    }

    getMatchById(matchId) {
        return axios.get(
            `${BASE_URL}/getMatchById/${matchId}`
        );
    }


    updateMatch(id, match) {
        return axios.put(`${BASE_URL}/updateMatch/${id}`, match);
    }
    getTotalMatches() {
        return axios.get(`${BASE_URL}/getTotalMatches`)
    }


    getUpcomingMatches() {
        return axios.get(`${BASE_URL}/getUpcomingMatches`);
    }

    getLiveMatches() {
        return axios.get(`${BASE_URL}/getLiveMatches`);
    }

    getCompletedMatches() {
        return axios.get(`${BASE_URL}/getCompletedMatches`);

    }

    savePlaying11(data) {
        return axios.post(
            `${BASE_URL}/save-playing11`,
            data
        );
    }

    getPlaying11(matchId) {
        return axios.get(
            `${BASE_URL}/playing11/${matchId}`
        );
    }

    getPlaying11ByTeam(matchId, teamId) {
        return axios.get(
            `${BASE_URL}/getplaying11?matchId=${matchId}&teamId=${teamId}`
        );
    }

    // Match State

    startMatch(data) {
        return axios.post(
            `${BASE_URL}/start`,
            data
        );
    }

    getMatchState(matchId) {
        return axios.get(
            `${BASE_URL}/matchState/${matchId}`
        );
    }

    updateCurrentPlayers(matchId, data) {
        return axios.put(
            `${BASE_URL}/updatePlayers/${matchId}`,
            data
        );
    }

    getOutPlayers(matchId, innings) {
        return axios.get(
            `${BASE_URL}/outPlayers/${matchId}/${innings}`
        );
    }

    // Live Score

    getLiveScore(matchId) {
        return axios.get(
            `${BASE_URL}/liveScore/${matchId}`
        );
    }


    getBallScoreByMatchAndInnings(matchId, innings) {
        return axios.get(
            `${BASE_URL}/getBallScoreByMatchAndInnings/${matchId}/${innings}`
        );
    }

    scoreBall(dto) {
        return axios.post(
            `${BASE_URL}/scoreBall`,
            dto
        );
    }

    getBattingScorecard(matchId, teamId, innings) {
        return axios.get(
            `${BASE_URL}/battingScorecard/${matchId}?teamId=${teamId}&innings=${innings}`
        );
    }

    getBowlingScorecard(matchId, teamId, innings) {
        return axios.get(
            `${BASE_URL}/bowlingScorecard/${matchId}?teamId=${teamId}&innings=${innings}`
        );
    }

    getTeamScorecard(matchId, teamId) {
        return axios.get(
            `${BASE_URL}/teamScorecard/${matchId}?teamId=${teamId}`
        );
    }

    getResult(matchId) {
        return axios.get(`${BASE_URL}/matchResult/${matchId}`)
    }

}


export default new ApiService;