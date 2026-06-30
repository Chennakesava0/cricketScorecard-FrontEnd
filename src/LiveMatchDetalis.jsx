import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ApiService from "./ApiService";

function LiveMatchDetails() {

    const { matchId } = useParams();
    const navigate = useNavigate();

    const [match, setMatch] = useState(null);
    const [liveScore, setLiveScore] = useState(null);

    useEffect(() => {

        const fetchData = async () => {

            try {

                const matchRes = await ApiService.getMatchById(matchId);
                setMatch(matchRes.data);

                const scoreRes = await ApiService.getLiveScore(matchId);
                setLiveScore(scoreRes.data);


            } catch (err) {
                console.log(err);
            }
        };

        fetchData();

        const interval = setInterval(fetchData, 2000);

        return () => clearInterval(interval);

    }, [matchId]);

    if (!match || !liveScore) {
        return (
            <div className="container mt-5 text-center">
                <h4>Loading Live Match...</h4>
            </div>
        );
    }

    const innings = liveScore.innings || 1;

    const battingTeam =
        innings === 1
            ? match.team1?.teamName
            : match.team2?.teamName;

    const bowlingTeam =
        innings === 1
            ? match.team2?.teamName
            : match.team1?.teamName;

    return (

        <div className="container-fluid mt-3">

            {/* ================= LIVE HEADER ================= */}

            <div
                className="card border-0 shadow-lg mb-4"
                style={{
                    background: "#22272e",
                    color: "white",
                    borderRadius: "12px"
                }}
            >

                <div className="card-body p-4">

                    {/* Back Button */}

                    <div className="mb-3">

                        <button
                            className="btn btn-outline-light"
                            onClick={() => navigate(-1)}
                        >
                            ← Back
                        </button>

                    </div>

                    {/* Match */}

                    <div className="text-center">

                        <h2
                            className="fw-bold mb-2"
                            style={{
                                fontSize: "2.2rem",
                                letterSpacing: "1px"
                            }}
                        >

                            {match.team1.teamName.toUpperCase()} VS{" "}
                            {match.team2.teamName.toUpperCase()}

                        </h2>

                        <h5
                            className="mb-2"
                            style={{ fontWeight: "500" }}
                        >

                            <span className="text-success">

                                Batting :
                                <strong> {battingTeam}</strong>

                            </span>

                            {" | "}

                            <span className="text-warning">

                                Bowling :
                                <strong> {bowlingTeam}</strong>

                            </span>

                        </h5>

                        <h1
                            className="fw-bold my-2"
                            style={{
                                fontSize: "48px",
                                lineHeight: "1"
                            }}
                        >
                            {liveScore.totalRuns}/{liveScore.totalWickets}
                        </h1>

                        <h5 className="mb-2">
                            Overs : {liveScore.overs}
                        </h5>

                        {innings === 2 && (

                            <h5
                                className="fw-bold mt-2 mb-0"
                                style={{ color: "#ffc107" }}
                            >
                                🎯 Need {liveScore.runsRequired} runs from{" "}
                                {liveScore.ballsRemaining} balls
                            </h5>

                        )}

                    </div>

                    <hr className="border-secondary my-3" />

                    {/* Bottom */}

                    <div className="row">

                        {/* LEFT */}

                        <div className="col-md-8">

                            {/* Striker */}

                            <div className="mb-2">
                                <h5 className="fw-bold">
                                    * {liveScore.strikerName}

                                    <span style={{ marginLeft: "25px" }}>
                                        {liveScore.strikerRuns} ({liveScore.strikerBalls})
                                    </span>
                                </h5>
                            </div>

                            <div className="mb-3">
                                <h5>
                                    {liveScore.nonStrikerName}

                                    <span style={{ marginLeft: "25px" }}>
                                        {liveScore.nonStrikerRuns} ({liveScore.nonStrikerBalls})
                                    </span>
                                </h5>
                            </div>

                            {/* BALL LOG */}

                            <div
                                className="d-flex mt-4"
                                style={{
                                    overflowX: "auto",
                                    whiteSpace: "nowrap",
                                    gap: "8px",
                                    paddingBottom: "10px"
                                }}
                            >

                                {liveScore.ballLog?.map((ball, index) => (

                                    <div
                                        key={index}
                                        className="rounded-circle d-flex justify-content-center align-items-center fw-bold"
                                        style={{
                                            minWidth: "38px",
                                            height: "38px",
                                            background:
                                                ball === "W"
                                                    ? "#dc3545"
                                                    : ball === "4"
                                                        ? "#0d6efd"
                                                        : ball === "6"
                                                            ? "#198754"
                                                            : "#343a40",
                                            color: "white",
                                            fontSize: "15px",
                                            flexShrink: 0
                                        }}
                                    >
                                        {ball}
                                    </div>

                                ))}

                            </div>

                        </div>

                        {/* RIGHT */}

                        <div className="col-md-4 text-end">

                            <h5 className="fw-bold">
                                {liveScore.bowlerName}
                            </h5>

                            <h6 className="mt-2">
                                Overs : {liveScore.bowlerOvers}
                                {"  -  "}
                                Runs : {liveScore.bowlerRuns}
                                {"  -  "}
                                Wickets : {liveScore.bowlerWickets}
                            </h6>

                        </div>
                    </div>

                </div>

            </div>
            {/* SCORECARD PLACEHOLDER */}

            <div className="card shadow border-0 mt-4">

                <div className="card-body text-center">

                    <h4 className="text-secondary">

                        Scorecard Coming Here

                    </h4>

                </div>

            </div>

        </div>

    );

}

export default LiveMatchDetails;