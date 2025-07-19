import { useState } from 'react';
import {
  Cpu,
  Github,
  BookOpen,
  Code,
  HelpCircle,
  Lightbulb,
  ChevronRight,
  CheckCircle2,
  AlertCircle,
  Terminal,
  FileCode,
  MessageSquare,
  Braces,
  Rocket,
  PanelLeft,
  Zap,
  Bot,
  Workflow,
  LayoutDashboard,
  Sparkles
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from './components/ui/card';
import { Button } from './components/ui/button';

// Define tutorial section types
type TutorialSection = {
  id: string;
  title: string;
  icon: React.ReactNode;
  description: string;
};

// Define tutorial step types

function App() {
  // State for active section
  const [activeSection, setActiveSection] = useState<string>('intro');
  // State for tracking progress
  const [completedSteps, setCompletedSteps] = useState<Record<string, boolean>>({});
  // State for showing troubleshooting tips
  const [showTroubleshooting, setShowTroubleshooting] = useState<Record<string, boolean>>({});

  // Define tutorial sections
  const tutorialSections: TutorialSection[] = [
    {
      id: 'intro',
      title: 'Introduction',
      icon: <BookOpen className="h-5 w-5" />,
      description: 'Learn what Factory AI is and what you can do with it'
    },
    {
      id: 'bridge',
      title: 'Connecting Bridge',
      icon: <Cpu className="h-5 w-5" />,
      description: 'Set up Bridge to connect your local machine'
    },
    {
      id: 'github',
      title: 'GitHub Setup',
      icon: <Github className="h-5 w-5" />,
      description: 'Connect your GitHub account and repositories'
    },
    {
      id: 'workflows',
      title: 'Basic Workflows',
      icon: <Workflow className="h-5 w-5" />,
      description: 'Learn how to use Factory AI for common tasks'
    },
    {
      id: 'usecases',
      title: 'Use Cases',
      icon: <Lightbulb className="h-5 w-5" />,
      description: 'Practical examples for creators and beginners'
    },
    {
      id: 'help',
      title: 'Help & Resources',
      icon: <HelpCircle className="h-5 w-5" />,
      description: 'Get help and find additional resources'
    }
  ];

  // Toggle step completion
  const toggleStepCompletion = (stepId: string) => {
    setCompletedSteps(prev => ({
      ...prev,
      [stepId]: !prev[stepId]
    }));
  };

  // Toggle troubleshooting tips
  const toggleTroubleshooting = (sectionId: string) => {
    setShowTroubleshooting(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  // Get tutorial content based on active section
  const getTutorialContent = () => {
    switch (activeSection) {
      case 'intro':
        return (
          <div className="space-y-6">
            <div className="rounded-lg bg-primary/10 p-4 border border-primary/20">
              <h3 className="text-lg font-medium flex items-center">
                <Sparkles className="h-5 w-5 mr-2 text-primary" />
                Welcome to Factory AI
              </h3>
              <p className="mt-2">
                Factory AI is a platform that helps you build software faster using AI. It's designed for creators and beginners, not just experienced programmers.
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium">What You Can Do With Factory AI:</h3>
              
              <div className="grid gap-3">
                <div className="flex items-start gap-3 rounded-md border p-3">
                  <Bot className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <h4 className="font-medium">Chat with AI Assistants</h4>
                    <p className="text-sm text-muted-foreground">Get help with coding, design, and creative tasks through natural conversation</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 rounded-md border p-3">
                  <Code className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <h4 className="font-medium">Create and Edit Code</h4>
                    <p className="text-sm text-muted-foreground">Build applications, websites, and scripts even if you're not an expert coder</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 rounded-md border p-3">
                  <Terminal className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <h4 className="font-medium">Run Commands on Your Machine</h4>
                    <p className="text-sm text-muted-foreground">Execute terminal commands and see results without leaving the interface</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 rounded-md border p-3">
                  <Github className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <h4 className="font-medium">Integrate with GitHub</h4>
                    <p className="text-sm text-muted-foreground">Work with your repositories, create pull requests, and manage code</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-between">
              <Button 
                variant="outline"
                disabled={true}
              >
                Previous
              </Button>
              <Button 
                onClick={() => setActiveSection('bridge')}
                className="gap-1"
              >
                Next: Connecting Bridge
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        );
        
      case 'bridge':
        return (
          <div className="space-y-6">
            <div className="rounded-lg bg-primary/10 p-4 border border-primary/20">
              <h3 className="text-lg font-medium flex items-center">
                <Cpu className="h-5 w-5 mr-2 text-primary" />
                Connecting Bridge
              </h3>
              <p className="mt-2">
                Bridge allows Factory AI to interact with your local machine. This is essential for running commands, accessing files, and executing code.
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Step-by-Step Guide:</h3>
              
              <div className="space-y-3">
                <div className="flex items-start gap-3 rounded-md border p-3">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border">
                    1
                  </div>
                  <div className="space-y-1">
                    <div className="font-medium">Download Bridge</div>
                    <p className="text-sm text-muted-foreground">
                      Click on the CPU icon in the top right corner of the Factory AI interface
                    </p>
                    <div className="mt-2">
                      <Button
                        variant="secondary"
                        size="sm"
                        className="gap-1"
                        onClick={() => toggleStepCompletion('download-bridge')}
                      >
                        {completedSteps['download-bridge'] ? (
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                        ) : (
                          <CheckCircle2 className="h-4 w-4" />
                        )}
                        Mark as {completedSteps['download-bridge'] ? 'incomplete' : 'complete'}
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3 rounded-md border p-3">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border">
                    2
                  </div>
                  <div className="space-y-1">
                    <div className="font-medium">Install Bridge</div>
                    <p className="text-sm text-muted-foreground">
                      Run the downloaded installer and follow the prompts to complete installation
                    </p>
                    <div className="mt-2">
                      <Button
                        variant="secondary"
                        size="sm"
                        className="gap-1"
                        onClick={() => toggleStepCompletion('install-bridge')}
                      >
                        {completedSteps['install-bridge'] ? (
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                        ) : (
                          <CheckCircle2 className="h-4 w-4" />
                        )}
                        Mark as {completedSteps['install-bridge'] ? 'incomplete' : 'complete'}
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3 rounded-md border p-3">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border">
                    3
                  </div>
                  <div className="space-y-1">
                    <div className="font-medium">Connect to Factory AI</div>
                    <p className="text-sm text-muted-foreground">
                      Once installed, Bridge should automatically connect to Factory AI. The CPU icon will turn green when connected.
                    </p>
                    <div className="mt-2">
                      <Button
                        variant="secondary"
                        size="sm"
                        className="gap-1"
                        onClick={() => toggleStepCompletion('connect-bridge')}
                      >
                        {completedSteps['connect-bridge'] ? (
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                        ) : (
                          <CheckCircle2 className="h-4 w-4" />
                        )}
                        Mark as {completedSteps['connect-bridge'] ? 'incomplete' : 'complete'}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => toggleTroubleshooting('bridge')}
                className="mt-4 w-full"
              >
                {showTroubleshooting['bridge'] ? 'Hide' : 'Show'} Troubleshooting Tips
              </Button>

              {showTroubleshooting['bridge'] && (
                <div className="rounded-md bg-muted p-4 space-y-3">
                  <h4 className="font-medium flex items-center">
                    <AlertCircle className="h-4 w-4 mr-2 text-amber-500" />
                    Common Issues
                  </h4>
                  
                  <div className="space-y-2">
                    <p className="text-sm"><strong>Bridge won't install:</strong> Make sure you have admin privileges on your computer.</p>
                    <p className="text-sm"><strong>Bridge won't connect:</strong> Try restarting both Bridge and your browser.</p>
                    <p className="text-sm"><strong>Connection drops:</strong> Check your internet connection and firewall settings.</p>
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-between">
              <Button 
                variant="outline"
                onClick={() => setActiveSection('intro')}
              >
                Previous
              </Button>
              <Button 
                onClick={() => setActiveSection('github')}
                className="gap-1"
              >
                Next: GitHub Setup
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        );
        
      case 'github':
        return (
          <div className="space-y-6">
            {/* ----------  HEADER  ---------- */}
            <div className="rounded-lg bg-primary/10 p-4 border border-primary/20">
              <h3 className="text-lg font-medium flex items-center">
                <Github className="h-5 w-5 mr-2 text-primary" />
                GitHub Integration ― Zero-Assumptions Guide
              </h3>
              <p className="mt-2">
                These steps walk you through the entire process, with visual cues, expected screens, and what to do if something looks different.
              </p>
            </div>

            {/* ----------  STEPS  ---------- */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Detailed Steps:</h3>

              {/* Step 1 */}
              <div className="rounded-md border p-4 space-y-2">
                <div className="flex items-center gap-2 font-medium">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full border">1</span>
                  Open Settings
                  {completedSteps['connect-github'] && (
                    <CheckCircle2 className="h-4 w-4 text-green-500 ml-1" />
                  )}
                </div>
                <p className="text-sm text-muted-foreground">
                  In the Factory AI web app, locate your <strong>profile avatar</strong> in the <strong>top-right corner</strong>. It looks like a small circle with your initials or picture.
                </p>
                <p className="text-sm text-muted-foreground italic">
                  Screenshot: "Top-right corner showing avatar → click avatar → dropdown opens".
                </p>
                <p className="text-sm text-muted-foreground">
                  Click <strong>Settings</strong> in the dropdown. You should now see a left sidebar that includes "Integrations".
                </p>
                <div className="text-xs text-muted-foreground">
                  If you don't see "Settings", you may be in full-screen editor mode. Press <kbd>Esc</kbd> once and try again.
                </div>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => toggleStepCompletion('connect-github')}
                >
                  {completedSteps['connect-github'] ? 'Mark Incomplete' : 'Mark Complete'}
                </Button>
              </div>

              {/* Step 2 */}
              <div className="rounded-md border p-4 space-y-2">
                <div className="flex items-center gap-2 font-medium">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full border">2</span>
                  Select "Integrations"
                  {completedSteps['open-integrations'] && (
                    <CheckCircle2 className="h-4 w-4 text-green-500 ml-1" />
                  )}
                </div>
                <p className="text-sm text-muted-foreground">
                  In the Settings sidebar, click <strong>Integrations</strong>. The main panel should list available services like GitHub, GitLab, etc.
                </p>
                <p className="text-sm text-muted-foreground italic">
                  Screenshot: "Integrations page with GitHub card and big <em>Connect</em> button".
                </p>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => toggleStepCompletion('open-integrations')}
                >
                  {completedSteps['open-integrations'] ? 'Mark Incomplete' : 'Mark Complete'}
                </Button>
              </div>

              {/* Step 3 */}
              <div className="rounded-md border p-4 space-y-2">
                <div className="flex items-center gap-2 font-medium">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full border">3</span>
                  Click "Connect" on the GitHub Card
                  {completedSteps['click-connect'] && (
                    <CheckCircle2 className="h-4 w-4 text-green-500 ml-1" />
                  )}
                </div>
                <p className="text-sm text-muted-foreground">
                  A new browser tab opens: <code>github.com/login/oauth/...</code>. You'll see the "Authorize Factory-AI" page.
                </p>
                <p className="text-sm text-muted-foreground italic">
                  Screenshot: "GitHub OAuth screen with green <em>Authorize</em> button".
                </p>
                <p className="text-sm text-muted-foreground">
                  Click the <strong>Authorize Factory-AI</strong> button.
                </p>
                <div className="text-xs text-muted-foreground">
                  If you manage multiple organizations, GitHub will ask "Where do you want to install?". Pick <em>Only select repositories</em> if you want to limit access.
                </div>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => toggleStepCompletion('click-connect')}
                >
                  {completedSteps['click-connect'] ? 'Mark Incomplete' : 'Mark Complete'}
                </Button>
              </div>

              {/* Step 4 */}
              <div className="rounded-md border p-4 space-y-2">
                <div className="flex items-center gap-2 font-medium">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full border">4</span>
                  Confirm Success
                  {completedSteps['confirm-success'] && (
                    <CheckCircle2 className="h-4 w-4 text-green-500 ml-1" />
                  )}
                </div>
                <p className="text-sm text-muted-foreground">
                  You'll be redirected back to Factory AI. The GitHub card now shows a green check mark and lists the repositories you granted.
                </p>
                <ul className="text-sm list-disc list-inside text-muted-foreground">
                  <li><strong>Before</strong>: Gray <em>Connect</em> button</li>
                  <li><strong>After</strong>: Green "Connected" badge + repo list</li>
                </ul>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => toggleStepCompletion('confirm-success')}
                >
                  {completedSteps['confirm-success'] ? 'Mark Incomplete' : 'Mark Complete'}
                </Button>
              </div>

              {/* Errors / Troubleshooting toggle */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => toggleTroubleshooting('github')}
                className="w-full"
              >
                {showTroubleshooting['github'] ? 'Hide' : 'Show'} Troubleshooting & Error Messages
              </Button>

              {showTroubleshooting['github'] && (
                <div className="rounded-md bg-muted p-4 space-y-3">
                  <h4 className="font-medium flex items-center">
                    <AlertCircle className="h-4 w-4 mr-2 text-amber-500" />
                    Common Issues & Fixes
                  </h4>
                  <div className="space-y-2 text-sm">
                    <p><strong>Error:</strong> "<em>Oops! Something went wrong</em>" on GitHub page.<br/>
                      <strong>Fix:</strong> Ensure you are logged into the correct GitHub account and try again.
                    </p>
                    <p><strong>Error:</strong> "<em>Forbidden</em>" after authorizing.<br/>
                      <strong>Fix:</strong> Your organization may require admin approval. Ask an org owner to approve the OAuth app.</p>
                    <p><strong>Looks Different?</strong> GitHub occasionally updates its UI. Look for a green button that says <em>Authorize</em> or <em>Install &amp; Authorize</em>.</p>
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-between">
              <Button 
                variant="outline"
                onClick={() => setActiveSection('bridge')}
              >
                Previous
              </Button>
              <Button 
                onClick={() => setActiveSection('workflows')}
                className="gap-1"
              >
                Next: Basic Workflows
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        );
        
      case 'workflows':
        return (
          <div className="space-y-6">
            <div className="rounded-lg bg-primary/10 p-4 border border-primary/20">
              <h3 className="text-lg font-medium flex items-center">
                <Workflow className="h-5 w-5 mr-2 text-primary" />
                Basic Workflows
              </h3>
              <p className="mt-2">
                Learn how to use Factory AI for common tasks, from creating files to building entire applications.
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Common Workflows:</h3>
              
              <div className="space-y-3">
                <div className="rounded-md border p-3">
                  <h4 className="font-medium flex items-center">
                    <MessageSquare className="h-4 w-4 mr-2 text-primary" />
                    Chatting with Factory AI
                  </h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    Simply type your request in natural language. For example: "Create a simple HTML page with a contact form" or "Help me debug this JavaScript code".
                  </p>
                </div>

                <div className="rounded-md border p-3">
                  <h4 className="font-medium flex items-center">
                    <FileCode className="h-4 w-4 mr-2 text-primary" />
                    Creating and Editing Files
                  </h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    Ask Factory AI to create new files or edit existing ones. You can say: "Create a CSS file for my navbar" or "Update my README file to include installation instructions".
                  </p>
                </div>

                <div className="rounded-md border p-3">
                  <h4 className="font-medium flex items-center">
                    <Terminal className="h-4 w-4 mr-2 text-primary" />
                    Running Commands
                  </h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    Factory AI can run commands on your machine. Try: "Install React in this project" or "Run the tests in this repository".
                  </p>
                </div>

                <div className="rounded-md border p-3">
                  <h4 className="font-medium flex items-center">
                    <Github className="h-4 w-4 mr-2 text-primary" />
                    Working with GitHub
                  </h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    Manage your repositories directly through Factory AI. Ask: "Create a pull request for these changes" or "Clone my repository and set it up".
                  </p>
                </div>
              </div>

              <div className="rounded-lg bg-muted p-4 mt-4">
                <h4 className="font-medium flex items-center">
                  <Lightbulb className="h-4 w-4 mr-2 text-amber-500" />
                  Pro Tip
                </h4>
                <p className="text-sm mt-1">
                  Be specific in your requests to get the best results. Instead of "Make a website", try "Create a simple portfolio website with an about page, projects section, and contact form using HTML and CSS".
                </p>
              </div>
            </div>

            <div className="flex justify-between">
              <Button 
                variant="outline"
                onClick={() => setActiveSection('github')}
              >
                Previous
              </Button>
              <Button 
                onClick={() => setActiveSection('usecases')}
                className="gap-1"
              >
                Next: Use Cases
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        );
        
      case 'usecases':
        return (
          <div className="space-y-6">
            <div className="rounded-lg bg-primary/10 p-4 border border-primary/20">
              <h3 className="text-lg font-medium flex items-center">
                <Lightbulb className="h-5 w-5 mr-2 text-primary" />
                Use Cases for Beginners
              </h3>
              <p className="mt-2">
                Practical examples of what you can build with Factory AI, even if you're not a programmer.
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium">What You Can Build:</h3>
              
              <div className="grid gap-3">
                <div className="rounded-md border p-4">
                  <h4 className="font-medium flex items-center">
                    <LayoutDashboard className="h-4 w-4 mr-2 text-primary" />
                    Personal Website or Portfolio
                  </h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    Create a professional website to showcase your work, skills, and experience.
                  </p>
                  <Button variant="outline" size="sm" className="mt-3">
                    Try This Example
                  </Button>
                </div>

                <div className="rounded-md border p-4">
                  <h4 className="font-medium flex items-center">
                    <Bot className="h-4 w-4 mr-2 text-primary" />
                    Simple Chatbot
                  </h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    Build a custom chatbot for your website or application without complex coding.
                  </p>
                  <Button variant="outline" size="sm" className="mt-3">
                    Try This Example
                  </Button>
                </div>

                <div className="rounded-md border p-4">
                  <h4 className="font-medium flex items-center">
                    <Braces className="h-4 w-4 mr-2 text-primary" />
                    Data Visualization Tool
                  </h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    Create interactive charts and graphs to visualize your data.
                  </p>
                  <Button variant="outline" size="sm" className="mt-3">
                    Try This Example
                  </Button>
                </div>

                <div className="rounded-md border p-4">
                  <h4 className="font-medium flex items-center">
                    <Rocket className="h-4 w-4 mr-2 text-primary" />
                    Mobile App Prototype
                  </h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    Design and build a functional prototype of your mobile app idea.
                  </p>
                  <Button variant="outline" size="sm" className="mt-3">
                    Try This Example
                  </Button>
                </div>
              </div>
            </div>

            <div className="flex justify-between">
              <Button 
                variant="outline"
                onClick={() => setActiveSection('workflows')}
              >
                Previous
              </Button>
              <Button 
                onClick={() => setActiveSection('help')}
                className="gap-1"
              >
                Next: Help & Resources
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        );
        
      case 'help':
        return (
          <div className="space-y-6">
            <div className="rounded-lg bg-primary/10 p-4 border border-primary/20">
              <h3 className="text-lg font-medium flex items-center">
                <HelpCircle className="h-5 w-5 mr-2 text-primary" />
                Help & Resources
              </h3>
              <p className="mt-2">
                Find additional help, documentation, and community resources to support your Factory AI journey.
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Resources:</h3>
              
              <div className="grid gap-3">
                <a href="https://docs.factory.ai" target="_blank" rel="noopener noreferrer" className="rounded-md border p-4 hover:bg-muted/50 transition-colors">
                  <h4 className="font-medium flex items-center">
                    <BookOpen className="h-4 w-4 mr-2 text-primary" />
                    Official Documentation
                  </h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    Comprehensive guides, tutorials, and reference materials
                  </p>
                </a>

                <a href="https://community.factory.ai" target="_blank" rel="noopener noreferrer" className="rounded-md border p-4 hover:bg-muted/50 transition-colors">
                  <h4 className="font-medium flex items-center">
                    <MessageSquare className="h-4 w-4 mr-2 text-primary" />
                    Community Forum
                  </h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    Connect with other users, ask questions, and share your projects
                  </p>
                </a>

                <a href="https://www.youtube.com/factoryai" target="_blank" rel="noopener noreferrer" className="rounded-md border p-4 hover:bg-muted/50 transition-colors">
                  <h4 className="font-medium flex items-center">
                    <Zap className="h-4 w-4 mr-2 text-primary" />
                    Video Tutorials
                  </h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    Step-by-step video guides for visual learners
                  </p>
                </a>

                <div className="rounded-md border p-4">
                  <h4 className="font-medium flex items-center">
                    <PanelLeft className="h-4 w-4 mr-2 text-primary" />
                    In-App Help
                  </h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    Click the "?" icon in the top right corner of Factory AI for contextual help
                  </p>
                </div>
              </div>

              <div className="rounded-lg bg-muted p-4 mt-4">
                <h4 className="font-medium flex items-center">
                  <Lightbulb className="h-4 w-4 mr-2 text-amber-500" />
                  Need More Help?
                </h4>
                <p className="text-sm mt-1">
                  You can always ask Factory AI directly! Just say "I need help with..." or "How do I..." and Factory AI will guide you through the process.
                </p>
              </div>
            </div>

            <div className="flex justify-between">
              <Button 
                variant="outline"
                onClick={() => setActiveSection('usecases')}
              >
                Previous
              </Button>
              <Button 
                onClick={() => setActiveSection('intro')}
                variant="outline"
                className="gap-1"
              >
                Back to Start
              </Button>
            </div>
          </div>
        );
        
      default:
        return (
          <div>
            <p>Select a tutorial section to begin</p>
          </div>
        );
    }
  };

  // Calculate progress percentage
  const calculateProgress = () => {
    const totalSteps = 9; // Total number of steps across all sections
    const completed = Object.values(completedSteps).filter(Boolean).length;
    return Math.round((completed / totalSteps) * 100);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Sparkles className="h-6 w-6 text-primary" />
            <h1 className="text-2xl font-bold">Factory AI Tutorial</h1>
          </div>
          <div className="text-sm text-muted-foreground">
            Progress: {calculateProgress()}%
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="md:col-span-1 space-y-4">
            <div className="rounded-lg bg-muted p-4">
              <h2 className="text-lg font-medium mb-3">Tutorial Sections</h2>
              <nav className="space-y-1">
                {tutorialSections.map((section) => (
                  <Button
                    key={section.id}
                    variant={activeSection === section.id ? "secondary" : "ghost"}
                    className={`w-full justify-start ${activeSection === section.id ? 'bg-secondary' : ''}`}
                    onClick={() => setActiveSection(section.id)}
                  >
                    <span className="flex items-center">
                      {section.icon}
                      <span className="ml-2">{section.title}</span>
                    </span>
                  </Button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="md:col-span-3">
            <Card className="w-full">
              <CardHeader>
                <CardTitle>{tutorialSections.find(s => s.id === activeSection)?.title}</CardTitle>
                <CardDescription>
                  {tutorialSections.find(s => s.id === activeSection)?.description}
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                {getTutorialContent()}
              </CardContent>
              
              <CardFooter className="flex justify-between border-t pt-4">
                <p className="text-sm text-muted-foreground">
                  Factory AI Tutorial - Designed for beginners
                </p>
                <Button variant="outline" size="sm">
                  <HelpCircle className="h-4 w-4 mr-2" />
                  Get Help
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;