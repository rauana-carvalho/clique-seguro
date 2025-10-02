import React, { useState } from 'react';
import LogoIcon from '../assets/logo.svg';
import './Header.css';

function Header() {
  const [isAboutOpen, setIsAboutOpen] = useState(false);

  const toggleAbout = () => {
    setIsAboutOpen(!isAboutOpen);
  };

  return (
    <>
      <header className="app-header">
        <div className="header-content">
          <div className="header-left">
            <img src={LogoIcon} alt="Clique Seguro Logo" className="header-logo" />
            <span className="header-title">Clique Seguro</span>
          </div>
          <button className="about-button" onClick={toggleAbout}>
            Sobre
          </button>
        </div>
      </header>
      
      {isAboutOpen && (
        <div className="about-modal-overlay" onClick={toggleAbout}>
          <div className="about-modal" onClick={(e) => e.stopPropagation()}>
            <div className="about-header">
              <h2>Sobre o Projeto</h2>
              <button className="close-button" onClick={toggleAbout}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
            <div className="about-content">
              <p>
                O Clique Seguro nasceu com o objetivo de identificar páginas online potencialmente maliciosas, 
                com foco específico na proteção de usuários idosos. A proposta surge da necessidade de combater 
                a crescente incidência de golpes virtuais direcionados a esse público, que frequentemente possui 
                menor familiaridade com os riscos presentes no ambiente digital.
              </p>
              <p>
                A ferramenta funcionará por meio de um sistema de análise que examina URLs suspeitas fornecidas 
                pelos usuários. Através de técnicas de verificação e checagem de indicadores de segurança, 
                o sistema emitirá alertas sobre possíveis ameaças.
              </p>
              <p>
                Dessa forma, o projeto busca não apenas oferecer uma solução tecnológica, mas também promover 
                a inclusão digital segura, contribuindo para a redução de vulnerabilidades e para o uso mais 
                consciente da internet por parte da população idosa.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Header;