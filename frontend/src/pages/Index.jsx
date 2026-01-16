import { Link } from "react-router-dom";
import { MessageCircle, Users, Shield } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Hero Section */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="text-center space-y-8 max-w-2xl animate-fade-in">
          {/* Logo */}
          <div className="mx-auto w-20 h-20  bg-linear-to-br from-purple-400 to-blue-500 rounded-3xl flex items-center justify-center shadow-xl animate-float">
            <MessageCircle className="w-10 h-10 text-white" />
          </div>

          {/* Heading */}
          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground">
              Welcome to <span className="text-primary">TalkFlow</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground">
              Connect with friends and family. Simple, fast, and fun messaging
              for everyone!
            </p>
          </div>

          {/* Features */}
          <div className="flex flex-wrap justify-center gap-6 py-4">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Users className="w-5 h-5 text-orange-500" />
              <span>Group Chats</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Shield className="w-5 h-5 text-green-500" />
              <span>Safe & Secure</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <MessageCircle className="w-5 h-5 text-secondary-foreground" />
              <span>Easy to Use</span>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Link to="/signup">
              <button
                className="
    w-full sm:w-auto 
    h-14 px-8 
    text-lg font-semibold 
    rounded-xl 
    bg-linear-to-br from-purple-400 to-blue-500 
    text-white 
    shadow-lg 
    transition-all duration-200 
    hover:bg-orange-600 
    hover:shadow-xl 
    active:scale-95
  "
              >
                Get Started
              </button>
            </Link>
            <Link to="/login">
              <button
                className="
    w-full sm:w-auto 
    h-14 px-8 
    text-lg font-semibold 
    rounded-xl 
    border-2 border-blue-500
    text-blue-500 
    transition-all duration-200 
    hover:bg-linear-to-br from-purple-400 to-blue-500  
    hover:text-white 
    active:scale-95
  "
              >
                Login
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="text-center py-6 text-muted-foreground text-sm">
        <p>Made with ❤️ in India</p>
      </footer>
    </div>
  );
};

export default Index;
