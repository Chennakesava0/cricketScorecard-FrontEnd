import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ApiService from "./ApiService";

function CompletedMatches() {

    const [matches, setMatches] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        ApiService.getCompletedMatches()
            .then(res => setMatches(res.data))
            .catch(console.error);
    }, []);

    return (

        <div className="container mt-4">

            <h2 className="text-center mb-4">
                Completed Matches
            </h2>

            <div className="mb-4">
    <button
        className="btn btn-secondary"
        onClick={() => navigate(-1)}
    >
        ← Back
    </button>
</div>

            {matches.length === 0 ? (

                <div className="text-center mt-5">
                    <h4>No completed matches available.</h4>
                </div>

            ) : (

                <div className="row">

                    {matches.map(match => (

                        <div
                            key={match.matchId}
                            className="col-lg-3 col-md-6 mb-4"
                        >

                            <div
                                className="card shadow h-100"
                                style={{
                                    cursor: "pointer",
                                    borderRadius: "12px"
                                }}
                                onClick={() =>
                                    navigate(`/result/${match.matchId}`)
                                }
                            >

                                <div className="card-body">

                                    <h6
                                        className="text-center text-secondary mb-3"
                                    >
                                        📍 {match.venue}
                                    </h6>

                                    <div className="d-flex justify-content-between">

                                        <strong>
                                            {match.team1Name}
                                        </strong>

                                        <strong>

                                            {match.firstInningsRuns}/
                                            {match.firstInningsWickets}

                                            {" "}

                                            ({match.firstInningsOvers})

                                        </strong>

                                    </div>

                                    <div
                                        className="d-flex justify-content-between mt-2"
                                    >

                                        <strong>
                                            {match.team2Name}
                                        </strong>

                                        <strong>

                                            {match.secondInningsRuns}/
                                            {match.secondInningsWickets}

                                            {" "}

                                            ({match.secondInningsOvers})

                                        </strong>

                                    </div>

                                    <hr />

                                    <div
                                        className="text-center text-success fw-bold"
                                    >
                                        🏆 {match.result}
                                    </div>

                                </div>

                            </div>

                        </div>

                    ))}

                </div>

            )}

        </div>

    );

}

export default CompletedMatches;