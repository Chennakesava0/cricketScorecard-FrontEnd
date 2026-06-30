import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ApiService from "./ApiService";
import { useParams } from "react-router-dom";

function LiveScore() {

    const navigate = useNavigate();

    const [upcomingMatches, setUpcomingMatches] = useState([]);
    const [liveMatches, setLiveMatches] = useState([]);
    const [completedMatches, setCompletedMatches] = useState([]);
    const [liveScore, setLiveScore] = useState(null);


    const getLiveScore = (match) => {
        if (!match) {
            return {
                team1: { runs: 0, wickets: 0, overs: "0.0" },
                team2: { runs: 0, wickets: 0, overs: "0.0" }
            };
        }

        const innings = Number(liveScore?.innings ?? 1);

        return {
            team1: {
                runs: innings === 1 ? (match.totalRuns || 0) : (match.team1Runs || 0),
                wickets: innings === 1 ? (match.totalWickets || 0) : (match.team1Wickets || 0),
                overs: innings === 1 ? (match.overs || "0.0") : (match.team1Overs || "0.0")
            },
            team2: {
                runs: innings === 2 ? (match.totalRuns || 0) : 0,
                wickets: innings === 2 ? (match.totalWickets || 0) : 0,
                overs: innings === 2 ? (match.overs || "0.0") : "0.0"
            }
        };
    };


    useEffect(() => {
        const fetchMatches = () => {
            ApiService.getUpcomingMatches()
                .then(res => setUpcomingMatches(res.data || []))
                .catch(() => setUpcomingMatches([]));

            ApiService.getLiveMatches()
                .then(res => setLiveMatches(res.data || []))
                .catch(() => setLiveMatches([]));

            ApiService.getCompletedMatches()
                .then(res => setCompletedMatches(res.data || []))
                .catch(() => setCompletedMatches([]));
        };

        // initial load
        fetchMatches();

        // 🔴 auto refresh every 2 seconds
        const interval = setInterval(fetchMatches, 2000);

        return () => clearInterval(interval);
    }, []);



    const upcomingMatch =
        upcomingMatches.length > 0
            ? upcomingMatches[0]
            : null;

    const liveMatch = liveMatches?.[0] || null;


    useEffect(() => {
        if (!liveMatch?.matchId) return;

        const fetchScore = () => {
            ApiService.getLiveScore(liveMatch.matchId)
                .then(res => {

                    setLiveScore(res.data);
                })
                .catch(err => {

                    setLiveScore(null);
                });
        };

        fetchScore();

        const interval = setInterval(fetchScore, 2000);

        return () => clearInterval(interval);

    }, [liveMatch?.matchId]);

    useEffect(() => {
    console.log("LIVE SCORE FROM API:", liveScore);
}, [liveScore]);


    const oversString =
        typeof liveScore?.overs === "string" || typeof liveScore?.overs === "number"
            ? String(liveScore.overs)
            : "0.0";

    let oversPart = "0";
    let ballsPart = "0";

    if (oversString.includes(".")) {
        const parts = oversString.split(".");
        oversPart = parts[0] ?? "0";
        ballsPart = parts[1] ?? "0";
    } else {
        oversPart = oversString;
        ballsPart = "0";
    }

    let totalOversFromApi = Number(oversPart) || 0;
    let currentBalls = Number(ballsPart) || 0;

    const matchOversLimit = Number(liveMatch?.totalOvers ?? 20);

    // split innings
    const secondInningsOvers =
        totalOversFromApi > matchOversLimit
            ? totalOversFromApi - matchOversLimit
            : totalOversFromApi;

    // IMPORTANT: balls bowled in 2nd innings only
    const ballsBowled =
        (secondInningsOvers * 6) + currentBalls;

    const totalBalls = matchOversLimit * 6;

    const ballsRemaining = Math.max(totalBalls - ballsBowled, 0);

    const innings = Number(liveScore?.innings || 1);

const target = Number(liveScore?.target ?? 0);
    

const currentRuns = Number(liveScore?.totalRuns || 0);

const runsRequired =
    innings === 2 ? Math.max(target - currentRuns, 0) : 0;


    // TEAM 1 (first innings or final score)
    const team1Runs =
        innings === 2
            ? (liveScore?.firstInningsRuns || 0)
            : (liveScore?.totalRuns || 0);

    const team1Wickets =
        innings === 2
            ? (liveScore?.firstInningsWickets || 0)
            : (liveScore?.totalWickets || 0);

    const team1Overs = `${matchOversLimit}.0`;

    // TEAM 2 (only active in 2nd innings)
    const team2Runs =
        innings === 2
            ? (liveScore?.totalRuns || 0)
            : 0;

    const team2Wickets =
        innings === 2
            ? (liveScore?.totalWickets || 0)
            : 0;

    const team2Overs =
        innings === 2
            ? `${secondInningsOvers}.${currentBalls}`
            : "0.0";



    const completedMatch =
        completedMatches.length > 0
            ? completedMatches[0]
            : null;

    const getDisplayDate = (matchDate) => {

        if (!matchDate) return "";

        const today = new Date();
        const tomorrow = new Date();

        tomorrow.setDate(today.getDate() + 1);

        const date = new Date(matchDate);

        if (date.toDateString() === today.toDateString()) {
            return "Today";
        }

        if (date.toDateString() === tomorrow.toDateString()) {
            return "Tomorrow";
        }

        return date.toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric"
        });
    };

    const formatTime = (time) => {
        if (!time) return "-";

        const [hourStr, minute] = time.split(":");
        let hours = Number(hourStr);

        const ampm = hours >= 12 ? "PM" : "AM";

        hours = hours % 12;
        if (hours === 0) hours = 12;

        return `${hours}:${minute} ${ampm}`;
    };


    const MatchCard = ({ title, count, color, children, onClick }) => {
        return (
            <div
                className="card border-0 shadow-sm text-white h-100 d-flex flex-column"
                style={{
                    borderRadius: "16px",
                    height: "420px",
                    // width: "30%", 
                    cursor: "pointer",
                    background: "#1c1c2b"
                }}
                onClick={onClick}
            >
                <div className="card-body p-4 d-flex flex-column justify-content-between h-100">

                    {/* Header */}
                    <div className="d-flex justify-content-between align-items-start mb-3">

                        <span className={`badge px-3 py-2 bg-${color}`}>
                            {title} ({count})
                        </span>

                        <i className="bi bi-chevron-right fs-4 text-light"></i>
                    </div>

                    {children}

                </div>
            </div>
        );
    };



    return (

        <div className="container-fluid mt-4 px-4">

            <div className="d-flex justify-content-between align-items-center mb-4">

                <h2 className="fw-bold">
                    Match Center
                </h2>

                <button
                    className="btn btn-outline-primary"
                    onClick={() => navigate("/")}
                >
                    ← Back To Dashboard
                </button>

            </div>


            <div className="row g-4">

                {/* Upcoming Card */}
                <div className="col-12 col-lg-4">
                    <MatchCard
                        title="UPCOMING"
                        count={upcomingMatches.length}
                        color="warning text-dark"
                        onClick={() => navigate("/upcoming")}
                    >
                        {upcomingMatch ? (
                            <div className="d-flex flex-column h-100 justify-content-between">

                                {/* TOP SECTION */}
                                <div>
                                    {/* HEADER */}
                                    <h6 className="fw-bold text-white mb-2">
                                        UPCOMING MATCH
                                    </h6>

                                    <p style={{ color: "white", marginBottom: "20px" }}>
                                        VENUE: {upcomingMatch?.venue || "NO VENUE WORKING"}
                                    </p>
                                    <br></br>

                                    {/* MIDDLE SECTION (FULL SPACE UTILIZATION) */}
                                    <div className="d-flex flex-grow-1 align-items-center justify-content-between ">

                                        {/* LEFT SIDE - TEAMS */}
                                        <div className="d-flex flex-column gap-3">

                                            <div className="fw-semibold text-white fs-6">
                                                {upcomingMatch.team1?.teamName || upcomingMatch.team1}
                                            </div>

                                            <div className="fw-semibold text-white fs-6">
                                                {upcomingMatch.team2?.teamName || upcomingMatch.team2}
                                            </div>

                                        </div>

                                        {/* RIGHT SIDE - DATE & TIME */}
                                        <div className="text-end me-3">

                                            <div className="text-end" style={{ paddingRight: "10px" }}>

                                                <div className="text-warning fw-bold fs-5">
                                                    {getDisplayDate(upcomingMatch.matchDate)}
                                                </div>

                                            </div>

                                            <div className="text-info fw-semibold fs-4">
                                                {formatTime(upcomingMatch.matchTime)}
                                            </div>

                                        </div>

                                    </div>

                                </div>
                            </div>
                        ) : (
                            <div className="text-center mt-5">
                                <h1 className="text-secondary">0</h1>
                                <p className="text-muted">No Upcoming Matches</p>
                            </div>
                        )}
                    </MatchCard>
                </div>

                {/* Live Card */}
                <div className="col-12 col-lg-4">
                    <MatchCard
                        title="LIVE"
                        count={liveMatches.length}
                        color="danger"
                        onClick={() => navigate("/live")}
                    >
                        {liveMatch ? (
                            <>

                                <div className="mb-3">
                                    <h6 className="fw-bold text-white mb-1">
                                        LIVE MATCH
                                    </h6>

                                    <p style={{ color: "white" }}>
                                        VENUE: {liveMatch?.venue || "NO VENUE WORKING"}
                                    </p>
                                </div>

                                {/* Team 1 */}
                                <div className="d-flex align-items-center justify-content-between mb-3">

                                    <span className="fw-semibold text-white fs-5 m-0">
                                        {liveMatch.team1?.teamName}
                                    </span>

                                    <div className="text-end d-flex align-items-baseline gap-2">
                                        <span className="text-warning fw-bold fs-4 m-0">
                                            {team1Runs}/{team1Wickets}
                                        </span>

                                        <small className="text-light opacity-75">
                                            ({team1Overs})
                                        </small>
                                    </div>
                                </div>


                                {/* Team 2 */}
                                <div className="d-flex align-items-center justify-content-between mb-3">

                                    <span className="fw-semibold text-white fs-5 m-0">
                                        {liveMatch.team2?.teamName}
                                    </span>

                                    <div className="text-end d-flex align-items-baseline gap-2">
                                        <span className="text-info fw-bold fs-4 m-0">
                                            {team2Runs}/{team2Wickets}
                                        </span>

                                        <small className="text-light opacity-75">
                                            ({team2Overs})
                                        </small>
                                    </div>

                                </div>
                                <hr className="border-secondary" />
                                {/* First Innings → Toss Info */}
                                {liveScore?.innings !== 2 ? (
                                    <div className="mb-2 text-center">
                                        <span className="text-warning fw-bold">
                                            {liveMatch?.tossWinner}
                                        </span>
                                        {" won the toss and elected to "}
                                        <span className="text-info fw-bold">
                                            {liveMatch?.electedTo}
                                        </span>
                                    </div>
                                ) : (
                                    /* Second Innings → Target Info */
                                    <div className="mb-2 text-center">
                                        <span className="text-warning fw-bold">
                                            Target: {target}
                                        </span>

                                        {" | "}

                                        <span className="text-info fw-bold">
                                            Need {runsRequired} runs
                                        </span>

                                        {" from "}

                                        <span className="text-danger fw-bold">
                                            {ballsRemaining} balls
                                        </span>
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="text-center mt-5">
                                <h1 className="text-secondary">0</h1>
                                <p className="text-muted">No Live Matches</p>
                            </div>
                        )}
                    </MatchCard>
                </div>

                {/* Completed Card */}
                <div className="col-12 col-lg-4">
                    <MatchCard
                        title="COMPLETED"
                        count={completedMatches.length}
                        color="success"
                        onClick={() => navigate("/completed")}
                    >
                        {completedMatch ? (
                            <>
                                <div className="d-flex justify-content-between mb-2">
                                    <span>{completedMatch.team1?.teamName || completedMatch.team1?.name}</span>
                                    <strong>
                                        {completedMatch.team1?.runs}/{completedMatch.team1?.wickets}
                                    </strong>
                                </div>

                                <div className="d-flex justify-content-between">
                                    <span>{completedMatch.team2?.teamName || completedMatch.team2?.name}</span>
                                    <strong>
                                        {completedMatch.team2?.runs}/{completedMatch.team2?.wickets}
                                    </strong>
                                </div>

                                <hr />

                                <div className="alert alert-success py-2 mb-0">
                                    {completedMatch.result}
                                </div>
                            </>
                        ) : (
                            <div className="text-center mt-5">
                                <h1 className="text-secondary">0</h1>
                                <p className="text-muted">No Completed Matches</p>
                            </div>
                        )}
                    </MatchCard>
                </div>

            </div>
        </div>
    );
}

export default LiveScore;