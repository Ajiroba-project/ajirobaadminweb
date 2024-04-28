import React from "react";


interface LayoutProps {
  children: React.ReactNode; // Define the prop type for children
}

function Layout({ children }: LayoutProps) {


  return (
  <main >
      
            {children}
    
  </main>);
}

export default Layout;
