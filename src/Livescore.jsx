import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ApiService from "./ApiService";

function Livescore(){

    const {matchId} = useParams();

    const[score, setScore] = useState({})


    useEffect(()=>{

          if (!matchId) return;

        ApiService.getLiveScore(matchId)
          .then(res => setScore(res.data))
          .catch(err => console.log(err) );

    },[matchId]);

    return(
        <div className="container mt-4">

            <h2>Live Score</h2>

            <h1>
                {score.totalRuns ?? 0}/{score.totalWickets ?? 0}
            </h1>

            <h4>
                Overs : {score.overs ?? 0.0}
            </h4>

            <h4>
                CRR : {score.currentRunRate ?? 0}
            </h4>

            <h4>
                RRR :{score.requiredRunRate ?? 0}
            </h4>

            <h4>
                Target :{score.target ?? 0}
            </h4>

            <h4>
                Runs Required : {score.runsRequired ?? 0}
            </h4>

            <h4>
                Balls Remaining : {score.ballsRemaining ?? 0}
            </h4>

        </div>
    );
}


export default Livescore;