import { useNavigate } from 'react-router-dom';
import './LandingPage.css';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <>
      <div className="landing-container">
        <div className="main-content">
          <h2>This project aims to raise awareness about Esports at the University of Central Florida (UCF) while providing tools to support the streaming of Esports matches. 
      By fostering greater engagement and accessibility, it seeks to enhance the visibility and community participation in the growing field of competitive gaming.
          </h2>
          
          <button className="start-btn" onClick={() => navigate('/teams')}>
            Start
          </button>
        </div>
      </div>
    </>

  );
};

export default LandingPage;