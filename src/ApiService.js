import axios from "axios";

const BASE_URL = "http://localhost:9090";

class ApiService{

    getDashboard(){
        return axios.get(`${BASE_URL}/dashboard`)
    }

    addTeams(team){
        return axios.post(`${BASE_URL}/saveTeam`,team)
    }

    getTeams(){
        return axios.get(`${BASE_URL}/getAllTeams`)
    }

    addPlayers(player){
        return axios.post(`${BASE_URL}/savePlayer`,player)
    }

    getPlayers(){
        return axios.get(`${BASE_URL}/getAllPlayers`)
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

    getMatches(){
        return axios.get(`${BASE_URL}/getAllMatches`)
    }

    getLiveScore(matchId){
        return axios.get(`${BASE_URL}/liveScore/${matchId}`)
    }

    getBatting(matchId){
        return axios.get(`${BASE_URL}/battingScorecard/${matchId}`)
    }

    getBowling(matchId){
        return axios.get(`${BASE_URL}/bowlingScorecard/${matchId}`)
    }

    getResult(matchId){
        return axios.get(`${BASE_URL}/matchResult/${matchId}`)
    }

}


export default new ApiService;