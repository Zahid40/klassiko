
import { clearUser, setUser } from "@/lib/slices/userSlice";
import { RootState } from "@/lib/store";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { useDispatch, useSelector } from "react-redux";

export default async function Page() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data: todos } = await supabase.from("todos").select();

  const user = useSelector((state: RootState) => state.user);

  const dispatch = useDispatch();

  const login = () => {
    dispatch(setUser({ name: "John Doe", email: "john@example.com" }));
  };

  const logout = () => {
    dispatch(clearUser());
  };

  return (
    <div>
      hwlooo
      <h1>Welcome, {user.name}</h1>
      <p>Email: {user.email}</p>
      <div>
        <button onClick={login}>Login</button>
        <button onClick={logout}>Logout</button>
      </div>
      <ul>
        {todos?.map((todo) => (
          <li>{todo}</li>
        ))}
      </ul>
    </div>
  );
}
