import { createContext, useState, ReactNode, Dispatch, SetStateAction } from "react";

type ErrorMessage = Record<string, any>;

type ErrorPage = {
  error: boolean;
  message: ErrorMessage;
};

type PagesContextType = {
  errorPage: ErrorPage;
  setErrorPage: Dispatch<SetStateAction<ErrorPage>>;
};

const PagesContext = createContext<PagesContextType | undefined>(undefined);

type Props = {
  children: ReactNode;
};

const PagesProvider = ({ children }: Props) => {
  const [errorPage, setErrorPage] = useState<ErrorPage>({
    error: false,
    message: {},
  });

  return (
    <PagesContext.Provider value={{ errorPage, setErrorPage }}>
      {children}
    </PagesContext.Provider>
  );
};

export { PagesProvider };
export default PagesContext;