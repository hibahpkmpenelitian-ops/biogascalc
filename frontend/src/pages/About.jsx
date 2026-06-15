import './About.css';

function About() {
  return (
    <main className="about" id="about-page">
      <div className="container">
        <h1 className="about-title animate-fade-in-up">
          About <span className="gradient-text">BiogasCalc</span>
        </h1>
        <p className="about-text animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          BiogasCalc is a full-stack web application built with the MERN stack
          for biogas production calculation and analysis.
        </p>

        <div className="about-grid animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <div className="about-card glass">
            <h3>Calculate</h3>
            <p>Estimate biogas production based on input parameters.</p>
          </div>
          <div className="about-card glass">
            <h3>Analyze</h3>
            <p>Visualize and analyze biogas data with interactive charts.</p>
          </div>
          <div className="about-card glass">
            <h3>Store</h3>
            <p>Save and manage calculation history in MongoDB.</p>
          </div>
        </div>
      </div>
    </main>
  );
}

export default About;
