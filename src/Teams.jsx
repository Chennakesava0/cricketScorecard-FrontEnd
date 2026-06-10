import { useEffect, useState } from "react";
import ApiService from "./ApiService";
import { useNavigate } from "react-router-dom";

function Teams() {

    const [teams, setTeams] = useState([]);
    const [teamName, setTeamName] = useState("");
    const navigate = useNavigate();


    const loadTeams = () => {
        ApiService.getTeams()
            .then(res => setTeams(res.data))
            .catch(err => console.error(err));
    };

    useEffect(() => {
        loadTeams();
    }, []);

    const handleAddTeam = () => {

        if (!teamName.trim()) {
            alert("Please enter a team name");
            return;
        }

        const newTeam = {
            teamName: teamName
        };

        ApiService.addTeams(newTeam)
            .then(() => {
                setTeamName("");
                loadTeams();
            })
            .catch(err => console.log(err));
    };

    return (
        <div className="container mt-4">

            <div className="card shadow p-4">

                <div className="d-flex justify-content-between align-items-center mb-3">

                    <h2 className="mb-0">🏏 Teams Management</h2>

                    <button
                        className="btn btn-secondary"
                        onClick={() => navigate("/")}
                    >
                        Back
                    </button>

                </div>
                <h5 className="text-secondary mb-3">
                    Total Teams: {teams.length}
                </h5>

                <div className="input-group mb-4">

                    <input
                        type="text"
                        className="form-control"
                        value={teamName}
                        onChange={(e) => setTeamName(e.target.value)}
                        placeholder="Enter Team Name"
                    />

                    <button
                        className="btn btn-primary"
                        onClick={handleAddTeam}
                    >
                        Add Team
                    </button>

                </div>

                <table className="table table-striped table-hover">

                    <thead className="table-dark">
                        <tr>
                            <th>#</th>
                            <th>Team Name</th>
                        </tr>
                    </thead>

                    <tbody>
                        {teams.map((team, index) => (
                            <tr key={team.id}>
                                <td>{index + 1}</td>
                                <td>{team.teamName}</td>
                            </tr>
                        ))}
                    </tbody>

                </table>

            </div>

        </div>
    );
}

export default Teams;