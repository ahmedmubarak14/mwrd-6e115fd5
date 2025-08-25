
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Shield, 
  Zap, 
  Users, 
  Clock, 
  CheckCircle, 
  Star,
  ArrowRight,
  Building,
  UserCheck,
  Award,
  TrendingUp,
  Globe,
  Phone,
  Mail,
  MapPin,
  Facebook,
  Twitter,
  Linkedin,
  Instagram
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { InteractiveDemo } from '@/components/demo/InteractiveDemo';

export const Landing = () => {
  const [isDemoOpen, setIsDemoOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <img 
                src="/lovable-uploads/1dd4b232-845d-46eb-9f67-b752fce1ac3b.png" 
                alt="MWRD Logo" 
                className="h-10 w-auto"
              />
            </div>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center space-x-8">
              <Link to="/why-start-with-mwrd" className="text-gray-700 hover:text-primary transition-colors">
                Why Start with Us
              </Link>
              <Link to="/what-makes-us-unique" className="text-gray-700 hover:text-primary transition-colors">
                What Makes Us Unique
              </Link>
              <Link to="/why-move-to-mwrd" className="text-gray-700 hover:text-primary transition-colors">
                Why Move to Us
              </Link>
              <Link to="/pricing" className="text-gray-700 hover:text-primary transition-colors">
                Pricing
              </Link>
            </div>

            {/* Auth Buttons */}
            <div className="flex items-center space-x-4">
              <Button variant="ghost" asChild>
                <Link to="/login">Sign In</Link>
              </Button>
              <Button asChild>
                <Link to="/register">Get Started</Link>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <Badge className="w-fit bg-primary/10 text-primary border-primary/20">
                  🚀 Transform Your Business Operations
                </Badge>
                <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 leading-tight">
                  The Future of
                  <span className="text-primary block">
                    Business Procurement
                  </span>
                </h1>
                <p className="text-xl text-gray-600 max-w-lg">
                  Connect with verified vendors, streamline your procurement process, 
                  and grow your business with our intelligent matching platform.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="text-lg px-8" asChild>
                  <Link to="/register">
                    Start Free Trial <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="text-lg px-8" onClick={() => setIsDemoOpen(true)}>
                  Watch Demo
                </Button>
              </div>

              {/* Social Proof */}
              <div className="flex items-center space-x-6 pt-4">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 border-2 border-white" />
                  ))}
                </div>
                <div className="text-sm text-gray-600">
                  <span className="font-semibold">2,500+</span> businesses trust MWRD
                </div>
              </div>
            </div>

            {/* Interactive Demo Placeholder */}
            <div className="lg:pl-12">
              <div className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl p-8 text-center">
                <h3 className="text-2xl font-bold mb-4">Interactive Platform Demo</h3>
                <p className="text-gray-600 mb-6">Experience MWRD's powerful features in action</p>
                <Button onClick={() => setIsDemoOpen(true)} className="bg-primary hover:bg-primary/90">
                  Launch Interactive Demo
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Demo Modal */}
      <InteractiveDemo 
        isOpen={isDemoOpen}
        onClose={() => setIsDemoOpen(false)}
      />

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Key Features
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Explore the powerful features that make MWRD the ultimate platform 
              for business procurement and vendor management.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature Card 1 */}
            <Card className="border-2 border-transparent hover:border-primary/20 transition-all duration-300">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                  <Shield className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-xl">Secure Platform</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center text-gray-600">
                  Enterprise-grade security measures to protect your data and transactions.
                </CardDescription>
              </CardContent>
            </Card>

            {/* Feature Card 2 */}
            <Card className="border-2 border-transparent hover:border-primary/20 transition-all duration-300">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                  <Zap className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-xl">Intelligent Matching</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center text-gray-600">
                  AI-powered matching algorithm connects you with the best vendors for your needs.
                </CardDescription>
              </CardContent>
            </Card>

            {/* Feature Card 3 */}
            <Card className="border-2 border-transparent hover:border-primary/20 transition-all duration-300">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                  <Users className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-xl">Vendor Network</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center text-gray-600">
                  Access a diverse network of verified vendors across various industries.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-primary text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { label: 'Active Users', value: '15K+' },
              { label: 'Successful Projects', value: '8.2K+' },
              { label: 'Verified Vendors', value: '3.5K+' },
              { label: 'Countries Served', value: '25+' }
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl md:text-4xl font-bold mb-2">{stat.value}</div>
                <div className="text-white/80">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How MWRD Works
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our streamlined process makes it easy for businesses to connect, 
              collaborate, and grow together.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: 'Post Your Requirements',
                description: 'Share your project details and specifications with our verified vendor network.',
                icon: Building
              },
              {
                step: '02',
                title: 'Get Matched & Compare',
                description: 'Receive qualified proposals and compare offers from pre-vetted vendors.',
                icon: UserCheck
              },
              {
                step: '03',
                title: 'Execute & Grow',
                description: 'Work with your chosen vendor and track progress through our platform.',
                icon: TrendingUp
              }
            ].map((step) => (
              <Card key={step.step} className="border-2 border-transparent hover:border-primary/20 transition-all duration-300 group">
                <CardHeader className="text-center pb-4">
                  <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center group-hover:bg-primary/20 transition-colors mb-4">
                    <step.icon className="h-8 w-8 text-primary" />
                  </div>
                  <div className="text-4xl font-bold text-primary mb-2">{step.step}</div>
                  <CardTitle className="text-xl">{step.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-center text-gray-600">
                    {step.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              What Our Clients Say
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Real stories from businesses that have transformed their operations 
              with MWRD.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                quote: 'MWRD has revolutionized our procurement process. We now connect with top-tier vendors effortlessly.',
                author: 'Sarah L., CEO',
                company: 'Tech Solutions Inc.'
              },
              {
                quote: 'The intelligent matching feature saved us countless hours. We found the perfect vendor for our project in no time.',
                author: 'David K., Project Manager',
                company: 'Global Innovations Ltd.'
              },
              {
                quote: 'We\'ve seen a significant increase in efficiency since implementing MWRD. It\'s a game-changer for our business.',
                author: 'Emily R., Operations Director',
                company: 'Pioneer Enterprises'
              }
            ].map((testimonial) => (
              <Card key={testimonial.author} className="border-2 border-transparent hover:border-primary/20 transition-all duration-300">
                <CardContent className="space-y-4">
                  <div className="text-gray-700 italic">“{testimonial.quote}”</div>
                  <div className="font-semibold text-gray-900">{testimonial.author}</div>
                  <div className="text-gray-600">{testimonial.company}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Flexible Pricing Plans
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Choose the plan that best fits your business needs and start 
              transforming your procurement process today.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Free Plan */}
            <Card className="border-2 border-gray-200">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl font-bold">Free</CardTitle>
                <CardDescription className="text-gray-600">
                  Get started with our basic features.
                </CardDescription>
                <div className="text-4xl font-bold mt-4">$0<span className="text-sm text-gray-600">/month</span></div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Basic vendor matching</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Limited project postings</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-400">Standard support</span>
                </div>
                <Button className="w-full" variant="outline">Get Started</Button>
              </CardContent>
            </Card>

            {/* Pro Plan */}
            <Card className="border-2 border-primary">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl font-bold">Pro</CardTitle>
                <CardDescription className="text-gray-600">
                  Unlock advanced features for growing businesses.
                </CardDescription>
                <div className="text-4xl font-bold mt-4">$99<span className="text-sm text-gray-600">/month</span></div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Advanced vendor matching</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Unlimited project postings</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Priority support</span>
                </div>
                <Button className="w-full">Upgrade to Pro</Button>
              </CardContent>
            </Card>

            {/* Enterprise Plan */}
            <Card className="border-2 border-gray-200">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl font-bold">Enterprise</CardTitle>
                <CardDescription className="text-gray-600">
                  Custom solutions for large organizations.
                </CardDescription>
                <div className="text-4xl font-bold mt-4">Contact Us</div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Custom vendor matching</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Dedicated account manager</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>24/7 premium support</span>
                </div>
                <Button className="w-full" variant="outline">Contact Sales</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Awards Section */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Recognized and Awarded
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our commitment to excellence has been recognized by industry leaders.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: 'Best Procurement Platform',
                organization: 'Global Tech Awards',
                icon: Award
              },
              {
                title: 'Innovation in Vendor Management',
                organization: 'Business Innovation Summit',
                icon: Star
              },
              {
                title: 'Top Business Solution',
                organization: 'Enterprise Solutions Magazine',
                icon: Globe
              }
            ].map((award) => (
              <Card key={award.title} className="border-2 border-transparent hover:border-primary/20 transition-all duration-300">
                <CardHeader className="text-center pb-4">
                  <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                    <award.icon className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="text-xl">{award.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-center text-gray-600">
                    Awarded by {award.organization} for excellence in business solutions.
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-primary to-purple-600 text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Transform Your Business?
          </h2>
          <p className="text-xl mb-8 text-white/90">
            Join thousands of businesses already growing with MWRD. 
            Start your free trial today and experience the difference.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" className="text-lg px-8" asChild>
              <Link to="/register">
                Start Free Trial <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 border-white text-white hover:bg-white hover:text-primary">
              Contact Sales
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            {/* Company Info */}
            <div className="space-y-4">
              <img 
                src="/lovable-uploads/1dd4b232-845d-46eb-9f67-b752fce1ac3b.png" 
                alt="MWRD Logo" 
                className="h-10 w-auto"
              />
              <p className="text-gray-400">
                Transforming business procurement through intelligent vendor matching 
                and streamlined collaboration.
              </p>
              <div className="flex space-x-4">
                <Facebook className="h-5 w-5 text-gray-400 hover:text-white cursor-pointer" />
                <Twitter className="h-5 w-5 text-gray-400 hover:text-white cursor-pointer" />
                <Linkedin className="h-5 w-5 text-gray-400 hover:text-white cursor-pointer" />
                <Instagram className="h-5 w-5 text-gray-400 hover:text-white cursor-pointer" />
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <div className="space-y-2">
                <Link to="/why-start-with-mwrd" className="block text-gray-400 hover:text-white">Why Start with Us</Link>
                <Link to="/what-makes-us-unique" className="block text-gray-400 hover:text-white">What Makes Us Unique</Link>
                <Link to="/why-move-to-mwrd" className="block text-gray-400 hover:text-white">Why Move to Us</Link>
                <Link to="/pricing" className="block text-gray-400 hover:text-white">Pricing</Link>
              </div>
            </div>

            {/* Support */}
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <div className="space-y-2">
                <a href="#" className="block text-gray-400 hover:text-white">Help Center</a>
                <a href="#" className="block text-gray-400 hover:text-white">Contact Support</a>
                <a href="#" className="block text-gray-400 hover:text-white">Privacy Policy</a>
                <a href="#" className="block text-gray-400 hover:text-white">Terms of Service</a>
              </div>
            </div>

            {/* Contact */}
            <div>
              <h4 className="font-semibold mb-4">Contact Us</h4>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-400">support@mwrd.com</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-400">+1 (555) 123-4567</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-400">New York, NY</span>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400">
              © 2024 MWRD. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link to="/privacy-policy" className="text-gray-400 hover:text-white">Privacy</Link>
              <Link to="/terms-and-conditions" className="text-gray-400 hover:text-white">Terms</Link>
              <a href="#" className="text-gray-400 hover:text-white">Cookies</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
