import axios from "axios";

const BASE_URL = "http://localhost:9090";

class CricApiService {

    // =====================================================
    // DIRECT CRICAPI DATA
    // CricketApiController
    // =====================================================

    // Get current matches directly from CricAPI
    getCurrentMatches() {
        return axios.get(
            `${BASE_URL}/cricket-api/currentMatches`
        );
    }


    // Get series directly from CricAPI
    getSeries() {
        return axios.get(
            `${BASE_URL}/cricket-api/series`
        );
    }


    // Get match information directly from CricAPI
    getMatchInfo(matchId) {
        return axios.get(
            `${BASE_URL}/cricket-api/matchInfo/${matchId}`
        );
    }


    // Get scorecard directly from CricAPI
    getScorecard(matchId) {
        return axios.get(
            `${BASE_URL}/cricket-api/scorecard/${matchId}`
        );
    }



    // =====================================================
    // API MATCH DATABASE
    // ApiMatchController
    // =====================================================

    // Get all CricAPI matches stored in our database
    getApiMatches() {
        return axios.get(
            `${BASE_URL}/api/matches`
        );
    }


    // Save an API match manually
    saveApiMatch(match) {
        return axios.post(
            `${BASE_URL}/api/matches/save`,
            match
        );
    }


    // Get API match by database ID
    getApiMatchById(id) {
        return axios.get(
            `${BASE_URL}/api/matches/${id}`
        );
    }


    // Get API match by CricAPI match ID
    getApiMatchByApiKey(apiMatchKey) {
        return axios.get(
            `${BASE_URL}/api/matches/api-key/${apiMatchKey}`
        );
    }


    // Update API match
    updateApiMatch(id, match) {
        return axios.put(
            `${BASE_URL}/api/matches/${id}`,
            match
        );
    }


    // Delete API match
    deleteApiMatch(id) {
        return axios.delete(
            `${BASE_URL}/api/matches/${id}`
        );
    }



    // =====================================================
    // API SERIES DATABASE
    // ApiSeriesController
    // =====================================================

    // Get all API series stored in our database
    getApiSeries() {
        return axios.get(
            `${BASE_URL}/api/series`
        );
    }


    // Save API series manually
    saveApiSeries(series) {
        return axios.post(
            `${BASE_URL}/api/series/save`,
            series
        );
    }


    // Get API series by database ID
    getApiSeriesById(id) {
        return axios.get(
            `${BASE_URL}/api/series/${id}`
        );
    }


    // Get API series by status
    getApiSeriesByStatus(status) {
        return axios.get(
            `${BASE_URL}/api/series/status/${status}`
        );
    }


    // Get API series by CricAPI series ID
    getApiSeriesBySeriesId(seriesId) {
        return axios.get(
            `${BASE_URL}/api/series/series-id/${seriesId}`
        );
    }


    // Update API series
    updateApiSeries(id, series) {
        return axios.put(
            `${BASE_URL}/api/series/${id}`,
            series
        );
    }


    // Delete API series
    deleteApiSeries(id) {
        return axios.delete(
            `${BASE_URL}/api/series/${id}`
        );
    }

}

export default new CricApiService();