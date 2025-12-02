import {useState, useMemo} from 'react';
import {Room} from './room';
import {TokenInput, TokenConfig} from './components/TokenInput';
import {createRoomStoreWithToken} from './store';

export const App = () => {
  const [config, setConfig] = useState<TokenConfig | null>(() => {
    const mdToken = localStorage.getItem('md-token');
    const openaiApiKey = localStorage.getItem('openai-api-key') || '';
    const anthropicApiKey = localStorage.getItem('anthropic-api-key') || '';
    const groqApiKey = localStorage.getItem('groq-api-key') || '';

    // Only return config if we have the required token and at least one API key
    if (mdToken && (openaiApiKey || anthropicApiKey || groqApiKey)) {
      return { mdToken, openaiApiKey, anthropicApiKey, groqApiKey };
    }
    return null;
  });

  const roomStore = useMemo(() => {
    if (!config) return null;
    return createRoomStoreWithToken(config.mdToken, {
      openai: config.openaiApiKey,
      anthropic: config.anthropicApiKey,
      groq: config.groqApiKey,
    }).roomStore;
  }, [config]);

  const handleTokenSubmit = (newConfig: TokenConfig) => {
    setConfig(newConfig);
  };

  if (!config || !roomStore) {
    return <TokenInput onSubmit={handleTokenSubmit} />;
  }

  return <Room roomStore={roomStore} />;
};
