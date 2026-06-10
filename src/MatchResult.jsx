import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ApiService from "./ApiService";


function MatchResult(){

    const {matchId} = useParams();
    const[result,setResult] = useState({});

    useEffect(()=>{

         if (!matchId) return;

        ApiService.getResult(matchId)
          .then(res => setResult(res.data))
          .catch(err => console.log(err));
    
    },[matchId]);
    return(
        <div className="container mt-4">

            <h2>Match Result</h2>

            <h3>{result.result}</h3>

            <h4>
                Winner : {result.winnerTeam || "-"}
            </h4>

            <h4>
                Loser : {result.loserTeam || "-"}
            </h4>

            <h4>
                Margin :{result.winningMargin || 0} {result.marginType || ""}
            </h4>

            <h4>
                Status :{result.matchStatus || "Loading..."}
            </h4>

        </div>
    );
}


export default MatchResult;