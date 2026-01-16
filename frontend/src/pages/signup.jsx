// import { Link,useNavigate } from "react-router-dom";
// import { useState } from "react";
// import {MessageCircle} from "lucide-react";

// const Signup = () =>{

// const [name,setName] =useState("");
// const [username,setUserame] =useState("");
// const [email,setEmail] = useState("");
// const [password,setPassword] =useState("");
// const [confirm, setConfirm] = useState("");
// const [error, setError] = useState("");
// const navigate = useNavigate();

// async function handleSignUp(e)
// {
//   e.preventDefault();
//   setError("");

//   if(!name || !username || !password)
//   {
//     setError("Fields are required");
//   }
//   if (password!=confirm)
//   {
//     setError("Passwords do not match");
//   }

//   try{
//     const res = await fetch("http://localhost:5000/api/auth/signup",{
//       method:"POST",
//       headers:{"Content-Type":"application/json"},
//       body:JSON.stringify({name,username,email,password})
//     });
//   const data = await res.json();
//     if (!res.ok) {
//       setError(data.message || "Signup failed");
//       return;
//   }
//   // go to login page
//   navigate("/");
// }
// catch(err){
// setError("Network error");
// }
// }
//   eturn (
//     <div className="min-h-screen flex items-center justify-center bg-background px-4">
//       <div className="w-full max-w-md space-y-8 animate-fade-in">
//         {/* Logo */}
//         <div className="mx-auto w-16 h-16 bg-primary rounded-2xl flex items-center justify-center shadow-lg">
//           <MessageCircle className="w-8 h-8 text-primary-foreground" />
//         </div>

//         {/* Heading */}
//         <div className="text-center space-y-2">
//           <h2 className="text-3xl font-bold text-foreground">
//             Create Account
//           </h2>
//           <p className="text-muted-foreground">
//             Join ChatApp and start chatting
//           </p>
//         </div>

//         {/* Form */}
//         <form onSubmit={handleSignUp} className="space-y-4">
//           <input
//             type="text"
//             placeholder="Full Name"
//             value={name}
//             onChange={(e) => setName(e.target.value)}
//             className="w-full h-12 px-4 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary"
//           />

//           <input
//             type="text"
//             placeholder="Username"
//             value={username}
//             onChange={(e) => setUsername(e.target.value)}
//             className="w-full h-12 px-4 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary"
//           />

//           <input
//             type="email"
//             placeholder="Email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             className="w-full h-12 px-4 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary"
//           />

//           <input
//             type="password"
//             placeholder="Password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             className="w-full h-12 px-4 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary"
//           />

//           <input
//             type="password"
//             placeholder="Confirm Password"
//             value={confirm}
//             onChange={(e) => setConfirm(e.target.value)}
//             className="w-full h-12 px-4 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary"
//           />

//           {error && (
//             <p className="text-sm text-red-500 text-center">{error}</p>
//           )}

//           <Button
//             type="submit"
//             size="lg"
//             className="w-full h-12 text-lg font-semibold"
//           >
//             Create Account
//           </Button>
//         </form>

//         {/* Footer */}
//         <p className="text-center text-sm text-muted-foreground">
//           Already have an account?{" "}
//           <Link to="/" className="text-primary font-medium hover:underline">
//             Login
//           </Link>
//         </p>
//       </div>
//     </div>
//   );
// };

// export default Signup;

// import { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { MessageCircle } from "lucide-react";

// const Signup = () => {
//   const [name, setName] = useState("");
//   const [username, setUsername] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [confirm, setConfirm] = useState("");
//   const [error, setError] = useState("");
//   const navigate = useNavigate();

//   async function handleSignUp(e) {
//     e.preventDefault();
//     setError("");

//     if (!name || !username || !password) {
//       setError("All fields are required");
//       return;
//     }

//     if (password !== confirm) {
//       setError("Passwords do not match");
//       return;
//     }

//     try {
//       const res = await fetch("http://localhost:5000/api/auth/signup", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ name, username, email, password }),
//       });

//       const data = await res.json();
//       if (!res.ok) {
//         setError(data.message || "Signup failed");
//         return;
//       }

//       navigate("/");
//     } catch (err) {
//       setError("Network error");
//     }
//   }

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-background px-4">
//       <div className="w-full max-w-md space-y-8 animate-fade-in">
//         {/* Logo */}
//         <div className="mx-auto w-16 h-16 bg-primary rounded-2xl flex items-center justify-center shadow-lg">
//           <MessageCircle className="w-8 h-8 text-primary-foreground" />
//         </div>

//         {/* Heading */}
//         <div className="text-center space-y-2">
//           <h2 className="text-3xl font-bold text-foreground">Create Account</h2>
//           <p className="text-muted-foreground">
//             Join ChatApp and start chatting
//           </p>
//         </div>

//         {/* Form */}
//         <form onSubmit={handleSignUp} className="space-y-4">
//           <input
//             type="text"
//             placeholder="Full Name"
//             value={name}
//             onChange={(e) => setName(e.target.value)}
//             className="w-full h-12 px-4 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary"
//           />

//           <input
//             type="text"
//             placeholder="Username"
//             value={username}
//             onChange={(e) => setUsername(e.target.value)}
//             className="w-full h-12 px-4 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary"
//           />

//           <input
//             type="email"
//             placeholder="Email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             className="w-full h-12 px-4 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary"
//           />

//           <input
//             type="password"
//             placeholder="Password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             className="w-full h-12 px-4 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary"
//           />

//           <input
//             type="password"
//             placeholder="Confirm Password"
//             value={confirm}
//             onChange={(e) => setConfirm(e.target.value)}
//             className="w-full h-12 px-4 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary"
//           />

//           {error && <p className="text-sm text-red-500 text-center">{error}</p>}

//           <button
//             type="submit"
//             className="w-full h-12 text-lg font-semibold rounded-lg
//              bg-primary text-primary-foreground
//              hover:bg-primary/90 transition-all shadow-lg"
//           >
//             Create Account
//           </button>
//         </form>

//         {/* Footer */}
//         <p className="text-center text-sm text-muted-foreground">
//           Already have an account?{" "}
//           <Link to="/" className="text-primary font-medium hover:underline">
//             Login
//           </Link>
//         </p>
//       </div>
//     </div>
//   );
// };

// export default Signup;

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MessageCircle } from "lucide-react";

const Signup = () => {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function handleSignUp(e) {
    e.preventDefault();
    setError("");

    if (!name || !username || !password) {
      setError("All fields are required");
      return;
    }

    if (password !== confirm) {
      setError("Passwords do not match");
      return;
    }

    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_API}/api/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, username, email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "Signup failed");
        return;
      }

      navigate("/login");
    } catch (err) {
      setError("Network error");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-fuchsia-100 px-4">
      <div className="w-full max-w-md bg-white p-4 rounded-lg space-y-8 shadow-lg animate-fade-in">
        {/* Logo */}
        <div className="mx-auto w-16 h-16 bg-linear-to-br from-purple-400 to-blue-500 rounded-2xl flex items-center justify-center shadow-lg">
          <MessageCircle className="w-8 h-8 text-white" />
        </div>

        {/* Heading */}
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold text-foreground">Create Account</h2>
          <p className="text-muted-foreground">
            Join TalkFlow and start chatting
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSignUp} className="space-y-4">
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full h-12 px-4 rounded-lg bg-gray-100 text-gray-900 placeholder-gray-500 border border-gray-200 focus:outline-none focus:ring-2 focus:border-transparent transition"
          />

          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full h-12 px-4 rounded-lg bg-gray-100 text-gray-900 placeholder-gray-500 border border-gray-200 focus:outline-none focus:ring-2 focus:border-transparent transition"
          />

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full h-12 px-4 rounded-lg bg-gray-100 text-gray-900 placeholder-gray-500 border border-gray-200 focus:outline-none focus:border-transparent transition"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full h-12 px-4 rounded-lg bg-gray-100 text-gray-900 placeholder-gray-500 border border-gray-200 focus:outline-none focus:border-transparent transition"
          />

          <input
            type="password"
            placeholder="Confirm Password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            className="w-full h-12 px-4 rounded-lg bg-gray-100 text-gray-900 placeholder-gray-500 border border-gray-200  focus:outline-none focus:border-transparent transition"
          />

          {error && <p className="text-sm text-red-500 text-center">{error}</p>}

          <button
            type="submit"
            className="w-full h-12 text-lg font-semibold rounded-lg
              text-primary-foreground
              bg-linear-to-br from-purple-400 to-blue-500 text-white 
             hover:bg-primary/90 transition-all shadow-lg"
          >
            Create Account
          </button>
        </form>

        {/* Footer */}
        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-primary font-medium hover:underline"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
