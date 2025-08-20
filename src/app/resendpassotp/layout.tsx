import React from 'react';

interface LayoutProps {
    children: React.ReactNode;
}

function Layout({ children }: LayoutProps) {
    return (
        <main className="  ">
            {children}
        </main>
    );
}

export default Layout;
