import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Route,  Routes } from 'react-router-dom';
import Dashboard from './Dashboard';
import Livescore from './Livescore';
import BattingScorecard from './BattingScorecard';
import BowlingScorecard from './BowlingScorecard';
import MatchResult from './MatchResult';
import Teams from './Teams';
import Players from './Players';

function App() {
  return (
     <BrowserRouter>
           
           <Routes>
               <Route path='/' element={<Dashboard />} />
               <Route path='/teams' element={<Teams />} />
               <Route path='/players' element={<Players />} />
               <Route path='/live/:matchId' element={<Livescore />}/>
               <Route path='/batting/:matchId' element={<BattingScorecard />} />
               <Route path='/bowling/:matchId' element={<BowlingScorecard />} />
               <Route path='/result/:matchId' element={<MatchResult />} />
           </Routes>
     </BrowserRouter>
  );
}

export default App;
