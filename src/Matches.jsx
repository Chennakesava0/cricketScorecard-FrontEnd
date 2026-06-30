
import { useEffect, useState } from "react";
import ApiService from "./ApiService";
import { useNavigate } from "react-router-dom";

function Matches() {

    const [matches, setMatches] = useState([]);
    const [teams, setTeams] = useState([]);

    const [team1Id, setTeam1Id] = useState("");
    const [team2Id, setTeam2Id] = useState("");
    const [matchDate, setMatchDate] = useState("");
    const [matchTime, setMatchTime] = useState("");
    const [venue, setVenue] = useState("");
    const [totalOvers, setTotalOvers] = useState("");
    const [status, setStatus] = useState("UPCOMING");
    const [editMatchId, setEditMatchId] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        loadMatches();
        loadTeams();
    }, []);

    const startMatch = (match) => {

        const now = new Date();

        const matchDateTime = new Date(
            `${match.matchDate}T${match.matchTime}`
        );

        if (now < matchDateTime) {
            alert("Match cannot be started before scheduled time");
            return;
        }

        navigate(`/match-setup/${match.matchId}`);
    };
    const deleteMatch = (matchId) => {
        alert("Deleting Match : " + matchId);
    };
    const editMatch = (match) => {

        setEditMatchId(match.matchId);

        setTeam1Id(match.team1.id);
        setTeam2Id(match.team2.id);
        setMatchDate(match.matchDate);
        setMatchTime(match.matchTime || "");
        setVenue(match.venue);
        setTotalOvers(match.totalOvers);
        setStatus(match.status);

    };

    const loadMatches = () => {
        ApiService.getMatches()
            .then(res => setMatches(res.data))
            .catch(err => console.log(err));
    };

    const loadTeams = () => {
        ApiService.getTeams()
            .then(res => setTeams(res.data))
            .catch(err => console.log(err));
    };

    const handleAddMatch = () => {

        if (
            !team1Id ||
            !team2Id ||
            !matchDate ||
            !matchTime ||
            !venue ||
            !totalOvers
        ) {
            alert("Please fill all fields");
            return;
        }

        if (team1Id === team2Id) {
            alert("Team 1 and Team 2 cannot be same");
            return;
        }

        const match = {
            team1: {
                id: team1Id
            },
            team2: {
                id: team2Id
            },
            matchDate,
            matchTime,
            venue,
            totalOvers,
            status
        };

        const apiCall = editMatchId
            ? ApiService.updateMatch(editMatchId, match)
            : ApiService.addMatch(match);

        apiCall
            .then(() => {

                alert(
                    editMatchId
                        ? "Match Updated Successfully"
                        : "Match Added Successfully"
                );

                setTeam1Id("");
                setTeam2Id("");
                setMatchDate("");
                setMatchTime("");
                setVenue("");
                setTotalOvers("");
                setStatus("UPCOMING");
                setEditMatchId(null);

                loadMatches();

            })
            .catch(err => console.log(err));
    };

    const generateTimeSlots = () => {
        const slots = [];

        for (let h = 0; h < 24; h++) {
            for (let m of ["00", "30"]) {
                const hour = String(h).padStart(2, "0");
                slots.push(`${hour}:${m}`);
            }
        }

        return slots;
    };

    const formatTime = (time) => {

        if (!time) return "-";

        const parts = time.split(":");

        let hours = parseInt(parts[0]);
        const minutes = parts[1];

        const ampm = hours >= 12 ? "PM" : "AM";

        hours = hours % 12;
        hours = hours ? hours : 12;

        return `${hours}:${minutes} ${ampm}`;
    };

    return (
        <div className="container mt-4">

            <div className="card shadow-lg p-4">

                <div className="d-flex justify-content-between">

                    <h2 className="text-primary">
                        🏏 Match Management
                    </h2>

                    <button
                        className="btn btn-secondary"
                        onClick={() => navigate("/")}
                    >
                        Back
                    </button>

                </div>

                <hr />

                <h5>
                    Total Matches :
                    <span className="text-success">
                        {" "}{matches.length}
                    </span>
                </h5>

                <div className="row g-2 mt-3">

                    <div className="col-md-3">

                        <select
                            className="form-select"
                            value={team1Id}
                            onChange={(e) =>
                                setTeam1Id(e.target.value)
                            }
                        >
                            <option value="">
                                Select Team 1
                            </option>

                            {teams.map(team => (
                                <option
                                    key={team.id}
                                    value={team.id}
                                >
                                    {team.teamName}
                                </option>
                            ))}

                        </select>

                    </div>

                    <div className="col-md-3">

                        <select
                            className="form-select"
                            value={team2Id}
                            onChange={(e) =>
                                setTeam2Id(e.target.value)
                            }
                        >
                            <option value="">
                                Select Team 2
                            </option>

                            {teams.map(team => (
                                <option
                                    key={team.id}
                                    value={team.id}
                                >
                                    {team.teamName}
                                </option>
                            ))}

                        </select>

                    </div>

                    <div className="col-md-2">
                        <input
                            type="date"
                            className="form-control"
                            value={matchDate}
                            onChange={(e) =>
                                setMatchDate(e.target.value)
                            }
                        />
                    </div>

                    <select
                        className="col-md-2"
                        value={matchTime}
                        onChange={(e) => setMatchTime(e.target.value)}
                    >
                        <option value="">Select Time</option>

                        {generateTimeSlots().map((time) => (
                            <option key={time} value={time}>
                                {formatTime(time)}
                            </option>
                        ))}
                    </select>
                    <div className="col-md-2">

                        <input
                            type="text"
                            className="form-control"
                            placeholder="Venue"
                            value={venue}
                            onChange={(e) =>
                                setVenue(e.target.value)
                            }
                        />

                    </div>

                    <div className="col-md-1">

                        <input
                            type="number"
                            className="form-control"
                            placeholder="Overs"
                            value={totalOvers}
                            onChange={(e) =>
                                setTotalOvers(e.target.value)
                            }
                        />

                    </div>

                </div>

                <div className="row mt-3">

                    <div className="col-md-3">

                        <select
                            className="form-select"
                            value={status}
                            onChange={(e) =>
                                setStatus(e.target.value)
                            }
                        >
                            <option value="UPCOMING">
                                UPCOMING
                            </option>
                            <option value="LIVE">
                                LIVE
                            </option>
                            <option value="COMPLETED">
                                COMPLETED
                            </option>
                        </select>

                    </div>

                    <div className="col-md-3">

                        <button
                            className="btn btn-primary"
                            onClick={handleAddMatch}
                        >
                            {editMatchId ? "Update Match" : "Add Match"}
                        </button>

                    </div>

                </div>

                <hr />

                <table className="table table-bordered">

                    <thead className="table-dark">
                        <tr>
                            <th>#</th>
                            <th>Team 1</th>
                            <th>Team 2</th>
                            <th>Date</th>
                            <th>Time</th>
                            <th>Venue</th>
                            <th>Overs</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>

                    <tbody>

                        {matches.map((match, index) => (

                            <tr key={match.matchId}>

                                <td>{index + 1}</td>
                                <td>{match.team1?.teamName}</td>
                                <td>{match.team2?.teamName}</td>
                                <td>{match.matchDate}</td>
                                <td>

                                    {formatTime(match.matchTime)}
                                </td>
                                <td>{match.venue}</td>
                                <td>{match.totalOvers}</td>
                                <td>{match.status}</td>


                                <td>

                                    {match.status === "UPCOMING" && (
                                        <>
                                            <button
                                                className="btn btn-primary btn-sm me-2"
                                                onClick={() => startMatch(match)}
                                            >
                                                Start Match
                                            </button>

                                            <button
                                                className="btn btn-warning btn-sm me-2"
                                                onClick={() => editMatch(match)}
                                            >
                                                Edit
                                            </button>

                                            <button
                                                className="btn btn-danger btn-sm"
                                                onClick={() => deleteMatch(match.matchId)}
                                            >
                                                Delete
                                            </button>
                                        </>
                                    )}

                                    {match.status === "LIVE" && (
                                        <button
                                            className="btn btn-success btn-sm"
                                            onClick={() =>
                                                navigate(`/matchscoring/${match.matchId}`)
                                            }
                                        >
                                            Continue Scoring
                                        </button>
                                    )}

                                    {match.status === "COMPLETED" && (
                                        <button
                                            className="btn btn-info btn-sm"
                                            onClick={() =>
                                                navigate(`/scorecard/${match.matchId}`)
                                            }
                                        >
                                            View Scorecard
                                        </button>
                                    )}

                                </td>

                            </tr>

                        ))}

                    </tbody>

                </table>

            </div>

        </div>
    );
}

export default Matches;