
import React from 'react';

const Landing = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Welcome to Supplify
          </h1>
          <p className="text-lg text-muted-foreground mb-8">
            Your procurement platform for connecting clients and vendors
          </p>
          <div className="space-y-4">
            <a
              href="/login"
              className="inline-block bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors"
            >
              Get Started
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;
