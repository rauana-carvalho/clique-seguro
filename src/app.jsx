import React, { useState } from 'react';
import LoadingIcon from './assets/loading.svg';
import Header from './components/header';
import './app.css'; 

const analyzeContent = (text) => {
  return new Promise(resolve => {
    setTimeout(() => {
      const lowerCaseText = text.toLowerCase();

      // Palavras-chave relacionadas a criptomoedas e investimentos suspeitos
      const cryptoKeywords = [
        'bitcoin', 'btc', 'ethereum', 'eth', 'cripto', 'criptomoeda', 'investimento garantido',
        'trader', 'trading', 'robô de investimento', 'lucro garantido', 'ganhe dinheiro fácil',
        'mercado bitcoin', 'binance', 'foxbit', 'mineração', 'wallet', 'carteira digital'
      ];
      
      // Palavras-chave de golpes gerais
      const suspiciousKeywords = [
        'parabéns, você ganhou', 'prêmio', 'oferta imperdível', 'clique aqui para resgatar', 
        'senha', 'banco', 'atualize seus dados', 'cartão de crédito', 'grátis', 'herança', 'dívida',
        'pix grátis', 'pix gratis', 'pix de graça', 'pix gratuito', 'ganhe pix', 'pix promocional',
        'receba pix', 'pix garantido', 'auxilio emergencial', 'cadastro positive', 'cpf negativado',
        'emprestimo aprovado', 'cartão pré-aprovado', 'spc', 'serasa', 'nome limpo',
        'whatsapp gold', 'conta bloqueada', 'confirme seus dados', 'clique no link'
      ];
      
      // Verificação específica para golpes de criptomoedas
      if (cryptoKeywords.some(keyword => lowerCaseText.includes(keyword))) {
        resolve({ 
          status: 'danger', 
          message: 'ATENÇÃO! Esta mensagem menciona criptomoedas ou investimentos. Cuidado com golpes de "investimento garantido" ou "lucro fácil". Nunca invista com base apenas em mensagens do WhatsApp!' 
        });
        return;
      }
      
      // Verificação para outros golpes comuns
      if (suspiciousKeywords.some(keyword => lowerCaseText.includes(keyword))) {
        resolve({ 
          status: 'danger', 
          message: 'Cuidado! A mensagem contém palavras suspeitas que são comuns em golpes. Desconfie de ofertas "grátis", prêmios inesperados ou solicitações de dados pessoais.' 
        });
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
  const [showHelp, setShowHelp] = useState(false);

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

  const handleHelp = () => {
    setShowHelp(true);
  };



  const handlePasteFromClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setInputValue(text);
    } catch (err) {
      alert('Não foi possível colar o texto. Tente colar manualmente usando Ctrl+V');
    }
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
            <div className="result-buttons">
              <button onClick={handleReset} className="verify-button">
                Verificar Outro
              </button>
            </div>
          </div>
        );
      case 'danger':
        return (
          <div className="state-container result-danger">
            <div className="icon">!</div>
            <h2 className="result-title">Perigoso</h2>
            <p className="result-description">{resultMessage}</p>
            <div className="result-buttons">
              <button onClick={handleReset} className="verify-button">
                Verificar Outro
              </button>
            </div>
          </div>
        );
      case 'idle':
      default:
        return (
          <>
            <h1 className="title">Verificador de Segurança</h1>
            <p className="subtitle">Cole a mensagem ou link suspeito que você recebeu.</p>
            
            <div className="input-container">
              <textarea
                className="text-input"
                placeholder="Cole aqui a mensagem ou o link suspeito..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
              />
              <button onClick={handlePasteFromClipboard} className="paste-button" title="Colar texto copiado">
                <span className="paste-icon">📋</span>
                <span className="paste-text">Colar</span>
              </button>
            </div>
            
            <div className="button-group">
              <button onClick={handleVerify} className="verify-button" disabled={!inputValue.trim()}>
                Verificar Agora
              </button>
              <button onClick={handleHelp} className="help-button">
                Como Usar
              </button>
            </div>
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
      
      {/* Modal de Ajuda */}
      {showHelp && (
        <div className="modal-overlay" onClick={() => setShowHelp(false)}>
          <div className="help-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Como Usar a Ferramenta</h2>
            </div>
            <div className="modal-content">
              <div className="video-container">
                <h3>Tutorial em Vídeo:</h3>
                <div className="video-embed">
                  {/* Aqui você pode adicionar o embed do YouTube ou outro player */}
                  <iframe 
                    width="100%" 
                    height="315" 
                    src="about:blank" 
                    title="Tutorial Clique Seguro"
                    frameBorder="0" 
                    allowFullScreen
                    style={{backgroundColor: '#f3f4f6', borderRadius: '8px'}}
                  ></iframe>
                </div>
              </div>
              <div className="step-by-step">
                <h3>Passo a Passo:</h3>
                <ol>
                  <li><strong>Copie</strong> a mensagem suspeita</li>
                  <li><strong>Cole</strong> aqui usando o botão "📋 Colar"</li>
                  <li><strong>Clique</strong> em "Verificar Agora"</li>
                  <li><strong>Aguarde</strong> o resultado da análise</li>
                </ol>
              </div>
              <div className="help-tips">
                <h3>Dicas de Segurança:</h3>
                <ul>
                  <li>Desconfie de prêmios ou ofertas "imperdíveis"</li>
                  <li>Nunca informe senhas por mensagem</li>
                  <li>Bancos não pedem dados por WhatsApp</li>
                  <li>Links encurtados podem esconder sites falsos</li>
                </ul>
              </div>
              
              <div className="modal-footer">
                <button className="verify-button" onClick={() => setShowHelp(false)}>
                  Voltar ao Verificador
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </>
  );
}

export default App;