import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ApiService from "./ApiService";

function MatchResult() {

    const { matchId } = useParams();
    const navigate = useNavigate();

    const [match, setMatch] = useState(null);
    const [result, setResult] = useState(null);

    useEffect(() => {

        const fetchData = async () => {

            try {

                const matchRes = await ApiService.getMatchById(matchId);
                setMatch(matchRes.data);

                const resultRes = await ApiService.getResult(matchId);
                setResult(resultRes.data);

            } catch (err) {
                console.log(err);
            }

        };

        fetchData();

    }, [matchId]);

    if (!match || !result) {
        return (
            <div className="container mt-5 text-center">
                <h4>Loading Match Result...</h4>
            </div>
        );
    }

    return (

        <div className="container-fluid mt-3">

            {/* Header Card */}
            <div
                className="card border-0 shadow-lg"
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

                    {/* Match Title */}
                    <h2
                        className="text-center fw-bold mb-4"
                        style={{
                            fontSize: "2.2rem",
                            letterSpacing: "1px"
                        }}
                    >
                        {match.team1.teamName.toUpperCase()} VS{" "}
                        {match.team2.teamName.toUpperCase()}
                    </h2>

                    {/* Score Summary */}
                    <div
                        className="mx-auto"
                        style={{
                            maxWidth: "700px",
                            background: "#2d333b",
                            borderRadius: "12px",
                            padding: "20px"
                        }}
                    >

                        {/* Team 1 */}
                        <div className="d-flex justify-content-between align-items-center">

                            <div>
                                <h4 className="mb-1 fw-bold">
                                    {match.team1.teamName}
                                </h4>

                                <small className="text-secondary">
                                    1st Innings
                                </small>
                            </div>

                            <div className="text-end">

                                <h3 className="mb-0 fw-bold">
                                    {result.firstInningsRuns}/
                                    {result.firstInningsWickets}
                                </h3>

                                <small className="text-info">
                                    ({result.firstInningsOvers} Ov)
                                </small>

                            </div>

                        </div>

                        <hr className="border-secondary my-3" />

                        {/* Team 2 */}
                        <div className="d-flex justify-content-between align-items-center">

                            <div>
                                <h4 className="mb-1 fw-bold">
                                    {match.team2.teamName}
                                </h4>

                                <small className="text-secondary">
                                    2nd Innings
                                </small>
                            </div>

                            <div className="text-end">

                                <h3 className="mb-0 fw-bold">
                                    {result.secondInningsRuns}/
                                    {result.secondInningsWickets}
                                </h3>

                                <small className="text-info">
                                    ({result.secondInningsOvers} Ov)
                                </small>

                            </div>

                        </div>

                    </div>

                    {/* Result */}
                    <div className="text-center mt-4">

                        <h2
                            className="fw-bold"
                            style={{
                                color: "#4ade80"
                            }}
                        >
                            {result.result}
                        </h2>

                        <div className="mt-3">

                            <span className="badge bg-success fs-6 px-3 py-2 me-2">
                                Winner : {result.winnerTeam}
                            </span>

                            <span className="badge bg-warning text-dark fs-6 px-3 py-2">
                                Margin : {result.winningMargin} {result.marginType}
                            </span>

                        </div>

                    </div>

                </div>

            </div>

            {/* Scorecard Card */}
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

export default MatchResult;