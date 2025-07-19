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
  Sparkles,
  ExternalLink,
  Info
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from './components/ui/card';
import { Button } from './components/ui/button';
import './factory-colors.css'; // Import custom Factory AI colors

// Define tutorial section types
type TutorialSection = {
  id: string;
  title: string;
  icon: React.ReactNode;
  description: string;
};

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
            <div className="rounded-lg bg-amber-100 p-4 border border-amber-300 shadow-md mb-4">
              <h3 className="text-lg font-medium flex items-center text-amber-800">
                <Info className="h-5 w-5 mr-2" />
                Community-Created Resource
              </h3>
              <p className="mt-2 text-amber-700">
                This is an <strong>unofficial</strong> community guide to Factory AI. This resource is not affiliated with, endorsed by, or connected to Factory AI in any way. For official documentation, please visit <a href="https://docs.factory.ai" target="_blank" rel="noopener noreferrer" className="underline">docs.factory.ai</a>.
              </p>
            </div>
            
            <div className="rounded-lg bg-factory-purple/10 p-4 border border-factory-purple/20 shadow-md">
              <h3 className="text-lg font-medium flex items-center">
                <Sparkles className="h-5 w-5 mr-2 text-factory-orange" />
                Welcome to Our Community Guide
              </h3>
              <p className="mt-2">
                Factory AI is a platform that helps you build software faster using AI. This community guide aims to help creators and beginners understand how to use the platform effectively.
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium text-factory-purple">What You Can Do With Factory AI:</h3>
              
              <div className="grid gap-3">
                <div className="flex items-start gap-3 rounded-md border border-factory-purple/20 p-3 shadow-sm hover:shadow-md transition-shadow">
                  <Bot className="h-5 w-5 text-factory-orange mt-0.5" />
                  <div>
                    <h4 className="font-medium text-factory-purple">Chat with AI Assistants</h4>
                    <p className="text-sm text-muted-foreground">Get help with coding, design, and creative tasks through natural conversation</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 rounded-md border border-factory-purple/20 p-3 shadow-sm hover:shadow-md transition-shadow">
                  <Code className="h-5 w-5 text-factory-orange mt-0.5" />
                  <div>
                    <h4 className="font-medium text-factory-purple">Create and Edit Code</h4>
                    <p className="text-sm text-muted-foreground">Build applications, websites, and scripts even if you're not an expert coder</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 rounded-md border border-factory-purple/20 p-3 shadow-sm hover:shadow-md transition-shadow">
                  <Terminal className="h-5 w-5 text-factory-orange mt-0.5" />
                  <div>
                    <h4 className="font-medium text-factory-purple">Run Commands on Your Machine</h4>
                    <p className="text-sm text-muted-foreground">Execute terminal commands and see results without leaving the interface</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 rounded-md border border-factory-purple/20 p-3 shadow-sm hover:shadow-md transition-shadow">
                  <Github className="h-5 w-5 text-factory-orange mt-0.5" />
                  <div>
                    <h4 className="font-medium text-factory-purple">Integrate with GitHub</h4>
                    <p className="text-sm text-muted-foreground">Work with your repositories, create pull requests, and manage code</p>
                  </div>
                </div>
              </div>
              
              <div className="rounded-lg bg-blue-50 p-4 border border-blue-200 mt-4">
                <p className="text-sm text-blue-700 flex items-start">
                  <Info className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                  <span>This guide reflects our community's experience with Factory AI. Features and interfaces may change. Always refer to the <a href="https://docs.factory.ai" target="_blank" rel="noopener noreferrer" className="underline font-medium">official documentation</a> for the most up-to-date information.</span>
                </p>
              </div>
            </div>

            <div className="flex justify-between">
              <Button 
                variant="outline"
                disabled={true}
                className="border-factory-purple/30 text-factory-purple"
              >
                Previous
              </Button>
              <Button 
                onClick={() => setActiveSection('bridge')}
                className="gap-1 bg-gradient-to-r from-factory-purple to-factory-orange text-white hover:opacity-90"
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
            <div className="rounded-lg bg-factory-purple/10 p-4 border border-factory-purple/20 shadow-md">
              <h3 className="text-lg font-medium flex items-center">
                <Cpu className="h-5 w-5 mr-2 text-factory-orange" />
                Connecting Bridge
              </h3>
              <p className="mt-2">
                Bridge allows Factory AI to interact with your local machine. Based on our community experience, here's how to set it up.
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium text-factory-purple">Community Guide to Bridge Setup:</h3>
              
              <div className="space-y-3">
                <div className="flex items-start gap-3 rounded-md border border-factory-purple/20 p-3 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-factory-purple bg-factory-purple/10 text-factory-purple font-medium">
                    1
                  </div>
                  <div className="space-y-1">
                    <div className="font-medium text-factory-purple">Download Bridge</div>
                    <p className="text-sm text-muted-foreground">
                      Click on the CPU icon in the top right corner of the Factory AI interface
                    </p>
                    <div className="mt-2">
                      <Button
                        variant="secondary"
                        size="sm"
                        className="gap-1 bg-factory-purple/10 hover:bg-factory-purple/20 border-factory-purple/20"
                        onClick={() => toggleStepCompletion('download-bridge')}
                      >
                        {completedSteps['download-bridge'] ? (
                          <CheckCircle2 className="h-4 w-4 text-factory-orange" />
                        ) : (
                          <CheckCircle2 className="h-4 w-4 text-factory-purple/50" />
                        )}
                        Mark as {completedSteps['download-bridge'] ? 'incomplete' : 'complete'}
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3 rounded-md border border-factory-purple/20 p-3 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-factory-purple bg-factory-purple/10 text-factory-purple font-medium">
                    2
                  </div>
                  <div className="space-y-1">
                    <div className="font-medium text-factory-purple">Install Bridge</div>
                    <p className="text-sm text-muted-foreground">
                      Run the downloaded installer and follow the prompts to complete installation
                    </p>
                    <div className="mt-2">
                      <Button
                        variant="secondary"
                        size="sm"
                        className="gap-1 bg-factory-purple/10 hover:bg-factory-purple/20 border-factory-purple/20"
                        onClick={() => toggleStepCompletion('install-bridge')}
                      >
                        {completedSteps['install-bridge'] ? (
                          <CheckCircle2 className="h-4 w-4 text-factory-orange" />
                        ) : (
                          <CheckCircle2 className="h-4 w-4 text-factory-purple/50" />
                        )}
                        Mark as {completedSteps['install-bridge'] ? 'incomplete' : 'complete'}
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3 rounded-md border border-factory-purple/20 p-3 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-factory-purple bg-factory-purple/10 text-factory-purple font-medium">
                    3
                  </div>
                  <div className="space-y-1">
                    <div className="font-medium text-factory-purple">Connect to Factory AI</div>
                    <p className="text-sm text-muted-foreground">
                      Once installed, Bridge should automatically connect to Factory AI. The CPU icon will turn green when connected.
                    </p>
                    <div className="mt-2">
                      <Button
                        variant="secondary"
                        size="sm"
                        className="gap-1 bg-factory-purple/10 hover:bg-factory-purple/20 border-factory-purple/20"
                        onClick={() => toggleStepCompletion('connect-bridge')}
                      >
                        {completedSteps['connect-bridge'] ? (
                          <CheckCircle2 className="h-4 w-4 text-factory-orange" />
                        ) : (
                          <CheckCircle2 className="h-4 w-4 text-factory-purple/50" />
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
                className="mt-4 w-full border-factory-purple/30 text-factory-purple hover:bg-factory-purple/10"
              >
                {showTroubleshooting['bridge'] ? 'Hide' : 'Show'} Community Troubleshooting Tips
              </Button>

              {showTroubleshooting['bridge'] && (
                <div className="rounded-md bg-factory-purple/5 p-4 space-y-3 border border-factory-purple/20 shadow-inner">
                  <h4 className="font-medium flex items-center text-factory-purple">
                    <AlertCircle className="h-4 w-4 mr-2 text-factory-orange" />
                    Common Issues (Community Solutions)
                  </h4>
                  
                  <div className="space-y-2">
                    <p className="text-sm"><strong className="text-factory-purple">Bridge won't install:</strong> Make sure you have admin privileges on your computer.</p>
                    <p className="text-sm"><strong className="text-factory-purple">Bridge won't connect:</strong> Try restarting both Bridge and your browser.</p>
                    <p className="text-sm"><strong className="text-factory-purple">Connection drops:</strong> Check your internet connection and firewall settings.</p>
                  </div>
                  
                  <p className="text-xs text-muted-foreground italic">
                    These tips are based on community experience and may not cover all scenarios. For official support, please contact Factory AI directly.
                  </p>
                </div>
              )}
            </div>

            <div className="flex justify-between">
              <Button 
                variant="outline"
                onClick={() => setActiveSection('intro')}
                className="border-factory-purple/30 text-factory-purple"
              >
                Previous
              </Button>
              <Button 
                onClick={() => setActiveSection('github')}
                className="gap-1 bg-gradient-to-r from-factory-purple to-factory-orange text-white hover:opacity-90"
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
            <div className="rounded-lg bg-factory-purple/10 p-4 border border-factory-purple/20 shadow-md">
              <h3 className="text-lg font-medium flex items-center">
                <Github className="h-5 w-5 mr-2 text-factory-orange" />
                GitHub Integration — Community Guide
              </h3>
              <p className="mt-2">
                Based on our community experience, here are detailed steps for connecting GitHub to Factory AI, with visual cues and troubleshooting tips.
              </p>
            </div>

            {/* ----------  STEPS  ---------- */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-factory-purple">Detailed Steps from Community Experience:</h3>

              {/* Step 1 */}
              <div className="rounded-md border border-factory-purple/20 p-4 space-y-2 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-2 font-medium">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full border border-factory-purple bg-factory-purple/10 text-factory-purple font-medium">1</span>
                  <span className="text-factory-purple">Open Settings</span>
                  {completedSteps['connect-github'] && (
                    <CheckCircle2 className="h-4 w-4 text-factory-orange ml-1" />
                  )}
                </div>
                <p className="text-sm text-muted-foreground">
                  In the Factory AI web app, locate your <strong className="text-factory-purple">profile avatar</strong> in the <strong className="text-factory-purple">top-right corner</strong>. It looks like a small circle with your initials or picture.
                </p>
                <p className="text-sm text-muted-foreground italic">
                  Screenshot: "Top-right corner showing avatar → click avatar → dropdown opens".
                </p>
                <p className="text-sm text-muted-foreground">
                  Click <strong className="text-factory-purple">Settings</strong> in the dropdown. You should now see a left sidebar that includes "Integrations".
                </p>
                <div className="text-xs text-muted-foreground">
                  If you don't see "Settings", you may be in full-screen editor mode. Press <kbd className="px-1 py-0.5 bg-factory-purple/10 border border-factory-purple/20 rounded text-factory-purple">Esc</kbd> once and try again.
                </div>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => toggleStepCompletion('connect-github')}
                  className="bg-factory-purple/10 hover:bg-factory-purple/20 border-factory-purple/20 text-factory-purple"
                >
                  {completedSteps['connect-github'] ? 'Mark Incomplete' : 'Mark Complete'}
                </Button>
              </div>

              {/* Step 2 */}
              <div className="rounded-md border border-factory-purple/20 p-4 space-y-2 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-2 font-medium">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full border border-factory-purple bg-factory-purple/10 text-factory-purple font-medium">2</span>
                  <span className="text-factory-purple">Select "Integrations"</span>
                  {completedSteps['open-integrations'] && (
                    <CheckCircle2 className="h-4 w-4 text-factory-orange ml-1" />
                  )}
                </div>
                <p className="text-sm text-muted-foreground">
                  In the Settings sidebar, click <strong className="text-factory-purple">Integrations</strong>. The main panel should list available services like GitHub, GitLab, etc.
                </p>
                <p className="text-sm text-muted-foreground italic">
                  Screenshot: "Integrations page with GitHub card and big <em>Connect</em> button".
                </p>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => toggleStepCompletion('open-integrations')}
                  className="bg-factory-purple/10 hover:bg-factory-purple/20 border-factory-purple/20 text-factory-purple"
                >
                  {completedSteps['open-integrations'] ? 'Mark Incomplete' : 'Mark Complete'}
                </Button>
              </div>

              {/* Step 3 */}
              <div className="rounded-md border border-factory-purple/20 p-4 space-y-2 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-2 font-medium">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full border border-factory-purple bg-factory-purple/10 text-factory-purple font-medium">3</span>
                  <span className="text-factory-purple">Click "Connect" on the GitHub Card</span>
                  {completedSteps['click-connect'] && (
                    <CheckCircle2 className="h-4 w-4 text-factory-orange ml-1" />
                  )}
                </div>
                <p className="text-sm text-muted-foreground">
                  A new browser tab opens: <code className="px-1 py-0.5 bg-factory-purple/10 border border-factory-purple/20 rounded text-factory-purple">github.com/login/oauth/...</code>. You'll see the "Authorize Factory-AI" page.
                </p>
                <p className="text-sm text-muted-foreground italic">
                  Screenshot: "GitHub OAuth screen with green <em>Authorize</em> button".
                </p>
                <p className="text-sm text-muted-foreground">
                  Click the <strong className="text-factory-purple">Authorize Factory-AI</strong> button.
                </p>
                <div className="text-xs text-muted-foreground">
                  If you manage multiple organizations, GitHub will ask "Where do you want to install?". Pick <em>Only select repositories</em> if you want to limit access.
                </div>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => toggleStepCompletion('click-connect')}
                  className="bg-factory-purple/10 hover:bg-factory-purple/20 border-factory-purple/20 text-factory-purple"
                >
                  {completedSteps['click-connect'] ? 'Mark Incomplete' : 'Mark Complete'}
                </Button>
              </div>

              {/* Step 4 */}
              <div className="rounded-md border border-factory-purple/20 p-4 space-y-2 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-2 font-medium">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full border border-factory-purple bg-factory-purple/10 text-factory-purple font-medium">4</span>
                  <span className="text-factory-purple">Confirm Success</span>
                  {completedSteps['confirm-success'] && (
                    <CheckCircle2 className="h-4 w-4 text-factory-orange ml-1" />
                  )}
                </div>
                <p className="text-sm text-muted-foreground">
                  You'll be redirected back to Factory AI. The GitHub card now shows a green check mark and lists the repositories you granted.
                </p>
                <ul className="text-sm list-disc list-inside text-muted-foreground">
                  <li><strong className="text-factory-purple">Before</strong>: Gray <em>Connect</em> button</li>
                  <li><strong className="text-factory-purple">After</strong>: Green "Connected" badge + repo list</li>
                </ul>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => toggleStepCompletion('confirm-success')}
                  className="bg-factory-purple/10 hover:bg-factory-purple/20 border-factory-purple/20 text-factory-purple"
                >
                  {completedSteps['confirm-success'] ? 'Mark Incomplete' : 'Mark Complete'}
                </Button>
              </div>

              {/* Errors / Troubleshooting toggle */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => toggleTroubleshooting('github')}
                className="w-full border-factory-purple/30 text-factory-purple hover:bg-factory-purple/10"
              >
                {showTroubleshooting['github'] ? 'Hide' : 'Show'} Community Troubleshooting Tips
              </Button>

              {showTroubleshooting['github'] && (
                <div className="rounded-md bg-factory-purple/5 p-4 space-y-3 border border-factory-purple/20 shadow-inner">
                  <h4 className="font-medium flex items-center text-factory-purple">
                    <AlertCircle className="h-4 w-4 mr-2 text-factory-orange" />
                    Common Issues & Community Solutions
                  </h4>
                  <div className="space-y-2 text-sm">
                    <p><strong className="text-factory-purple">Error:</strong> "<em>Oops! Something went wrong</em>" on GitHub page.<br/>
                      <strong className="text-factory-purple">Fix:</strong> Ensure you are logged into the correct GitHub account and try again.
                    </p>
                    <p><strong className="text-factory-purple">Error:</strong> "<em>Forbidden</em>" after authorizing.<br/>
                      <strong className="text-factory-purple">Fix:</strong> Your organization may require admin approval. Ask an org owner to approve the OAuth app.</p>
                    <p><strong className="text-factory-purple">Looks Different?</strong> GitHub occasionally updates its UI. Look for a green button that says <em>Authorize</em> or <em>Install &amp; Authorize</em>.</p>
                  </div>
                  
                  <p className="text-xs text-muted-foreground italic">
                    These tips are based on community experience and may not cover all scenarios. For official support, please contact Factory AI directly.
                  </p>
                </div>
              )}
              
              <div className="rounded-lg bg-blue-50 p-4 border border-blue-200 mt-4">
                <p className="text-sm text-blue-700 flex items-start">
                  <ExternalLink className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                  <span>For official GitHub integration documentation, please refer to the <a href="https://docs.factory.ai/integrations/github" target="_blank" rel="noopener noreferrer" className="underline font-medium">Factory AI documentation</a>.</span>
                </p>
              </div>
            </div>

            <div className="flex justify-between">
              <Button 
                variant="outline"
                onClick={() => setActiveSection('bridge')}
                className="border-factory-purple/30 text-factory-purple"
              >
                Previous
              </Button>
              <Button 
                onClick={() => setActiveSection('workflows')}
                className="gap-1 bg-gradient-to-r from-factory-purple to-factory-orange text-white hover:opacity-90"
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
            <div className="rounded-lg bg-factory-purple/10 p-4 border border-factory-purple/20 shadow-md">
              <h3 className="text-lg font-medium flex items-center">
                <Workflow className="h-5 w-5 mr-2 text-factory-orange" />
                Basic Workflows — Community Tips
              </h3>
              <p className="mt-2">
                Our community has gathered these common workflows that can help you get started with Factory AI.
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium text-factory-purple">Common Community Workflows:</h3>
              
              <div className="space-y-3">
                <div className="rounded-md border border-factory-purple/20 p-3 shadow-sm hover:shadow-md transition-shadow">
                  <h4 className="font-medium flex items-center text-factory-purple">
                    <MessageSquare className="h-4 w-4 mr-2 text-factory-orange" />
                    Chatting with Factory AI
                  </h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    Simply type your request in natural language. For example: "Create a simple HTML page with a contact form" or "Help me debug this JavaScript code".
                  </p>
                </div>

                <div className="rounded-md border border-factory-purple/20 p-3 shadow-sm hover:shadow-md transition-shadow">
                  <h4 className="font-medium flex items-center text-factory-purple">
                    <FileCode className="h-4 w-4 mr-2 text-factory-orange" />
                    Creating and Editing Files
                  </h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    Ask Factory AI to create new files or edit existing ones. You can say: "Create a CSS file for my navbar" or "Update my README file to include installation instructions".
                  </p>
                </div>

                <div className="rounded-md border border-factory-purple/20 p-3 shadow-sm hover:shadow-md transition-shadow">
                  <h4 className="font-medium flex items-center text-factory-purple">
                    <Terminal className="h-4 w-4 mr-2 text-factory-orange" />
                    Running Commands
                  </h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    Factory AI can run commands on your machine. Try: "Install React in this project" or "Run the tests in this repository".
                  </p>
                </div>

                <div className="rounded-md border border-factory-purple/20 p-3 shadow-sm hover:shadow-md transition-shadow">
                  <h4 className="font-medium flex items-center text-factory-purple">
                    <Github className="h-4 w-4 mr-2 text-factory-orange" />
                    Working with GitHub
                  </h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    Manage your repositories directly through Factory AI. Ask: "Create a pull request for these changes" or "Clone my repository and set it up".
                  </p>
                </div>
              </div>

              <div className="rounded-lg bg-factory-purple/5 p-4 mt-4 border border-factory-purple/20 shadow-inner">
                <h4 className="font-medium flex items-center text-factory-purple">
                  <Lightbulb className="h-4 w-4 mr-2 text-factory-orange" />
                  Community Tip
                </h4>
                <p className="text-sm mt-1">
                  Be specific in your requests to get the best results. Instead of "Make a website", try "Create a simple portfolio website with an about page, projects section, and contact form using HTML and CSS".
                </p>
              </div>
              
              <div className="rounded-lg bg-amber-100 p-4 border border-amber-300 mt-4">
                <p className="text-sm text-amber-800 flex items-start">
                  <Info className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                  <span>These workflows are based on community experience and may not reflect the most current features. For the latest capabilities, please refer to the <a href="https://docs.factory.ai" target="_blank" rel="noopener noreferrer" className="underline font-medium">official Factory AI documentation</a>.</span>
                </p>
              </div>
            </div>

            <div className="flex justify-between">
              <Button 
                variant="outline"
                onClick={() => setActiveSection('github')}
                className="border-factory-purple/30 text-factory-purple"
              >
                Previous
              </Button>
              <Button 
                onClick={() => setActiveSection('usecases')}
                className="gap-1 bg-gradient-to-r from-factory-purple to-factory-orange text-white hover:opacity-90"
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
            <div className="rounded-lg bg-factory-purple/10 p-4 border border-factory-purple/20 shadow-md">
              <h3 className="text-lg font-medium flex items-center">
                <Lightbulb className="h-5 w-5 mr-2 text-factory-orange" />
                Community Use Cases for Beginners
              </h3>
              <p className="mt-2">
                Here are some practical examples our community has found useful when working with Factory AI, especially for beginners.
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium text-factory-purple">What Community Members Have Built:</h3>
              
              <div className="grid gap-3">
                <div className="rounded-md border border-factory-purple/20 p-4 shadow-sm hover:shadow-md transition-shadow">
                  <h4 className="font-medium flex items-center text-factory-purple">
                    <LayoutDashboard className="h-4 w-4 mr-2 text-factory-orange" />
                    Personal Website or Portfolio
                  </h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    Create a professional website to showcase your work, skills, and experience.
                  </p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="mt-3 border-factory-purple/30 text-factory-purple hover:bg-factory-purple/10"
                  >
                    Try This Example
                  </Button>
                </div>

                <div className="rounded-md border border-factory-purple/20 p-4 shadow-sm hover:shadow-md transition-shadow">
                  <h4 className="font-medium flex items-center text-factory-purple">
                    <Bot className="h-4 w-4 mr-2 text-factory-orange" />
                    Simple Chatbot
                  </h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    Build a custom chatbot for your website or application without complex coding.
                  </p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="mt-3 border-factory-purple/30 text-factory-purple hover:bg-factory-purple/10"
                  >
                    Try This Example
                  </Button>
                </div>

                <div className="rounded-md border border-factory-purple/20 p-4 shadow-sm hover:shadow-md transition-shadow">
                  <h4 className="font-medium flex items-center text-factory-purple">
                    <Braces className="h-4 w-4 mr-2 text-factory-orange" />
                    Data Visualization Tool
                  </h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    Create interactive charts and graphs to visualize your data.
                  </p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="mt-3 border-factory-purple/30 text-factory-purple hover:bg-factory-purple/10"
                  >
                    Try This Example
                  </Button>
                </div>

                <div className="rounded-md border border-factory-purple/20 p-4 shadow-sm hover:shadow-md transition-shadow">
                  <h4 className="font-medium flex items-center text-factory-purple">
                    <Rocket className="h-4 w-4 mr-2 text-factory-orange" />
                    Mobile App Prototype
                  </h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    Design and build a functional prototype of your mobile app idea.
                  </p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="mt-3 border-factory-purple/30 text-factory-purple hover:bg-factory-purple/10"
                  >
                    Try This Example
                  </Button>
                </div>
              </div>
              
              <div className="rounded-lg bg-amber-100 p-4 border border-amber-300 mt-4">
                <p className="text-sm text-amber-800 flex items-start">
                  <Info className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                  <span>These examples are based on community projects and may not represent official Factory AI use cases. For verified examples, check the <a href="https://docs.factory.ai/examples" target="_blank" rel="noopener noreferrer" className="underline font-medium">official examples</a> in the Factory AI documentation.</span>
                </p>
              </div>
            </div>

            <div className="flex justify-between">
              <Button 
                variant="outline"
                onClick={() => setActiveSection('workflows')}
                className="border-factory-purple/30 text-factory-purple"
              >
                Previous
              </Button>
              <Button 
                onClick={() => setActiveSection('help')}
                className="gap-1 bg-gradient-to-r from-factory-purple to-factory-orange text-white hover:opacity-90"
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
            <div className="rounded-lg bg-factory-purple/10 p-4 border border-factory-purple/20 shadow-md">
              <h3 className="text-lg font-medium flex items-center">
                <HelpCircle className="h-5 w-5 mr-2 text-factory-orange" />
                Help & Official Resources
              </h3>
              <p className="mt-2">
                Here are links to official Factory AI resources and documentation that our community has found helpful.
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium text-factory-purple">Official Resources:</h3>
              
              <div className="grid gap-3">
                <a href="https://docs.factory.ai" target="_blank" rel="noopener noreferrer" className="rounded-md border border-factory-purple/20 p-4 hover:bg-factory-purple/5 transition-colors shadow-sm hover:shadow-md">
                  <h4 className="font-medium flex items-center text-factory-purple">
                    <BookOpen className="h-4 w-4 mr-2 text-factory-orange" />
                    Official Documentation
                  </h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    Comprehensive guides, tutorials, and reference materials from Factory AI
                  </p>
                </a>

                <a href="https://community.factory.ai" target="_blank" rel="noopener noreferrer" className="rounded-md border border-factory-purple/20 p-4 hover:bg-factory-purple/5 transition-colors shadow-sm hover:shadow-md">
                  <h4 className="font-medium flex items-center text-factory-purple">
                    <MessageSquare className="h-4 w-4 mr-2 text-factory-orange" />
                    Official Community Forum
                  </h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    Connect with other users, ask questions, and share your projects
                  </p>
                </a>

                <a href="https://www.youtube.com/factoryai" target="_blank" rel="noopener noreferrer" className="rounded-md border border-factory-purple/20 p-4 hover:bg-factory-purple/5 transition-colors shadow-sm hover:shadow-md">
                  <h4 className="font-medium flex items-center text-factory-purple">
                    <Zap className="h-4 w-4 mr-2 text-factory-orange" />
                    Official Video Tutorials
                  </h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    Step-by-step video guides for visual learners from Factory AI
                  </p>
                </a>

                <div className="rounded-md border border-factory-purple/20 p-4 shadow-sm hover:shadow-md transition-shadow">
                  <h4 className="font-medium flex items-center text-factory-purple">
                    <PanelLeft className="h-4 w-4 mr-2 text-factory-orange" />
                    In-App Help
                  </h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    Click the "?" icon in the top right corner of Factory AI for contextual help
                  </p>
                </div>
              </div>

              <div className="rounded-lg bg-factory-purple/5 p-4 mt-4 border border-factory-purple/20 shadow-inner">
                <h4 className="font-medium flex items-center text-factory-purple">
                  <Lightbulb className="h-4 w-4 mr-2 text-factory-orange" />
                  Community Tip
                </h4>
                <p className="text-sm mt-1">
                  You can always ask Factory AI directly! Just say "I need help with..." or "How do I..." and Factory AI will guide you through the process.
                </p>
              </div>
              
              <div className="rounded-lg bg-amber-100 p-4 border border-amber-300 mt-4">
                <p className="text-sm text-amber-800 flex items-start">
                  <Info className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                  <span>This guide is community-created and not an official Factory AI resource. Always refer to the <a href="https://docs.factory.ai" target="_blank" rel="noopener noreferrer" className="underline font-medium">official Factory AI documentation</a> for the most accurate and up-to-date information.</span>
                </p>
              </div>
            </div>

            <div className="flex justify-between">
              <Button 
                variant="outline"
                onClick={() => setActiveSection('usecases')}
                className="border-factory-purple/30 text-factory-purple"
              >
                Previous
              </Button>
              <Button 
                onClick={() => setActiveSection('intro')}
                variant="outline"
                className="gap-1 border-factory-purple/30 text-factory-purple"
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
    <div className="min-h-screen bg-gradient-to-br from-white to-factory-purple/5">
      {/* Header */}
      <header className="border-b bg-gradient-to-r from-factory-purple to-factory-orange shadow-md">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Sparkles className="h-6 w-6 text-white" />
            <h1 className="text-2xl font-bold text-white">Unofficial Factory AI Guide</h1>
          </div>
          <div className="text-sm text-white/90 bg-white/20 px-3 py-1 rounded-full">
            Progress: {calculateProgress()}%
          </div>
        </div>
      </header>
      
      {/* Disclaimer Banner */}
      <div className="bg-amber-100 border-b border-amber-300">
        <div className="container mx-auto px-4 py-2">
          <p className="text-amber-800 text-sm flex items-center justify-center">
            <Info className="h-4 w-4 mr-2" />
            This is a community-created guide and is NOT affiliated with or endorsed by Factory AI.
            <a href="https://docs.factory.ai" target="_blank" rel="noopener noreferrer" className="underline ml-1 font-medium">
              Visit official documentation
            </a>
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="md:col-span-1 space-y-4">
            <div className="rounded-lg bg-white p-4 shadow-md border border-factory-purple/10">
              <h2 className="text-lg font-medium mb-3 text-factory-purple">Guide Sections</h2>
              <nav className="space-y-1">
                {tutorialSections.map((section) => (
                  <Button
                    key={section.id}
                    variant={activeSection === section.id ? "secondary" : "ghost"}
                    className={`w-full justify-start ${
                      activeSection === section.id 
                        ? 'bg-gradient-to-r from-factory-purple/20 to-factory-orange/20 text-factory-purple border border-factory-purple/20' 
                        : 'hover:bg-factory-purple/10 text-gray-700'
                    }`}
                    onClick={() => setActiveSection(section.id)}
                  >
                    <span className="flex items-center">
                      <span className={activeSection === section.id ? 'text-factory-orange' : 'text-factory-purple/70'}>
                        {section.icon}
                      </span>
                      <span className="ml-2">{section.title}</span>
                    </span>
                  </Button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="md:col-span-3">
            <Card className="w-full border-factory-purple/10 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-factory-purple/10 to-factory-orange/10 border-b border-factory-purple/10">
                <CardTitle className="text-factory-purple">{tutorialSections.find(s => s.id === activeSection)?.title}</CardTitle>
                <CardDescription>
                  {tutorialSections.find(s => s.id === activeSection)?.description}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="pt-6">
                {getTutorialContent()}
              </CardContent>
              
              <CardFooter className="flex flex-col space-y-3 border-t border-factory-purple/10 pt-4 bg-gradient-to-r from-factory-purple/5 to-factory-orange/5">
                <div className="flex justify-between w-full">
                  <p className="text-sm text-factory-purple/70">
                    Community Guide to Factory AI - Created by users, for users
                  </p>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="border-factory-purple/30 text-factory-purple hover:bg-factory-purple/10"
                  >
                    <HelpCircle className="h-4 w-4 mr-2 text-factory-orange" />
                    Get Help
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Disclaimer: This guide is not affiliated with, endorsed by, or officially connected to Factory AI. 
                  For official documentation and support, please visit <a href="https://docs.factory.ai" className="underline hover:text-factory-purple" target="_blank" rel="noopener noreferrer">docs.factory.ai</a>
                </p>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;