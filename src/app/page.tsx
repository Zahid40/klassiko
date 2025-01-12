import { clearUser, setUser } from "@/store/slices/userSlice";
import { RootState } from "@/store/store";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";

export default async function Page() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data: todos } = await supabase.from("todos").select();

  // const user = useSelector((state: RootState) => state.user);

  // const dispatch = useDispatch();

  // const login = () => {
  //   dispatch(setUser({ name: "John Doe", email: "john@example.com" }));
  // };

  // const logout = () => {
  //   dispatch(clearUser());
  // };

  return (
    <div>
      Helo
      <Link href={"/login"}>Login</Link>
      {/* <h1>Welcome, {user.name}</h1>
      <p>Email: {user.email}</p>
      <div>
        <button onClick={login}>Login</button>
        <button onClick={logout}>Logout</button>
      </div> */}
      <ul>
        {todos?.map((todo) => (
          <li>{todo}</li>
        ))}
      </ul>
    </div>
  );
}
