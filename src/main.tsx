import { StrictMode, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, Link } from "react-router-dom";
import { createRoot } from 'react-dom/client';
import { MainPage } from './mainpage';
import "./main.css"

const Home = ({setMajor}:any) => {
  // const navigate = useNavigate(); // Use navigate for dynamic routing

  const handleMajorSelect = (selectedMajor: string) => {
    setMajor(selectedMajor); // dynamic major name using
    // navigate(`/${selectedMajor}`); // Navigate dynamically
  };
  
  return (
    <div>
      <section className='indialog'>
        <div className='i-wrapper'>
          <main className='i-main'>
            <h1 className='i-heading'>Select your major below</h1>
            {/* <label className="i-label" htmlFor="major-search">
              Search for your major
            </label> */}
            <input id="major-search" className="i-searchbar" type="text" placeholder='Search for your major'/>
            <div>
              <div className='i-majors' onClick={() => handleMajorSelect("cs")}><Link className='i-link' to={"/UniFlow/main"}> Computer Science, B.S.</Link></div>
              <div className='i-majors' onClick={() => handleMajorSelect("ae")}><Link className='i-link' to={"/main"}> Aerospace Engineering, B.S.</Link></div>
              <div className='i-majors' onClick={() => handleMajorSelect("be")}><Link className='i-link' to={"/main"}> Biomedical Engineering, B.S.</Link></div>
              <div className='i-majors' onClick={() => handleMajorSelect("che")}><Link className='i-link' to={"/main"}> Chemical Engineering, B.S.</Link></div>
              <div className='i-majors' onClick={() => handleMajorSelect("cve")}><Link className='i-link' to={"/main"}> Civil Engineering, B.S.</Link></div>
              <div className='i-majors' onClick={() => handleMajorSelect("ce")}><Link className='i-link' to={"/main"}> Computer Engineering, B.S.</Link></div>
              <div className='i-majors' onClick={() => handleMajorSelect("ee")}><Link className='i-link' to={"/main"}> Electrical Engineering, B.S.</Link></div>
              <div className='i-majors' onClick={() => handleMajorSelect("me")}><Link className='i-link' to={"/main"}> Mechanical Engineering, B.S.</Link></div>
            </div>
          </main>
        </div>
      </section>
      
    </div>
  );
}

function App() {
  const [major, setMajor] = useState<string>("");
  return (
    <Router>
      <Routes>
        <Route path="/UniFlow/" element={<Home setMajor={setMajor}/>} />
        <Route path={"/UniFlow/main/*"} element={<MainPage major={major} />} />
      </Routes>
    </Router>
  );
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
