import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Dashboard from './Dashboard';
import Livescore from './Livescore';
import BattingScorecard from './BattingScorecard';
import BowlingScorecard from './BowlingScorecard';
import MatchResult from './MatchResult';
import Teams from './Teams';
import Players from './Players';
import Matches from './Matches';
import UpcomingMatches from './UpComingMatches';
import LiveMatches from './LiveMatch';
import CompletedMatches from './CompletedMatche';
import MatchSetup from './MatchSetup';
import MatchScoring from './MatchScoring';
import LiveMatchDetails from './LiveMatchDetalis';
import Scorecard from './Scorecard';

function App() {
  return (
    <BrowserRouter>

      <Routes>
        <Route path='/' element={<Dashboard />} />
        <Route path='/teams' element={<Teams />} />
        <Route path='/players' element={<Players />} />
        <Route path='/matches' element={<Matches />} />
        <Route path='/match-setup/:matchId' element={<MatchSetup />} />
        <Route path='/matchscoring/:matchId' element={<MatchScoring />} />
        <Route path='/live/:matchId' element={<LiveMatchDetails />} />
        <Route path='/livescore/:matchId' element={<Livescore />} />
        <Route path='/scorecard/:matchId' element={<Scorecard />} />
        <Route path='/upcoming' element={<UpcomingMatches />} />
        <Route path='/live' element={<LiveMatches />} />
        <Route path='/completed' element={<CompletedMatches />} />
        <Route path='/result/:matchId' element={<MatchResult />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
