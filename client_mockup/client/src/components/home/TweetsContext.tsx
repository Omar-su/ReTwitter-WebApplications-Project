import { createContext, ReactNode, useContext, useState } from 'react';
import { Tweet } from '../../Interfaces';


type TweetsContextValue = [Tweet[], React.Dispatch<React.SetStateAction<Tweet[]>>];

export const TweetsContext = createContext<TweetsContextValue>([[], () => {}]);

type TweetsProviderProps = {
  children: ReactNode;
};

export function TweetsProvider({ children } : TweetsProviderProps) {
  const [tweets, setTweets] = useState<Tweet[]>([]);

  return (
    <TweetsContext.Provider value={[tweets, setTweets]}>
      {children}
    </TweetsContext.Provider>
  );
}

export function useTweets() {
  return useContext(TweetsContext);
}