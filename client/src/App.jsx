
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Hospitals from './pages/Hospitals';
import Hotels from './pages/Hotels';
import Crime from './pages/Crime';
import CountryDetail from './pages/CountryDetail';
import CultureDetail from './pages/CultureDetail';
import PlaceDetail from './pages/PlaceDetail';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="hospitals" element={<Hospitals />} />
          <Route path="hotels" element={<Hotels />} />
          <Route path="crime" element={<Crime />} />
          <Route path="country/:countryName" element={<CountryDetail />} />
          <Route path="culture/:cultureId" element={<CultureDetail />} />
          <Route path="place/:placeId" element={<PlaceDetail />} />
        </Route>
      </Routes>
    </Router>
  );
}
