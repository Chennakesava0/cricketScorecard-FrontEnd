import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ApiService from "./ApiService";
import "./Dashboard.css";

function Dashboard() {

    const [data, setData] = useState({});
    const navigate = useNavigate();

    useEffect(() => {

        ApiService.getDashboard()
            .then(res => setData(res.data))
            .catch(err => console.error(err));

    }, []);

    return (
        <div className="container mt-4">

            <h2 className="text-center mb-4">
                🏏 Cricket Scorecard Dashboard
            </h2>

            <div className="row g-4">

                <div className="col-md-4">
                    <div
                        className="card dashboard-card shadow"
                        onClick={() => navigate("/teams")}
                    >
                        <div className="card-body text-center">
                            <h5>Total Teams</h5>
                            <h2>{data.totalTeams}</h2>
                        </div>
                    </div>
                </div>

                <div className="col-md-4">
                    <div
                        className="card dashboard-card shadow"
                        onClick={() => navigate("/players")}
                    >
                        <div className="card-body text-center">
                            <h5>Total Players</h5>
                            <h2>{data.totalPlayers}</h2>
                        </div>
                    </div>
                </div>

                <div className="col-md-4">
                    <div
                        className="card dashboard-card shadow"
                        onClick={() => navigate("/matches")}
                    >
                        <div className="card-body text-center">
                            <h5>Total Matches</h5>
                            <h2>{data.totalMatches}</h2>
                        </div>
                    </div>
                </div>

                <div className="col-md-6">
                    <div className="card dashboard-card shadow"
                     onClick={() => navigate("/livescore/:matchId")}
                    >
                        <div className="card-body text-center">
                            <h5>Live Matches</h5>
                            <h2>{data.liveMatches}</h2>
                        </div>
                    </div>
                </div>

                <div className="col-md-6">
                    <div className="card dashboard-card shadow">
                        <div className="card-body text-center">
                            <h5>Completed Matches</h5>
                            <h2>{data.completedMatches ?? 0}</h2>
                        </div>
                    </div>
                </div>

            </div>

        </div>
    );
}

export default Dashboard;