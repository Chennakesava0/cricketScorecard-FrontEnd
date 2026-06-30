import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ApiService from "./ApiService";

function MatchSetup() {

    const { matchId } = useParams();
    const navigate = useNavigate();

    const [match, setMatch] = useState(null);

    const [team1Players, setTeam1Players] = useState([]);
    const [team2Players, setTeam2Players] = useState([]);

    const [playingXI1, setPlayingXI1] = useState([]);
    const [playingXI2, setPlayingXI2] = useState([]);

    const [tossWinner, setTossWinner] = useState("");
    const [electedTo, setElectedTo] = useState("");

    useEffect(() => {
        let isMounted = true;

        const loadMatchDetails = async () => {
            try {
                const matchRes = await ApiService.getMatchById(matchId);
                const matchData = matchRes.data;

                if (!isMounted) return;

                setMatch(matchData);

                const [team1Res, team2Res] = await Promise.all([
                    ApiService.getPlayersByTeam(matchData.team1.id),
                    ApiService.getPlayersByTeam(matchData.team2.id)
                ]);

                if (!isMounted) return;

                setTeam1Players(team1Res.data);
                setTeam2Players(team2Res.data);

            } catch (error) {
                console.log(error);
            }
        };

        loadMatchDetails();

        return () => {
            isMounted = false;
        };

    }, [matchId]);

    const toggleTeam1Player = (playerId) => {
        setPlayingXI1(prev =>
            prev.includes(playerId)
                ? prev.filter(id => id !== playerId)
                : prev.length < 11
                    ? [...prev, playerId]
                    : (alert("Only 11 Players Allowed"), prev)
        );
    };

    const toggleTeam2Player = (playerId) => {
        setPlayingXI2(prev =>
            prev.includes(playerId)
                ? prev.filter(id => id !== playerId)
                : prev.length < 11
                    ? [...prev, playerId]
                    : (alert("Only 11 Players Allowed"), prev)
        );
    };

    const formatRole = (role) => {
        if (!role) return "";

        switch (role.toUpperCase()) {
            case "BATSMAN":
            case "BAT":
                return "Batsman";
            case "BOWLER":
            case "BOWL":
                return "Bowler";
            case "WICKETKEEPER":
            case "WK":
                return "Wicketkeeper";
            default:
                return role;
        }
    };

    const saveMatchSetup = async () => {

        if (playingXI1.length !== 11 || playingXI2.length !== 11) {
            alert("Select 11 players for both teams");
            return;
        }

        if (!tossWinner || !electedTo) {
            alert("Select toss details");
            return;
        }

        try {

            await ApiService.savePlaying11({
                matchId: Number(matchId),
                playerIds: playingXI1
            });

            await ApiService.savePlaying11({
                matchId: Number(matchId),
                playerIds: playingXI2
            });

            await ApiService.updateMatch(matchId, {
                ...match,
                tossWinner,
                electedTo
            });

            await ApiService.startMatch({
                matchId: Number(matchId)
            });

            alert("Match Started Successfully");

            navigate(`/matchscoring/${matchId}`);

        } catch (error) {
    
    alert(error.response?.data || "Failed To Start Match");
}
    };

    if (!match) return <div>Loading...</div>;

    const canStart =
        playingXI1.length === 11 &&
        playingXI2.length === 11 &&
        tossWinner &&
        electedTo;

    return (
        <div className="container mt-4">

            <div
                className="card border-0 shadow-lg p-4"
                style={{
                    borderRadius: "20px",
                    background: "#ffffff"
                }}
            >

                <div className="text-center mb-4">

                    <h2 className="fw-bold text-primary">
                        Match Setup
                    </h2>

                    <h4 className="mt-3 fw-bold">
                        <div className="row text-center mt-4 mb-4">

                            <div className="col-md-4">
                                <div className="card border-0 shadow-sm p-3">
                                    <h6>Venue</h6>
                                    <strong>{match.venue}</strong>
                                </div>
                            </div>

                            <div className="col-md-4">
                                <div className="card border-0 shadow-sm p-3">
                                    <h6>Overs</h6>
                                    <strong>{match.totalOvers}</strong>
                                </div>
                            </div>

                            <div className="col-md-4">
                                <div className="card border-0 shadow-sm p-3">
                                    <h6>Date</h6>
                                    <strong>{match.matchDate}</strong>
                                </div>
                            </div>

                        </div>
                        {match.team1?.teamName}
                        <span className="mx-3 text-danger">VS</span>
                        {match.team2?.teamName}
                    </h4>

                </div>

                <div className="row mt-4">

                    {/* TEAM 1 */}
                    <div className="col-md-6">
                        <div
                            className="card border-0 shadow-sm p-3 h-100"
                            style={{ borderRadius: "15px" }}
                        >
                            <h5 className="fw-bold text-primary mb-3">
                                Team 1 Playing XI ({playingXI1.length}/11)
                            </h5>

                            {team1Players.map(player => (
                                <div
                                    key={player.id}
                                    className={`form-check p-2 mb-2 rounded border ${playingXI1.includes(player.id)
                                            ? "bg-primary text-white"
                                            : ""
                                        }`}
                                >

                                    <input
                                        type="checkbox"
                                        className="form-check-input"
                                        checked={playingXI1.includes(player.id)}
                                        onChange={() => toggleTeam1Player(player.id)}
                                    />

                                    <label className="form-check-label d-flex justify-content-between w-100">
                                        <span>
                                            {player.playerName}
                                            {player.captain && " (C)"}
                                            {player.viceCaptain && " (VC)"}
                                        </span>
                                        <span>{formatRole(player.role)}</span>
                                    </label>

                                </div>
                            ))}
                        </div>
                    </div>

                    {/* TEAM 2 */}
                    <div className="col-md-6">
                        <div className="card p-3">
                            <h5 className="fw-bold text-success mb-3">
                                Team 2 Playing XI ({playingXI2.length}/11)
                            </h5>

                            {team2Players.map(player => (
                                <div
                                    key={player.id}
                                    className={`form-check p-2 mb-2 rounded border ${playingXI2.includes(player.id)
                                            ? "bg-success text-white"
                                            : ""
                                        }`}
                                >

                                    <input
                                        type="checkbox"
                                        className="form-check-input"
                                        checked={playingXI2.includes(player.id)}
                                        onChange={() => toggleTeam2Player(player.id)}
                                    />

                                    <label className="form-check-label d-flex justify-content-between w-100">
                                        <span>
                                            {player.playerName}
                                            {player.captain && " (C)"}
                                            {player.viceCaptain && " (VC)"}
                                        </span>
                                        <span>{formatRole(player.role)}</span>
                                    </label>

                                </div>
                            ))}
                        </div>
                    </div>

                </div>

                <hr />

                {/* TOSS */}
                <h5 className="fw-bold text-dark mb-3">
                    🪙 Toss Details
                </h5>

                <div className="row">

                    <div className="col-md-6">
                        <select
                            className="form-select"
                            value={tossWinner}
                            onChange={(e) => setTossWinner(e.target.value)}
                        >
                            <option value="">Select Toss Winner</option>
                            <option value={match.team1?.teamName}>{match.team1?.teamName}</option>
                            <option value={match.team2?.teamName}>{match.team2?.teamName}</option>
                        </select>
                    </div>

                    <div className="col-md-6">
                        <select
                            className="form-select"
                            value={electedTo}
                            onChange={(e) => setElectedTo(e.target.value)}
                        >
                            <option value="">Select Decision</option>
                            <option value="BAT">BAT</option>
                            <option value="BOWL">BOWL</option>
                        </select>
                    </div>

                </div>

                <div className="mt-4 text-center">
                    <button
                        className="btn btn-success btn-lg px-5"
                        onClick={saveMatchSetup}
                        disabled={!canStart}
                    >
                        🏏 Start Match
                    </button>
                </div>

            </div>
        </div>
    );
}

export default MatchSetup;