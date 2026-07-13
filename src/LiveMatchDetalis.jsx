import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ApiService from "./ApiService";
import Scorecard from "./Scorecard";

function LiveMatchDetails() {

    const { matchId } = useParams();
    const navigate = useNavigate();

    const [match, setMatch] = useState(null);
    const [liveScore, setLiveScore] = useState(null);

    const [visibleOvers, setVisibleOvers] = useState([]);
    const [autoScroll, setAutoScroll] = useState(true);
    const [showAllOvers, setShowAllOvers] = useState(false);
    const [allOvers, setAllOvers] = useState([]);

    useEffect(() => {

        if (!autoScroll) return;

        const el = document.getElementById("over-scroll");

        if (el) {
            el.scrollLeft = el.scrollWidth;
        }

    }, [visibleOvers, autoScroll]);

    useEffect(() => {

        const fetchData = async () => {

            try {

                const matchRes = await ApiService.getMatchById(matchId);
                setMatch(matchRes.data);

                const scoreRes = await ApiService.getLiveScore(matchId);
                setLiveScore(scoreRes.data);
                const overs = scoreRes?.data?.overBallLog || [];

                setAllOvers(overs);

                // show last 3 overs initially
                setVisibleOvers(overs.slice(-3));


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

                            {match?.team1?.teamName?.toUpperCase() || ""} VS {" "}
                            {match?.team2?.teamName?.toUpperCase() || ""}

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

                        <div className="d-flex justify-content-between align-items-center mt-2 flex-wrap">

                            {/* LEFT */}
                            <div>

                                {innings === 1 ? (

                                    <span className="text-info fw-bold">
                                        CRR : {liveScore.currentRunRate}
                                    </span>

                                ) : (

                                    <>
                                        <span className="text-info fw-bold me-4">
                                            CRR : {liveScore.currentRunRate}
                                        </span>

                                        <span className="text-warning fw-bold">
                                            RRR : {liveScore.requiredRunRate}
                                        </span>
                                    </>

                                )}

                            </div>

                            {/* CENTER */}
                            <div className="text-center flex-grow-1">

                                {innings === 2 && (

                                    <h5
                                        className="fw-bold mb-0"
                                        style={{ color: "#ffc107" }}
                                    >
                                        🎯 Need {liveScore.runsRequired} runs from {liveScore.ballsRemaining} balls
                                    </h5>

                                )}

                            </div>

                            {/* RIGHT */}
                            <div className="text-end">

                                {innings === 1 ? (

                                    <span className="text-warning fw-bold">
                                        Balls Left : {liveScore.ballsRemaining}
                                    </span>

                                ) : (

                                    <span className="text-success fw-bold">
                                        🎯 Target : {liveScore.target}
                                    </span>

                                )}

                            </div>

                        </div>
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

                            {/* ================= OVER WISE BALL LOG (SINGLE LINE SCROLL) ================= */}

                            <div className="mt-4 w-100">

                                <h6 className="text-secondary mb-9 fw-bold">
                                    Ball by Ball
                                </h6>

                                <div
                                    id="over-scroll"
                                    className="hide-scroll d-flex"
                                    onScroll={(e) => {

                                        const el = e.target;

                                        const atEnd =
                                            el.scrollLeft + el.clientWidth >= el.scrollWidth - 20;

                                        setAutoScroll(atEnd);

                                    }}
                                    style={{
                                        overflowX: "auto",
                                        whiteSpace: "nowrap",
                                        gap: "12px",
                                        width: "100%",
                                        paddingBottom: "10px"
                                    }}
                                >

                                    {allOvers?.map((over, index) => {

                                        return (
                                            <div
                                                key={index}
                                                className="d-flex align-items-center flex-shrink-0"
                                                style={{
                                                    background: "#1f2933",
                                                    color: "white",
                                                    borderRadius: "10px",
                                                    padding: "10px 14px",
                                                    minWidth: "fit-content"
                                                }}
                                            >

                                                {/* Over number */}
                                                <span className="fw-bold text-warning me-3">
                                                    Over {over.overNo}
                                                </span>

                                                {/* Balls in one line */}
                                                <div className="d-flex align-items-center gap-2 me-3">

                                                    {over.balls.map((ball, i) => (
                                                        <div
                                                            key={i}
                                                            className="rounded-circle d-flex justify-content-center align-items-center fw-bold"
                                                            style={{
                                                                width: "35px",
                                                                height: "34px",
                                                                background:
                                                                    ball === "W"
                                                                        ? "#dc3545"
                                                                        : ball === "4"
                                                                            ? "#0d6efd"
                                                                            : ball === "6"
                                                                                ? "#198754"
                                                                                : ball === "WD"
                                                                                    ? "#ffc107"
                                                                                    : "#343a40",
                                                                color: "white",
                                                                fontSize: "13px"
                                                            }}
                                                        >
                                                            {ball}
                                                        </div>
                                                    ))}

                                                </div>

                                                {/* Over runs */}
                                                <span className="fw-bold text-success">
                                                    = {over.runs}
                                                </span>

                                            </div>
                                        );
                                    })}

                                </div>
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

                    <h4 className="mb-3">
                        View Complete Scorecard
                    </h4>

                    <button
                        className="btn btn-primary btn-lg"
                        onClick={() => navigate(`/scorecard/${matchId}`)}
                    >
                        Open Scorecard
                    </button>

                </div>

            </div>

        </div>

    );

}

export default LiveMatchDetails;