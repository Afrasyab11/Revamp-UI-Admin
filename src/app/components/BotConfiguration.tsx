import { ChevronLeft, Upload, Save, Sparkles, MessageSquare, Palette, Check, Database, FileText, Globe, RefreshCw, Trash2, ChevronLeft as ChevronLeftIcon, ChevronRight, Bot, X, ThumbsUp, ThumbsDown, Minimize2, ChevronDown, Mic, MicOff, Info } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Textarea } from '@/app/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs';
import { Switch } from '@/app/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select';
import { Badge } from '@/app/components/ui/badge';
import { Separator } from '@/app/components/ui/separator';
import { Checkbox } from '@/app/components/ui/checkbox';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/app/components/ui/table';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/app/components/ui/alert-dialog';
import { toast } from 'sonner';

interface BotConfigurationProps {
  botId: string;
  onBack: () => void;
}

interface UploadedDocument {
  id: string;
  name: string;
  uploadDate: string;
  size: number;
  status: 'completed' | 'processing' | 'failed';
}

interface AddedUrl {
  id: string;
  url: string;
  scope: string;
  addedDate: string;
  status: 'completed' | 'processing' | 'failed';
}

export default function BotConfiguration({ botId, onBack }: BotConfigurationProps) {
  const [botName, setBotName] = useState('CodingBot 01');
  const [welcomeMessage, setWelcomeMessage] = useState('');
  const [idleTimeout, setIdleTimeout] = useState('30');
  const [voiceSearchEnabled, setVoiceSearchEnabled] = useState(true);
  const [feedbackEnabled, setFeedbackEnabled] = useState(false);
  const [streamChatEnabled, setStreamChatEnabled] = useState(false);
  const [suggestionsEnabled, setSuggestionsEnabled] = useState(false);
  const [supportedLanguages, setSupportedLanguages] = useState<string[]>(['en']);
  const [systemPrompt, setSystemPrompt] = useState('');
  const [personaStyle, setPersonaStyle] = useState('professional');
  const [conversationMemory, setConversationMemory] = useState(true);
  const [fallbackMessage, setFallbackMessage] = useState("I'm sorry, I don't understand...");
  const [primaryColor, setPrimaryColor] = useState('#3B82F6');
  const [secondaryColor, setSecondaryColor] = useState('#10B981');
  const [botPosition, setBotPosition] = useState('bottom-right');
  const [welcomePopupText, setWelcomePopupText] = useState('Hi there! How can I assist you today?');
  const [isSaving, setIsSaving] = useState(false);

  // Knowledge Base states
  const [uploadedDocuments, setUploadedDocuments] = useState<UploadedDocument[]>([
    { id: '1', name: 'Product_Guide.pdf', uploadDate: '2025-01-28 10:30 AM', size: 2048000, status: 'completed' },
    { id: '2', name: 'FAQ_Document.docx', uploadDate: '2025-01-28 11:15 AM', size: 512000, status: 'completed' },
    { id: '3', name: 'Technical_Specs.txt', uploadDate: '2025-01-28 12:00 PM', size: 256000, status: 'processing' },
  ]);
  const [addedUrls, setAddedUrls] = useState<AddedUrl[]>([
    { id: '1', url: 'https://example.com/docs', scope: 'entire-site', addedDate: '2025-01-28 10:00 AM', status: 'completed' },
    { id: '2', url: 'https://help.example.com', scope: 'second-level-pages', addedDate: '2025-01-28 11:30 AM', status: 'completed' },
  ]);
  const [urlInput, setUrlInput] = useState('');
  const [urlScope, setUrlScope] = useState('entire-site');
  const [autoIndexEnabled, setAutoIndexEnabled] = useState(false);
  const [chunkSize, setChunkSize] = useState('512');
  const [chunkOverlap, setChunkOverlap] = useState('50');
  const [isReindexing, setIsReindexing] = useState(false);
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);

  // Live Preview states
  const [isChatOpen, setIsChatOpen] = useState(true);
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [writtenFeedback, setWrittenFeedback] = useState('');

  // Delete confirmation dialog state
  const [deleteConfirmation, setDeleteConfirmation] = useState<{
    isOpen: boolean;
    itemType: 'document' | 'url' | null;
    itemId: string;
    itemName: string;
  }>({
    isOpen: false,
    itemType: null,
    itemId: '',
    itemName: '',
  });

  const languageOptions = [
    { value: 'en', label: 'English' },
    { value: 'ar', label: 'Arabic' }
  ];

  const toggleLanguage = (lang: string) => {
    if (supportedLanguages.includes(lang)) {
      setSupportedLanguages(supportedLanguages.filter(l => l !== lang));
    } else {
      setSupportedLanguages([...supportedLanguages, lang]);
    }
  };

  const getLanguageDisplay = () => {
    if (supportedLanguages.length === 0) return 'Select languages';
    return supportedLanguages
      .map(lang => languageOptions.find(opt => opt.value === lang)?.label)
      .join(', ');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files).map((file, index) => ({
        id: `${Date.now()}-${index}`,
        name: file.name,
        uploadDate: new Date().toLocaleString('en-US', { 
          year: 'numeric', 
          month: '2-digit', 
          day: '2-digit', 
          hour: '2-digit', 
          minute: '2-digit',
          hour12: true 
        }),
        size: file.size,
        status: 'processing' as const,
      }));
      setUploadedDocuments([...uploadedDocuments, ...newFiles]);
      toast.success(`${newFiles.length} file(s) uploaded successfully!`);
    }
  };

  const handleDeleteDocument = (id: string) => {
    const doc = uploadedDocuments.find(d => d.id === id);
    if (doc) {
      setDeleteConfirmation({
        isOpen: true,
        itemType: 'document',
        itemId: id,
        itemName: doc.name,
      });
    }
  };

  const handleAddUrl = () => {
    if (!urlInput.trim()) {
      toast.error('Please enter a valid URL');
      return;
    }
    const newUrl: AddedUrl = {
      id: String(Date.now()),
      url: urlInput,
      scope: urlScope,
      addedDate: new Date().toLocaleString('en-US', { 
        year: 'numeric', 
        month: '2-digit', 
        day: '2-digit', 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
      }),
      status: 'completed',
    };
    setAddedUrls([...addedUrls, newUrl]);
    setUrlInput('');
    toast.success('URL added successfully!');
  };

  const handleDeleteUrl = (id: string) => {
    const url = addedUrls.find(u => u.id === id);
    if (url) {
      setDeleteConfirmation({
        isOpen: true,
        itemType: 'url',
        itemId: id,
        itemName: url.url,
      });
    }
  };

  const confirmDelete = () => {
    if (deleteConfirmation.itemType === 'document') {
      setUploadedDocuments(uploadedDocuments.filter(doc => doc.id !== deleteConfirmation.itemId));
      toast.success('Document deleted successfully!');
    } else if (deleteConfirmation.itemType === 'url') {
      setAddedUrls(addedUrls.filter(url => url.id !== deleteConfirmation.itemId));
      toast.success('URL deleted successfully!');
    }
    setDeleteConfirmation({ isOpen: false, itemType: null, itemId: '', itemName: '' });
  };

  const cancelDelete = () => {
    setDeleteConfirmation({ isOpen: false, itemType: null, itemId: '', itemName: '' });
  };

  const handleReindex = () => {
    setIsReindexing(true);
    setTimeout(() => {
      setIsReindexing(false);
      toast.success('Re-indexing completed successfully!');
    }, 2000);
  };

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      toast.success('Bot configuration saved successfully!');
    }, 1000);
  };

  // Pagination logic
  const totalPages = Math.ceil(uploadedDocuments.length / rowsPerPage);
  const paginatedDocuments = uploadedDocuments.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Completed</Badge>;
      case 'processing':
        return <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100">Processing</Badge>;
      case 'failed':
        return <Badge className="bg-red-100 text-red-700 hover:bg-red-100">Failed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getScopeLabel = (scope: string) => {
    switch (scope) {
      case 'only-this-page':
        return 'Only this page';
      case 'second-level-pages':
        return 'Second level pages';
      case 'entire-site':
        return 'Entire site';
      default:
        return scope;
    }
  };

  // Live Preview Component
  const LivePreview = () => {
    const getPositionStyles = () => {
      switch (botPosition) {
        case 'bottom-right':
          return 'items-end justify-end';
        case 'bottom-left':
          return 'items-end justify-start';
        case 'top-right':
          return 'items-start justify-end';
        case 'top-left':
          return 'items-start justify-start';
        default:
          return 'items-end justify-end';
      }
    };

    const suggestedQuestions = [
      "What are your business hours?",
      "How can I track my order?",
      "Tell me about your services"
    ];

    return (
      <Card className="border-0 shadow-sm sticky top-24">
        <CardHeader>
          <CardTitle>Live Preview</CardTitle>
          <CardDescription>See how your bot will look to users</CardDescription>
        </CardHeader>
        <CardContent className="p-4">
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl min-h-[650px] relative border border-gray-200 flex items-end justify-end p-6">
            {/* Bot widget */}
            <div className="relative">
              {/* Chat Interface - Toggleable */}
              {isChatOpen && (
                <div 
                  className="absolute bottom-20 right-0 w-[380px] h-[520px] bg-white rounded-2xl shadow-2xl flex flex-col animate-in slide-in-from-bottom-4 fade-in"
                  style={{ 
                    borderTop: `4px solid ${primaryColor}`
                  }}
                >
                    {/* Chat Header */}
                    <div 
                      className="px-6 py-4 rounded-t-2xl flex items-center justify-between"
                      style={{ 
                        background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})` 
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-lg font-semibold" style={{ color: primaryColor }}>
                          {botName.split(' ').map(word => word[0]).join('').toUpperCase().slice(0, 2) || 'CB'}
                        </div>
                        <div>
                          <h3 className="font-semibold text-white truncate max-w-[200px]">{botName}</h3>
                          <p className="text-xs text-white/80">Online</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => setIsChatOpen(false)}
                          className="text-white/80 hover:text-white transition-colors"
                          title="Minimize chat"
                        >
                          <Minimize2 className="size-5" />
                        </button>
                        <button 
                          onClick={() => {
                            setShowFeedbackForm(true);
                            setIsChatOpen(false);
                          }}
                          className="text-white/80 hover:text-white transition-colors"
                          title="Close and give feedback"
                        >
                          <X className="size-5" />
                        </button>
                      </div>
                    </div>

                    {/* Chat Messages */}
                    <div className="flex-1 p-6 overflow-y-auto space-y-4">
                      {/* Bot Welcome Message */}
                      <div className="flex gap-3">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-semibold flex-shrink-0" style={{ background: `${primaryColor}20`, color: primaryColor }}>
                          {botName.split(' ').map(word => word[0]).join('').toUpperCase().slice(0, 2) || 'CB'}
                        </div>
                        <div className="bg-gray-100 rounded-2xl rounded-tl-sm px-4 py-3 max-w-[75%] break-words overflow-hidden">
                          <p className="text-sm text-gray-800 break-words">
                            {welcomeMessage || welcomePopupText || "Hi there! How can I assist you today?"}
                          </p>
                        </div>
                      </div>

                      {/* Suggested Questions */}
                      {suggestionsEnabled && (
                        <div className="space-y-2">
                          <p className="text-xs text-gray-500 px-2">Suggested questions:</p>
                          {suggestedQuestions.map((question, index) => (
                            <button
                              key={index}
                              className="block w-full text-left px-4 py-2.5 rounded-xl border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-colors text-sm text-gray-700"
                              style={{ 
                                borderColor: `${primaryColor}30`
                              }}
                            >
                              {question}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Chat Input */}
                    <div className="p-4 border-t border-gray-100">
                      <div className="flex items-center gap-2 bg-gray-100 rounded-xl px-4 py-2">
                        <Input
                          value={chatMessage}
                          onChange={(e) => setChatMessage(e.target.value)}
                          placeholder={isListening ? "Listening..." : "Type your message..."}
                          className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 px-0"
                          disabled={isListening}
                        />
                        
                        {voiceSearchEnabled && (
                          <button 
                            onClick={() => {
                              setIsListening(!isListening);
                              if (!isListening) {
                                toast.success('Voice input started');
                                // Simulate voice input completion after 3 seconds
                                setTimeout(() => {
                                  setIsListening(false);
                                  setChatMessage('What are your business hours?');
                                  toast.success('Voice input captured');
                                }, 3000);
                              } else {
                                toast.info('Voice input stopped');
                              }
                            }}
                            className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all ${
                              isListening 
                                ? 'bg-red-500 hover:bg-red-600 animate-pulse' 
                                : 'bg-gray-300 hover:bg-gray-400'
                            }`}
                            title={isListening ? "Stop listening" : "Start voice input"}
                          >
                            {isListening ? (
                              <MicOff className="size-4 text-white" />
                            ) : (
                              <Mic className="size-4 text-gray-700" />
                            )}
                          </button>
                        )}
                        
                        <button 
                          className="w-9 h-9 rounded-lg flex items-center justify-center text-white transition-all hover:opacity-90"
                          style={{ 
                            background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})` 
                          }}
                          title="Send message"
                        >
                          <MessageSquare className="size-4" />
                        </button>
                      </div>
                      
                      {voiceSearchEnabled && !isListening && (
                        <p className="text-xs text-gray-400 mt-2 text-center flex items-center justify-center gap-1">
                          <Mic className="size-3" />
                          Click microphone to use voice input
                        </p>
                      )}
                      
                      {isListening && (
                        <div className="mt-2 flex items-center justify-center gap-2">
                          <div className="flex gap-1">
                            <div className="w-1 h-3 bg-red-500 rounded-full animate-pulse" style={{ animationDelay: '0ms' }}></div>
                            <div className="w-1 h-4 bg-red-500 rounded-full animate-pulse" style={{ animationDelay: '150ms' }}></div>
                            <div className="w-1 h-5 bg-red-500 rounded-full animate-pulse" style={{ animationDelay: '300ms' }}></div>
                            <div className="w-1 h-4 bg-red-500 rounded-full animate-pulse" style={{ animationDelay: '450ms' }}></div>
                            <div className="w-1 h-3 bg-red-500 rounded-full animate-pulse" style={{ animationDelay: '600ms' }}></div>
                          </div>
                          <p className="text-xs text-red-600 font-medium">Recording...</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Welcome popup - show only when chat is closed */}
                {!isChatOpen && !showFeedbackForm && welcomePopupText && (
                  <div 
                    className="absolute bottom-24 right-0 bg-white rounded-2xl shadow-lg p-4 w-80 break-words"
                    style={{ 
                      borderColor: primaryColor,
                      borderWidth: '2px',
                      borderStyle: 'solid'
                    }}
                  >
                    <p className="text-sm text-gray-700 break-words">{welcomePopupText}</p>
                    <div 
                      className="absolute -bottom-2 right-6 w-4 h-4 rotate-45 bg-white"
                      style={{ 
                        borderRight: `2px solid ${primaryColor}`,
                        borderBottom: `2px solid ${primaryColor}`
                      }}
                    ></div>
                  </div>
                )}

                {/* Feedback Form - show when close button clicked */}
                {!isChatOpen && showFeedbackForm && (
                  <div 
                    className="absolute bottom-20 right-0 w-[380px] bg-white rounded-2xl shadow-2xl flex flex-col animate-in slide-in-from-bottom-4 fade-in"
                    style={{ 
                      borderTop: `4px solid ${primaryColor}`
                    }}
                  >
                    {/* Feedback Header */}
                    <div 
                      className="px-6 py-4 rounded-t-2xl"
                      style={{ 
                        background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})` 
                      }}
                    >
                      <h3 className="font-semibold text-white text-center">How was your experience?</h3>
                    </div>

                    {/* Feedback Buttons */}
                    <div className="p-6 space-y-4">
                      <div className="flex items-center justify-center gap-6">
                        <button
                          onClick={() => {
                            toast.success('Thank you for your positive feedback!');
                            setShowFeedbackForm(false);
                            setWrittenFeedback('');
                          }}
                          className="flex flex-col items-center gap-2 p-6 rounded-xl border-2 border-gray-200 hover:border-green-500 hover:bg-green-50 transition-all group"
                        >
                          <ThumbsUp className="size-8 text-gray-400 group-hover:text-green-600 transition-colors" />
                          <span className="text-sm font-medium text-gray-600 group-hover:text-green-700">Good</span>
                        </button>
                        
                        <button
                          onClick={() => {
                            toast.success('Thank you for your feedback!');
                            setShowFeedbackForm(false);
                            setWrittenFeedback('');
                          }}
                          className="flex flex-col items-center gap-2 p-6 rounded-xl border-2 border-gray-200 hover:border-red-500 hover:bg-red-50 transition-all group"
                        >
                          <ThumbsDown className="size-8 text-gray-400 group-hover:text-red-600 transition-colors" />
                          <span className="text-sm font-medium text-gray-600 group-hover:text-red-700">Bad</span>
                        </button>
                      </div>

                      {/* Written Feedback Textarea */}
                      <div className="space-y-2">
                        <Label htmlFor="written-feedback" className="text-sm text-gray-700">
                          Tell us more (optional)
                        </Label>
                        <Textarea
                          id="written-feedback"
                          value={writtenFeedback}
                          onChange={(e) => setWrittenFeedback(e.target.value)}
                          placeholder="Share your thoughts..."
                          rows={3}
                          className="resize-none text-sm h-[72px] overflow-y-auto"
                        />
                      </div>

                      <button
                        onClick={() => {
                          setShowFeedbackForm(false);
                          setWrittenFeedback('');
                        }}
                        className="w-full text-sm text-gray-500 hover:text-gray-700 transition-colors py-2"
                      >
                        Skip
                      </button>
                    </div>
                  </div>
                )}
                
                {/* Bot button - clickable */}
                <button 
                  onClick={() => {
                    setIsChatOpen(!isChatOpen);
                    setShowFeedbackForm(false);
                  }}
                  className="w-16 h-16 rounded-full shadow-2xl flex items-center justify-center text-white relative group"
                  style={{ 
                    background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})` 
                  }}
                  title={isChatOpen ? "Close chat" : "Open chat"}
                >
                  <MessageSquare className="size-7" />
                  <div className="absolute inset-0 rounded-full bg-white opacity-0 group-hover:opacity-20 transition-opacity"></div>
                </button>
              </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" onClick={onBack}>
                <ChevronLeft className="size-4 mr-1" />
                Back to Bots
              </Button>
              <Separator orientation="vertical" className="h-6" />
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Bot Configuration</h1>
                <p className="text-sm text-gray-500">{botName}</p>
              </div>
            </div>
            <Button onClick={handleSave} disabled={isSaving} className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
              <Save className="size-4 mr-2" />
              {isSaving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="basic" className="w-full">
        {/* Full-width Tab Bar */}
        <div className="bg-white border-b border-gray-200 sticky top-[73px] z-10">
          <TabsList className="w-full h-auto p-0 bg-transparent rounded-none border-0">
            <TabsTrigger 
              value="basic" 
              className="flex-1 gap-2 rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-blue-50/50 py-4"
            >
              <MessageSquare className="size-4" />
              Basic Settings
            </TabsTrigger>
            <TabsTrigger 
              value="behavior" 
              className="flex-1 gap-2 rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-blue-50/50 py-4"
            >
              <Sparkles className="size-4" />
              Behavior & Prompts
            </TabsTrigger>
            <TabsTrigger 
              value="appearance" 
              className="flex-1 gap-2 rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-blue-50/50 py-4"
            >
              <Palette className="size-4" />
              Appearance
            </TabsTrigger>
            <TabsTrigger 
              value="knowledgebase" 
              className="flex-1 gap-2 rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-blue-50/50 py-4"
            >
              <Database className="size-4" />
              Knowledge Base
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Tab Content */}
        <div className="px-6 py-8">
          {/* Basic Settings Tab */}
          <TabsContent value="basic" className="space-y-6 mt-0">
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Left Column - Form */}
              <div className="space-y-6">
                <Card className="border-0 shadow-sm">
                  <CardHeader>
                    <CardTitle>Basic Information</CardTitle>
                    <CardDescription>Configure your bot's fundamental settings and identity</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="botName">Bot Name</Label>
                      <Input
                        id="botName"
                        value={botName}
                        onChange={(e) => setBotName(e.target.value)}
                        placeholder="Enter bot name"
                        maxLength={30}
                      />
                      <p className="text-xs text-gray-500">{botName.length}/30 characters</p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="avatar">Bot Avatar</Label>
                      <div className="flex items-center gap-4">
                        <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center text-white text-2xl font-semibold">
                          {botName.split(' ').map(word => word[0]).join('').toUpperCase().slice(0, 2) || 'CB'}
                        </div>
                        <div>
                          <Button variant="outline" size="sm">
                            <Upload className="size-4 mr-2" />
                            Upload Image
                          </Button>
                          <p className="text-xs text-gray-500 mt-2">Recommended: 256x256px, PNG or JPG</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-sm">
                  <CardHeader>
                    <CardTitle>Communication Settings</CardTitle>
                    <CardDescription>Customize how your bot communicates with users</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="welcomeMessage">Welcome Message</Label>
                      <Textarea
                        id="welcomeMessage"
                        value={welcomeMessage}
                        onChange={(e) => setWelcomeMessage(e.target.value)}
                        placeholder="Enter your welcome message..."
                        rows={3}
                        className="resize-y overflow-y-auto h-[84px] max-h-[300px]"
                      />
                      <p className="text-xs text-gray-500">Maximum 300 characters</p>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="idleTimeout">Idle Timeout (seconds)</Label>
                        <Input
                          id="idleTimeout"
                          type="number"
                          value={idleTimeout}
                          onChange={(e) => setIdleTimeout(e.target.value)}
                          placeholder="30"
                        />
                      </div>

                      <div className="space-y-2 relative">
                        <Label>Supported Languages</Label>
                        <div className="relative">
                          <button
                            type="button"
                            onClick={() => setIsLanguageDropdownOpen(!isLanguageDropdownOpen)}
                            className="flex h-10 w-full items-center justify-between rounded-md border border-gray-300 bg-white px-3 py-2 text-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <span className={supportedLanguages.length === 0 ? 'text-gray-500' : 'text-gray-900'}>
                              {getLanguageDisplay()}
                            </span>
                            <ChevronDown className="size-4 text-gray-500" />
                          </button>

                          {isLanguageDropdownOpen && (
                            <>
                              <div 
                                className="fixed inset-0 z-10" 
                                onClick={() => setIsLanguageDropdownOpen(false)}
                              />
                              <div className="absolute z-20 mt-1 w-full rounded-md border border-gray-200 bg-white shadow-lg">
                                {languageOptions.map((option) => (
                                  <div
                                    key={option.value}
                                    onClick={() => toggleLanguage(option.value)}
                                    className="flex items-center gap-2 px-3 py-2 hover:bg-gray-50 cursor-pointer"
                                  >
                                    <Checkbox
                                      checked={supportedLanguages.includes(option.value)}
                                      onCheckedChange={() => toggleLanguage(option.value)}
                                    />
                                    <span className="text-sm">{option.label}</span>
                                  </div>
                                ))}
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-sm">
                  <CardHeader>
                    <CardTitle>Feature Toggles</CardTitle>
                    <CardDescription>Enable or disable specific bot features</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-0">
                    <div className="flex items-center justify-between py-4 border-b border-gray-100">
                      <div className="space-y-0.5 flex-1">
                        <Label>Voice Search</Label>
                        <p className="text-sm text-gray-500">Allow users to interact using voice commands</p>
                      </div>
                      <Switch checked={voiceSearchEnabled} onCheckedChange={setVoiceSearchEnabled} />
                    </div>

                    <div className="flex items-center justify-between py-4 border-b border-gray-100">
                      <div className="space-y-0.5 flex-1">
                        <Label>Feedback Buttons</Label>
                        <p className="text-sm text-gray-500">Show thumbs up/down for responses</p>
                      </div>
                      <Switch checked={feedbackEnabled} onCheckedChange={setFeedbackEnabled} />
                    </div>

                    <div className="flex items-center justify-between py-4 border-b border-gray-100">
                      <div className="space-y-0.5 flex-1">
                        <div className="flex items-center gap-2">
                          <Label>Stream Chat</Label>
                          <div className="relative group">
                            <Info className="size-4 text-gray-400 cursor-help" />
                            <div className="absolute left-6 top-1/2 -translate-y-1/2 w-80 bg-gray-900 text-white text-xs rounded-lg p-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 pointer-events-none shadow-xl">
                              <div className="space-y-4">
                                {/* With Stream */}
                                <div>
                                  <p className="font-semibold text-white mb-2 flex items-center gap-1">
                                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                                    With Stream
                                  </p>
                                  <div className="bg-gray-800 rounded-lg p-3 text-gray-200">
                                    <div className="flex items-start gap-2">
                                      <div className="w-6 h-6 bg-blue-500 rounded-md flex items-center justify-center text-[10px] font-bold flex-shrink-0">AI</div>
                                      <div className="text-[11px] leading-relaxed">
                                        <span className="streamWord" style={{ animationDelay: '0s' }}>Hello! </span>
                                        <span className="streamWord" style={{ animationDelay: '0.2s' }}>How </span>
                                        <span className="streamWord" style={{ animationDelay: '0.4s' }}>can </span>
                                        <span className="streamWord" style={{ animationDelay: '0.6s' }}>I </span>
                                        <span className="streamWord" style={{ animationDelay: '0.8s' }}>help </span>
                                        <span className="streamWord" style={{ animationDelay: '1s' }}>you </span>
                                        <span className="streamWord" style={{ animationDelay: '1.2s' }}>today?</span>
                                        <span className="inline-block w-1 h-3 bg-blue-400 ml-0.5 animate-pulse"></span>
                                      </div>
                                    </div>
                                  </div>
                                  <p className="text-gray-400 text-[10px] mt-1 italic">↑ Words appear one by one</p>
                                </div>

                                {/* Without Stream */}
                                <div>
                                  <p className="font-semibold text-white mb-2 flex items-center gap-1">
                                    <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
                                    Without Stream
                                  </p>
                                  <div className="bg-gray-800 rounded-lg p-3 text-gray-200">
                                    <div className="flex items-start gap-2">
                                      <div className="w-6 h-6 bg-blue-500 rounded-md flex items-center justify-center text-[10px] font-bold flex-shrink-0">AI</div>
                                      <p className="text-[11px] leading-relaxed noStreamText">
                                        Hello! How can I help you today?
                                      </p>
                                    </div>
                                  </div>
                                  <p className="text-gray-400 text-[10px] mt-1 italic">↑ Complete message appears at once</p>
                                </div>
                              </div>
                              <div className="absolute left-0 top-1/2 -translate-x-1 -translate-y-1/2 w-2 h-2 bg-gray-900 rotate-45"></div>
                            </div>
                          </div>
                        </div>
                        <p className="text-sm text-gray-500">Display responses as they are generated</p>
                      </div>
                      <Switch checked={streamChatEnabled} onCheckedChange={setStreamChatEnabled} />
                    </div>

                    <div className="flex items-center justify-between py-4">
                      <div className="space-y-0.5 flex-1">
                        <Label>Suggestions Questions</Label>
                        <p className="text-sm text-gray-500">Show suggested questions to users</p>
                      </div>
                      <Switch checked={suggestionsEnabled} onCheckedChange={setSuggestionsEnabled} />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Right Column - Live Preview */}
              <div>
                <LivePreview />
              </div>
            </div>
          </TabsContent>

          {/* Behavior & Prompts Tab */}
          <TabsContent value="behavior" className="space-y-6 mt-0">
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle>System Prompt</CardTitle>
                <CardDescription>Define core instructions for your AI assistant's behavior</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="systemPrompt">Core Instructions</Label>
                  <Textarea
                    id="systemPrompt"
                    value={systemPrompt}
                    onChange={(e) => setSystemPrompt(e.target.value)}
                    placeholder="Enter your system prompt to define how the assistant should behave..."
                    rows={6}
                    className="resize-none font-mono text-sm"
                  />
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>Define the bot's personality, tone, and expertise</span>
                    <span>{systemPrompt.length} characters</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle>Persona Style</CardTitle>
                <CardDescription>Choose how your bot communicates with users</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { value: 'professional', label: 'Professional', desc: 'Formal and business-like' },
                    { value: 'technical', label: 'Technical', desc: 'Detailed and precise' },
                    { value: 'friendly', label: 'Friendly', desc: 'Warm and approachable' },
                    { value: 'creative', label: 'Creative', desc: 'Innovative and expressive' },
                  ].map((style) => (
                    <button
                      key={style.value}
                      onClick={() => setPersonaStyle(style.value)}
                      className={`relative p-4 rounded-lg border-2 transition-all text-left ${
                        personaStyle === style.value
                          ? 'border-blue-600 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300 bg-white'
                      }`}
                    >
                      {personaStyle === style.value && (
                        <div className="absolute top-3 right-3 w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center">
                          <Check className="size-3 text-white" />
                        </div>
                      )}
                      <div className="font-medium text-gray-900">{style.label}</div>
                      <div className="text-sm text-gray-500 mt-1">{style.desc}</div>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle>Memory & Context</CardTitle>
                <CardDescription>Configure how your bot remembers conversations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between py-2">
                  <div className="space-y-0.5 flex-1">
                    <Label>Conversation Memory</Label>
                    <p className="text-sm text-gray-500">Remember context from previous messages</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-600 min-w-[70px] text-right">{conversationMemory ? 'Stateful' : 'Stateless'}</span>
                    <Switch checked={conversationMemory} onCheckedChange={setConversationMemory} />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle>Fallback Message</CardTitle>
                <CardDescription>Default message when AI cannot process the request</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Label htmlFor="fallbackMessage">Error Response</Label>
                  <Textarea
                    id="fallbackMessage"
                    value={fallbackMessage}
                    onChange={(e) => setFallbackMessage(e.target.value)}
                    placeholder="Enter fallback message..."
                    rows={3}
                    className="resize-none"
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle>Content Moderation</CardTitle>
                <CardDescription>Define filtering rules and prohibited topics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Label htmlFor="moderation">Moderation Rules</Label>
                  <Textarea
                    id="moderation"
                    placeholder="Define content filtering rules, prohibited topics, or sensitive areas to avoid..."
                    rows={4}
                    className="resize-none"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Appearance Tab */}
          <TabsContent value="appearance" className="space-y-6 mt-0">
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Left Column - Form */}
              <div className="space-y-6">
                <Card className="border-0 shadow-sm">
                  <CardHeader>
                    <CardTitle>Brand Colors</CardTitle>
                    <CardDescription>Customize your bot's color scheme</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="primaryColor">Primary Color</Label>
                      <div className="flex items-center gap-3">
                        <Input
                          id="primaryColor"
                          type="color"
                          value={primaryColor}
                          onChange={(e) => setPrimaryColor(e.target.value)}
                          className="w-20 h-10 cursor-pointer"
                        />
                        <Input
                          type="text"
                          value={primaryColor}
                          onChange={(e) => setPrimaryColor(e.target.value)}
                          className="flex-1 font-mono"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="secondaryColor">Secondary Color</Label>
                      <div className="flex items-center gap-3">
                        <Input
                          id="secondaryColor"
                          type="color"
                          value={secondaryColor}
                          onChange={(e) => setSecondaryColor(e.target.value)}
                          className="w-20 h-10 cursor-pointer"
                        />
                        <Input
                          type="text"
                          value={secondaryColor}
                          onChange={(e) => setSecondaryColor(e.target.value)}
                          className="flex-1 font-mono"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-sm">
                  <CardHeader>
                    <CardTitle>Widget Position</CardTitle>
                    <CardDescription>Choose where the chat widget appears</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Select value={botPosition} onValueChange={setBotPosition}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="bottom-right">Bottom Right</SelectItem>
                        <SelectItem value="bottom-left">Bottom Left</SelectItem>
                        <SelectItem value="top-right">Top Right</SelectItem>
                        <SelectItem value="top-left">Top Left</SelectItem>
                      </SelectContent>
                    </Select>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-sm">
                  <CardHeader>
                    <CardTitle>Welcome Popup Text</CardTitle>
                    <CardDescription>Message shown when widget first appears</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Textarea
                      value={welcomePopupText}
                      onChange={(e) => setWelcomePopupText(e.target.value)}
                      placeholder="Hi there! How can I assist you today?"
                      rows={3}
                      className="resize-none"
                    />
                  </CardContent>
                </Card>
              </div>

              {/* Right Column - Live Preview */}
              <div>
                <LivePreview />
              </div>
            </div>
          </TabsContent>

          {/* Knowledge Base Tab */}
          <TabsContent value="knowledgebase" className="space-y-6 mt-0">
            <div className="flex items-center justify-between mb-2">
              <div>
                <p className="text-sm text-gray-500">Last Indexed: 1/28/2025 2:22 PM</p>
              </div>
              <div>
                <Badge variant="outline" className="text-sm">
                  <FileText className="size-3 mr-1" />
                  Documents: {uploadedDocuments.length}
                </Badge>
              </div>
            </div>

            {/* Documents Section */}
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="size-5" />
                  Documents
                </CardTitle>
                <CardDescription>Upload and manage your knowledge base documents</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                  {/* Document Upload Area */}
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-gray-400 transition-colors">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                        <Upload className="size-6 text-gray-400" />
                      </div>
                      <div>
                        <p className="text-gray-700 font-medium mb-1">
                          Drag & drop your file here, or click to browse
                        </p>
                        <p className="text-sm text-gray-500">
                          Supports: .pdf, .docx, .txt files
                        </p>
                      </div>
                      <label htmlFor="file-upload">
                        <Button type="button" variant="secondary" size="sm" asChild>
                          <span>Choose Files</span>
                        </Button>
                        <input
                          id="file-upload"
                          type="file"
                          multiple
                          accept=".pdf,.docx,.txt"
                          onChange={handleFileUpload}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>

                  {/* Documents Grid/Table */}
                  {uploadedDocuments.length > 0 && (
                    <div className="space-y-4">
                      <div className="border rounded-lg overflow-hidden">
                        <Table>
                          <TableHeader>
                            <TableRow className="bg-gray-50">
                              <TableHead>Document Name</TableHead>
                              <TableHead>Upload Date & Time</TableHead>
                              <TableHead>Size</TableHead>
                              <TableHead>Ingestion Status</TableHead>
                              <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {paginatedDocuments.map((doc) => (
                              <TableRow key={doc.id}>
                                <TableCell className="font-medium">
                                  <div className="flex items-center gap-2">
                                    <FileText className="size-4 text-gray-500" />
                                    {doc.name}
                                  </div>
                                </TableCell>
                                <TableCell className="text-sm text-gray-600">{doc.uploadDate}</TableCell>
                                <TableCell className="text-sm text-gray-600">
                                  {(doc.size / 1024 / 1024).toFixed(2)} MB
                                </TableCell>
                                <TableCell>{getStatusBadge(doc.status)}</TableCell>
                                <TableCell className="text-right">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleDeleteDocument(doc.id)}
                                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                  >
                                    <Trash2 className="size-4" />
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>

                      {/* Pagination Controls */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Label className="text-sm text-gray-600">Rows per page:</Label>
                          <Select value={String(rowsPerPage)} onValueChange={(val) => {
                            setRowsPerPage(Number(val));
                            setCurrentPage(1);
                          }}>
                            <SelectTrigger className="w-20 h-8">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="5">5</SelectItem>
                              <SelectItem value="10">10</SelectItem>
                              <SelectItem value="20">20</SelectItem>
                              <SelectItem value="50">50</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-600">
                            Page {currentPage} of {totalPages}
                          </span>
                          <div className="flex gap-1">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                              disabled={currentPage === 1}
                            >
                              <ChevronLeftIcon className="size-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                              disabled={currentPage === totalPages}
                            >
                              <ChevronRight className="size-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
            </Card>

            {/* URLs Section */}
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="size-5" />
                  URLs
                </CardTitle>
                <CardDescription>Index web pages and online content</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                  <div className="flex gap-3">
                    <Input
                      type="url"
                      value={urlInput}
                      onChange={(e) => setUrlInput(e.target.value)}
                      placeholder="Enter URL here..."
                      className="flex-1"
                    />
                    <Select value={urlScope} onValueChange={setUrlScope}>
                      <SelectTrigger className="w-56">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="only-this-page">Only this page</SelectItem>
                        <SelectItem value="second-level-pages">Second level pages</SelectItem>
                        <SelectItem value="entire-site">Entire site</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button onClick={handleAddUrl} className="px-6">
                      Add URL
                    </Button>
                  </div>

                  {/* Added URLs Grid/Table */}
                  {addedUrls.length > 0 && (
                    <div className="space-y-4">
                      <div className="border rounded-lg overflow-hidden">
                        <Table>
                          <TableHeader>
                            <TableRow className="bg-gray-50">
                              <TableHead>URL</TableHead>
                              <TableHead>Scope</TableHead>
                              <TableHead>Added Date & Time</TableHead>
                              <TableHead>Ingestion Status</TableHead>
                              <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {addedUrls.map((url) => (
                              <TableRow key={url.id}>
                                <TableCell className="font-medium max-w-md">
                                  <div className="flex items-center gap-2">
                                    <Globe className="size-4 text-gray-500 flex-shrink-0" />
                                    <span className="truncate">{url.url}</span>
                                  </div>
                                </TableCell>
                                <TableCell className="text-sm text-gray-600">
                                  {getScopeLabel(url.scope)}
                                </TableCell>
                                <TableCell className="text-sm text-gray-600">{url.addedDate}</TableCell>
                                <TableCell>{getStatusBadge(url.status)}</TableCell>
                                <TableCell className="text-right">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleDeleteUrl(url.id)}
                                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                  >
                                    <Trash2 className="size-4" />
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </div>
                  )}
                </CardContent>
            </Card>

            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle>Indexing Settings</CardTitle>
                <CardDescription>Configure how documents are processed and indexed</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center gap-2 py-2">
                  <Checkbox 
                    id="auto-index"
                    checked={autoIndexEnabled} 
                    onCheckedChange={setAutoIndexEnabled} 
                  />
                  <Label htmlFor="auto-index" className="cursor-pointer">
                    Auto Index on Upload
                  </Label>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="chunkSize">Chunk Size</Label>
                    <Input
                      id="chunkSize"
                      type="number"
                      value={chunkSize}
                      onChange={(e) => setChunkSize(e.target.value)}
                      placeholder="512"
                    />
                    <p className="text-xs text-gray-500">Number of tokens per chunk</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="chunkOverlap">Chunk Overlap</Label>
                    <Input
                      id="chunkOverlap"
                      type="number"
                      value={chunkOverlap}
                      onChange={(e) => setChunkOverlap(e.target.value)}
                      placeholder="50"
                    />
                    <p className="text-xs text-gray-500">Overlapping tokens between chunks</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle>Manual Re-indexing</CardTitle>
                <CardDescription>Re-index all documents and sources</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-start justify-between py-2">
                  <div className="space-y-1 flex-1">
                    <p className="text-sm text-gray-700 font-medium">Re-index all documents and sources</p>
                    <p className="text-sm text-gray-500">This will rebuild entire search index</p>
                  </div>
                  <Button 
                    variant="outline"
                    onClick={handleReindex} 
                    disabled={isReindexing}
                    className="gap-2"
                  >
                    <RefreshCw className={`size-4 ${isReindexing ? 'animate-spin' : ''}`} />
                    {isReindexing ? 'Re-indexing...' : 'Re-index Now'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </div>
      </Tabs>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteConfirmation.isOpen} onOpenChange={(open) => !open && cancelDelete()}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete <span className="font-semibold text-gray-900">{deleteConfirmation.itemName}</span> permanently? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={cancelDelete}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}