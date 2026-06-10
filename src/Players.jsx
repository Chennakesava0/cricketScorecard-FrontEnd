import { useEffect, useState } from "react";
import ApiService from "./ApiService";
import { useNavigate } from "react-router-dom";

function Players() {

    const [players, setPlayers] = useState([]);
    const [teams, setTeams] = useState([]);

    const [playerName, setPlayerName] = useState("");
    const [teamId, setTeamId] = useState("");
    const [role, setRole] = useState("");

    const [selectedTeam, setSelectedTeam] = useState("");
    const [captainId, setCaptainId] = useState("");
    const [viceCaptainId, setViceCaptainId] = useState("");

    // ✅ Pagination state (NEW)
    const [currentPage, setCurrentPage] = useState(0);

    const navigate = useNavigate();

    const loadPlayers = () => {
        ApiService.getPlayers()
            .then(res => setPlayers(res.data))
            .catch(err => console.log(err));
    };

    const loadTeams = () => {
        ApiService.getTeams()
            .then(res => setTeams(res.data))
            .catch(err => console.log(err));
    };

    useEffect(() => {
        loadPlayers();
        loadTeams();
    }, []);

    const handleAddPlayer = () => {

        if (!playerName.trim() || !teamId || !role) {
            alert("Please fill all fields");
            return;
        }

        const player = {
            playerName,
            role,
            captain: false,
            viceCaptain: false,
            team: {
                id: teamId
            }
        };

        ApiService.addPlayers(player)
            .then(() => {

                setPlayerName("");
                setTeamId("");
                setRole("");

                loadPlayers();

            })
            .catch(err => console.log(err));
    };

    const handleSaveLeadership = () => {

        if (!selectedTeam) {
            alert("Select Team");
            return;
        }

        if (!captainId || !viceCaptainId) {
            alert("Select Captain and Vice Captain");
            return;
        }

        if (captainId === viceCaptainId) {
            alert("Captain and Vice Captain cannot be same");
            return;
        }

        ApiService.assignCaptainViceCaptain(
            selectedTeam,
            captainId,
            viceCaptainId
        )
            .then(() => {

                alert("Leadership Updated Successfully");

                setCaptainId("");
                setViceCaptainId("");

                loadPlayers();

            })
            .catch(err => console.log(err));
    };

    // ✅ Pagination Logic (NEW)
    const currentTeam = teams[currentPage];

    const paginatedPlayers = players.filter(
        player => player.team?.id === currentTeam?.id
    );

    return (
        <div className="container mt-4">

            <div className="card shadow-lg p-4">

                {/* Header */}
                <div className="d-flex justify-content-between align-items-center">

                    <h2 className="text-primary">
                        🏏 Players Management
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
                    Total Players :
                    <span className="text-success">
                        {" "}{players.length}
                    </span>
                </h5>

                {/* Add Player */}
                <div className="row g-2 mt-3">

                    <div className="col-md-4">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Player Name"
                            value={playerName}
                            onChange={(e) =>
                                setPlayerName(e.target.value)
                            }
                        />
                    </div>

                    <div className="col-md-3">
                        <select
                            className="form-select"
                            value={teamId}
                            onChange={(e) =>
                                setTeamId(e.target.value)
                            }
                        >
                            <option value="">
                                Select Team
                            </option>

                            {teams.map(team => (
                                <option key={team.id} value={team.id}>
                                    {team.teamName}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="col-md-3">
                        <select
                            className="form-select"
                            value={role}
                            onChange={(e) =>
                                setRole(e.target.value)
                            }
                        >
                            <option value="">
                                Select Role
                            </option>
                            <option value="BATSMAN">Batsman</option>
                            <option value="BOWLER">Bowler</option>
                            <option value="ALL_ROUNDER">All Rounder</option>
                            <option value="WICKET_KEEPER">Wicket Keeper</option>
                        </select>
                    </div>

                    <div className="col-md-2">
                        <button
                            className="btn btn-primary w-100"
                            onClick={handleAddPlayer}
                        >
                            Add Player
                        </button>
                    </div>

                </div>

                <hr />

                {/* Leadership Section */}
                <h4 className="text-success">
                    Team Leadership
                </h4>

                <div className="row g-2 mt-2">

                    <div className="col-md-4">

                        <select
                            className="form-select"
                            value={selectedTeam}
                            onChange={(e) => {
                                setSelectedTeam(e.target.value);
                                setCaptainId("");
                                setViceCaptainId("");
                            }}
                        >

                            <option value="">
                                Select Team
                            </option>

                            {teams.map(team => (
                                <option key={team.id} value={team.id}>
                                    {team.teamName}
                                </option>
                            ))}

                        </select>

                    </div>

                    <div className="col-md-3">

                        <select
                            className="form-select"
                            value={captainId}
                            onChange={(e) =>
                                setCaptainId(e.target.value)
                            }
                        >

                            <option value="">
                                Select Captain
                            </option>

                            {players
                                .filter(p => p.team?.id == selectedTeam)
                                .map(player => (
                                    <option key={player.id} value={player.id}>
                                        {player.playerName}
                                    </option>
                                ))
                            }

                        </select>

                    </div>

                    <div className="col-md-3">

                        <select
                            className="form-select"
                            value={viceCaptainId}
                            onChange={(e) =>
                                setViceCaptainId(e.target.value)
                            }
                        >

                            <option value="">
                                Select Vice Captain
                            </option>

                            {players
                                .filter(p => p.team?.id == selectedTeam)
                                .map(player => (
                                    <option key={player.id} value={player.id}>
                                        {player.playerName}
                                    </option>
                                ))
                            }

                        </select>

                    </div>

                    <div className="col-md-2">

                        <button
                            className="btn btn-success w-100"
                            onClick={handleSaveLeadership}
                        >
                            Save
                        </button>

                    </div>

                </div>

                <hr />

                {/* Players Table */}
                <table className="table table-striped table-hover">

                    <thead className="table-dark">
                        <tr>
                            <th>#</th>
                            <th>Player</th>
                            <th>Role</th>
                            <th>Team</th>
                            <th>Captain</th>
                            <th>Vice Captain</th>
                        </tr>
                    </thead>

                    <tbody>

                        {paginatedPlayers.map((player, index) => (

                            <tr key={player.id}>

                                <td>{index + 1}</td>
                                <td>{player.playerName}</td>
                                <td>{player.role}</td>
                                <td>{player.team?.teamName}</td>
                                <td>
                                    {player.captain ? "👑 Captain" : "-"}
                                </td>
                                <td>
                                    {player.viceCaptain ? "⭐ Vice Captain" : "-"}
                                </td>

                            </tr>

                        ))}

                    </tbody>

                </table>

                {/* Pagination Controls */}
                <div className="d-flex justify-content-center align-items-center gap-3 mt-4">

                    <button
                        className="btn btn-outline-primary"
                        disabled={currentPage === 0}
                        onClick={() => setCurrentPage(currentPage - 1)}
                    >
                        Previous
                    </button>

                    <div className="text-center">

                        <h5 className="mb-0 text-primary">
                            {currentTeam?.teamName || "No Team Selected"}
                        </h5>

                        <small className="text-muted">
                            Page {currentPage + 1} of {teams.length}
                        </small>

                    </div>

                    <button
                        className="btn btn-outline-primary"
                        disabled={currentPage === teams.length - 1}
                        onClick={() => setCurrentPage(currentPage + 1)}
                    >
                        Next
                    </button>

                </div>

            </div>
        </div>
    );
}

export default Players;