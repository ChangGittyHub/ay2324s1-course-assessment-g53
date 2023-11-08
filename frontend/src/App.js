import { useEffect } from "react"
import { BrowserRouter, Routes, Route} from "react-router-dom"
import QuestionPage from "./pages/QuestionPage"
import Login from "./pages/Login"
import Logout from "./pages/Logout"
import Layout from "./pages/Layout"
import UpdateUserProfilePage from "./pages/UpdateUserProfilePage"
import SignupPage from "./pages/SignupPage"
import AdminView from "./pages/AdminView"
import { useDispatch, useSelector } from "react-redux"
import { authActions } from "./store"
import useCookie from "./components/useCookie"
import UserProfile from "./pages/UserProfile"
import Room from "./pages/Room"
import Match from "./pages/Match"
import QuestionHistoryPage from "./pages/QuestionHistoryPage"



const App = () => {

  const isLogin = useSelector((state) => state.auth.isLoggedIn)
  const is_admin = useSelector((state) => state.auth.is_admin)
  const dispatch = useDispatch()
  const { getAuthCookie } = useCookie()

  useEffect(() => {
    const token = getAuthCookie()
    if (token) {
      dispatch(authActions.setLogin(true))
      const tokenBody = token.split('.')[1]
      let buffer = JSON.parse(atob(tokenBody))
      if (buffer.user_data.is_admin) {
        dispatch(authActions.setAdmin(true))
      }
    }
  }, [])
  //console.log(isLogin, is_admin)
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<Login />} />
        <Route path="signup" element={<SignupPage />} />
        <Route path="logout" element={<Logout />} />
        <Route path="/" element={<Layout is_admin={is_admin} />}>
          {isLogin ? <Route path="match" element = {<Match/>}/> : null}
          {isLogin ? <Route path="questionpage" element={<QuestionPage />} /> : null}
          {isLogin ? <Route path="profile" element={<UserProfile />} /> : null}
          {isLogin ? <Route path="questionhistory" element={<QuestionHistoryPage />} /> : null}
          {isLogin ? <Route path="room/:id" element={<Room />} /> : null}
          {is_admin ? <Route path="adminview" element={<AdminView />} /> : null}
        </Route>
      </Routes>
    </BrowserRouter>
  )

}

export default App
