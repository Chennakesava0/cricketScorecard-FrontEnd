import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ApiService from "./ApiService";
import "./Scorecard.css";

function Scorecard() {

    const { matchId } = useParams();
    const navigate = useNavigate();

    const [match, setMatch] = useState(null);
    const [scorecard, setScorecard] = useState(null);
    const [selectedTeam, setSelectedTeam] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadMatch();
    }, []);

    useEffect(() => {
        if (selectedTeam != null) {
            loadScorecard(selectedTeam);
        }
    }, [selectedTeam]);

    const loadMatch = () => {

        ApiService.getMatchById(matchId)
            .then((res) => {

                setMatch(res.data);

                setSelectedTeam(res.data.team1.id);

            })
            .catch((err) => console.log(err));
    };

    const loadScorecard = (teamId) => {

        setLoading(true);

        ApiService.getTeamScorecard(matchId, teamId)
            .then((res) => {
                

                setScorecard(res.data);

                setLoading(false);


            })
            .catch((err) => {

                console.log(err);

                setLoading(false);

            });

    };

    if (!match || loading) {

        return (

            <div className="loading-box">

                Loading Scorecard...

            </div>

        );

    }

    return (

        <div className="scorecard-page">

            {/* Header */}

            <div className="score-header">

                <button
                    className="back-btn"
                    onClick={() => navigate(-1)}
                >
                    ← Back
                </button>

                <h2>

                    Match Scorecard

                </h2>

            </div>

            {/* Team Buttons */}

            <div className="team-switch">

                <button
                    className={
                        selectedTeam === match.team1.id
                            ? "team-btn active-team"
                            : "team-btn"
                    }
                    onClick={() => setSelectedTeam(match.team1.id)}
                >
                    {match.team1.teamName}
                </button>

                <button
                    className={
                        selectedTeam === match.team2.id
                            ? "team-btn active-team"
                            : "team-btn"
                    }
                    onClick={() => setSelectedTeam(match.team2.id)}
                >
                    {match.team2.teamName}
                </button>

            </div>

            {/* Team Score */}

            <div className="score-summary">

                <h1>

                    {scorecard.totalRuns}/{scorecard.wickets}

                </h1>

                <p>

                    Overs : {scorecard.overs}

                </p>

                <p>

                    Extras : {scorecard.extras}

                </p>

            </div>

            {/* Batting */}

            <div className="table-card">

                <div className="table-title">

                    🏏 Batting

                </div>

                <table className="score-table">

                    <thead>

                        <tr>

                            <th>Batter</th>
                            <th>Dismissal</th>
                            <th>R</th>
                            <th>B</th>
                            <th>4s</th>
                            <th>6s</th>
                            <th>SR</th>


                        </tr>

                    </thead>

                    <tbody>

                        {

                            scorecard.batting
                                .filter(player => player.balls > 0)
                                .map(player => (

                                    <tr key={player.playerId}>

                                        <td>{player.playerName}</td>

                                        <td>
                                            {player.dismissalType === "NOT OUT"
                                                ? "not out"
                                                : player.dismissalType}
                                        </td>

                                        <td>{player.runs}</td>

                                        <td>{player.balls}</td>

                                        <td>{player.fours}</td>

                                        <td>{player.sixes}</td>

                                        <td>{player.strikeRate}</td>



                                    </tr>

                                ))

                        }

                    </tbody>

                </table>

                {/* Yet To Bat */}

                <div className="yet-to-bat-card">

                    <h3>Yet To Bat</h3>

                    {

                        scorecard.batting.filter(

                            player =>

                                player.dismissalType === "YET TO BAT"

                        ).length > 0 ?

                            (

                                <div className="yet-list">

                                    {

                                        scorecard.batting.filter(

                                            player =>

                                                player.dismissalType === "YET TO BAT"

                                        )

                                            .map(player => (

                                                <span
                                                    key={player.playerId}
                                                    className="yet-player"
                                                >

                                                    {player.playerName}

                                                </span>

                                            ))

                                    }

                                </div>

                            )

                            :

                            (

                                <p className="all-batted">

                                    All Players Have Batted

                                </p>

                            )

                    }

                </div>

            </div>

            {/* Bowling */}

            <div className="table-card">

                <div className="table-title">

                    🎯 Bowling

                </div>

                <table className="score-table">

                    <thead>

                        <tr>

                            <th>Bowler</th>

                            <th>Overs</th>

                            <th>Runs</th>

                            <th>Wickets</th>

                            <th>Economy</th>

                        </tr>

                    </thead>

                    <tbody>

                        {

                            scorecard.bowling.length > 0 ?

                                (

                                    scorecard.bowling.map(bowler => (

                                        <tr key={bowler.playerId}>

                                            <td>

                                                {bowler.playerName}

                                            </td>

                                            <td>

                                                {bowler.overs}

                                            </td>

                                            <td>

                                                {bowler.runsConceded}

                                            </td>

                                            <td>

                                                {bowler.wickets}

                                            </td>

                                            <td>

                                                {bowler.economyRate}

                                            </td>

                                        </tr>

                                    ))

                                )

                                :

                                (

                                    <tr>

                                        <td
                                            colSpan="5"
                                            className="no-data"
                                        >

                                            Bowling Yet To Start

                                        </td>

                                    </tr>

                                )

                        }

                    </tbody>

                </table>

            </div>

        </div>

    );

}

export default Scorecard;