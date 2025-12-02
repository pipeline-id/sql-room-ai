import {useState, useMemo} from 'react';
import {Room} from './room';
import {TokenInput} from './components/TokenInput';
import {createRoomStoreWithToken} from './store';

export const App = () => {
  const [mdToken, setMdToken] = useState<string | null>(() => {
    return localStorage.getItem('md-token');
  });

  const roomStore = useMemo(() => {
    if (!mdToken) return null;
    return createRoomStoreWithToken(mdToken).roomStore;
  }, [mdToken]);

  const handleTokenSubmit = (token: string) => {
    setMdToken(token);
  };

  if (!mdToken || !roomStore) {
    return <TokenInput onSubmit={handleTokenSubmit} />;
  }

  return <Room roomStore={roomStore} />;
};
