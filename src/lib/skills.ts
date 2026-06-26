/**
 * Comprehensive skills list for resume builder and other features
 */

export const AVAILABLE_SKILLS = [
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
] as const;

export type Skill = typeof AVAILABLE_SKILLS[number];

// Helper function to search skills
export function searchSkills(query: string, exclude: string[] = []): string[] {
  const lowerQuery = query.toLowerCase();
  return AVAILABLE_SKILLS.filter(
    skill => 
      skill.toLowerCase().includes(lowerQuery) && 
      !exclude.includes(skill)
  );
}

// Helper function to get skill category
export function getSkillCategory(skill: string): string {
  const categories = {
    'Programming Languages': ['JavaScript', 'TypeScript', 'Python', 'Java', 'C', 'C++', 'C#', 'Go', 'Rust', 'PHP', 'Ruby', 'Swift', 'Kotlin', 'Dart', 'Scala', 'R'],
    'Frontend': ['React.js', 'Next.js', 'Vue.js', 'Angular', 'Svelte', 'HTML5', 'CSS3', 'Tailwind CSS'],
    'Backend': ['Node.js', 'Express.js', 'Django', 'Flask', 'FastAPI', 'Spring Boot', 'Laravel'],
    'Database': ['MySQL', 'PostgreSQL', 'MongoDB', 'Redis', 'Prisma', 'TypeORM'],
    'Cloud': ['AWS', 'Azure', 'Google Cloud', 'Docker', 'Kubernetes'],
    'AI/ML': ['OpenAI API', 'TensorFlow', 'PyTorch', 'Machine Learning', 'Deep Learning'],
  };

  for (const [category, skills] of Object.entries(categories)) {
    if (skills.some(s => skill.includes(s))) {
      return category;
    }
  }
  return 'Other';
}
