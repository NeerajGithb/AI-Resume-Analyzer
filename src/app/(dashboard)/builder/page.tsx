'use client';

import { useState, useRef, useEffect, FormEvent } from 'react';
import { motion } from 'framer-motion';
import { AppShell } from '@/components/layout/AppShell';
import { Button } from '@/components/ui/Button';
import { useRouter } from 'next/navigation';
import { generateResume } from '@/services/resumeBuilderService';
import { ApiError } from '@/lib/httpClient';

interface FormData {
  name: string;
  phone: string;
  email: string;
  linkedin?: string;
  github?: string;
  leetcode?: string;
  degree: string;
  institution: string;
  location: string;
  graduationYear: string;
  targetRole: string;
  projectsExperience?: string; // Optional: brief description of real projects
  skills: string[];
}

// Comprehensive skills list
const AVAILABLE_SKILLS = [
  // Programming Languages
  'JavaScript', 'TypeScript', 'Python', 'Java', 'C', 'C++', 'C#', 'Go', 'Rust', 'PHP', 'Ruby', 'Swift', 'Kotlin', 'Dart', 'Scala', 'R', 'Perl', 'Elixir', 'Haskell', 'Clojure', 'Lua', 'Shell Scripting', 'Bash', 'PowerShell',
  
  // Frontend Frameworks & Libraries
  'React.js', 'Next.js', 'Vue.js', 'Vue 3', 'Nuxt.js', 'Angular', 'Angular 2+', 'Svelte', 'SvelteKit', 'Solid.js', 'Qwik', 'Preact', 'Alpine.js', 'Ember.js', 'Backbone.js', 'jQuery',
  
  // Frontend UI & Styling
  'HTML5', 'CSS3', 'Tailwind CSS', 'Bootstrap', 'Material-UI', 'MUI', 'Ant Design', 'Chakra UI', 'Shadcn UI', 'Radix UI', 'Mantine', 'Sass', 'SCSS', 'Less', 'Styled Components', 'Emotion', 'CSS Modules', 'PostCSS',
  
  // State Management
  'Redux', 'Redux Toolkit', 'Zustand', 'Recoil', 'Jotai', 'MobX', 'XState', 'Context API', 'React Query', 'TanStack Query', 'SWR', 'Apollo Client', 'Relay',
  
  // Backend Frameworks
  'Node.js', 'Express.js', 'Koa.js', 'Hapi.js', 'Fastify', 'NestJS', 'Django', 'Flask', 'FastAPI', 'Spring Boot', 'Spring', 'ASP.NET', 'ASP.NET Core', 'Laravel', 'Symfony', 'Ruby on Rails', 'Sinatra', 'Phoenix', 'Gin', 'Echo', 'Fiber',
  
  // Databases - SQL
  'MySQL', 'PostgreSQL', 'SQLite', 'MariaDB', 'Microsoft SQL Server', 'Oracle Database', 'Amazon Aurora',
  
  // Databases - NoSQL
  'MongoDB', 'Redis', 'Cassandra', 'DynamoDB', 'CouchDB', 'Neo4j', 'InfluxDB', 'Elasticsearch',
  
  // Database Tools & ORMs
  'Prisma', 'TypeORM', 'Sequelize', 'Mongoose', 'Drizzle', 'Knex.js', 'Hibernate', 'Entity Framework',
  
  // Cloud Platforms
  'AWS', 'Amazon Web Services', 'Azure', 'Microsoft Azure', 'Google Cloud', 'GCP', 'DigitalOcean', 'Heroku', 'Vercel', 'Netlify', 'Railway', 'Render', 'Fly.io', 'Cloudflare', 'Linode', 'Oracle Cloud',
  
  // AWS Services
  'EC2', 'S3', 'Lambda', 'RDS', 'CloudFront', 'Route 53', 'ECS', 'EKS', 'Elastic Beanstalk', 'API Gateway', 'CloudWatch', 'IAM', 'SQS', 'SNS',
  
  // DevOps & CI/CD
  'Docker', 'Kubernetes', 'K8s', 'Jenkins', 'GitHub Actions', 'GitLab CI/CD', 'CircleCI', 'Travis CI', 'Azure DevOps', 'ArgoCD', 'Terraform', 'Ansible', 'Puppet', 'Chef', 'Vagrant', 'Nginx', 'Apache', 'PM2',
  
  // AI & Machine Learning
  'OpenAI API', 'GPT', 'ChatGPT', 'Claude API', 'Groq API', 'Anthropic Claude API', 'Gemini API', 'TensorFlow', 'PyTorch', 'Keras', 'Scikit-learn', 'Pandas', 'NumPy', 'Matplotlib', 'Seaborn', 'Hugging Face', 'LangChain', 'LlamaIndex', 'Transformers', 'YOLO', 'Computer Vision', 'NLP', 'Deep Learning', 'Machine Learning',
  
  // Testing
  'Jest', 'Vitest', 'Mocha', 'Chai', 'Jasmine', 'Cypress', 'Playwright', 'Selenium', 'Puppeteer', 'Testing Library', 'React Testing Library', 'Enzyme', 'Supertest', 'JUnit', 'PyTest', 'unittest',
  
  // Version Control
  'Git', 'GitHub', 'GitLab', 'Bitbucket', 'SVN', 'Mercurial',
  
  // APIs & Protocols
  'REST API', 'RESTful API', 'GraphQL', 'gRPC', 'WebSockets', 'Socket.io', 'tRPC', 'JSON', 'XML', 'SOAP', 'Protocol Buffers', 'HTTP', 'TCP/IP',
  
  // Authentication & Security
  'JWT', 'OAuth', 'OAuth 2.0', 'Auth0', 'Firebase Auth', 'Passport.js', 'bcrypt', 'SSL/TLS', 'HTTPS', 'CORS', 'CSRF Protection', 'XSS Prevention',
  
  // Build Tools & Bundlers
  'Webpack', 'Vite', 'Rollup', 'Parcel', 'esbuild', 'Turbopack', 'Babel', 'SWC', 'Gulp', 'Grunt', 'npm', 'Yarn', 'pnpm', 'Bun',
  
  // Mobile Development
  'React Native', 'Flutter', 'Expo', 'SwiftUI', 'Android Studio', 'Xcode', 'Ionic', 'Cordova', 'Capacitor',
  
  // CMS & E-commerce
  'WordPress', 'Shopify', 'WooCommerce', 'Strapi', 'Contentful', 'Sanity', 'Prismic', 'Headless CMS', 'Ghost', 'Magento',
  
  // Real-time & Backend-as-a-Service
  'Firebase', 'Supabase', 'Appwrite', 'PocketBase', 'Firestore', 'Realtime Database', 'Pusher', 'Ably',
  
  // Message Queues & Streaming
  'RabbitMQ', 'Apache Kafka', 'Redis Pub/Sub', 'AWS SQS', 'AWS SNS', 'Azure Service Bus',
  
  // Monitoring & Logging
  'Sentry', 'LogRocket', 'Datadog', 'New Relic', 'Grafana', 'Prometheus', 'ELK Stack', 'Splunk', 'CloudWatch',
  
  // Design & Prototyping
  'Figma', 'Adobe XD', 'Sketch', 'InVision', 'Zeplin', 'Photoshop', 'Illustrator', 'Canva',
  
  // Project Management & Collaboration
  'Jira', 'Confluence', 'Trello', 'Asana', 'Monday.com', 'Linear', 'Notion', 'Slack', 'Microsoft Teams', 'Discord',
  
  // IDEs & Editors
  'VS Code', 'Visual Studio Code', 'IntelliJ IDEA', 'WebStorm', 'PyCharm', 'Eclipse', 'Sublime Text', 'Vim', 'Neovim', 'Emacs',
  
  // Blockchain & Web3
  'Solidity', 'Ethereum', 'Web3.js', 'Ethers.js', 'Smart Contracts', 'Blockchain', 'NFT', 'DeFi',
  
  // Game Development
  'Unity', 'Unreal Engine', 'Godot', 'Three.js', 'Babylon.js', 'Phaser', 'Pygame',
  
  // Data Science & Analytics
  'Tableau', 'Power BI', 'Excel', 'Google Analytics', 'Mixpanel', 'Amplitude', 'Jupyter Notebook', 'Apache Spark', 'Hadoop',
  
  // Payment Integration
  'Stripe', 'PayPal', 'Razorpay', 'Square', 'Braintree', 'Paytm',
  
  // File Storage & CDN
  'Cloudinary', 'AWS S3', 'Backblaze', 'ImageKit', 'UploadCare', 'Fastly CDN', 'Akamai', 'CDN',
  
  // Methodologies & Concepts
  'Agile', 'Scrum', 'Kanban', 'TDD', 'BDD', 'Test-Driven Development', 'CI/CD', 'Microservices', 'Monolithic Architecture', 'Serverless', 'Event-Driven Architecture', 'Domain-Driven Design', 'DDD', 'SOLID Principles', 'Design Patterns', 'OOP', 'Object-Oriented Programming', 'Functional Programming', 'System Design', 'Data Structures', 'Algorithms', 'DSA', 'Clean Code', 'Clean Architecture', 'Responsive Design', 'Mobile-First Design', 'SEO', 'Web Accessibility', 'WCAG', 'Performance Optimization', 'Code Review', 'Load Balancing', 'Caching', 'Rate Limiting', 'RBAC', 'Role-Based Access Control',
  
  // Technology Stacks (Acronyms)
  'MERN Stack', 'MEAN Stack', 'LAMP Stack', 'LEMP Stack', 'JAMstack', 'T3 Stack', 'Full Stack',
  
  // Other Tools
  'Postman', 'Insomnia', 'Swagger', 'OpenAPI', 'Linux', 'Ubuntu', 'macOS', 'Windows', 'WSL', 'SSH', 'FTP', 'DNS', 'VPN',
];

const ROLE_OPTIONS = [
  // Software & Engineering
  { value: 'Software Engineer', label: 'Software Engineer' },
  { value: 'Frontend Developer', label: 'Frontend Developer' },
  { value: 'Backend Developer', label: 'Backend Developer' },
  { value: 'Full Stack Developer', label: 'Full Stack Developer' },
  { value: 'DevOps Engineer', label: 'DevOps Engineer' },
  { value: 'Data Engineer', label: 'Data Engineer' },
  { value: 'Mobile Developer', label: 'Mobile Developer' },
  { value: 'QA Engineer', label: 'QA Engineer' },
  { value: 'Security Engineer', label: 'Security Engineer' },
  { value: 'Cloud Architect', label: 'Cloud Architect' },
  
  // Data & AI
  { value: 'Data Scientist', label: 'Data Scientist' },
  { value: 'Data Analyst', label: 'Data Analyst' },
  { value: 'Machine Learning Engineer', label: 'Machine Learning Engineer' },
  { value: 'AI Engineer', label: 'AI Engineer' },
  { value: 'Business Analyst', label: 'Business Analyst' },
  
  // Product & Design
  { value: 'Product Manager', label: 'Product Manager' },
  { value: 'Product Designer', label: 'Product Designer' },
  { value: 'UX Designer', label: 'UX Designer' },
  { value: 'UI Designer', label: 'UI Designer' },
  { value: 'UX Researcher', label: 'UX Researcher' },
  
  // Marketing & Sales
  { value: 'Marketing Manager', label: 'Marketing Manager' },
  { value: 'Digital Marketing Specialist', label: 'Digital Marketing Specialist' },
  { value: 'Content Writer', label: 'Content Writer' },
  { value: 'SEO Specialist', label: 'SEO Specialist' },
  { value: 'Sales Manager', label: 'Sales Manager' },
  { value: 'Account Manager', label: 'Account Manager' },
  
  // Operations & Finance
  { value: 'Operations Manager', label: 'Operations Manager' },
  { value: 'Project Manager', label: 'Project Manager' },
  { value: 'Scrum Master', label: 'Scrum Master' },
  { value: 'Financial Analyst', label: 'Financial Analyst' },
  { value: 'Accountant', label: 'Accountant' },
  
  // HR & Administration
  { value: 'HR Manager', label: 'HR Manager' },
  { value: 'Recruiter', label: 'Recruiter' },
  { value: 'Administrative Assistant', label: 'Administrative Assistant' },
  
  // Customer Support
  { value: 'Customer Support', label: 'Customer Support' },
  { value: 'Customer Success Manager', label: 'Customer Success Manager' },
  { value: 'Technical Support', label: 'Technical Support' },
];

export default function BuilderPage() {
  const router = useRouter();
  const skillsDropdownRef = useRef<HTMLDivElement>(null);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    phone: '',
    email: '',
    linkedin: '',
    github: '',
    leetcode: '',
    degree: '',
    institution: '',
    location: '',
    graduationYear: '',
    targetRole: '',
    projectsExperience: '',
    skills: [],
  });
  const [loading, setLoading] = useState(false);
  const [currentStage, setCurrentStage] = useState<number>(0);
  const [skillSearch, setSkillSearch] = useState('');
  const [showSkillDropdown, setShowSkillDropdown] = useState(false);

  const LOADING_STAGES = [
    'Analyzing your information...',
    'Organizing skills and experience...',
    'Generating professional content...',
    'Creating LaTeX resume...',
  ];

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (skillsDropdownRef.current && !skillsDropdownRef.current.contains(event.target as Node)) {
        setShowSkillDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredSkills = AVAILABLE_SKILLS.filter(
    skill => 
      skill.toLowerCase().includes(skillSearch.toLowerCase()) &&
      !formData.skills.includes(skill)
  );

  const addSkill = (skill: string) => {
    if (!formData.skills.includes(skill)) {
      setFormData({ ...formData, skills: [...formData.skills, skill] });
    }
    setSkillSearch('');
    setShowSkillDropdown(false);
  };

  const removeSkill = (skillToRemove: string) => {
    setFormData({ 
      ...formData, 
      skills: formData.skills.filter(s => s !== skillToRemove) 
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // Validate required fields
    if (!formData.name || !formData.phone || !formData.email || !formData.degree || !formData.institution || !formData.targetRole) {
      alert('Please fill in all required fields');
      return;
    }

    if (formData.skills.length === 0) {
      alert('Please select at least a few skills');
      return;
    }

    setLoading(true);
    setCurrentStage(0);
    
    // Show fake loading stages with delays
    const delays = [800, 1000, 1200]; // Delays for each stage
    
    for (let i = 0; i < delays.length; i++) {
      await new Promise(resolve => setTimeout(resolve, delays[i]));
      setCurrentStage(i + 1);
    }
    
    // Final stage - now call the actual API
    try {
      // Convert skills array to comma-separated string for backend
      const dataToSend = {
        ...formData,
        projectsExperience: formData.projectsExperience || undefined,
        skills: formData.skills.join(', ')
      };
      
      const result = await generateResume(dataToSend as any);
      
      // Small delay to show completion
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Redirect to result page
      router.push(`/builder/report/${result.id}`);
    } catch (error) {
      setLoading(false);
      setCurrentStage(0);
      if (error instanceof ApiError) {
        alert(error.message);
      } else {
        alert('Failed to generate resume. Please try again.');
      }
    }
  };

  return (
    <AppShell>
      <div className="max-w-4xl mx-auto p-6">
        {loading ? (
          // Loading State - Show stages like analyze page
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center justify-center min-h-[60vh]"
          >
            <div className="w-full max-w-md bg-white border border-[var(--border)] rounded-[var(--radius-lg)] p-8 shadow-[var(--shadow-xs)]">
              <div className="space-y-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-[var(--text-primary)]">Generating Resume</h2>
                  <div className="flex items-center gap-2 text-sm text-[var(--text-muted)]">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[var(--accent)]"></div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="relative">
                  <div className="overflow-hidden h-2 text-xs flex rounded-full bg-[var(--bg-subtle)]">
                    <motion.div
                      initial={{ width: '0%' }}
                      animate={{
                        width: `${((currentStage + 1) / LOADING_STAGES.length) * 100}%`
                      }}
                      transition={{ duration: 0.5 }}
                      className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-r from-violet-600 to-purple-600"
                    />
                  </div>
                </div>

                {/* Stages */}
                <div className="space-y-2">
                  {LOADING_STAGES.map((stageName, idx) => {
                    const isActive = idx === currentStage;
                    const isComplete = idx < currentStage;

                    return (
                      <div
                        key={idx}
                        className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
                          isActive
                            ? 'bg-violet-50 border border-violet-200'
                            : isComplete
                            ? 'bg-green-50 border border-green-200'
                            : 'bg-gray-50 border border-gray-200'
                        }`}
                      >
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                            isActive
                              ? 'bg-violet-600 text-white animate-pulse'
                              : isComplete
                              ? 'bg-green-600 text-white'
                              : 'bg-gray-300 text-gray-600'
                          }`}
                        >
                          {isComplete ? '✓' : idx + 1}
                        </div>
                        <span className={`text-sm font-medium ${
                          isActive ? 'text-violet-900' : isComplete ? 'text-green-900' : 'text-gray-600'
                        }`}>
                          {stageName}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          // Form State - Show when not generating
          <>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6"
            >
              <h1 className="text-2xl font-bold text-[var(--text-primary)]">Resume Builder</h1>
              <p className="text-sm text-[var(--text-muted)] mt-1">
                Fill in your details and AI will generate a professional resume
              </p>
            </motion.div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Information */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-lg border border-[var(--border)] p-6"
          >
            <h2 className="text-lg font-semibold mb-4">Personal Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-[var(--border)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                  placeholder="John Doe"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Phone <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3 py-2 border border-[var(--border)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                  placeholder="+1 234 567 8900"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 border border-[var(--border)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                  placeholder="john.doe@example.com"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">LinkedIn</label>
                <input
                  type="text"
                  value={formData.linkedin}
                  onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                  className="w-full px-3 py-2 border border-[var(--border)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                  placeholder="https://www.linkedin.com/in/yourprofile"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">GitHub</label>
                <input
                  type="text"
                  value={formData.github}
                  onChange={(e) => setFormData({ ...formData, github: e.target.value })}
                  className="w-full px-3 py-2 border border-[var(--border)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                  placeholder="https://github.com/yourusername"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">LeetCode (Optional)</label>
                <input
                  type="text"
                  value={formData.leetcode}
                  onChange={(e) => setFormData({ ...formData, leetcode: e.target.value })}
                  className="w-full px-3 py-2 border border-[var(--border)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                  placeholder="https://leetcode.com/yourusername"
                />
              </div>
            </div>
          </motion.div>

          {/* Education */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-lg border border-[var(--border)] p-6"
          >
            <h2 className="text-lg font-semibold mb-4">Education & Role</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Degree <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.degree}
                  onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
                  className="w-full px-3 py-2 border border-[var(--border)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                  placeholder="Bachelor of Science in Computer Science"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Institution <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.institution}
                  onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                  className="w-full px-3 py-2 border border-[var(--border)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                  placeholder="University Name"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Location</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-3 py-2 border border-[var(--border)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                  placeholder="City, State"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Graduation Year</label>
                <input
                  type="text"
                  value={formData.graduationYear}
                  onChange={(e) => setFormData({ ...formData, graduationYear: e.target.value })}
                  className="w-full px-3 py-2 border border-[var(--border)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                  placeholder="2020 - 2024"
                />
              </div>
              <div className="md:col-span-2">
                <label htmlFor="target-role" className="block text-sm font-medium mb-1">
                  Target Role <span className="text-red-500">*</span>
                </label>
                <select
                  id="target-role"
                  value={formData.targetRole}
                  onChange={(e) => setFormData({ ...formData, targetRole: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-md border border-[var(--border)] bg-white text-sm text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent appearance-none cursor-pointer"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23666' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E")`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right 1rem center',
                    backgroundSize: '16px',
                  }}
                  required
                >
                  <option value="">Select target role</option>
                  {ROLE_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-[var(--text-muted)] mt-1">
                  Select the job role you're targeting with this resume
                </p>
              </div>
            </div>
          </motion.div>

          {/* Technical Skills */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-lg border border-[var(--border)] p-6"
          >
            <h2 className="text-lg font-semibold mb-4">Technical Skills</h2>
            <div>
              <label className="block text-sm font-medium mb-1">
                Select Your Skills
              </label>
              
              {/* Selected Skills */}
              {formData.skills.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3 p-3 bg-gray-50 rounded-md border border-gray-300">
                  {formData.skills.map((skill, index) => (
                    <span
                      key={`${skill}-${index}`}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-blue-600 text-white text-sm rounded-full"
                    >
                      {skill}
                      <button
                        type="button"
                        onClick={() => removeSkill(skill)}
                        className="hover:bg-white/20 rounded-full p-0.5"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <line x1="18" y1="6" x2="6" y2="18" />
                          <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                      </button>
                    </span>
                  ))}
                </div>
              )}

              {/* Search Input */}
              <div className="relative" ref={skillsDropdownRef}>
                <input
                  type="text"
                  value={skillSearch}
                  onChange={(e) => {
                    setSkillSearch(e.target.value);
                    setShowSkillDropdown(true);
                  }}
                  onFocus={() => setShowSkillDropdown(true)}
                  className="w-full px-3 py-2 border border-[var(--border)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                  placeholder="Type to search skills (e.g., React, Python, Docker)..."
                />

                {/* Dropdown */}
                {showSkillDropdown && skillSearch && filteredSkills.length > 0 && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                    {filteredSkills.slice(0, 20).map((skill) => (
                      <button
                        key={skill}
                        type="button"
                        onClick={() => addSkill(skill)}
                        className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm border-b border-gray-100 last:border-b-0"
                      >
                        {skill}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <p className="text-xs text-[var(--text-muted)] mt-2">
                💡 Type to search from {AVAILABLE_SKILLS.length}+ skills. Click to add. AI will automatically categorize them.
              </p>
              
              {formData.skills.length === 0 && (
                <p className="text-xs text-orange-600 mt-2">
                  ⚠️ Please select at least a few skills
                </p>
              )}
            </div>
          </motion.div>

          {/* Projects Experience (Optional) */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-lg border border-[var(--border)] p-6"
          >
            <h2 className="text-lg font-semibold mb-4">Projects Experience (Optional)</h2>
            <div>
              <label className="block text-sm font-medium mb-1">
                Briefly describe any projects you've worked on
              </label>
              <textarea
                value={formData.projectsExperience || ''}
                onChange={(e) => setFormData({ ...formData, projectsExperience: e.target.value })}
                className="w-full px-3 py-2 border border-[var(--border)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                rows={4}
                placeholder="Example: Built an e-commerce website using MERN stack with payment integration. Created a chat application with real-time messaging using Socket.io."
              />
              <p className="text-xs text-[var(--text-muted)] mt-2">
                📝 If you have real projects, mention them briefly. AI will use this to create realistic project descriptions. Leave blank if none.
              </p>
            </div>
          </motion.div>

          {/* Submit Button */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex justify-end"
          >
            <Button type="submit" variant="primary" size="lg" disabled={loading}>
              {loading ? 'Generating Resume...' : 'Generate Resume'}
            </Button>
          </motion.div>
        </form>
          </>
        )}
      </div>
    </AppShell>
  );
}
