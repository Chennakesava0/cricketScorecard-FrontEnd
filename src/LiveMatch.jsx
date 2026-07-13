import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ApiService from "./ApiService";

function LiveMatches() {
    const [matches, setMatches] = useState([]);
    const [scores, setScores] = useState({});
    const navigate = useNavigate();

    // ================= NORMALIZE OVERS =================
    const normalizeOvers = (overs = "0.0") => {
        if (!overs) return "0.0";

        const value = String(overs);
        const [o = "0", b = "0"] = value.split(".");

        let oversNum = Number(o || 0);
        let ballsNum = Number(b || 0);

        if (ballsNum >= 6) {
            oversNum += Math.floor(ballsNum / 6);
            ballsNum = ballsNum % 6;
        }

        return `${oversNum}.${ballsNum}`;
    };

    // ================= OVERS TO BALLS =================
    const oversToBalls = (overs = "0.0") => {
        if (!overs) return 0;

        const [o = "0", b = "0"] = String(overs).split(".");
        return (Number(o || 0) * 6) + Number(b || 0);
    };

    // ================= FETCH MATCHES + SCORES =================
    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await ApiService.getLiveMatches();
                const list = res.data || [];

                setMatches(list);

                const scoreMap = {};

                await Promise.all(
                    list.map(async (match) => {
                        try {
                            const scoreRes = await ApiService.getLiveScore(match.matchId);
                            const data = scoreRes.data || {};

                            scoreMap[match.matchId] = {
                                ...data,

                                // SAFE OVERS HANDLING
                                overs: normalizeOvers(data?.overs),
                                firstInningsOvers: normalizeOvers(data?.firstInningsOvers),
                                secondInningsOvers: normalizeOvers(data?.secondInningsOvers),

                                // SAFE DEFAULTS
                                innings: data?.innings || 1,
                                totalRuns: data?.totalRuns || 0,
                                totalWickets: data?.totalWickets || 0,
                                target: data?.target || 0,
                                firstInningsRuns: data?.firstInningsRuns || 0,
                                firstInningsWickets: data?.firstInningsWickets || 0,
                            };
                        } catch (err) {
                            scoreMap[match.matchId] = null;
                        }
                    })
                );

                setScores(scoreMap);

            } catch (err) {
                setMatches([]);
            }
        };

        fetchData();
        const interval = setInterval(fetchData, 2000);

        return () => clearInterval(interval);
    }, []);

    // ================= MATCH CARD =================
    const MatchCard = ({ match, score }) => {

        const innings = score?.innings || 1;
        const matchOversLimit = match.totalOvers || 20;

        // BALL CALCULATION (STRICTLY PER INNINGS)
        const firstBalls = oversToBalls(score?.firstInningsOvers);
        const secondBalls = oversToBalls(score?.secondInningsOvers);

        const totalBalls = matchOversLimit * 6;

        const currentBalls =
            innings === 1 ? firstBalls : secondBalls;

        const ballsRemaining = Math.max(totalBalls - currentBalls, 0);

        const runsRequired = Math.max(
            (score?.target || 0) - (score?.totalRuns || 0),
            0
        );

        // ================= TEAM 1 =================
        const team1Runs =
            innings === 2
                ? (score?.firstInningsRuns || 0)
                : (score?.totalRuns || 0);

        const team1Wickets =
            innings === 2
                ? (score?.firstInningsWickets || 0)
                : (score?.totalWickets || 0);

        const team1Overs =
            innings === 2
                ? score?.firstInningsOvers || "0.0"
                : score?.overs || "0.0";

        // ================= TEAM 2 =================
        const team2Runs =
            innings === 2 ? (score?.totalRuns || 0) : 0;

        const team2Wickets =
            innings === 2 ? (score?.totalWickets || 0) : 0;

        const team2Overs =
            innings === 2
                ? score?.secondInningsOvers || "0.0"
                : "0.0";

        return (
            <div
                className="card shadow-lg border-0 mb-4"
                style={{
                    borderRadius: "18px",
                    background: "#1c1c2b",
                    color: "white",
                    cursor: "pointer"
                }}
                onClick={() => navigate(`/live/${match.matchId}`)}
            >
                <div className="card-body p-4">

                    {/* HEADER */}
                    <div className="mb-3 text-center">
                        <h6 className="fw-bold">LIVE MATCH</h6>
                        <div>
                            VENUE: {match.venue || "Not Available"}
                        </div>
                    </div>

                    {/* TEAM 1 */}
                    <div className="d-flex justify-content-between mb-3">
                        <span className="fw-bold fs-5">
                            {match.team1?.teamName}
                        </span>

                        <span className="text-warning fw-bold fs-4">
                            {team1Runs}/{team1Wickets}
                            <small className="ms-2 fs-6">
                                ({team1Overs})
                            </small>
                        </span>
                    </div>

                    {/* TEAM 2 */}
                    <div className="d-flex justify-content-between mb-3">
                        <span className="fw-bold fs-5">
                            {match.team2?.teamName}
                        </span>

                        <span className="text-info fw-bold fs-4">
                            {team2Runs}/{team2Wickets}
                            <small className="ms-2 fs-6">
                                ({team2Overs})
                            </small>
                        </span>
                    </div>

                    <hr className="border-secondary" />

                    {/* STATUS */}
                    {innings === 1 ? (
                        <div className="text-center text-warning">
                            {match.tossWinner} Won Toss & Elected to {match.electedTo}
                        </div>
                    ) : (
                        <div className="text-center fw-semibold">
                            <span className="text-warning">
                                Target: {score?.target}
                            </span>{" "}
                            |{" "}
                            <span className="text-info">
                                {runsRequired} runs needed
                            </span>{" "}
                            in{" "}
                            <span className="text-danger">
                                {ballsRemaining} balls
                            </span>
                        </div>
                    )}

                </div>
            </div>
        );
    };

    return (
        <div className="container mt-4">

            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="fw-bold text-danger m-0">
                    🔴 Live Matches
                </h2>

                <button
                    className="btn btn-outline-light shadow-sm px-4"
                    style={{
                        borderRadius: "10px",
                        border: "2px solid #dc3545",
                        color: "#dc3545",
                        fontWeight: "600"
                    }}
                    onClick={() => navigate(-1)}
                >
                    ← Back
                </button>
            </div>
            {matches.length === 0 ? (
                <div className="alert alert-info text-center">
                    No Live Matches Available
                </div>
            ) : (
                <div className="row">
                    {matches.map((match) => (
                        <div key={match.matchId} className="col-lg-4 col-md-6">
                            <MatchCard
                                match={match}
                                score={scores[match.matchId]}
                            />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default LiveMatches;