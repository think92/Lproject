import { Children, createContext, useState } from "react";

/* 

작성자 : 전송민

LoginUserContext 

- 로그인한 회원의 정보는 담는 Context 
- 아이디와 등급을 담는다.
- 추후 개발과정으로 localStorage 또는 sessionStorage로 업그레이드 예정
(https://dev-syhy.tistory.com/39)

*/

export const LoginUserContext = createContext();

export const LoginUserProvider = ({ children }) => {
  const [login_id, setLogin_id] = useState(null);
  const [login_role, setLogin_role] = useState(null);

  return (
    <LoginUserContext.Provider
      value={{ login_id, setLogin_id, login_role, setLogin_role }}
    >
      {children}
    </LoginUserContext.Provider>
  );
};
