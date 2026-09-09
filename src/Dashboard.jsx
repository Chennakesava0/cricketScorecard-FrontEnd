import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ApiService from "./ApiService";
import "./Dashboard.css";

function Dashboard() {

    const [data, setData] = useState({});
    const [liveMatches, setLiveMatches] = useState([]);
    const [upcomingMatches, setUpcomingMatches] = useState([]);
    const [completedMatches, setCompletedMatches] = useState([]);

    const navigate = useNavigate();

    useEffect(() => {

        // Dashboard count
        ApiService.getDashboard()
            .then(res => {
                setData(res.data);
            })
            .catch(err => {
                console.error("Dashboard error:", err);
            });


        // Get live matches
        ApiService.getLiveMatches()
            .then(res => {
                console.log("LIVE MATCHES:", res.data);
                setLiveMatches(res.data || []);
            })
            .catch(err => {
                console.error("Live matches error:", err);
                setLiveMatches([]);
            });


        // Get upcoming matches
        ApiService.getUpcomingMatches()
            .then(res => {
                console.log("UPCOMING MATCHES:", res.data);
                setUpcomingMatches(res.data || []);
            })
            .catch(err => {
                console.error("Upcoming matches error:", err);
                setUpcomingMatches([]);
            });


        // Get completed matches
        ApiService.getCompletedMatches()
            .then(res => {
                console.log("COMPLETED MATCHES:", res.data);
                setCompletedMatches(res.data || []);
            })
            .catch(err => {
                console.error("Completed matches error:", err);
                setCompletedMatches([]);
            });

    }, []);

    const handleLiveMatchesClick = () => {

        let matchId = null;

        // 1. First priority → Live match
        if (liveMatches.length > 0) {

            matchId = liveMatches[0].matchId;

        }

        // 2. If no live match → Upcoming match
        else if (upcomingMatches.length > 0) {

            matchId = upcomingMatches[0].matchId;

        }

        // 3. If no upcoming match → Completed match
        else if (completedMatches.length > 0) {

            matchId = completedMatches[0].matchId;

        }


        // Navigate if any match exists
        if (matchId) {

            console.log("Opening Livescore page with Match ID:", matchId);

            navigate(`/livescore/${matchId}`);

        }

    };

    return (

        <div className="dashboard-page">

            {/* ================= HEADER ================= */}

            <div className="dashboard-header">

                <div className="header-left">

                    <div className="header-logo">
                        🏏
                    </div>

                    <div>
                        <h1>Cricket Scorecard</h1>
                        <p>Match Management Dashboard</p>
                    </div>

                </div>

                <div className="header-badge">
                    LIVE SCORE SYSTEM
                </div>

            </div>


            {/* ================= OVERVIEW ================= */}

            <div className="section-heading">

                <div>
                    <h2>Dashboard Overview</h2>

                    <p>
                        Manage teams, players, matches and live cricket data
                    </p>
                </div>

            </div>


            {/* ================= STAT CARDS ================= */}

            <div className="dashboard-grid">


                {/* TOTAL TEAMS */}

                <div
                    className="dashboard-stat-card teams"
                    onClick={() => navigate("/teams")}
                >

                    <div className="stat-top">

                        <div className="stat-icon">
                            🏏
                        </div>

                        <span className="card-arrow">
                            →
                        </span>

                    </div>

                    <div className="stat-info">

                        <p>Total Teams</p>

                        <h2>
                            {data.totalTeams ?? 0}
                        </h2>

                        <span>
                            Manage Teams
                        </span>

                    </div>

                </div>


                {/* TOTAL PLAYERS */}

                <div
                    className="dashboard-stat-card players"
                    onClick={() => navigate("/players")}
                >

                    <div className="stat-top">

                        <div className="stat-icon">
                            👥
                        </div>

                        <span className="card-arrow">
                            →
                        </span>

                    </div>

                    <div className="stat-info">

                        <p>Total Players</p>

                        <h2>
                            {data.totalPlayers ?? 0}
                        </h2>

                        <span>
                            Manage Players
                        </span>

                    </div>

                </div>


                {/* TOTAL MATCHES */}

                <div
                    className="dashboard-stat-card matches"
                    onClick={() => navigate("/matches")}
                >

                    <div className="stat-top">

                        <div className="stat-icon">
                            🏆
                        </div>

                        <span className="card-arrow">
                            →
                        </span>

                    </div>

                    <div className="stat-info">

                        <p>Total Matches</p>

                        <h2>
                            {data.totalMatches ?? 0}
                        </h2>

                        <span>
                            Manage Matches
                        </span>

                    </div>

                </div>


                {/* LIVE MATCHES */}

                <div
                    className="dashboard-stat-card live"
                    onClick={handleLiveMatchesClick}
                >

                    <div className="stat-top">

                        <div className="stat-icon live-icon">
                            🔴
                        </div>

                        <span className="live-badge">
                            LIVE
                        </span>

                    </div>

                    <div className="stat-info">

                        <p>Live Matches</p>

                        <h2>
                            {data.liveMatches ?? 0}
                        </h2>

                        <span>
                            View Live Matches
                        </span>

                    </div>

                </div>

            </div>


            {/* ================= CRICAPI ================= */}

            <div className="cricapi-section">

                <div
                    className="cricapi-main-card"
                    onClick={() => navigate("/cricapi/matches")}
                >

                    {/* LEFT SIDE */}

                    <div className="cricapi-main-left">

                        <div className="cricapi-main-icon">
                            🌐
                        </div>

                        <div className="cricapi-main-content">

                            <div className="cricapi-heading-row">

                                <h2>
                                    CricAPI Cricket Matches
                                </h2>

                                <span className="api-status">
                                    API CONNECTED
                                </span>

                            </div>

                            <p>
                                Browse live and upcoming cricket matches
                                synchronized from CricAPI.
                            </p>

                            <span className="cricapi-description">
                                Select the matches you want to display
                                in your Cricket Scorecard system.
                            </span>

                        </div>

                    </div>


                    {/* RIGHT SIDE */}

                    <div className="cricapi-main-right">

                        <div className="cricapi-manage-text">
                            <span>Manage Matches</span>

                            <small>
                                Select API matches
                            </small>
                        </div>

                        <div className="cricapi-action-arrow">
                            →
                        </div>

                    </div>

                </div>

            </div>

        </div>
    );
}

export default Dashboard;