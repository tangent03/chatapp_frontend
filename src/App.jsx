import { lazy, Suspense, useEffect } from "react";
import { Toaster } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ProtectRoute from "./components/auth/ProtectRoute";
import CallInterface from "./components/call/CallInterface";
import { LayoutLoader } from "./components/layout/Loaders";
import { server } from "./constants/config";
import { CallProvider } from "./context/CallContext";
import { userExists } from "./redux/reducers/auth";
import { SocketProvider } from "./socket";

const Chat = lazy(() => import("./pages/Chat"));
const Groups = lazy(() => import("./pages/Groups"));
const Home = lazy(() => import("./pages/Home"));
const Login = lazy(() => import("./pages/Login"));
const AdminLogin = lazy(() => import("./pages/admin/AdminLogin"));
const Dashboard = lazy(() => import("./pages/admin/Dashboard"));
const UserManagement = lazy(() => import("./pages/admin/UserManagement"));
const ChatManagement = lazy(() => import("./pages/admin/ChatManagement"));
const MessagesManagement = lazy(() => import("./pages/admin/MessageManagement"));
const NotFound = lazy(() => import("./pages/NotFound"));

const App = () => {
  const { user, loader } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(userExists());
  }, [dispatch]);

  return loader ? (
    <LayoutLoader />
  ) : (
    <BrowserRouter>
      <Suspense fallback={<LayoutLoader />}>
        <SocketProvider>
          <CallProvider>
            {user && <CallInterface />}
            <Routes>
              <Route
                path="/"
                element={
                  <ProtectRoute user={user} redirect="/login">
                    <Home />
                  </ProtectRoute>
                }
              />

              <Route
                path="/groups"
                element={
                  <ProtectRoute user={user} redirect="/login">
                    <Groups />
                  </ProtectRoute>
                }
              />

              <Route
                path="/chat/:chatId"
                element={
                  <ProtectRoute user={user} redirect="/login">
                    <Chat />
                  </ProtectRoute>
                }
              />

              <Route
                path="/login"
                element={
                  <ProtectRoute user={!user} redirect="/">
                    <Login />
                  </ProtectRoute>
                }
              />

              <Route path="/admin" element={<AdminLogin />} />
              <Route path="/admin/dashboard" element={<Dashboard />} />
              <Route path="/admin/users" element={<UserManagement />} />
              <Route path="/admin/chats" element={<ChatManagement />} />
              <Route path="/admin/messages" element={<MessagesManagement />} />

              <Route path="*" element={<NotFound />} />
            </Routes>
          </CallProvider>
        </SocketProvider>
      </Suspense>

      <Toaster position="bottom-center" />
    </BrowserRouter>
  );
};

export { server };
export default App;