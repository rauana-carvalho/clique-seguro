import React, { useState } from 'react';
import LoadingIcon from './assets/loading.svg';
import Header from './components/header';
import './app.css'; 

const analyzeContent = (text) => {
  return new Promise(resolve => {
    setTimeout(() => {
      const lowerCaseText = text.toLowerCase();

      const suspiciousKeywords = [
        'parabéns, você ganhou', 'prêmio', 'oferta imperdível', 'clique aqui para resgatar', 
        'senha', 'banco', 'atualize seus dados', 'cartão de crédito', 'grátis', 'herança', 'dívida'
      ];
      if (suspiciousKeywords.some(keyword => lowerCaseText.includes(keyword))) {
        resolve({ status: 'danger', message: 'Cuidado! A mensagem contém palavras suspeitas que são comuns em golpes.' });
        return;
      }

      const urls = lowerCaseText.match(/(https?:\/\/[^\s]+)/g) || [];

      const suspiciousUrlTerms = [
        'roub', 'golp', 'fraud',        
        'banc', 'bank', 'cont', 'kont', 
        'grat', 'prem', 'ofert',
        'seguran', 'verific', 'login', 'senh', 'acess', 'atualiz',
        'idoso', 'dinh', 'cart', 'cred'
      ];

      for (const url of urls) {
        const deLeetedUrl = url
          .replace(/4|@/g, 'a')
          .replace(/3/g, 'e')
          .replace(/1|!/g, 'i')
          .replace(/0/g, 'o')
          .replace(/5|\$/g, 's');

        const cleanedUrl = deLeetedUrl.replace(/[^a-zA-Z0-9]/g, '');

        if (suspiciousUrlTerms.some(term => cleanedUrl.includes(term))) {
          resolve({ status: 'danger', message: 'Alerta! O endereço do site usa táticas de camuflagem (letras trocadas por números) para parecer legítimo.' });
          return;
        }
      }

      const urlShorteners = ['bit.ly', 'tinyurl.com', 'goo.gl', 'is.gd', 't.co'];
      for (const url of urls) {
        if (urlShorteners.some(shortener => url.includes(shortener))) {
          resolve({ status: 'danger', message: 'Atenção: Este é um link encurtado. Golpistas os usam para esconder o site real. Desconfie!' });
          return;
        }
      }
      
      resolve({
        status: 'safe',
        message: 'Tudo certo! Não encontramos sinais óbvios de golpe nesta mensagem ou link.'
      });
    }, 2000); 
  });
};

const safeMessages = [
  "Tudo certo! Este link parece seguro.",
  "Análise concluída. Pode confiar.",
  "Verificado! Nenhuma ameaça encontrada."
];

function App() {
  const [inputValue, setInputValue] = useState('');
  const [status, setStatus] = useState('idle'); 
  const [resultMessage, setResultMessage] = useState('');

  const handleVerify = async () => {
    if (!inputValue.trim()) return;
    
    setStatus('loading');
    const result = await analyzeContent(inputValue);

    if (result.status === 'safe') {
      setResultMessage(safeMessages[Math.floor(Math.random() * safeMessages.length)]);
    } else {
      setResultMessage(result.message);
    }
    setStatus(result.status);
  };

  const handleReset = () => {
    setInputValue('');
    setStatus('idle');
    setResultMessage('');
  };

  const renderContent = () => {
    switch (status) {
      case 'loading':
        return (
          <div className="state-container">
            <img src={LoadingIcon} alt="Verificando..." className="loading-icon" />
            <p className="loading-text">Verificando...</p>
          </div>
        );
      case 'safe':
        return (
          <div className="state-container result-safe">
            <div className="icon">✓</div>
            <h2 className="result-title">Parece Seguro</h2>
            <p className="result-description">{resultMessage}</p>
            <button onClick={handleReset} className="verify-button">
              Verificar outro
            </button>
          </div>
        );
      case 'danger':
        return (
          <div className="state-container result-danger">
            <div className="icon">❗</div>
            <h2 className="result-title">Perigoso</h2>
            <p className="result-description">{resultMessage}</p>
            <button onClick={handleReset} className="verify-button">
              Verificar outro
            </button>
          </div>
        );
      case 'idle':
      default:
        return (
          <>
            <h1 className="title">Verificador de Segurança</h1>
            <p className="subtitle">Cole a mensagem ou link suspeito abaixo e nós analisamos para você.</p>
            <textarea
              className="text-input"
              placeholder="Cole aqui a mensagem ou o link suspeito"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
            <button onClick={handleVerify} className="verify-button">
              Verificar agora
            </button>
          </>
        );
    }
  };

  return (
    <>
      <Header />
      <main className="card">
        {renderContent()}
      </main>
    </>
  );
}

export default App;